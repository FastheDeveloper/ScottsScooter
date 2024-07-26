import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MapBox, {
  Camera,
  CircleLayer,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import { featureCollection, point } from '@turf/helpers';
import pin from 'assets/pin.png';
import scooters from 'data/scooter.json';
import { APP_COLOR } from 'constants/AppConstants';
MapBox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PK || '');
const Map = () => {
  const points = scooters.map((scooter: { long: number; lat: number }) =>
    point([scooter.long, scooter.lat])
  );

  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={10} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

      <ShapeSource cluster id="scooters" shape={featureCollection(points)}>
        <SymbolLayer
          id="cluters-count"
          style={{
            textField: ['get', 'point_count'],
            textSize: 16,
            textColor: '#ffffff',
            textPitchAlignment: 'map',
          }}
        />

        <CircleLayer
          id="clusters"
          belowLayerID="cluters-count"
          filter={['has', 'point_count']}
          style={{
            circleColor: APP_COLOR.MAIN_GREEN,
            circleRadius: 20,
            circleOpacity: 0.7,
            circleStrokeWidth: 2,
            circleStrokeColor: 'white',
          }}
        />
        <SymbolLayer
          id="scooter-icons"
          minZoomLevel={1}
          filter={['!', ['has', 'point_count']]}
          style={{
            iconImage: 'pin',
            iconSize: 0.5,
            iconAllowOverlap: true,
            iconAnchor: 'bottom',
          }}
        />
        <Images images={{ pin }} />
      </ShapeSource>
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
