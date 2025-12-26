
module.exports = {
    Unit: {
        type: "object",
        properties: {
            id: {
                type: "integer"
            },
            storeId: {
                type: 'integer'
            },
            name: {
                type: "string"
            },
            description: {
                type: "string"
            },
            profileImage: {
                type: "integer"
            },
            detailUrl: {
                type: "string"
            },
        }
    },
    ReservationPolicy: {
        type: 'object',
        properties: {
            slotDuration: {
                type: 'integer',
                default: 30,
            },
            maximumHeadcount: {
                type: 'integer',
                default: 1
            },
            operatingHours: {
                type: 'array',
                items: {
                    $ref: "#/components/schemas/OperatingHour"
                }
            }
        }
    },
    OperatingHour: {
        type: "object",
        properties: {
            dayOfWeek: {
                type: 'string',
                enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
                default: "MON",
            },
            openTime: {
                type: 'string',
                default: "09:00"
            },
            closeTime: {
                type: 'string',
                default: "18:00"
            }
        }
    },
    ReservationUnit: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
            },
            storeId: {
                type: 'integer'
            },
            name: {
                type: 'string',
            },
            description: {
                type: 'string'
            },
            profileImage: {
                type: "string"
            },
            detailUrl: {
                type: 'string'
            }
        }
    },
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