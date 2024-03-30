import { redirect } from "@remix-run/server-runtime";

export const loader = () => {
  throw redirect("introduction");
};

export default function Index() {
  return null;
}
