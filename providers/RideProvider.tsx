import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { DirectionsApi, fetchDirectionBasedOnCoords, getDirections } from '~/utils/MapUtils';
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';

import { supabase } from '~/lib/supabase';
import { useAuth } from './AuthProvider';
import { Alert } from 'react-native';
import { useScooter } from './ScooterProvider';

interface Ride {
  created_at: string; // ISO 8601 string format for date-time
  finished_at: string | null; // Can be a date-time string or null
  id: number;
  scooter_id: number;
  user_id: string; // Assuming it's a UUID or similar string
}

interface RideContextType {
  startRide: (scooterId: number) => void;
  finishRide: (rideId: number) => void;
  ride?: Ride | null;
  rideRoute?: number[][] | [];
}
const RideContext = createContext<RideContextType>({
  startRide: () => {},
  finishRide: () => {},
  ride: null,
});

export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState<null | Ride>();
  const [rideRoute, setRideRoute] = useState<number[][]>([]);
  const { userId } = useAuth();
  const { setNewDirection } = useScooter();

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

  const startRide = async (scooterId: number) => {
    if (ride) {
      Alert.alert('Ride ongoing, cannot start a new ride');
      return;
    }
    const { data, error } = await supabase
      .from('rides')
      .insert([{ user_id: userId, scooter_id: scooterId }])
      .select();

    if (error) {
      Alert.alert('failed to start the ride');
      console.log(error);
    } else {
      console.log(data);
      setRide(data[0] as Ride);
    }
  };

  const finishRide = async (rideId: number) => {
    if (!ride) {
      return;
    }
    const actualRoute = await fetchDirectionBasedOnCoords(rideRoute);
    console.log(actualRoute.matchings[0]?.geometry.coordinates, 'Actual ride');
    const rideRouteCoord = actualRoute?.matchings[0]?.geometry.coordinates;
    const rideRouteDuration = actualRoute?.matchings[0]?.duration;
    const rideRouteDistance = actualRoute?.matchings[0]?.distance;
    console.log(rideRouteCoord, ' Ride route route');
    if (rideRouteCoord) {
      setRideRoute(rideRouteCoord);
    }

    // Construct the update object based on available values
    const updateData: { [key: string]: any } = {
      finished_at: new Date(), // Always update this field
    };

    // Conditionally add fields to the update object
    if (rideRouteDuration !== undefined) {
      updateData.routeDuration = rideRouteDuration;
    } else {
      updateData.routeDuration = null; // Set to null if needed
    }

    if (rideRouteDistance !== undefined) {
      updateData.routeDistance = rideRouteDistance;
    } else {
      updateData.routeDistance = null; // Set to null if needed
    }

    if (rideRouteCoord !== undefined) {
      updateData.routeCoords = rideRouteCoord;
    } else {
      updateData.routeCoords = null; // Set to null if needed
    }

    console.log(updateData, 'Data update');
    const { data, error } = await supabase.from('rides').update(updateData).eq('id', ride.id);

    if (error) {
      Alert.alert('failed to finish ride');
      console.log(error);
    } else {
      setNewDirection(undefined);
      setRide(null);
      console.log(data);
    }
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

export const useRide = () => useContext(RideContext);
