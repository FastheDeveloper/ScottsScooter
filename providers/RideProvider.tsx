import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { DirectionsApi, fetchDirectionBasedOnCoords, getDirections } from '~/utils/MapUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '~/lib/supabase';
import { useAuth } from './AuthProvider';
import { Alert } from 'react-native';
import { useScooter } from './ScooterProvider';
import { RideStartedModal } from '~/components/modals/RideStartedModal';
import { TWithModal, withModal } from './ModalProvider';

interface Ride {
  created_at: string; // ISO 8601 string format for date-time
  finished_at: string | null; // Can be a date-time string or null
  id: number;
  scooter_id: number;
  user_id: string; // Assuming it's a UUID or similar string
}

interface RideContextType {
  startRide: (scooterId: number) => void;
  finishRide: (scooterId: number) => void;
  ride?: Ride | null;
  rideRoute?: number[][] | [];
}
const RideContext = createContext<RideContextType>({
  startRide: () => {},
  finishRide: () => {},
  ride: null,
});

function RideProvider({ children, openModal }: PropsWithChildren<TWithModal>) {
  const [ride, setRide] = useState<null | Ride>();
  const [rideRoute, setRideRoute] = useState<number[][]>([]);
  const { userId } = useAuth();
  const { setNewDirection, fetchScooters, setSelectedScooter } = useScooter();

  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .limit(1)
        .single();
      if (data) {
        Alert.alert('Active ride resumed');
        setRide(data);
      }
      // console.log(data, ' finise');
    };
    fetchActiveRide();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location?.watchPositionAsync({ distanceInterval: 30 }, (newLocation) => {
        setRideRoute((currRoute: number[][]) => [
          ...currRoute,
          [newLocation?.coords?.longitude, newLocation?.coords?.latitude],
        ]);
      });
    };

    if (ride) {
      try {
        watchLocation();
      } catch (e) {
        console.log(e, 'watch location');
      }
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [ride]);

  useEffect(() => {
    const checklastUsedScooter = async () => {
      const selScoot = await AsyncStorage.getItem('lastSelectedScooter');
      console.log('Last used scooter', selScoot);
      if (selScoot) {
        const sanitisedScooter = JSON.parse(selScoot);
        setSelectedScooter(sanitisedScooter);
      }
    };
    if (ride) {
      checklastUsedScooter();
    }
  }, [ride]);
  const startRide = async (scooterId: number) => {
    console.log(scooterId, 'start ride');
    if (ride) {
      Alert.alert('Ride ongoing, cannot start a new ride');
      return;
    }
    const { data, error } = await supabase
      .from('rides')
      .insert([{ user_id: userId, scooter_id: scooterId }])
      .select();

    // const { data: Scootdata, error: ScottError } = await supabase
    //   .from('scooters')
    //   .update({
    //     lastRider: userId,
    //   })
    //   .eq('id', scooterId);

    // if (ScottError) {
    //   Alert.alert('failed to stcots errorart the ride');
    //   console.log(error, 'Scotts error');
    // } else {
    //   console.log(Scootdata, 'ScottsError');
    //   // setRide(data[0] as Ride);
    // }

    if (error) {
      openModal?.(<RideStartedModal text="Couldnt start ride" />, {
        transparent: true,
        animationType: 'none',
      });
      console.log(error);
    } else {
      openModal?.(<RideStartedModal text="Ride Started Successfully" />, {
        transparent: true,
        animationType: 'none',
      });
      console.log(data);
      setRide(data[0] as Ride);
    }
  };

  const finishRide = async (scooterId: number) => {
    if (!ride) {
      return;
    }
    const updateData: { [key: string]: any } = {
      finished_at: new Date(), // Always update this field
    };

    const actualRoute = await fetchDirectionBasedOnCoords(rideRoute);
    let lastCoord;
    if (actualRoute && actualRoute.matchings && actualRoute.matchings.length > 0) {
      // Extract relevant data from the response
      const { geometry, duration, distance } = actualRoute.matchings[0];
      const { coordinates } = geometry;
      lastCoord = coordinates[coordinates.length - 1] ?? rideRoute[rideRoute.length - 1];

      if (coordinates) {
        setRideRoute(coordinates);
      } else {
        setRideRoute(rideRoute);
      }

      // Conditionally add fields to updateData
      updateData.routeDuration = duration ?? null;
      updateData.routeDistance = distance ?? null;
      updateData.routeCoords = coordinates ?? null;
    } else {
      lastCoord = rideRoute[rideRoute.length - 1];

      setRideRoute(rideRoute);
    }

    console.log(updateData, 'Data update');
    const { data: rideData, error: rideError } = await supabase
      .from('rides')
      .update(updateData)
      .eq('id', ride.id);

    if (rideError) {
      openModal?.(<RideStartedModal text="Failed to complete ride" />, {
        transparent: true,
        animationType: 'none',
      });
      console.log(rideError);
    } else {
      openModal?.(<RideStartedModal text="Ride Completed Successfully" />, {
        transparent: true,
        animationType: 'none',
      });
      setNewDirection(undefined);
      setRide(null);
      console.log(rideData);
    }

    console.log(lastCoord, ' Last route route');
    const { data, error } = await supabase
      .from('scooters')
      .update({
        location: `POINT(${lastCoord[0]} ${lastCoord[1]})`,
      })
      .eq('id', scooterId);
    if (data) {
      console.log(data, scooterId, 'update data');
    } else {
      console.log(error, scooterId, 'update error');
    }

    fetchScooters();
  };

  // console.log('Current ride,:', ride);
  return (
    <RideContext.Provider
      value={{
        startRide,
        finishRide,
        ride,
        rideRoute,
      }}>
      {children}
    </RideContext.Provider>
  );
}
export default withModal(RideProvider);
export const useRide = () => useContext(RideContext);
