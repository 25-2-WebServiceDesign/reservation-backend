const responseForm = (data, meta = {}) => {
    return {
        type: "object",
        properties: {
            data: data,
            meta: {
                type: 'object',
                properties: {
                    ...meta,
                    timestamp: {
                        type: "string",
                        description: "응답 시간 iso format",
                        example: "2025-12-22T17:50:48.212Z"
                    }
                }
            }
        }
    }
};

module.exports = {
    StoreCreate: {
        $ref: "#/components/schemas/Store"
    },
    GetAllReviews: responseForm(
        {
            type: "object",
            properties: {
                reviews: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Review" }
                }
            }
        }
    ),
    GetOneReview: responseForm(
        {
            type: "object",
            properties: {
                review: {$ref: "#/components/schemas/Review"}
            }
        }
    ),
    GetOneUser: responseForm(
        {
            type: "object",
            properties: {
                user: { $ref: "#/components/schemas/User" },
            }
        }
    ),
    StandardError: {
        type: "object",
        properties: {
            error: {
                type: "string",
                example: "BAD_REQUEST",
            },
            message: {
                type: "string",
                example: "userId is required"
            }
        }
    },
    LoginResponse: {
        type: "object",
        properties: {
            data: {
                type: "object",
                properties: {
                    user: { $ref: "#/components/schemas/User" },
                    accessToken: {
                        type: "string",
                        description: "JWT 인증 토큰",
                    },
                    refreshToken: {
                        type: "string",
                        description: "JWT 리프레시 토큰",
                    },
                    expiresIn: {
                        type: "integer",
                        description: "accessToken 유효 기간 (단위: 초)",
                        example: 3600,
                    }
                }
            },
            meta: {
                type: 'object',
                properties: {
                    timestamp: {
                        type: "string",
                        description: "응답 시간 iso format",
                        example: "2025-12-22T17:50:48.212Z"
                    }
                }
            }
        }
    },
}