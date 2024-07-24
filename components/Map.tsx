import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MapBox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

MapBox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PK || '');
const Map = () => {
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={16} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
