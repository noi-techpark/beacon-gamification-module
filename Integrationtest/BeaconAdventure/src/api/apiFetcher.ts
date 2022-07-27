import { to } from 'await-to-js';
import { ApiError } from '../models/error';

export const API_SERVER_URL = "http://174.138.100.82/api/v1";

export async function fetchBeaconsApi<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const [error, httpResponse] = await to(fetch(input, init));

    if (!httpResponse) {
        throw error;
    }

    const parsedResponse = await httpResponse.json();

    if (httpResponse.status >= 400 && httpResponse.status < 600) {
        console.log(httpResponse);
        console.log(parsedResponse);

        throw new ApiError(httpResponse.status, httpResponse.statusText, parsedResponse);
    }

    if (!parsedResponse) {
        throw error;
    }

    return parsedResponse;
}
