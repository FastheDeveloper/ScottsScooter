import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { DirectionsApi, getDirections } from '~/utils/MapUtils';

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
}

const ScooterContext = createContext<ScooterContextType | null>(null);

export default function ScooterProvider({ children }: PropsWithChildren) {
  const [selectedScooter, setSelectedScooter] = useState<ScooterDetails>();
  const [newDirection, setNewDirection] = useState<DirectionsApi>();

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
        routeDistance: newDirection?.routes?.[0].distace,
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
