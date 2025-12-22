/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: 리뷰 확인
 *     description: 리뷰 하나를 상세 확인
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: review id
 *     responses:
 *       200:
 *         description: 리뷰 불러오기 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GetOneReview"
 *       400:
 *         description: 요청 오류
 *       404:
 *         description: 리뷰 찾을 수 없음
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: 리뷰 수정
 *     description: 내가 작성한 리뷰를 수정한다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: review id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GetOneReview"
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 리뷰를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: 리뷰 삭제 (Soft Delete)
 *     description: 리뷰를 소프트 딜리트 처리한다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: review id
 *     responses:
 *       204:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 리뷰를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
