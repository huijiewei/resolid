import { Button, type BaseProps, type ButtonProps } from "@resolid/react-ui";
import { __DEV__ } from "@resolid/utils";
import { forwardRef } from "react";
import { Link, NavLink, useLocation, useNavigate, type LinkProps, type NavLinkProps, type Path } from "react-router";

export const HistoryLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { state, to, ...rest } = props;

  return <Link to={to} state={{ ...state, previous: true }} ref={ref} {...rest} />;
});

if (__DEV__) {
  HistoryLink.displayName = "HistoryLink";
}

export const HistoryNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  const { state, to, ...rest } = props;

  return <NavLink to={to} state={{ ...state, previous: true }} ref={ref} {...rest} />;
});

if (__DEV__) {
  HistoryNavLink.displayName = "HistoryLink";
}

export type HistoryBackProps = ButtonProps & { backTo?: string | Partial<Path> };

export const HistoryBack = (props: BaseProps<"button", HistoryBackProps, "children">) => {
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
