import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { APP_COLOR } from '~/constants/AppConstants';
import { useRide } from '~/providers/RideProvider';
import { Text, View } from 'react-native';
import { Button } from './Button';
export default function ActiveRideSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { ride, finishRide } = useRide();
  console.log(ride, 'rider');

  useEffect(() => {
    if (ride) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [ride]);

  return (
    <BottomSheet
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      ref={bottomSheetRef}
      backgroundStyle={{ backgroundColor: '#414442' }}
      handleIndicatorStyle={{ backgroundColor: APP_COLOR.MAIN_WHITE }}>
      {ride && (
        <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
          <Text>{ride.id} in progress</Text>

          <View>
            <Button
              title="Finish Journey"
              onPress={() => finishRide(ride.id)}
              style={{
                backgroundColor: APP_COLOR.ACCENT_GREEN,
              }}
            />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
