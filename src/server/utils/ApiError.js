export default class ApiError extends Error {
    constructor(message, status) {
        super()
        this.errorMessage = message
        this.status = status
    }
}
