import debounce from 'lodash.debounce';
import React from 'react';
import { GestureResponderEvent, Platform, StyleProp, TouchableNativeFeedback, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors } from '../../styles/colors';

export interface IPlatformTouchableProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent | number) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  noBackground?: boolean;
}

const PlatformTouchable = (props: IPlatformTouchableProps): JSX.Element => {
  const {
    //   raised,
    onPress,
    onPressOut,
    onLongPress,
    children,
    style,
    disabled,
    noBackground
  } = props;

  // All Android Buttons should have the ripple effect
  if (Platform.OS === 'android') {
    // Normal Android buttons get a gray ripple
    return (
      <TouchableNativeFeedback
        onPress={onPress ? debounce(onPress, 500, { leading: true, trailing: false }) : undefined}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        useForeground={TouchableNativeFeedback.canUseNativeForeground()}
        background={!noBackground ? TouchableNativeFeedback.Ripple(Colors.BLACK_032, true) : undefined}
        disabled={disabled}
      >
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  // Normal iOS buttons use TouchableOpacity
  return (
    <TouchableOpacity
      onPress={onPress ? debounce(onPress, 500, { leading: true, trailing: false }) : undefined}
      onPressOut={onPressOut}
      onLongPress={onLongPress}
      disabled={disabled}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

export default PlatformTouchable;
