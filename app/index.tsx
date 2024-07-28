import { Stack, Link } from 'expo-router';
import Map from 'components/Map';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <Map />
      <StatusBar style="light" />
    </>
  );
}
