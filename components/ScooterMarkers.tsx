import { ShapeSource, SymbolLayer, CircleLayer, Images } from '@rnmapbox/maps';
import React from 'react';
import { APP_COLOR } from '../constants/AppConstants';
// @ts-ignore
import pin from '../assets/pin.png';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { useScooter } from '../providers/ScooterProvider';
import { featureCollection, point } from '@turf/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TWithModal, withModal } from '~/providers/ModalProvider';
import { RideStartedModal } from './modals/RideStartedModal';
// import scooters from '../data/scooter.json';

function ScooterMarkers({ openModal, closeModal }: TWithModal) {
  const { setSelectedScooter, nearbyScooters } = useScooter();

  const points = nearbyScooters?.map((scooter: { long: number; lat: number }) =>
    point([scooter.long, scooter.lat], { scooter })
  );

  const onLocationPressed = async (event: OnPressEvent) => {
    openModal?.(<RideStartedModal />, { transparent: true, animationType: 'fade' });
    if (event.features[0].properties?.scooter)
      setSelectedScooter(event.features[0].properties.scooter);
    const jsonValue = JSON.stringify(event.features[0].properties?.scooter);
    await AsyncStorage.setItem('lastSelectedScooter', jsonValue);
  };

  return (
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
  );
}

export default withModal(ScooterMarkers);
