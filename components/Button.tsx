import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { APP_COLOR } from '~/constants/AppConstants';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: APP_COLOR.ACCENT_GREEN,
    borderRadius: 24,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: APP_COLOR.MAIN_WHITE,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ title, ...touchableProps }, ref) => {
    return (
      <TouchableOpacity ref={ref} {...touchableProps} style={[styles.button, touchableProps.style]}>
        <Text
          style={[
            styles.buttonText,
            { color: title === 'Sign up' ? APP_COLOR.ACCENT_GREEN : APP_COLOR.MAIN_WHITE },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);
