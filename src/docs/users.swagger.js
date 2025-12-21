/**
 * @swagger
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: 프로필 정보 확인
 *     description: 내 프로필 정보를 조회한다.
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
 * /users/me:
 *   patch:
 *     tags:
 *       - Users
 *     summary: 프로필 정보 수정
 *     description: 내 프로필 정보를 수정한다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: 수정할 필드만 전달 (예 - nickname 등)
 *     responses:
 *       200:
 *         description: 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /users/me:
 *   delete:
 *     tags:
 *       - Users
 *     summary: 프로필 삭제 (Soft Delete)
 *     description: 내 계정을 소프트 딜리트 처리한다.
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /users/me/reviews:
 *   get:
 *     tags:
 *       - Users
 *     summary: 내 리뷰 확인
 *     description: 내가 작성한 리뷰 목록을 조회한다. (페이지네이션 가능)
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
 * /users/me/favorites:
 *   get:
 *     tags:
 *       - Users
 *     summary: 관심가게 조회
 *     description: 내가 즐겨찾기한 가게 목록을 조회한다.
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 인증 필요
 *       500:
 *         description: 서버 에러
 */
