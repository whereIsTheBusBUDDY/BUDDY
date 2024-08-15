from fastapi import FastAPI, Form, File, UploadFile, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
import math
from fastapi.responses import JSONResponse
import numpy as np
import torch
import sys
import os
import joblib
from geopy.distance import geodesic
from pydantic import BaseModel, Field
import pandas as pd
from ultralytics import YOLO  
import cv2

# 모델 경로 설정
MODEL_PATH = ''
THRESHOLD = 0.7

# ETA 모델 불러오기
ETA_MODEL_PATH = ''
best_rf_model_loaded = joblib.load(ETA_MODEL_PATH)

app = FastAPI()
router = APIRouter()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@router.get("/")
def read_root():
    return "FastAPI"

# YOLOv8 모델 로드
model = YOLO(MODEL_PATH)
model.to('cuda')  # 모델을 GPU로 이동

@router.post("/yolo")
async def process_home_form(file: UploadFile = File(...)):
    print("yolo 요청 들어옴")
    if not file:
        raise HTTPException(status_code=422, detail="File is missing")

    try:
        # 이미지 로드 및 변환을 OpenCV로 처리
        image = np.frombuffer(await file.read(), np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # RGB로 변환
        
        # 모델 예측
        results = model.predict(image, device='cuda')
        
        # 결과를 JSON으로 변환
        json_results = results_to_json(results)

        return JSONResponse(content=json_results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
        
def results_to_json(results):
    results_dict = {}
    allow = False

    if not results or len(results) == 0:
        print("탐지 된 객체가 없음")
        return {"allow": allow}

    for result in results:
        boxes = result.boxes.xyxy.cpu().numpy()
        confidences = result.boxes.conf.cpu().numpy()
        classes = result.boxes.cls.cpu().numpy() 

        for box, confidence, cls in zip(boxes, confidences, classes):
            class_name = result.names[int(cls)]
            reliability = round(float(confidence), 2)

            # 각 클래스당 최대 신뢰도만 저장
            if class_name in results_dict:
                results_dict[class_name] = max(results_dict[class_name], reliability)
            else:
                results_dict[class_name] = reliability

    # 각 클래스의 최종 신뢰도만 출력
    for class_name, reliability in results_dict.items():
        print(f"Class: {class_name}, Final Reliability: {reliability}")

    if 'idcard' not in results_dict or results_dict['idcard'] < THRESHOLD:
        print("idcard 신뢰도가 낮음 또는 탐지되지 않음")
        return {"allow": allow}

    relevant_classes = ['people', 'pan', 'arrow', 'hanoi']
    filtered_results = {key: results_dict[key] for key in relevant_classes if key in results_dict}

    if len(filtered_results) != len(relevant_classes):
        print("필요한 클래스가 부족함")
        return {"allow": allow}

    predict_avg = round(sum(filtered_results.values()) / len(filtered_results), 2)
    print(f"기타 클래스의 평균 예측 결과: {predict_avg}")

    if predict_avg >= THRESHOLD:
        allow = True

    print(f"Final allow value: {allow}, type: {type(allow)}")
    return {"allow": allow}


class RouteItem(BaseModel):
    bus_stop_longtitude: float = Field(..., alias="busStopLongitude")
    bus_stop_latitude: float = Field(..., alias="busStopLatitude")
    visited: bool

class ETARequest(BaseModel):
    now_bus_longtitude: float = Field(..., alias="nowBusLongitude")
    now_bus_latitude: float = Field(..., alias="nowBusLatitude")
    bus_line: int = Field(..., alias="busLine")
    detail_bus_stop_longtitude: float = Field(..., alias="detailBusStopLongitude")
    detail_bus_stop_latitude: float = Field(..., alias="detailBusStopLatitude")
    route: list[RouteItem]

@router.post("/eta")
def predict_eta(request: ETARequest):
    now_stop_lat = request.now_bus_latitude
    now_stop_long = request.now_bus_longtitude
    next_stop_lat = request.detail_bus_stop_latitude
    next_stop_long = request.detail_bus_stop_longtitude
    bus_no = request.bus_line

    visited_stops = [stop for stop in request.route if stop.visited]
    if visited_stops:
        last_visited_stop = visited_stops[-1]
        now_stop_lat = last_visited_stop.bus_stop_latitude
        now_stop_long = last_visited_stop.bus_stop_longtitude

    new_data = {
        'distance': [geodesic((now_stop_lat, now_stop_long), (next_stop_lat, next_stop_long)).meters / 1000],
        'day': [pd.Timestamp.now().dayofweek],
        'weather_0': 0, 
        'weather_11': 0,
        'weather_21': 0,
        'weather_22': 0,
        'weather_23': 0,
        'bus_no': [bus_no]
    }
    
    new_data_df = pd.DataFrame(new_data)
    new_data_df = pd.get_dummies(new_data_df, columns=['bus_no'])
    missing_cols = set(best_rf_model_loaded.feature_names_in_) - set(new_data_df.columns)
    for col in missing_cols:
        new_data_df[col] = 0
    new_data_df = new_data_df[best_rf_model_loaded.feature_names_in_]

    predicted_time = best_rf_model_loaded.predict(new_data_df)
    predicted_time -= 2
    
    if predicted_time <= 0:
        predicted_time = 1

    return {
        'bus_line': bus_no,
        'predicted_time': math.trunc(predicted_time[0])
    }

app.include_router(router, prefix="/ai")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8001, workers=60)
