import { useEffect, useState } from "react";
import { Animated, EasingFunction } from "react-native";

export type UseAnimationOptions = {
    doAnimation: boolean;
    duration?: number;
    easing?: EasingFunction;
    delay?: number;
    disableNative?: boolean;
    callback?: () => void;
}

export const useAnimation = (opts: UseAnimationOptions) => {
    const [animation] = useState(new Animated.Value(0));

    const { doAnimation, duration, delay, easing, callback, disableNative } = opts;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: doAnimation ? 1 : 0,
            easing,
            duration,
            delay,
            useNativeDriver: !disableNative
        }).start(callback);
    }, [doAnimation]);

    return animation;
}