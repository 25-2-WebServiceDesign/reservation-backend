
# API Design – Reservation Service

## 1. 개요

본 문서는 **Reservation Service API**의 설계 원칙과 주요 리소스 구조를 설명한다.  
본 API는 예약 기반 서비스(식당, 숙소, 스토어 등)를 대상으로 하며,  
사용자 인증, 가게/유닛 관리, 예약, 리뷰 기능을 제공한다.

- OpenAPI Version: **3.0.0**
- API Version: **1.0.0**
- 인증 방식: **JWT (Bearer Token)**

---

## 2. 서버 환경

| 환경 | Base URL |
|---|---|
| Local | `http://localhost:3000` |
| AWS | `http://54.180.83.86:3000` |

---

## 3. 인증 & 보안 설계

### 3.1 인증 방식
- **JWT 기반 Bearer Authentication**
- Access Token + Refresh Token 구조
- Access Token 만료 시 `/auth/refresh` 엔드포인트 사용

```http
Authorization: Bearer {accessToken}
````

### 3.2 인증이 필요한 API

* 예약 생성/조회/수정
* 가게/유닛 관리
* 리뷰 작성/수정/삭제
* 사용자 프로필 관련 API

---

## 4. 사용자 역할(Role)

| Role     | 설명     |
| -------- | ------ |
| CUSTOMER | 일반 사용자 |
| OWNER    | 가게 소유자 |
| ADMIN    | 관리자    |

각 API는 역할에 따라 접근이 제한된다.

---

## 5. 주요 리소스 설계

### 5.1 User

* 사용자 기본 정보 및 역할 관리
* 프로필 조회/수정/삭제
* 관리자 권한으로 역할 변경 가능

### 5.2 Store

* 가게 단위의 최상위 리소스
* OWNER 사용자만 생성 가능
* 모든 사용자는 조회 가능
* 즐겨찾기(Favorites) 기능 제공

### 5.3 Reservation Unit

* 가게 내 예약 가능한 단위 (예: 방, 테이블)
* 운영 시간(Business Hour)과 정책을 가짐
* 예약은 반드시 유닛 단위로 생성

### 5.4 Reservation

* 사용자와 유닛 간 예약 관계
* 상태 변경(PENDING, CONFIRMED 등)
* 예약 완료 상태에서만 리뷰 작성 가능

### 5.5 Review

* 예약 기반 리뷰 시스템
* 예약이 완료된 경우만 작성 가능
* Soft Delete 적용

---

## 6. 인증(Auth) API 설계

### 6.1 소셜 로그인

* **Naver OAuth**
* **Firebase (Google 등)**

| Endpoint               | Method | 설명                    |
| ---------------------- | ------ | --------------------- |
| `/auth/naver/login`    | GET    | 네이버 로그인 시작            |
| `/auth/naver/callback` | GET    | 네이버 인증 콜백             |
| `/auth/firebase/login` | POST   | Firebase ID Token 로그인 |

### 6.2 토큰 관리

| Endpoint        | Method | 설명                |
| --------------- | ------ | ----------------- |
| `/auth/refresh` | POST   | Access Token 재발급  |
| `/auth/logout`  | POST   | Refresh Token 무효화 |

---

## 7. 예약(Reservation) API 설계

| Endpoint                    | Method | 설명       |
| --------------------------- | ------ | -------- |
| `/reservations`             | GET    | 나의 예약 목록 |
| `/reservations/{id}`        | GET    | 예약 상세 조회 |
| `/reservations/{id}`        | PUT    | 예약 수정/취소 |
| `/reservations/{id}/status` | PATCH  | 예약 상태 변경 |
| `/reservations/{id}/review` | POST   | 예약 리뷰 작성 |

---

## 8. 가게(Store) API 설계

| Endpoint                 | Method | 설명            |
| ------------------------ | ------ | ------------- |
| `/stores`                | GET    | 전체 가게 조회      |
| `/stores`                | POST   | 가게 생성 (OWNER) |
| `/stores/me`             | GET    | 내 가게 목록       |
| `/stores/{id}`           | GET    | 가게 상세         |
| `/stores/{id}`           | PATCH  | 가게 수정         |
| `/stores/{id}`           | DELETE | 가게 삭제 (Soft)  |
| `/stores/{id}/favorites` | POST   | 즐겨찾기 추가       |
| `/stores/{id}/favorites` | DELETE | 즐겨찾기 제거       |

---

## 9. 유닛(Unit) API 설계

| Endpoint                     | Method | 설명          |
| ---------------------------- | ------ | ----------- |
| `/units/{id}`                | GET    | 유닛 상세       |
| `/units/{id}`                | PATCH  | 유닛 수정       |
| `/units/{id}`                | DELETE | 유닛 삭제       |
| `/units/{id}/business-hours` | POST   | 운영시간 등록     |
| `/units/{id}/business-hours` | PUT    | 운영시간 재설정    |
| `/units/{id}/availability`   | GET    | 예약 가능 시간 조회 |
| `/units/{id}/reservations`   | POST   | 예약 생성       |
| `/units/{id}/reviews`        | GET    | 유닛 리뷰 조회    |

---

## 10. 리뷰(Review) API 설계

| Endpoint        | Method | 설명           |
| --------------- | ------ | ------------ |
| `/reviews/{id}` | GET    | 리뷰 상세        |
| `/reviews/{id}` | PUT    | 리뷰 수정        |
| `/reviews/{id}` | DELETE | 리뷰 삭제 (Soft) |

---

## 11. 공통 응답 구조

### 11.1 성공 응답

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2025-12-22T17:50:48.212Z"
  }
}
```

### 11.2 에러 응답

```json
{
  "error": "BAD_REQUEST",
  "message": "userId is required"
}
```

---

## 12. 설계 원칙 요약

* RESTful 리소스 중심 설계
* 인증/인가 분리
* Soft Delete 적극 활용
* DB + Redis 역할 분리

---

## 13. 문서 & 테스트

* Swagger UI: `/api-docs`
* Swagger JSON → Postman Import 가능
* API 테스트는 Postman 기준으로 수행

---
