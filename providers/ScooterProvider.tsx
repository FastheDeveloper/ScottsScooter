import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { DirectionsApi, getDirections } from '~/utils/MapUtils';
import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
export interface ScooterDetails {
  id: number;
  lat: number;
  long: number;
}
interface ScooterContextType {
  selectedScooter: ScooterDetails | undefined;
  setSelectedScooter: React.Dispatch<React.SetStateAction<ScooterDetails | undefined>>;
  newDirection: DirectionsApi | undefined;
  directionCoordinates: number[][] | undefined;
  routeTime: number | undefined;
  routeDistance: number | undefined;
  isNearby: boolean;
}

const ScooterContext = createContext<ScooterContextType | null>(null);

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [selectedScooter, setSelectedScooter] = useState<ScooterDetails>();
  const [newDirection, setNewDirection] = useState<DirectionsApi>();
  const [isNearby, setIsNearBy] = useState(true);

  // useEffect(() => {
  //   Location.watchPositionAsync(
  //     {
  //       distanceInterval: 100,
  //     },
  //     (newLocation) => {
  //       if (selectedScooter) {
  //         const from = point((newLocation?.coords?.longitude, newLocation?.coords?.latitude));
  //         const to = point((selectedScooter?.long, selectedScooter?.lat));

  //         const distance = getDistance(from, to, { units: 'meters' });
  //         console.log(distance, ' DIS');
  //         if (distance < 50) {
  //           setIsNearBy(true);
  //         }
  //       }
  //       console.log('Location updated', newLocation);
  //     }
  //   );
  // }, []);
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

  return (
    <ScooterContext.Provider
      value={{
        selectedScooter,
        setSelectedScooter,
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
