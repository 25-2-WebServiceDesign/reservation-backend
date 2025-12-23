module.exports = {
    Store: {
        type: "object",
        properties: {
            id: {
                type: "integer"
            },
            name: {
                type: "string",
            },
            address: {
                type: 'string'
            },
            phone: {
                type: "string"
            },
            ownerId: {
                type: "integer",
            },
            category: {
                type: "string"
            },
            homepageUrl: {
                type: "string"
            },
            detail: {
                type: 'string'
            },
        }
    },
    User: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                example: 1,
            },
            nickname: {
                type: "string",
                example: "최현우",
            },
            email: {
                type: "string",
                example: "example@gmail.com",
            },
            phone: {
                type: "string",
                example: "+820112341234",
            },
            profileImage: {
                type: "string",
            },
            role: {
                type: "string",
                enum: ["CUSTOMER", "OWNER", "ADMIN"],
                example: "CUSTOMER",
            }
        }
    },
    Review: {
        type: "object",
        properties: {
            id: {
                type: "integer"
            },
            userId: {
                type: "integer"
            },
            reservationId: {
                type: "integer"
            },
            rating: {
                type: "integer",
                description: "0 ~ 10 사이의 별점"
            },
            content: {
                type: "string"
            }
        }
    },
}