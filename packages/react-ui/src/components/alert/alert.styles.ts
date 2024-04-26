import { sharedBadgeAndAlertVariants } from "../../shared/styles";
import { type VariantProps, classed } from "../../utils/classed";

// @ts-expect-error Type
export const alertStyles = classed("border rounded relative p-4", sharedBadgeAndAlertVariants);

export type AlertStyleProps = VariantProps<typeof alertStyles>;
