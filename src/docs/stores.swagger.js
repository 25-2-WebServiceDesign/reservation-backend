/**
 * @swagger
 * /stores:
 *   post:
 *     tags:
 *       - Stores
 *     summary: 가게 등록
 *     description: 가게를 등록한다. OWNER 사용자 등급 필요
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StoreCreate"
 *     responses:
 *       201:
 *         description: created 가게 생성 성공
 *       400:
 *         description: bad_request 유효하지 않은 카테고리 혹은 필수 항목 누락
 *       401:
 *         description: unauthorized 인증되지 않은 사용자
 *       403:
 *         description: forbidden 유효하지 않은 사용자
 */

/**
 * @swagger
 * /stores:
 *  get:
 *      tags:
 *          - Stores
 *      summary: (모든 사용자) 모든 가게 조회
 *      description: 사용자가 모든 가게를 조회함 - 추후 페이지네이션 적용
 *      parameters:
 *          - in: query
 *            name: page
 *            required: false
 *            schema:
 *                type: integer
 *            default: 1
 *          - in: query
 *            name: limit
 *            required: false
 *            schema:
 *                type: integer
 *            default: 5
 *      responses:
 *          200:
 *              description: ok 가게 조회 성공
 */

/**
 * @swagger
 * /stores/me:
 *  get:
 *      tags:
 *          - Stores
 *      summary: 본인 가게들 조회
 *      description: OWNER 사용자가 본인의 가게들을 조회함
 *      parameters:
 *          - in: query
 *            name: path
 *            required: false
 *            schema:
 *                type: integer
 *            default: 1
 *          - in: query
 *            name: limit
 *            required: false
 *            schema:
 *                type: integer
 *            default: 5
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: ok 가게 조회 성공
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 */

/**
 * @swagger
 * /stores/{id}:
 *  get:
 *      tags:
 *          - Stores
 *      summary: 가게 상세 조회
 *      description: 가게 상세 조회
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 가게 ID
 *            default: 1
 *      responses:
 *          200:
 *              description: ok 가게 상세 조회 성공
 *          404:
 *              description: not_found 해당 ID 를 가진 가게가 없습니다.
 */

/**
 * @swagger
 * /stores/{id}/units:
 *  get:
 *      tags:
 *          - Stores
 *      summary: 가게 유닛들 조회
 *      description: 가게 유닛들 조회
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 가게 ID
 *            default: 1
 *          - in: query
 *            name: page
 *            required: false
 *            schema:
 *                type: integer
 *            default: 1
 *          - in: query
 *            name: limit
 *            required: false
 *            schema:
 *                type: integer
 *            default: 5
 *      responses:
 *          200:
 *              description: ok 가게 상세 조회 성공
 *          404:
 *              description: not_found 해당 ID 를 가진 가게가 없습니다.
 */

/**
 * @swagger
 * /stores/{id}/reservations:
 *  get:
 *      tags:
 *          - Stores
 *      summary: 가게 예약 조회
 *      description: 가게의 예약을 조회한다. (OWNER & 소유자)
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 가게 ID
 *            default: 1
 *          - in: query
 *            name: page
 *            required: false
 *            schema:
 *                type: integer
 *            default: 1
 *          - in: query
 *            name: limit
 *            required: false
 *            schema:
 *                type: integer
 *            default: 5
 *      responses:
 *          200:
 *              description: ok 가게 예약들 조회 성공
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 가게가 없습니다.
 */


/**
 * @swagger
 * /stores/{id}/reviews:
 *  get:
 *      tags:
 *          - Stores
 *      summary: 가게 리뷰들 조회
 *      description: 가게의 리뷰들을 조회한다. (모든 사용자) 
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 가게 ID
 *            default: 1
 *      responses:
 *          200:
 *              description: ok 가게 리뷰 조회 성공
 *          404:
 *              description: not_found 해당 ID 를 가진 가게가 없습니다.
 */





/**
 * @swagger
 * /stores/{id}/units:
 *  post:
 *      tags:
 *          - Stores
 *      summary: 예약 유닛 추가
 *      description: 예약을 할 수 있는 유닛 추가
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 가게 ID
 *            default: 1
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/UnitCreate"
 *      responses:
 *          201:
 *              description: created 유닛 생성 성공!
 *          401:
 *              description: unauthorized 인증되지 않은 사용자
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 가게가 없습니다.
 *          
 */

/**
 * @swagger
 * /stores/{id}:
 *   patch:
 *     tags:
 *       - Stores
 *     summary: 가게정보 업데이트
 *     security:
 *        - bearerAuth: []
 *     description: 가게 정보 업데이트 (OWNER & 소유자 이상 등급 필요)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *            type: integer
 *         description: 가게 ID
 *         default: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StoreCreate"
 *     responses:
 *       200:
 *         description: ok 가게 정보 업데이트 성공
 *       401:
 *         description: unauthorized 인증되지 않은 사용자
 *       403:
 *         description: forbidden 유효하지 않은 사용자
 *       404:
 *         description: not_found 해당 ID 를 가진 가게가 없습니다.
 */

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     tags:
 *       - Stores
 *     summary: 가게 삭제 (소프트)
 *     security:
 *       - bearerAuth: []
 *     description: 가게 소프트 딜리트 (OWNER & 소유자 혹은 그 이상의 등급)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *            type: integer
 *         description: 가게 ID
 *         default: 1
 *     responses:
 *       200:
 *         description: ok 가게 삭제 성공 (삭제된 ID, timestamp json형식으로 반환)
 *       401:
 *         description: unauthorized 인증되지 않은 사용자
 *       403:
 *         description: forbidden 유효하지 않은 사용자
 *       404:
 *         description: not_found 해당 ID 를 가진 가게가 없습니다.
 */

/**
 * @swagger
 * /stores/{id}/favorites:
 *  post:
 *      tags:
 *          - Stores
 *      summary: 관심 가게 추가
 *      description: 관심 가게로 추가한다. (모든 사용자)
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 가게 ID
 *            default: 1
 *      responses:
 *          200:
 *              description: ok 관심 가게 추가 성공!
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 가게가 없습니다.
 */

/**
 * @swagger
 * /stores/{id}/favorites:
 *  delete:
 *      tags:
 *          - Stores
 *      summary: 관심 가게 삭제 (소프트)
 *      description: 괌심 가게 소프트 삭제
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: integer
 *            description: 가게 ID
 *            default: 1
 *      responses:
 *          204:
 *              description: no_content 삭제 성공 혹은 이미 삭제되거나 관심 가게에 존재하지 않음
 *          403:
 *              description: forbidden 유효하지 않은 사용자
 *          404:
 *              description: not_found 해당 ID 를 가진 가게가 없다.
 */

