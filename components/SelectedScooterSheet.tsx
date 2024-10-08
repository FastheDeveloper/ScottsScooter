import React, { useEffect, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Image, Text, View } from 'react-native';
import { useScooter } from '~/providers/ScooterProvider';

import { FontAwesome6 } from '@expo/vector-icons';
import { APP_COLOR } from '~/constants/AppConstants';
import { Button } from './Button';

import { useRide } from '~/providers/RideProvider';
export default function SelectedScooterSheet() {
  const {
    selectedScooter,
    routeTime,
    routeDistance,
    isNearby,
    setSelectedScooter,
    setNewDirection,
  } = useScooter();
  const { startRide, ride } = useRide();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (selectedScooter && !ride) {
      bottomSheetRef.current?.expand();
    }
  }, [selectedScooter]);

  const handlePress = () => {
    if (selectedScooter) {
      startRide(selectedScooter?.id);
    }
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      ref={bottomSheetRef}
      onClose={() => {
        // setSelectedScooter(undefined);
        setNewDirection(undefined);
      }}
      backgroundStyle={{ backgroundColor: '#414442' }}
      handleIndicatorStyle={{ backgroundColor: APP_COLOR.MAIN_WHITE }}>
      {selectedScooter && (
        <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={require('~/assets/scooter.png')} style={{ width: 50, height: 50 }} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={{ color: APP_COLOR.MAIN_WHITE, fontSize: 20, fontWeight: '600' }}>
                Lime - S
              </Text>
              <Text style={{ color: 'gray', fontSize: 18 }}>
                Id-{selectedScooter?.id} • Lakwe Lakes
              </Text>
            </View>

            <View style={{ gap: 10 }}>
              <View
                style={{
                  gap: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                }}>
                <FontAwesome6 name="bolt-lightning" size={18} color={APP_COLOR.MAIN_GREEN} />
                <Text style={{ color: APP_COLOR.MAIN_WHITE, fontSize: 18, fontWeight: '600' }}>
                  {(routeDistance!! / 1000).toFixed(2)}km
                </Text>
              </View>
              <View
                style={{
                  gap: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                }}>
                <FontAwesome6 name="clock" size={18} color={APP_COLOR.MAIN_GREEN} />
                <Text style={{ color: APP_COLOR.MAIN_WHITE, fontSize: 18, fontWeight: '600' }}>
                  {(routeTime!! / 60).toFixed(0)}mins
                </Text>
              </View>
            </View>
          </View>

          {/* BOTTOM PART */}

          <View>
            <Button
              title="Start Journey"
              disabled={!isNearby}
              onPress={handlePress}
              style={{
                backgroundColor: isNearby ? APP_COLOR.ACCENT_GREEN : APP_COLOR.MAIN_GREY,
                borderColor: !isNearby ? APP_COLOR.ACCENT_GREEN : 'red',
                borderWidth: !isNearby ? 1 : 0,
              }}
            />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
