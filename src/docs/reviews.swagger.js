/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags:
 *       - Reviews
 *     summary: 리뷰 수정
 *     description: 내가 작성한 리뷰를 수정한다.
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: review id
 *     responses:
 *       200:
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
