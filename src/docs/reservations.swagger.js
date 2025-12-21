/**
 * @swagger
 * /reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: 나의 예약 현황 조회
 *     description: 내 예약 목록을 조회한다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: 예약 상세 조회
 *     description: 예약 단건 상세 정보를 조회한다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: reservation id
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 예약을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     tags:
 *       - Reservations
 *     summary: 예약 수정/취소
 *     description: 예약 정보를 수정하거나 취소한다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: reservation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 수정/취소에 필요한 필드 전달 (예: status, time 등)
 *     responses:
 *       200:
 *         description: 수정/취소 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 예약을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /reservations/{id}/status:
 *   patch:
 *     tags:
 *       - Reservations
 *     summary: 예약 상태 변경
 *     description: 예약 상태를 변경한다. (owner 권한 등 정책에 따라 제한)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: reservation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: 변경할 예약 상태
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: 상태 변경 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 예약을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /reservations/{id}/review:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: 리뷰 추가
 *     description: 예약이 완료 상태인 경우에만 리뷰를 작성한다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: reservation id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: 별점
 *               content:
 *                 type: string
 *                 description: 리뷰 내용
 *             required:
 *               - rating
 *               - content
 *     responses:
 *       201:
 *         description: 리뷰 생성 성공
 *       400:
 *         description: 잘못된 요청(예약 미완료 등)
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 예약을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
