import { useControllableState } from "../use-controllable-state";

export type UseDisclosureProps = {
  opened?: boolean;
  defaultOpened?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export function useDisclosure(options: UseDisclosureProps) {
  const { opened, defaultOpened = false, onOpen, onClose } = options;

  const [openedState, setOpenedState] = useControllableState({
    value: opened,
    defaultValue: defaultOpened,
    onChange: (opened) => {
      if (opened) {
        onOpen?.();
      } else {
        onClose?.();
      }
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

  return [openedState, { open, close, toggle }] as const;
}
