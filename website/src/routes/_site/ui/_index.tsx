import { redirect } from "@remix-run/node";

export const loader = () => {
  throw redirect("introduction", 308);
};

export default function Index() {
  return null;
}
