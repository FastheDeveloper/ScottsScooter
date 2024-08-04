import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { DirectionsApi, getDirections } from '~/utils/MapUtils';
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import { supabase } from '~/lib/supabase';
import { Alert } from 'react-native';
export interface ScooterDetails {
  id: number;
  lat: number;
  long: number;
}
interface RPCScooterDetails {
  id: number;
  battery: number;
  lat: number;
  long: number;
  dist_meters: number;
}
interface ScooterContextType {
  selectedScooter?: ScooterDetails;
  setSelectedScooter: React.Dispatch<React.SetStateAction<ScooterDetails | undefined>>;
  setNewDirection: React.Dispatch<React.SetStateAction<DirectionsApi | undefined>>;
  newDirection: DirectionsApi | undefined;
  directionCoordinates: number[][] | undefined;
  routeTime: number | undefined;
  routeDistance: number | undefined;
  isNearby: boolean;
  nearbyScooters: RPCScooterDetails[];
}

const ScooterContext = createContext<ScooterContextType | null>(null);

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [nearbyScooters, setNearByScooter] = useState<RPCScooterDetails[]>([]);
  const [selectedScooter, setSelectedScooter] = useState<ScooterDetails>();
  const [newDirection, setNewDirection] = useState<DirectionsApi>();
  const [isNearby, setIsNearBy] = useState<boolean>(false);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
        if (selectedScooter) {
          const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
          const to = point([selectedScooter.long, selectedScooter.lat]);
          const distance = getDistance(from, to, { units: 'meters' });
          console.log(distance, ' dis');
          if (distance < 100) {
            setIsNearBy(true);
          } else if (distance > 100) {
            setIsNearBy(false);
          }
        }
      });
    };

    if (selectedScooter) {
      watchLocation();
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [selectedScooter]);

  useEffect(() => {
    const fetchDirections = async () => {
      if (selectedScooter) {
        const myLocation = await Location.getCurrentPositionAsync();

        const res = await getDirections(
          [myLocation.coords.longitude, myLocation.coords.latitude],
          [selectedScooter?.long, selectedScooter?.lat]
        );

        setNewDirection(res);
      }
    };
    if (selectedScooter) {
      fetchDirections();
    }
  }, [selectedScooter]);

  useEffect(() => {
    const fetchScooters = async () => {
      const location = await Location.getCurrentPositionAsync();
      const { error, data } = await supabase.rpc('nearby_scooters', {
        lat: location.coords.latitude,
        long: location.coords.longitude,
        // max_dist_meters: 2000,
      });
      if (error) {
        Alert.alert('Failed to fetch scooter');
      } else {
        setNearByScooter(data);
      }
    };

    fetchScooters();
  }, []);
  return (
    <ScooterContext.Provider
      value={{
        nearbyScooters,
        selectedScooter,
        setSelectedScooter,
        setNewDirection,

        newDirection,
        directionCoordinates: newDirection?.routes?.[0].geometry.coordinates,
        routeTime: newDirection?.routes?.[0].duration,
        routeDistance: newDirection?.routes?.[0].distance,
        isNearby,
      }}>
      {children}
    </ScooterContext.Provider>
  );
}

export const useScooter = () => {
  const context = useContext(ScooterContext);
  if (!context) {
    throw new Error('useScooter must be used within a ScooterProvider');
  }
  return context;
};
