import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { Slot, type AsChildProps, type EmptyProps } from "../slot/Slot";
import { useFloatingReference } from "./FloatingReferenceContext";

export const FloatingTrigger = forwardRef<HTMLButtonElement, AsChildProps<"button", EmptyProps, "type">>(
  (props, ref) => {
    const { asChild, children, ...rest } = props;

    const { setReference, getReferenceProps } = useFloatingReference();

    const refs = useMergeRefs(setReference, ref);

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={refs}
        type={Comp == "button" ? "button" : undefined}
        {...getReferenceProps({
          ...rest,
        })}
      >
        {children}
      </Comp>
    );
  },
);

if (__DEV__) {
  FloatingTrigger.displayName = "FloatingTrigger";
}
