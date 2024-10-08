import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '~/providers/AuthProvider';
import { ModalsProvider } from '~/providers/ModalProvider';
import RideProvider from '~/providers/RideProvider';
import ScooterProvider from '~/providers/ScooterProvider';
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ModalsProvider>
          <ScooterProvider>
            <RideProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="light" />
            </RideProvider>
          </ScooterProvider>
        </ModalsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
