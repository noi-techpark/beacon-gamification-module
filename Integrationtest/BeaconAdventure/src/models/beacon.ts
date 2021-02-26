export type Beacon = {
    id: string;
    latitude: number;
    longitude: number;
    distance: number;
    range: 'immediate' | 'near' | 'far' | 'unknown'
}

export type BeaconMedata = {
    id: number;
    name: string;
    beacon_id: string;
}