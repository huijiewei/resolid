import { redirect } from "@remix-run/server-runtime";

export const loader = () => {
  throw redirect("introduction", 308);
};

export default function Index() {
  return null;
}
