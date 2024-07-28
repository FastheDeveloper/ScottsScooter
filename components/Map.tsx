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
import { featureCollection, point } from '@turf/helpers';
import pin from 'assets/pin.png';
import scooters from 'data/scooter.json';
import { APP_COLOR } from 'constants/AppConstants';
import routeResponse from '~/data/route.json';
import { DirectionsApi, getDirections } from '~/utils/MapUtils';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import * as Location from 'expo-location';
MapBox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PK || '');

const Map = () => {
  const [newDirection, setNewDirection] = useState<DirectionsApi>();
  const points = scooters.map((scooter: { long: number; lat: number }) =>
    point([scooter.long, scooter.lat])
  );

  const directionCoordinate = newDirection?.routes?.[0].geometry.coordinates;

  const onLocationPressed = async (event: OnPressEvent) => {
    const myLocation = await Location.getCurrentPositionAsync();
    console.log(myLocation, 'FAss');

    const res = await getDirections(
      [myLocation.coords.longitude, myLocation.coords.latitude],
      [event.coordinates.longitude, event.coordinates.latitude]
    );

    setNewDirection(res);
  };

  console.log(newDirection?.routes, '    FAS');
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation followZoomLevel={1} />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

      <ShapeSource
        cluster
        id="scooters"
        shape={featureCollection(points)}
        onPress={onLocationPressed}>
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

      {directionCoordinate && (
        <ShapeSource
          id="routeSource"
          lineMetrics
          shape={{
            properties: {},
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: directionCoordinate,
            },
          }}>
          <LineLayer
            id="exampleLineLayerBackground"
            style={{
              lineColor: APP_COLOR.MAIN_GREEN,
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: 5,
              lineOpacity: 0.4,
            }}
          />
          <LineLayer
            id="exampleLineLayer"
            style={{
              lineColor: APP_COLOR.MAIN_GREEN,
              lineCap: 'round',
              lineJoin: 'round',
              lineWidth: 5,
              lineDasharray: [0, 2, 1],
            }}
          />
        </ShapeSource>
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
