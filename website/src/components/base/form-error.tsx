export const FormError = ({ message }: { message: string | undefined }) => {
  return (
    message && <span className={"absolute start-0.5 top-full block pt-0.5 text-sm text-fg-danger"}>{message}</span>
  );
};
