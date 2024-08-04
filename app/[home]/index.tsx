import { Stack } from 'expo-router';
import Map from 'components/Map';
import { StatusBar } from 'expo-status-bar';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';
import ActiveRideSheet from '~/components/ActiveRideSheet';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <Map />
      <SelectedScooterSheet />
      <ActiveRideSheet />
      <StatusBar style="light" />
    </>
  );
}
