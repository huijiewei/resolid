import { sharedBadgeAndAlertVariants } from "../../shared/styles";
import { classed, type VariantProps } from "../../utils/classed";

// @ts-expect-error Type
export const badgeStyles = classed("inline-flex items-center", sharedBadgeAndAlertVariants);

export type BadgeStyleProps = VariantProps<typeof badgeStyles>;
