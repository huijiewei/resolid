import { type ReactNode, Suspense, use } from "react";

type PromiseComponentProps<T> = {
  data: Promise<T>;
  render: (data: T) => ReactNode;
};

export type SuspenseComponentProps<T> = PromiseComponentProps<T> & {
  fallback: ReactNode;
};

const PromiseComponent = <T extends object>({ data, render }: PromiseComponentProps<T>) => {
  const value = use(data);

  return render(value);
};

export const SuspenseComponent = <T extends object>({ fallback, render, data }: SuspenseComponentProps<T>) => {
  return (
    <Suspense fallback={fallback}>
      <PromiseComponent data={data} render={render} />
    </Suspense>
  );
};
