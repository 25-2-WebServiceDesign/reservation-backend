# 레이어 구조
## 전체 프로젝트 구조
```
root/
    postman/        # postman json file
    seed/           # 시드 데이터
    src/            # 프로젝트 코드들
    unitTests/      # sqlite 로 DB 의존성을 제거한 독립된 환경 설정 및 src/services 함수 단위 테스트 코드 (jest)
    docs/           # 프로젝트 설계에 대한 상세
    README.md       # 프로젝트 개요, 실행-배포 가이드
```

## src 구조
```
src/
    config/         # sequelize, swagger 등 환경 설정
    models/         # sequelize model 선언
    repositories/   # sql 쿼리 실행 레이어
    services/       # 연산 레이어
    controllers/    # 입력 검증, services 호출, 응답 반환
    routers/        # 엔드포인트 라우팅, 미들웨어, controller 연결
    middleware      # 미들웨어 묶음
    responses       # 표준 응답 형식, 에러 형식 선언
    utils           # jwt 등 자주 사용되는 기능 모음
    docs/           # swagger 문서
    app.js          # router 들을 묶어 하나의 app 으로 생성
    server.js       # app을 실행
```

