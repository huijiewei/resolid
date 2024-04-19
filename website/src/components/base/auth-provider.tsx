import { createContext } from "@resolid/react-ui";

export type AuthContext<T = unknown> = {
  identity: T | undefined;
};

const [AuthProvider, useAuth] = createContext<AuthContext>({
  strict: true,
  name: "AuthContext",
});

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
