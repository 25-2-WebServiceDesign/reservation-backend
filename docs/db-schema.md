# DB Schema

| [dbdiagram.io](https://dbdiagram.io) 에서 작업함

![ERD](../assets/ERD.png)


## 소스 코드
```
ENUM WeekDays {
  SUN
  MON
  TUE
  WED
  THU
  FRI
  SAT
}

ENUM Roles {
  CUSTOMER
  OWNER
  ADMIN
}

Enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELED_BY_CUSTOMER
  CANCELED_BY_STORE
  COMPLETED
}

Enum Providers {
  NAVER
  KAKAO
  GOOGLE
}

Table UserAuth {
  id integer [pk, increment]
  userId integer [not null, ref: < User.id]
  provider Providers [not null]
  providerUid varchar [not null]

  Indexes {
    (provider, providerUid) [unique]
  }
}

Table RefreshToken {
  id integer [pk, increment]
  userId integer [not null, ref: < User.id]
  token varchar [not null, note: "JWT 인증 갱신 토큰"]
  expiresAt timestamp [not null]
  revokedAt timestamp [default: null]
}

Table User {
  id integer [pk, increment]
  nickname varchar(20) [not null]
  email varchar(100) [unique, not null]
  phone varchar(20) [unique]
  profileImage varchar(255) [note: "s3 경로"]
  role Role [not null, default: Roles.CUSTOMER, note: "[CUSTOMER, OWNER, ADMIN]"]

  createdAt timestamp [not null, default: "now()"]
  updatedAt timestamp [not null, default: "now()"]
  deletedAt timestamp [default: null]
}

Table Store {
  id integer [pk, increment]
  name varchar(100) [not null]
  address varchar(200) [not null]
  phone varchar(20) [not null]
  ownerId integer [not null, ref: < User.id]
  category varchar [note: "[숙소, 식당, 스토어] 중 택 1 추후 추가 가능"]
  homepageURL varchar(200) [default: null]
  detail varchar [note: "상세 페이지"]

  createdAt timestamp [not null, default: "now()"]
  updatedAt timestamp [not null, default: "now()"]
  deletedAt timestamp [default: null]
}

Table ReservationPolicy {
  id integer [pk, increment]
  unitId integer [not null, unique, ref: < ReservationUnit.id]
  slotDuration integer [not null, default: 30, note: "min 단위의 예약 단위 시간"]
  maximumHeadcount integer [default: 1, note: "최대 예약 가능 수"]
}

Table OperatingHour {
  id integer [pk, increment]
  policyId integer [ref: < ReservationPolicy.id]
  dayOfWeek WeekDays [note: "요일", not null]
  openTime time [not null]
  closeTime time [not null]

  createdAt timestamp [not null, default: "now()"]
  updatedAt timestamp [not null, default: "now()"]
}

Table ReservationUnit {
  id integer [pk, increment]
  storeId integer [not null, ref: < Store.id]
  name varchar(100) [not null]
  description text [not null]
  profileImage varchar [note: "s3 혹은 이미지의 경로"]
  detailURL varchar [default: null, note: "sns 경로 혹은 상세 페이지가 있다면 그 경로"]

  createdAt timestamp [not null, default: "now()"]
  updatedAt timestamp [not null, default: "now()"]
  deletedAt timestamp [default: null]
}

Table Reservation {
  id integer [pk, increment]
  userId integer [not null, ref: < User.id]
  unitId integer [not null, ref: < ReservationUnit.id]
  startTime timestamp [not null]
  endTime timestamp [not null]
  memo text [note: "예약 세부사항"]
  headcount integer [default: 1]
  status ReservationStatus [note: "예약확인중, 예약됨, 취소됨, 완료됨"]

  createdAt timestamp [not null, default: "now()"]
  updatedAt timestamp [not null, default: "now()"]
}

Table Review {
  id integer [pk, increment]
  userId integer [not null, ref: > User.id]
  reservationId integer [not null, ref: > Reservation.id]
  rating integer [not null, note: "0 ~ 10 까지의 점수"]
  content text

  createdAt timestamp [not null, default: "now()"]
  updatedAt timestamp [not null, default: "now()"]
  deletedAt timestamp [default: null, note: "소프트 딜리트 시 사용"]
}

Table Favorite {
  userId integer [not null, ref: < User.id]
  storeId integer [not null, ref: < Store.id]

  Indexes {
    (userId, storeId) [unique]
  }

  createdAt timestamp [not null, default: "now()"]
  deletedAt timestamp [default: null, note: "소프트 딜리트 시 시간이 설정됨"]
}
```