import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { APP_COLOR } from '~/constants/AppConstants';
import { useRide } from '~/providers/RideProvider';
import { Text, View } from 'react-native';
import { Button } from './Button';
import { useScooter } from '~/providers/ScooterProvider';
export default function ActiveRideSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { ride, finishRide } = useRide();
  const { selectedScooter } = useScooter();
  // console.log(ride, 'rider');

  useEffect(() => {
    if (ride) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [ride]);

  const handlePress = () => {
    if (selectedScooter) {
      console.log(selectedScooter.id, ' finished scooter');
      finishRide(selectedScooter?.id);
    }
    bottomSheetRef.current?.close();
  };

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
              onPress={handlePress}
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
