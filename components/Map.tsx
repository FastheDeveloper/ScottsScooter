import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MapBox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

const access_token: string =
  'pk.eyJ1IjoiZmFzdGhlbWFwcGVyIiwiYSI6ImNsejAzNTdkZjI5Z20ybXFyMnZseXRmaXAifQ.hOR5Q0VTdElqmwV7fbUPQw';
MapBox.setAccessToken(access_token);
const Map = () => {
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followUserLocation />
      <LocationPuck />
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
