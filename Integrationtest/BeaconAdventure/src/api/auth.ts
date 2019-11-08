import to from "await-to-js";
import { User, UserDetail } from "../models/user";
import { hashCode } from "../utils/stringUtils";
import { API_SERVER_URL, fetchBeaconsApi } from "./apiFetcher";
import { MessageReponse, TokenResponse } from "./responses";

export async function postCreateUser(token: string, username: string): Promise<User> {
    const [error, user] = await to(
        fetchBeaconsApi<User>(`${API_SERVER_URL}/create-user/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            },
            body: JSON.stringify({
                username,
                email: username,
                password: hashCode(username),
                password2: hashCode(username),
            })
        })
    );

    if (!user) {
        throw error;
    }

    return user;
}

export async function postAddUserToGroup(token: string, userId: number): Promise<boolean> {
    const [error, response] = await to(
        fetchBeaconsApi<MessageReponse>(`${API_SERVER_URL}/groups/1/add-user/${userId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        })
    );

    if (!response) {
        throw error;
    }

    return !!response.Message;
}

export async function getAuthToken(username: string, password: string): Promise<TokenResponse> {
    const [error, response] = await to<TokenResponse>(
        fetchBeaconsApi(`${API_SERVER_URL}/api-token-auth/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
    );

    if (!response) {
        throw error;
    }

    return response;
}

export async function getUserDetail(token: string, userId: number): Promise<UserDetail> {
    const [error, userDetail] = await to<UserDetail>(
        fetchBeaconsApi(`${API_SERVER_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        })
    );

    if (!userDetail) {
        throw error;
    }

    return userDetail;
}