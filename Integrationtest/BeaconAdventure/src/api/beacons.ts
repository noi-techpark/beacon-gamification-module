import to from "await-to-js";
import { BeaconMedata } from "../models/beacon";
import { API_SERVER_URL, fetchBeaconsApi } from "./apiFetcher";

export async function getBeacons(token: string): Promise<any> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/beacons/`, {
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

export async function getBeaconMetadataById(token: string, beaconId: number): Promise<BeaconMedata> {
    const [error, response] = await to(
        fetchBeaconsApi(`${API_SERVER_URL}/beacons/${beaconId}`, {
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