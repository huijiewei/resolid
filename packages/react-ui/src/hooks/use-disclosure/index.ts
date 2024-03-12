import { useControllableState } from "../use-controllable-state";

export type UseDisclosureProps = {
  opened?: boolean;
  defaultOpened?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export function useDisclosure(options: UseDisclosureProps = {}) {
  const { opened, defaultOpened = false, onOpen, onClose } = options;

  const [openedState, setOpenedState] = useControllableState({
    value: opened,
    defaultValue: defaultOpened,
    onChange: (value) => {
      value ? onOpen?.() : onClose?.();
    },
  });

  const open = () => {
    setOpenedState(true);
  };

  const close = () => {
    setOpenedState(false);
  };

  const toggle = () => {
    setOpenedState((prevState) => !prevState);
  };

  return {
    opened: openedState,
    open,
    close,
    toggle,
  };
}
