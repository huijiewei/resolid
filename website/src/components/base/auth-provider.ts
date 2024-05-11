import { createContext } from "@resolid/react-ui";

type AuthContext<T = unknown> = {
  identity: T | undefined;
};

const [AuthProvider, useAuthContext] = createContext<AuthContext>({
  strict: true,
  name: "AuthContext",
});

export { AuthProvider };

export const useAuth = <T>() => {
  return useAuthContext() as AuthContext<T>;
};
