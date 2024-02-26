import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { useMergeRefs } from "../../hooks";
import { Slot, type AsChildProps } from "../slot/Slot";
import { useFloatingReference } from "./FloatingReferenceContext";

export type FloatingTriggerProps = AsChildProps<"button", { active?: boolean }, "type">;

export const FloatingTrigger = forwardRef<HTMLButtonElement, FloatingTriggerProps>((props, ref) => {
  const { asChild, active, children, ...rest } = props;

  const { setReference, getReferenceProps, opened } = useFloatingReference();

  const refs = useMergeRefs(setReference, ref);

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={refs}
      data-active={active && opened ? "" : undefined}
      type={Comp == "button" ? "button" : undefined}
      {...getReferenceProps({
        ...rest,
      })}
    >
      {children}
    </Comp>
  );
});

if (__DEV__) {
  FloatingTrigger.displayName = "FloatingTrigger";
}