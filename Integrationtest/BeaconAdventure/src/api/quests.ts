import to from "await-to-js";
import { API_SERVER_URL, fetchBeaconsApi } from "./apiFetcher";

export async function getQuests(token: string): Promise<any> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/quest/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        })
    );

    if (!response) {
        throw error;
    }

    return response.results;
}

export async function getQuestSteps(token: string): Promise<any> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/quest-steps/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        })
    );

    if (!response) {
        throw error;
    }

    return response.results;
}

export async function getQuestFinder(token: string, beaconId: string): Promise<any> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/quest-finder?beacon_id=${beaconId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        })
    );

    if (!response) {
        throw error;
    }

    return response;
}

export async function postAddPoints(token: string, userId: number, points: number): Promise<any> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/users/add-points/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            },
            body: JSON.stringify({
                pk_user: userId,
                points
            })
        })
    );

    if (!response) {
        throw error;
    }

    return response;
}

export async function postRemovePoints(token: string, userId: number, points: number): Promise<any> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/users/add-points/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            },
            body: JSON.stringify({
                pk_user: userId,
                points
            })
        })
    );

    if (!response) {
        throw error;
    }

    return response;
}