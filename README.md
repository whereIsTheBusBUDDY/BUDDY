# 🚍  버스 어디? BUDDY 🚍

실시간 셔틀버스 위치 공유 서비스

## 0. 프로젝트 개요

### **📆 프로젝트** 기간
2024.07.08 ~ 2024.08.16 (6주)

### **💭** 기획 배경

**[문제점 분석]**

![](./assets/survey.png)

 
- 날씨나 교통 상황에 따라 탑승 시간이 일정하지 않아 교육생들이 셔틀버스를 놓치는 경우가 빈번

- 간혹 기사님들 간 담당 노선이 변경될 경우 승하차 위치 정보 불확실

- 탑승 패턴에 따라 학기 중 임의로 노선이 변경될 경우 따로 공지 확인을 못해 불편

**[솔루션 제시]**

셔틀버스 실시간 위치 정보 공유

이슈 발생 시 공지사항 전달 및 커뮤니티 공간 제공

## 1. 기능 소개

### **✅ 회원가입 및 로그인**

- 회원가입
  - AI (YOLO)를 활용하여 학생증으로 SSAFY 교육생 여부를 판정 ( 1차 인증 )
  - MatterMost Incoming Webhook으로 발송한 랜덤코드와 학생증 이름을 매칭하여 인증 후 회원가입 ( 2차 인증 )
  - 필요 정보: 이름, 학번, 이메일, 비밀번호, 닉네임, 선호노선
- 로그인
  - JWT 기반 Spring Security
  - 일반 로그인(이메일, 비밀번호)

### 🚍 버스 위치 정보

- 버스의 실시간 위치 제공
  - 기사님 핸드폰 GPS를 이용하여 해당 셔틀버스의 실시간 위치 정보 공유
  - 즐겨찾기 정류장 전 정류장 도착 시 푸쉬 알림 & TTS 알림 전송 ( 예 : “🚌 버스가 곧 즐겨찾기 정류장에 도착합니다. 현재위치 : 갈마역”)
- 버스의 예상 도착 시간 제공
  - 외부 API를 이용하여 예상 도착 시간 제공
  - 지도 API를 사용하여 실시간 교통 정보를 수집하고, AI 모델을 통해 예상 도착 시간을 계산
  - 날씨, 도로 공사, 교통 체증 등 변수 반영하여 제공

### 📈 정보 제공

- 셔틀버스 노선도 제공
  - 호차 별 셔틀버스 노선 지도에 표시하여 시각화
  - 호차 별 정류장 정보 표시

### 💬 게시판 기능

- 공지사항
  - 관리자
  - 사용자 - 읽기 전용
- 자유게시판
  - 게시글 CRUD
  - 댓글 CRUD

### 🔊 푸시 알림

- 즐겨찾기 한 정류장의 직전 정류장 도착 시 PUSH 및 TTS 알림
  - 사용자가 저장하고 싶은 장소의 GPS 좌표를 데이터베이스에 저장
  - 사용자 실시간 위치를 백그라운드 위치 추적하여 주기적으로 업데이트
  - 사용자 현재 위치와 저장된 장소 간 거리 계산하여 일정 반경 내 접근 시 푸시 알림 전송
- 공지사항 등록 시 푸쉬 알림
  - 관리자가 공지사항을 등록할 경우 사용자에게 푸쉬 알림 전송
- 건의하기 전송 시 관리자에게 푸쉬 알림 및 TTS 알림
  - 셔틀 버스 탑승한 사용자가 건의하기 클릭 시 해당 호차 관리자 계정에 푸쉬 알림 전송 및 TTS 알림

### 🗣️ 기사님과의 소통

- 비상 연락 시스템
  - 긴급 상황시 기사님에게 건의사항 전송
  - ex) 급히 화장실 가야 해서 멈춰 달라고 해야할 때

### 🎫 QR 체크인

- 탑승인원 파악 (전 호차 실시간 탑승인원 표시)
- 입장 시 익명 채팅창 활성화(익명 실시간 건의 및 소통, 알림표시?만)
- 입장 시 해당 호차 기사님과 소통할 수 있는 건의하기 페이지 활성화
- 버스 현황 이런식으로 버스에 인원이 얼마나 탑승해있는지(인원수만 제공)

- 부가 기능
  - 셔틀 동선 최적화 (다 하면 나중에)
  - 장소 검색시 가까운 셔틀 정류장, 노선 추천 (컨설턴트님 추천)
  - 생체인식 로그인
  - 기사님 전용해서 네비게이션 기능
  - 각 정류장 마다 탈때 내릴때 몇 명 탈지 몇명 내릴지 기사님에게 알려주기 (만약에 해당 정류장에서 사람이 없을 때 해당 정류장 그냥 지나칠수 있음) ⇒ 시간 단축

## 2. 화면 구성

### 👁‍🗨 와이어 프레임

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f013385e-9dd0-40f7-b35e-40ac32ef030e/b5d06333-f52d-48d9-89e5-1f0be7018d61/image.png)

## 3. ERD

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/f013385e-9dd0-40f7-b35e-40ac32ef030e/a098b4a8-48f4-4178-8898-6ea3933811b9/image.png)

## 4. 기대 효과

- 확장시켜 전국 SSAFY 캠퍼스에서 활용 가능
- 셔틀 버스를 운영하는 곳에 서비스 제공 가능

### **👯 팀 구성**

<table>
 <tr>
    <td align="center"><a href="https://github.com/boeunyoon"><img src="https://avatars.githubusercontent.com/boeunyoon" width="130px;" alt=""></a></td>
    <td align="center"><a href="https://github.com/seungminleeee"><img src="https://avatars.githubusercontent.com/seungminleeee" width="130px;" alt=""></a></td>
    <td align="center"><a href="https://github.com/zhzzang"><img src="https://avatars.githubusercontent.com/zhzzang" width="130px;" alt=""></a></td>
    <td align="center"><a href="https://github.com/aswe0409"><img src="https://avatars.githubusercontent.com/aswe0409" width="130px;" alt=""></a></td>
    <td align="center"><a href="https://github.com/stopvvon"><img src="https://avatars.githubusercontent.com/stopvvon" width="130px;" alt=""></a></td>
   <td align="center"><a href="https://github.com/ssuinh"><img src="https://avatars.githubusercontent.com/ssuinh" width="130px;" alt=""></a></td>
  </tr>
  <tr>
    <td align="center"><b>Leader & FE & BE</b></a></td>
    <td align="center"><b>FE</b></a></td>
    <td align="center"><b>BE & Infra</b></a></td>
    <td align="center"><b>BE & AI</b></a></td>
    <td align="center"><b>FE</b></a></td>
    <td align="center"><b>FE</b></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/boeunyoon"><b>윤보은</b></a></td>
    <td align="center"><a href="https://github.com/seungminleeee"><b>이승민</b></a></td>
    <td align="center"><a href="https://github.com/zhzzang"><b>이주희</b></a></td>
    <td align="center"><a href="https://github.com/aswe0409"><b>정석영</b></a></td>
    <td align="center"><a href="https://github.com/stopvvon"><b>정지원</b></a></td>
    <td align="center"><a href="https://github.com/ssuinh"><b>홍수인</b></a></td>
  </tr>
</table>

### **💻 기술 스택**


**FE Development**

  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/React Native-61DAFB?style=for-the-badge&logo=React&logoColor=black"/>
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=Expo&logoColor=white"/>

**BE Development**

<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/JAVA-007396?style=for-the-badge&logo=OpenJDK&logoColor=white"> 
<img src="https://img.shields.io/badge/spring%20security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white">
<img src="https://img.shields.io/badge/JPA%20(Hibernate)-00485B?style=for-the-badge&logo=Hibernate&logoColor=white">
<img src="https://img.shields.io/badge/jwt-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white">

**Database**

  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 

**AI**

<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/fastapi-009688?style=for-the-badge&logo=fastapi&logoColor=white">


**Infra**

<img src="https://img.shields.io/badge/ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white">
<img src="https://img.shields.io/badge/amazon%20ec2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white">
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
<img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">

**SUPPORT TOOL**

<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jira&logoColor=white">
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/intellij%20idea-000000?style=for-the-badge&logo=intellij-idea&logoColor=white">
<img src="https://img.shields.io/badge/visual%20studio%20code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white">


**CI/CD**

<img src="https://img.shields.io/badge/gitlab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white">
<img src="https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white">
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
