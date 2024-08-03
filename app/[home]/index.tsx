import { Stack } from 'expo-router';
import Map from 'components/Map';
import { StatusBar } from 'expo-status-bar';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <Map />
      <SelectedScooterSheet />
      <StatusBar style="light" />
    </>
  );
}
