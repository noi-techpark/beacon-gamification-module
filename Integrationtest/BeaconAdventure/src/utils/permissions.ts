import { PermissionsAndroid } from "react-native";

export async function requestFineLocationPermission(): Promise<boolean> {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'help',
            message: 'plz',
            buttonPositive: 'Si'
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    } catch (err) {
        return Promise.resolve(false);
    }
}