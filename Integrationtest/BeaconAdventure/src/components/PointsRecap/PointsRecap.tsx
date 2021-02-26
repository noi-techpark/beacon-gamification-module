import React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import { material } from 'react-native-typography';
import { translate } from '../../localization/locale';
import { Colors } from '../../styles/colors';
import { isNull, isUndefined } from '../../utils/uiobjects';
import { PointsTotal } from '../PointsTotal';

interface IPointsRecapProps {
  points?: number;
}

const PointsRecap: React.FunctionComponent<IPointsRecapProps> = ({ points }) => (
  <View style={{ height: 204, width: '100%' }}>
    <View style={styles.root}>
      {isUndefined(points) ? (
        <View />
      ) : isNull(points) ? (
        <Text
          style={{
            ...material.body1Object,
            color: Colors.BLACK,
            width: Dimensions.get('window').width - 116 - 50,
            flexWrap: 'wrap'
          }}
        >
          {translate('points_placeholder')}
        </Text>
      ) : (
        <PointsTotal
          points={points}
          hideTitle={true}
          contentContainerStyle={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-start' }}
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
});

export default React.memo(PointsRecap);
