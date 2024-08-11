import React, { useState } from 'react';
import { Alert, StyleSheet, View, AppState, TextInput } from 'react-native';
import { supabase } from '~/lib/supabase';
import { Input } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button } from '~/components/Button';
import { APP_COLOR } from '~/constants/AppConstants';
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  const styles = StyleSheet.create({
    container: {
      // marginTop: 40,
      marginTop: insets.top,
      padding: 12,
      justifyContent: 'space-between',
      flex: 1,
      marginBottom: insets.bottom,
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={{
              type: 'font-awesome',
              name: 'envelope',
              size: 15,
              style: { paddingRight: 5 },
            }}
            onChangeText={(text: string) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{
              type: 'font-awesome',
              name: 'envelope',
              size: 15,
              style: { paddingRight: 5 },
            }}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
        </View>
      </View>
      <View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
        </View>
        <View style={styles.verticallySpaced}>
          <Button
            title="Sign up"
            disabled={loading}
            onPress={() => signUpWithEmail()}
            style={{
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: APP_COLOR.ACCENT_GREEN,
            }}
          />
        </View>
      </View>
    </View>
  );
}
