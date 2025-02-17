import { createSafeContext } from "@resolid/react-ui";

type AuthContextValue<T = unknown> = {
  identity: T | undefined;
};

export const [AuthContext, useAuthContext] = createSafeContext<AuthContextValue>({
  name: "AuthContext",
});

export const useAuth = <T>() => {
  return useAuthContext() as AuthContextValue<T>;
};
