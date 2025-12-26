class ApiResponse {
    constructor(data, meta = {}) {
        this.data = data;
        this.meta = {
            ...meta,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = ApiResponse;