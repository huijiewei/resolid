import type { BaseProps } from "../slot/slot";

export const ModalFooter = (props: BaseProps<"footer">) => {
  const { children, className, ...rest } = props;

  return (
    <footer className={className} {...rest}>
      {children}
    </footer>
  );
};
