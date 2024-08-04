import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { APP_COLOR } from '~/constants/AppConstants';
import { useRide } from '~/providers/RideProvider';
import { Text } from 'react-native';
export default function ActiveRideSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { ride } = useRide();
  console.log(ride, 'rider');

  useEffect(() => {
    if (ride) {
      bottomSheetRef.current?.expand();
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
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}