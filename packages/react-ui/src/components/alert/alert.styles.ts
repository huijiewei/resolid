import { sharedBadgeAndAlertVariants } from "../../shared/styles";
import { type VariantProps, classed } from "../../utils/classed";

// @ts-expect-error Type
export const alertStyles = classed("relative rounded border p-4", sharedBadgeAndAlertVariants);

export type AlertStyleProps = VariantProps<typeof alertStyles>;
