/**
 * @swagger
 * /auth/naver/login:
 *  get:
 *      tags:
 *          - Auth
 *      summary: naver login - swagger, postman 테스트 X (브라우저에서 테스트!)
 *      description: 네이버 로그인
 *      responses:
 *          200:
 *              description: 네이버 로그인 성공 (계정이 없다면 회원가입 후 생성)
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/LoginResponse"
 *          400:
 *              description: 네이버 로그인 실패
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/StandardError"
 */

/**
 * @swagger
 * /auth/naver/callback:
 *  get:
 *      tags:
 *          - Auth
 *      summary: naver login callback - 직접 사용 X (네이버 인증에서 사용)
 *      description: 네이버 로그인
 */

/**
 * @swagger
 * /auth/refresh:
 *  post:
 *      tags:
 *          - Auth
 *      summary: JWT 토큰 재발급
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          refreshToken:
 *                              type: string
 *                              description: 리프레시 토큰
 *      responses:
 *          200:
 *              description: "재발금 성공"
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/LoginResponse"
 */

/**
 * @swagger
 * /auth/logout:
 *  post:
 *      tags:
 *          - Auth
 *      summary: 리프레시 토큰 비활성화 (logout)
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          refreshToken:
 *                              type: string
 *                              description: 리프레시 토큰
 *      responses:
 *          204:
 *              description: 로그아웃 성공
 *          400:
 *              description: bad request
 * 
 */