import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
import { useAuth } from './AuthProvider';
import { Alert } from 'react-native';
import { useScooter } from './ScooterProvider';

interface RideContextType {
  startRide: (scooterId: number) => void;
}
const RideContext = createContext<RideContextType>({
  startRide: () => {},
});

export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState<any[] | null>();
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
      setRide(data);
    }
  };

  console.log('Current ride,:', ride);
  return (
    <RideContext.Provider
      value={{
        startRide,
      }}>
      {children}
    </RideContext.Provider>
  );
}

export const useRide = () => useContext(RideContext);
