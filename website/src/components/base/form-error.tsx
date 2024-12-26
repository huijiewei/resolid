export const FormError = ({ message }: { message: string | undefined }) => {
  return (
    message && <span className={"text-fg-danger absolute start-0.5 top-full block pt-0.5 text-sm"}>{message}</span>
  );
};
