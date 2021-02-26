// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-native-hooks' {
    import { AccessibilityInfo, AppState } from 'react-native';

    export function useAccessibilityInfo(): AccessibilityInfo

    export function useAppState(): AppState

    /**
     * const [photos, getPhotos, saveToCameraRoll] = useCameraRoll()
     * {
     *   photos.map((photo, index) => /* render photos *\/)
     * }
     * <Button title='Get Photos' onPress={() => getPhotos()}>Get Photos</Button>
     */
    export function useCameraRoll(): [any[], Function, Function]

    export function useClipboard(): [string, (data: string) => void]

    export function useDimensions(): any

    /** const [position, stopObserving, setRNConfiguration] = useGeolocation() */
    export function useGeolocation(): [any, Function, Function]

    // export function useNetInfo(): NetInfo

    /**
     * const keyboard = useKeyboard()
     *
     * console.log('keyboard show: ', keyboard.show)
     * console.log('keyboard height: ', keyboard.height)
     */
    export function useKeyboard(): any

    /**
     * const interactionReady = useInteractionManager()
     * console.log('interaction ready: ', interactionReady)
     */
    export function useInteractionManager(): any

    /**
     * const orientation = useDeviceOrientation()
     * console.log('is orientation portrait: ', orientation.portrait)
     * console.log('is orientation landscape: ', orientation.landscape)
     */
    export function useDeviceOrientation(): any
}