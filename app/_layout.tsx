import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '~/providers/AuthProvider';
import ScooterProvider from '~/providers/ScooterProvider';
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ScooterProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ScooterProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
