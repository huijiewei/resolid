import { useNavigation } from "@remix-run/react";
import { clsx } from "@resolid/react-ui";
import { useEffect, useRef, useState } from "react";

export function RouteProcessBar() {
  const transition = useNavigation();
  const active = transition.state !== "idle";

  const ref = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    Promise.allSettled(ref.current.getAnimations().map(({ finished }) => finished)).then(() => {
      if (!active) setAnimating(false);
    });

    const id = active ? setTimeout(() => setAnimating(true), 100) : null;

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [active]);

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? "正在加载" : undefined}
      className="pointer-events-none fixed inset-x-0 top-0 z-spotlight h-1 animate-pulse"
    >
      <div
        ref={ref}
        className={clsx(
          "h-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-500 ease-in-out",
          transition.state === "idle" && (animating ? "w-full" : "w-0 opacity-0 transition-none"),
          transition.state === "submitting" && "w-4/12",
          transition.state === "loading" && "w-10/12",
        )}
      />
    </div>
  );
}
