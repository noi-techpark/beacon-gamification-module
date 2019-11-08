
declare module 'react-native-parallax-header' {
    import React from 'react';
    import { NativeMethodsMixinStatic, ScrollViewProperties, StyleProp, ViewStyle } from "react-native";

    export interface ReactNativeParallaxHeaderProps extends ScrollViewProperties {
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

    export interface ReactNativeParallaxHeaderStatic extends NativeMethodsMixinStatic, React.ComponentClass<ReactNativeParallaxHeaderProps> {

    }

    type ReactNativeParallaxHeader = ReactNativeParallaxHeaderStatic;
    var ReactNativeParallaxHeader: ReactNativeParallaxHeaderStatic;

    export default ReactNativeParallaxHeader;
}