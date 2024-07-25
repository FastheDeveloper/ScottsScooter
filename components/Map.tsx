import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MapBox, {
  Camera,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import pin from 'assets/pin.png';
import scooters from 'data/scooter.json';
MapBox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PK || '');
const Map = () => {
  const points = scooters.map((scooter: { long: number; lat: number }) =>
    point([scooter.long, scooter.lat])
  );
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={16} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

      <ShapeSource id="scooters" shape={featureCollection(points)}>
        <SymbolLayer
          id="scooter-icons"
          minZoomLevel={1}
          style={{
            iconImage: 'pin',
            iconSize: 0.5,
            iconAllowOverlap: true,
          }}
        />
        <Images images={{ pin }} />
      </ShapeSource>
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
