import React from 'react';
import { Marker } from 'react-native-maps';
import { Image } from 'react-native';

const StationMarker = React.memo(({ station, onPress }) => (
  <Marker
    key={station.id}
    coordinate={{
      latitude: station.latitude,
      longitude: station.longitude,
    }}
    onPress={() => onPress(station)}
  >
    <Image
      resizeMode="cover"
      source={require('../../../assets/busStopIcon.png')}
      style={{ width: 50, height: 50 }}
    />
  </Marker>
));

export default StationMarker;
