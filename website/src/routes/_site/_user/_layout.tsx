import { Outlet } from "react-router";
import { ErrorComponent } from "~/components/base/error-component";

export default function UsersLayout() {
  return (
    <div className={"max-w-288 mx-auto flex flex-row p-4"}>
      <div className={"w-52"}>1</div>
      <div className={"grow"}>
        <Outlet />
      </div>
    </div>
  );
}

export const ErrorBoundary = ErrorComponent;
