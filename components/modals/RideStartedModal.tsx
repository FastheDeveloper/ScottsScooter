import { Fragment } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withModal } from '~/providers/ModalProvider';

export const RideStartedModal = withModal(({ closeModal }) => {
  const insets = useSafeAreaInsets();
  const marginTop = Platform.select({
    ios: 115 + insets.top,
    android: 115 + insets.top,
    default: 0,
  });

  return (
    <Fragment>
      <View style={s.root}>
        <View style={[s.container, { marginVertical: marginTop }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text> MODAL IS MODALLING</Text>
            <Text onPress={closeModal}>X</Text>
          </View>
        </View>
      </View>
    </Fragment>
  );
});

const s = StyleSheet.create({
  border: {
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});
