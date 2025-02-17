import { Button, type ButtonProps, type PrimitiveProps } from "@resolid/react-ui";
import { Link, type LinkProps, NavLink, type NavLinkProps, type Path, useLocation, useNavigate } from "react-router";

export const HistoryLink = (props: LinkProps) => {
  const { state, to, ...rest } = props;

  return <Link to={to} state={{ ...state, previous: true }} {...rest} />;
};

export const HistoryNavLink = (props: NavLinkProps) => {
  const { state, to, ...rest } = props;

  return <NavLink to={to} state={{ ...state, previous: true }} {...rest} />;
};

export type HistoryBackProps = ButtonProps & { backTo?: string | Partial<Path> };

export const HistoryBack = (props: PrimitiveProps<"button", HistoryBackProps, "children">) => {
  const { onClick, backTo = "/", ...rest } = props;

  const navigate = useNavigate();
  const { state } = useLocation();

  const historyBack = () => {
    if (state?.previous) {
      navigate(-1);
    } else {
      navigate(backTo);
    }
  };

  return (
    <Button
      onClick={(e) => {
        onClick?.(e);
        historyBack();
      }}
      {...rest}
    >
      点击返回
    </Button>
  );
};
