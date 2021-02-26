import filter from "lodash.filter";
import sortBy from "lodash.sortby";
import unionBy from "lodash.unionby";
import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import { Beacon } from "../models/beacon";

const IBEACON_DISCOVERED = 'beaconDiscovered';
const IBEACONS_UPDATED = 'beaconsUpdated';
const IBEACON_LOST = 'beaconLost';

export function useDiscoveredBeacons() {
    const [discoveredBeacons, setDiscoveredBeacons] = useState<Beacon[]>([]);

    useEffect(() => {
        const subscriptions = [
            DeviceEventEmitter.addListener(IBEACON_DISCOVERED, async (beacon: Beacon) => {
                // console.log(beacon);
                
                setDiscoveredBeacons(sortBy(unionBy(discoveredBeacons, [beacon], b => b.id), b => b.distance));
            }),
            DeviceEventEmitter.addListener(IBEACONS_UPDATED, ({ beacons }) => {
                // console.log(beacons);

                setDiscoveredBeacons(sortBy(unionBy(beacons, discoveredBeacons, b => b.id), b => b.distance));
            }),
            DeviceEventEmitter.addListener(IBEACON_LOST, beacon => {
                // console.log(beacon);
                
                setDiscoveredBeacons(filter(discoveredBeacons, b => b.id !== beacon.id));
            })
        ];

        return () => {
            subscriptions.forEach(s => s.remove());
        };
    }, [discoveredBeacons]);

    // console.log(discoveredBeacons);

    return discoveredBeacons;
}