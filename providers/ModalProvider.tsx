import React, {
  useEffect,
  useState,
  useContext,
  ReactNode,
  ComponentType,
  useRef,
  useCallback,
  createContext,
  PropsWithChildren,
} from 'react';
import {
  BackHandler,
  InteractionManager,
  Keyboard,
  Modal,
  View,
  StyleSheet,
  NativeEventSubscription,
  Platform,
  ModalProps,
} from 'react-native';

export interface ModalOptions {
  scrollable?: boolean;
  fullScreen?: boolean;
  onCloseCb?: () => void;
  transparent?: boolean;
  showCloseButton?: boolean;
  animationType?: 'none' | 'slide' | 'fade' | undefined;
  modalConfig?: Partial<ModalProps>;
}

export type openModalFunc = (data: ReactNode, modalOptions?: ModalOptions) => void;

export interface TWithModal {
  openModal: openModalFunc;
  closeModal: () => void;
  closeModalNoCallbackAction?: () => void;
}

interface Props {
  children: ReactNode;
}

interface StateModal {
  isVisible: boolean;
  component?: ReactNode;
  modalOptions?: ModalOptions;
}

export const ModalContext = createContext<TWithModal>({
  openModal: () => console.warn('openModal must be overriden'),
  closeModal: () => console.warn('closeModal must be overriden'),
  closeModalNoCallbackAction: () => console.warn('closeModal must be overriden'),
});

export const ModalsProvider = React.memo((props: Props) => {
  const backHandler = useRef<NativeEventSubscription | undefined>();
  const [state, setState] = useState<StateModal>({
    isVisible: false,
    component: <View />,
    modalOptions: {
      transparent: false,
      onCloseCb: undefined,
      showCloseButton: true,
      animationType: 'slide',
      modalConfig: {},
    },
  });

  const openModal: openModalFunc = useCallback((component, modalOptions) => {
    Keyboard.dismiss();
    setState({
      isVisible: true,
      component,
      modalOptions,
    });
  }, []);

  const closeModal = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      setState({
        ...state,
        isVisible: false,
      });
      if (modalOptions?.onCloseCb) {
        modalOptions.onCloseCb();
      }
    });
  }, []);

  const closeModalNoCallbackAction = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      setState({
        ...state,
        isVisible: false,
      });
    });
  }, []);

  const { component, isVisible, modalOptions } = state;

  useEffect(() => {
    if (isVisible && Platform.OS === 'android') {
      const backAction = () => {
        closeModal();
        return true;
      };
      backHandler.current = BackHandler.addEventListener('hardwareBackPress', backAction);
    }
    return () => {
      backHandler.current?.remove();
    };
  }, [isVisible]);
  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        closeModalNoCallbackAction,
      }}>
      {props.children}
      <Modal
        animationType={modalOptions?.animationType}
        transparent={modalOptions?.transparent}
        visible={isVisible}
        {...modalOptions?.modalConfig}>
        <View style={s.modalContent}>{component}</View>
      </Modal>
    </ModalContext.Provider>
  );
});

export const useModalService = () => {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("Couldn't find Modal Provider");
  }
  return context;
};

const s = StyleSheet.create({
  modalContent: {
    flex: 1,
  },
});

export function withModal<P>(WrappedComponent: ComponentType<P & TWithModal>) {
  const ComponentWithExtraInfo = (props: P & JSX.IntrinsicAttributes) => {
    const { openModal, closeModal, closeModalNoCallbackAction } = useContext(ModalContext);
    // At this point, the props being passed in are the original props the component expects.
    return (
      <WrappedComponent
        {...props}
        openModal={openModal}
        closeModal={closeModal}
        closeModalNoCallbackAction={closeModalNoCallbackAction}
      />
    );
  };
  return ComponentWithExtraInfo;
}
