import { __DEV__ } from "@resolid/utils";
import { type Context, type Provider, createContext as ReactCreateContext, useContext as ReactUseContext } from "react";

export type CreateContextOptions = {
  name: string;
  strict?: boolean;
  errorMessage?: string;
};

type CreateContextReturn<T> = [Provider<T>, () => T, Context<T>];

export const createContext = <T>(options: CreateContextOptions) => {
  const { name, strict = true, errorMessage } = options;

  const Context = ReactCreateContext<T | undefined>(undefined);

  if (__DEV__) {
    Context.displayName = name;
  }

  const useContext = () => {
    const context = ReactUseContext(Context);

    if (strict && context === undefined) {
      const error = new Error(
        errorMessage ||
          `use${name.replace(
            "Context",
            "",
          )} returned \`undefined\`. Seems you forgot to wrap component within ${name.replace("Context", "Provider")}`,
      );

      error.name = "ContextError";
      Error.captureStackTrace?.(error, useContext);

      throw error;
    }

    return context;
  };

  return [Context.Provider, useContext, Context] as CreateContextReturn<T>;
};
