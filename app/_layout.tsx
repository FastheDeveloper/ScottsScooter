import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ScooterProvider from '~/providers/ScooterProvider';
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScooterProvider>
        <Stack />
      </ScooterProvider>
    </GestureHandlerRootView>
  );
}
