import type { AnalyticsProps } from "@vercel/analytics";
import { Analytics as AnalyticsScript } from "@vercel/analytics/react";
import { useRoute } from "~/extensions/vercel/utils";

export const VercelAnalytics = (props: Omit<AnalyticsProps, "route">) => (
  <AnalyticsScript {...useRoute()} {...props} framework="react-router" />
);
