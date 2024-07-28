import { Stack } from 'expo-router';
import ScooterProvider from '~/providers/ScooterProvider';
export default function Layout() {
  return (
    <ScooterProvider>
      <Stack />
    </ScooterProvider>
  );
}
