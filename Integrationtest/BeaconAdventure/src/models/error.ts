export class ApiError extends Error {
    name: string;
    status: number;
    statusText: string;
    response?: any;

    constructor(status, statusText, response, message?) {
        super();
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
        this.response = response;
        this.message = message || `${status} - ${statusText}`;
    }
}

export function isUsernameAlreadyExisiting(err: ApiError): boolean {
    return err.status === 400 &&
        err.response.username && err.response.username[0] === 'A user with that username already exists.';
}