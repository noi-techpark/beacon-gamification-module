import { Animated, Easing } from 'react-native';
import { Colors } from '../styles/colors';

export function springyFadeIn() {
    const transitionSpec = {
        timing: Animated.spring,
        tension: 10,
        useNativeDriver: true,
    };

    return {
        transitionSpec,
        screenInterpolator: ({ position, scene }) => {
            const { index } = scene;

            const opacity = position.interpolate({
                inputRange: [index - 1, index],
                outputRange: [0, 1],
            });

            return { opacity };
        },
    };
}

export function forVertical() {
    const transitionSpec = {
        duration: 500,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true
    };

    return {
        transitionSpec,
        containerStyle: {
            backgroundColor: Colors.BLACK_040
        },
        screenInterpolator: ({ _, position, scene }) => {
            const { index } = scene;

            // const translateY = position.interpolate({
            //     inputRange: [index - 1, index, index + 1],
            //     outputRange: [height, 0, 0]
            // });

            // const opacity = position.interpolate({
            //     inputRange: [index - 1, index, index + 1],
            //     outputRange: [0, 1, 1],
            // });
            const translateY = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0, 0, 0]
            });

            return { transform: [{ translateY }] };
        }
    }
}