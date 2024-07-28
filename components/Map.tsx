import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import MapBox, {
  Camera,
  CircleLayer,
  Images,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';

import LineRoute from '~/components/LineRoute';
import ScooterMarker from '~/components/ScooterMarkers';
import { useScooter } from '~/providers/ScooterProvider';
MapBox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PK || '');

const Map = () => {
  const { directionCoordinates, routeTime, routeDistance, newDirection } = useScooter();

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={11} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
      <ScooterMarker />
      {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
