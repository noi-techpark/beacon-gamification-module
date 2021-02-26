
declare module 'react-native-star-rating-view' {
    import React from 'react';
    import { NativeMethodsMixinStatic, ScrollViewProperties, StyleProp, ViewStyle } from "react-native";

    export interface ReactNativeStarRatingViewProps extends ScrollViewProperties {
        renderContent: () => JSX.Element;
        backgroundImage?: string;
        backgroundImageScale?: number;
        navbarColor?: string;
        headerMinHeight?: number;
        headerMaxHeight?: number;
        alwaysShowTitle?: boolean;
        extraScrollHeight?: number;
        renderNavBar?: () => JSX.Element;
        title?: JSX.Element | string;
        contentContainerStyle?: StyleProp<ViewStyle>;
        // renderContent = {() => (
    }

    export interface ReactNativeStarRatingViewStatic extends NativeMethodsMixinStatic, React.ComponentClass<ReactNativeStarRatingViewProps> {

    }

    type ReactNativeStarRatingView = ReactNativeStarRatingViewStatic;
    var ReactNativeStarRatingView: ReactNativeStarRatingViewStatic;

    export default ReactNativeStarRatingView;
}