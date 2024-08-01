from fastapi import FastAPI, Form, File, UploadFile, HTTPException, APIRouter
from PIL import Image
from io import BytesIO
import math
import torch
from fastapi.responses import JSONResponse
import numpy as np
import sys
import os
import pathlib
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

# YOLOv5 경로 추가
YOLOV5_PATH = 'C:/workspace/AI/model_train/yolov5'
sys.path.append(YOLOV5_PATH)

from models.common import DetectMultiBackend  # YOLOv5의 모델 로드 클래스
from utils.general import non_max_suppression, scale_boxes
from utils.augmentations import letterbox

app = FastAPI()
router = APIRouter()

@router.get("/")
def read_root():
    return "FastAPI"

@router.post("/predict")
async def process_home_form(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=422, detail="File is missing")

    try:
        # YOLOv5 모델 로드
        model_path = 'C:/workspace/AI/fastAPI/yolov5/runs/train/newModel/weights/best.pt'
        #model_path = 'C:/workspace/AI/model_train/yolov5/runs/train/idcardModel2/weights/best.pt'
        model = DetectMultiBackend(model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

    try:
        # 업로드된 이미지 읽기
        image = Image.open(BytesIO(await file.read())).convert("RGB")
        original_shape = np.array(image).shape  # 원본 이미지의 모양

        # YOLOv5 모델의 이미지 전처리
        img = np.array(image)  # PIL 이미지를 numpy 배열로 변환
        img = letterbox(img, 640, stride=32, auto=True)[0]  # YOLOv5 전처리
        img = img.transpose((2, 0, 1))  # HWC to CHW
        img = np.ascontiguousarray(img)
        
        img_tensor = torch.from_numpy(img).to('cpu')
        img_tensor = img_tensor.float()  # uint8 to fp16/32
        img_tensor /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img_tensor.ndimension() == 3:
            img_tensor = img_tensor.unsqueeze(0)

        # 모델 예측
        with torch.no_grad():
            pred = model(img_tensor)

        # NMS 적용
        pred = non_max_suppression(pred, 0.5, 0.45, classes=[0, 1, 2, 3, 4], agnostic=False)

        # 결과를 JSON으로 변환
        json_results = results_to_json(pred, model, img_tensor, original_shape)
        
        return JSONResponse(content=json_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

def results_to_json(pred, model, img_tensor, original_shape): # 이미지 받아서 검증
    results = []
    allow = False
    threshold = 0.7

    # pred가 비어있는지 확인
    # if not pred or len(pred) == 0: # 사진이 안 온경우
    #     print("탐지 된 객체가 없음")
    #     return {"allow": allow}

def results_to_json(pred, model, img_tensor, original_shape): 
    results = {}
    allow = False
    threshold = 0.7

    if not pred or len(pred) == 0: 
        print("탐지 된 객체가 없음")
        return {"allow": allow}

    for det in pred:
        if len(det) == 0: 
            print("탐지 된 객체가 없음")
            return {"allow": allow}

        det[:, :4] = scale_boxes(img_tensor.shape[2:], det[:, :4], original_shape).round()
        for *xyxy, conf, cls in reversed(det):
            class_name = model.names[int(cls)]
            reliability = math.ceil(float(conf) * 100) / 100
            
            if class_name in results:
                # 기존 신뢰도와 비교하여 더 큰 값을 저장
                results[class_name] = max(results[class_name], reliability)
            else:
                # 새로운 클래스를 딕셔너리에 추가
                results[class_name] = reliability

            print(f"Class: {class_name}, Reliability: {reliability}")

    if 'idcard' not in results or results['idcard'] < threshold:
        print("idcard 신뢰도가 낮음 또는 탐지되지 않음")
        return {"allow": allow}

    # 'idcard' 신뢰도가 threshold 이상인 경우, 다른 클래스들 확인
    relevant_classes = ['people', 'pan', 'arrow', 'hanoi']
    filtered_results = {key: results[key] for key in relevant_classes if key in results}

    if len(filtered_results) != len(relevant_classes):
        print("필요한 클래스가 부족함")
        return {"allow": allow}

    predict_avg = round(sum(filtered_results.values()) / len(filtered_results), 2)
    print(f"기타 클래스의 평균 예측 결과: {predict_avg}")

        # filtered_results의 키와 값을 출력
    for key, value in filtered_results.items():
        print(f"Class: {key}, Max Reliability: {value}")

    if predict_avg >= threshold:
        allow = True

    return {"allow": allow}
    
    

# 라우터를 '/idcard' 경로로 설정
app.include_router(router, prefix="/idcard")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True, workers=1)
