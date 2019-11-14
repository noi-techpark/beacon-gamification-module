import { useAnimation, UseAnimationOptions } from "./useAnimation";

export const useContentChangeAnimation = (opts: UseAnimationOptions & {
    scrollDistance?: number,
    isFadeInverted?: boolean
}) => {
    const animation = useAnimation({
        doAnimation: opts.doAnimation,
        duration: opts.duration || 250,
        delay: opts.delay || 0,
        callback: opts.callback
    });

    const fade = animation.interpolate({
        inputRange: [0, 1],
        outputRange: !opts.isFadeInverted ? [1, 0] : [0, 1]
    });
    const scroll = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, opts.scrollDistance || -100]
    });

    return [fade, scroll];
};