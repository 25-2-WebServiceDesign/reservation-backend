/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 및 인가 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           description: 사용자 정보
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         expiresIn:
 *           type: number
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: JWT 토큰 재발급
 *     description: Refresh Token을 이용해 Access Token과 Refresh Token을 재발급한다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh Token
 *     responses:
 *       200:
 *         description: 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
 *       400:
 *         description: BAD_REQUEST
 *       401:
 *         description: UNAUTHORIZED (토큰 만료/위조)
 *       409:
 *         description: DUPLICATE_RESOURCE / STATE_CONFLICT
 *       422:
 *         description: UNPROCESSABLE_ENTITY
 *       429:
 *         description: TOO_MANY_REQUESTS
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 *       503:
 *         description: SERVICE_UNAVAILABLE
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 로그아웃
 *     description: Refresh Token을 비활성화하여 로그아웃 처리한다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh Token
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *       400:
 *         description: BAD_REQUEST
 *       401:
 *         description: UNAUTHORIZED
 *       429:
 *         description: TOO_MANY_REQUESTS
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Google 소셜 로그인 (Firebase)
 *     description: Firebase Auth를 이용한 Google 소셜 로그인
 *     responses:
 *       302:
 *         description: Google 인증 페이지로 리다이렉트
 *       401:
 *         description: UNAUTHORIZED
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 *       503:
 *         description: SERVICE_UNAVAILABLE
 */

/**
 * @swagger
 * /auth/naver:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Naver 소셜 로그인
 *     description: Naver OAuth 로그인
 *     responses:
 *       302:
 *         description: Naver 인증 페이지로 리다이렉트
 *       401:
 *         description: UNAUTHORIZED
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 */
