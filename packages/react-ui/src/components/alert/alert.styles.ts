import { sharedBadgeAndAlertVariants } from "../../shared/styles";
import { classed, type VariantProps } from "../../utils/classed";

// @ts-expect-error Type
export const alertStyles = classed("border rounded relative p-4", sharedBadgeAndAlertVariants);

export type AlertStyleProps = VariantProps<typeof alertStyles>;
