import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  type LinkProps,
  type NavLinkProps,
  type Path,
} from "@remix-run/react";
import { forwardRef, type HTMLAttributes } from "react";

export const HistoryLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { state, to, ...rest } = props;

  return <Link to={to} state={{ ...state, previous: true }} ref={ref} {...rest} />;
});

HistoryLink.displayName = "HistoryLink";

export const HistoryNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  const { state, to, ...rest } = props;

  return <NavLink to={to} state={{ ...state, previous: true }} ref={ref} {...rest} />;
});

HistoryNavLink.displayName = "HistoryLink";

export type HistoryBackProps = { backTo?: string | Partial<Path> };

export const HistoryBack = (props: Omit<HTMLAttributes<HTMLButtonElement> & HistoryBackProps, "children">) => {
  const { onClick, backTo = "/", ...rest } = props;

  const navigate = useNavigate();
  const { state } = useLocation();

  const historyBack = () => {
    if (state && state.previous) {
      navigate(-1);
    } else {
      navigate(backTo);
    }
  };

  return (
    <button
      className={""}
      onClick={(e) => {
        onClick && onClick(e);
        historyBack();
      }}
      {...rest}
    >
      点击返回
    </button>
  );
};
