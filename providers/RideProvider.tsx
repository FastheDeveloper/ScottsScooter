import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
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
  ride?: Ride | null;
}
const RideContext = createContext<RideContextType>({
  startRide: () => {},
  ride: null,
});

export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState<null | Ride>();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchActiveRide = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .is('finished_at', null)
        .single();
      if (data) {
        setRide(data);
      }
      console.log(data, ' finise');
    };
    fetchActiveRide();
  }, []);

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
      console.warn('Ride started');
      console.log(data);
      setRide(data[0] as Ride);
    }
  };

  console.log('Current ride,:', ride);
  return (
    <RideContext.Provider
      value={{
        startRide,
        ride,
      }}>
      {children}
    </RideContext.Provider>
  );
}

export const useRide = () => useContext(RideContext);
