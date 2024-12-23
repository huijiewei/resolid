import { computeRoute } from "@vercel/analytics";
import { useLocation, useParams } from "react-router";

export const useRoute = (): { route: string | null; path: string } => {
  const params = useParams();
  const { pathname: path } = useLocation();
  return { route: computeRoute(path, params as never), path };
};
