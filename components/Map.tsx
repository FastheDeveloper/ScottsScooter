import { StyleSheet } from 'react-native';
import React from 'react';
import MapBox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

import LineRoute from '~/components/LineRoute';
import ScooterMarker from '~/components/ScooterMarkers';
import { useScooter } from '~/providers/ScooterProvider';
import { useRide } from '~/providers/RideProvider';
MapBox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PK || '');

const Map = () => {
  const { directionCoordinates, routeTime, routeDistance, newDirection } = useScooter();
  const { ride } = useRide();
  const showMarkers = !ride;
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={11} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
      {showMarkers && (
        <>
          <ScooterMarker />
          {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
        </>
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
