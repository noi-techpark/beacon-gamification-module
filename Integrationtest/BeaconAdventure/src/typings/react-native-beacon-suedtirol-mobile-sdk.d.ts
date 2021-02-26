declare module 'react-native-beacon-suedtirol-mobile-sdk' {
    type NullableCallback = (data: string) => void | null;

    var NearbyBeacons: {
        startScanning(callback: NullableCallback): void;
        stopScanning(callback: NullableCallback): void;
        configureScanMode(mode: number): void;
    };

    export default NearbyBeacons;
}
