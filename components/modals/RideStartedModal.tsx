import { Fragment } from 'react';
import { Platform, StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_COLOR } from '~/constants/AppConstants';
import { TWithModal, withModal } from '~/providers/ModalProvider';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

interface RideStartedModalProps {
  text?: string;
}

export const RideStartedModal: React.FC<RideStartedModalProps> = withModal(
  ({ closeModal, text }) => {
    const insets = useSafeAreaInsets();
    const marginTop = Platform.select({
      ios: 115 + insets.top,
      android: 115 + insets.top,
      default: 0,
    });

    return (
      <Fragment>
        <Pressable style={s.root} onPress={closeModal}>
          <View style={[s.container, { marginVertical: marginTop * 2, marginHorizontal: '5%' }]}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',

                flex: 1,
              }}>
              <Text style={{ fontStyle: 'italic', fontSize: RFPercentage(3), textAlign: 'center' }}>
                {text}
              </Text>
            </View>
          </View>
        </Pressable>
      </Fragment>
    );
  }
);

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
    backgroundColor: APP_COLOR.MAIN_WHITE,
    height: '30%',
    borderRadius: 20,
    padding: '5%',
  },
});
