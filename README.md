# reservation-backend
25-2 웹서비스설계 최종 프로젝트

## 프로젝트 개요
Reservation Service는 식당·숙소·스토어 등 다양한 업종에서 사용할 수 있는 예약 기반 서비스 백엔드 API이다.
사용자는 가게 및 예약 유닛을 조회하고 예약을 생성할 수 있으며, 가게 소유자는 예약 관리·운영 시간 설정·상태 변경을 수행할 수 있다.

사용된 기술
- JWT 기반 인증
- 소셜 로그인 (Firebase: google, Naver OAuth)
- Redis 를 활용한 토큰 관리
- RESTful API 설계
- Swagger API 문서
- Docker 배포 및 운영
- 역할 기반 접근 제어 (ADMIN / OWNER / CUSTOMER)


## 실행 가이드
- node 실행
  1. `.env` 파일 형식에 맞도록 채우기 (ex: `.env.example`)
  2. `npm install`
  3. `node src/server.js`
- docker 실행
  1. `.env` 파일 형식에 맞도록 채우기 (ex: `.env.example`)
  2. `docker-compose up -d --build`

## 테스트 가이드
```bash
npm test
```

