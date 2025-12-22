/**
 * @swagger
 * /units/{id}:
 *  patch:
 *      tags:
 *          - Units
 *      summary: 유닛 상세 정보 수정
 *      description: 유닛 상세 정보 수정 (owner)
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 유닛 ID
 *            default: 1
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/UnitsUpdate"
 *      responses:
 *          200:
 *              description: ok 유닛 상세 정보 업데이트 성공
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 유닛이 없다.
 */

/**
 * @swagger
 * /units/{id}:
 *  delete:
 *      tags:
 *          - Units
 *      summary: 유닛 삭제 (소프트)
 *      security:
 *          - bearerAuth: []
 *      description: 유닛 소프트 딜리트 (가게 소유자 혹은 그 이상의 사용자)
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 유닛 ID
 *            default: 1
 *      responses:
 *          204:
 *              description: no_content 삭제 성공 혹은 이미 없음
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 */

/**
 * @swagger
 * /units/{id}:
 *  get:
 *      tags:
 *          - Units
 *      summary: 유닛 상세 정보 확인
 *      description: 유닛 상세 정보 확인 (모든 사용자)
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 유닛 ID
 *            default: 1
 *      responses:
 *          200:
 *              description: ok 유닛 상세 정보 확인 성공
 *          404:
 *              description: not_found 해당 ID 를 가진 유닛이 없습니다.
 */

/**
 * @swagger
 * /units/{id}/business-hours:
 *  post:
 *      tags:
 *          - Units
 *      summary: 유닛 운영시간 등록
 *      description: 유닛 운영시간 등록
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 유닛 ID
 *            default: 1
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/BusinessHour"
 *      responses:
 *          200:
 *              description: ok 유닛 운영시간 등록 완료
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 유닛이 없다.
 */


/**
 * @swagger
 * /units/{id}/business-hours:
 *  put:
 *      tags:
 *          - Units
 *      summary: 유닛 운영시간 재설정 (업데이트)
 *      security:
 *          - bearerAuth: []
 *      description: 유닛 운영시간을 재설정한다. (처음부터 다시 등록)
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 유닛 ID
 *            default: 1
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/BusinessHour"
 *      responses:
 *          200:
 *              description: ok 유닛 운영시간 재등록 완료
 *          400:
 *              description: bad_request 필수 항목 누락 (businessHourUnits)
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 유닛이 없다.
 */

/**
 * @swagger
 * /units/{id}/availability:
 *  get:
 *      tags:
 *          - Units
 *      summary: 유닛 예약 가능 시간 조회
 *      description: 특정 날짜(date)에 대해 해당 유닛의 예약 가능한 time slot 리스트를 반환
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 유닛 ID
 *            default: 1
 *          - in: query
 *            name: date
 *            schema:
 *                type: string
 *            description: 조회할 날짜 'YYYY-MM-DD', 기본값 = 당일 날짜
 *            default: 2025-12-11
 *      responses:
 *          200:
 *              description: ok 유닉 예약 가능 여부 조회 성공. (body 에 가능여부 반환)
 *          400:
 *              description: bad_request 필수 항목 누락 (businessHourUnits)
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 유닛이 없다.
 */

/**
 * @swagger
 * /units/{id}/reservations:
 *  post:
 *      tags:
 *          - Units
 *      summary: 예약 생성
 *      security:
 *          - bearerAuth: []
 *      description: 유닛에 대한 예약 생성 (사용자등급)
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 유닛 ID
 *            default: 1
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/ReservationCreate"
 *      responses:
 *          201:
 *              description: created 예약 생성 성공
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          403:
 *              description: forbidden 유효하지 않은 사용자 (가게 주인, 관리자)
 *          404:
 *              description: not_found 해당 ID 를 가진 유닛이 없다.
 */


/**
 * @swagger
 * /units/{id}/reviews:
 *  get:
 *      tags:
 *          - Units
 *      summary: 유닛의 리뷰들 조회
 *      description: 유닛의 리뷰들 조회. (모든 사용자) - 페이지네이션 추가 예정
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 유닛 ID
 *            default: 1
 *      responses:
 *          200:
 *              description: ok 유닛 리뷰들 조회 성공
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 유닛이 없다.
 */