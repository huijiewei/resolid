import { MDXProvider } from "@mdx-js/react";
import { clsx } from "@resolid/react-ui";
import { debounce, isBrowser, isExternalUrl } from "@resolid/utils";
import { type ComponentPropsWithoutRef, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { SpriteIcon } from "~/components/base/sprite-icon";
import { ClipboardButton } from "~/components/clipboard-button";

type TocItem = {
  id: string;
  level: number;
  slugElement: Element;
  topOffset: number;
  text: string | null;
};

const mdxComponents = {
  h2: ({ id, children, className, ...rest }: ComponentPropsWithoutRef<"h2">) => {
    return (
      <h2 className={clsx("reHeadings group relative flex items-center", className)} {...rest}>
        <span id={id} className={"reHeadingsSlug invisible absolute top-[calc(-1*88px)]"} />
        {children}
        <a tabIndex={-1} className={"ml-1 opacity-0 transition-opacity group-hover:opacity-100"} href={`#${id}`}>
          <SpriteIcon size={"sm"} name={"link"} />
        </a>
      </h2>
    );
  },
  h3: ({ id, children, className, ...rest }: ComponentPropsWithoutRef<"h3">) => {
    return (
      <h3 className={clsx("reHeadings group relative flex items-center", className)} {...rest}>
        <span id={id} className={"reHeadingsSlug invisible absolute top-[calc(-1*88px)]"} />
        {children}
        <a tabIndex={-1} className={"ml-1 opacity-0 transition-opacity group-hover:opacity-100"} href={`#${id}`}>
          <SpriteIcon size={"sm"} name={"link"} />
        </a>
      </h3>
    );
  },
  pre: ({ children, className, ...rest }: ComponentPropsWithoutRef<"pre"> & { "data-inline"?: boolean }) => {
    if (rest["data-inline"]) {
      rest["data-inline"] = undefined;

      return (
        <pre className={className} {...rest}>
          {children}
        </pre>
      );
    }

    return (
      <div className={"relative"}>
        <pre
          translate={"no"}
          className={clsx(
            "scrollbar scrollbar-thin rounded border p-3 group-[.example]:mt-0 group-[.example]:rounded-t-none group-[.example]:border-t-0",
            className,
          )}
          tabIndex={-1}
          {...rest}
        >
          {children}
        </pre>
        <div className={"z-base absolute right-1.5 top-1.5"}>
          <ClipboardButton content={children} />
        </div>
      </div>
    );
  },
  a: ({ children, href = "", className, ...rest }: ComponentPropsWithoutRef<"a">) => {
    const external = isExternalUrl(href);

    return (
      <a
        href={href}
        className={clsx(
          "text-link hover:text-link-hovered active:text-link-pressed inline-flex items-center no-underline hover:underline",
          className,
        )}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...rest}
      >
        {children}
        {external && <SpriteIcon size={"xs"} className={"ml-1"} name={"external-link"} />}
      </a>
    );
  },
};

// eslint-disable-next-line react-refresh/only-export-components
const Toc = () => {
  const [headingElements, setHeadingElements] = useState<Element[]>([]);

  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    setHeadingElements(Array.from(document.querySelectorAll(".reHeadings")));
  }, [pathname]);

  const items = useMemo(() => {
    if (!headingElements) {
      return [];
    }

    return headingElements
      .map((element) => {
        const slugElement = element.querySelector(".reHeadingsSlug");

        if (!slugElement?.id) {
          return null;
        }

        const box = slugElement.getBoundingClientRect();

        const id = slugElement.id;
        const level = Number(element.tagName[1]);
        const text = element.textContent?.replace("#", "");
        const topOffset = window.scrollY + box.top;

        if (level < 2 || level > 4) {
          return null;
        }

        return {
          id,
          level,
          slugElement,
          text,
          topOffset,
        };
      })
      .filter(Boolean) as TocItem[];
  }, [headingElements]);

  const active = useRef(true);
  const [activeId, setActiveId] = useState<string | null>(hash.replace("#", ""));

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!active.current) {
          return;
        }

        const id = entry.target.id;

        if (entry.isIntersecting) {
          setActiveId(id);
        } else {
          const box = entry.target.getBoundingClientRect();
          const isVisible = box.top > 0;

          if (!isVisible) {
            return;
          }

          const activeIndex = items.findIndex((item) => item.id === activeId);
          const previousId = items[activeIndex - 1]?.id;
          setActiveId(previousId);
        }
      },
      {
        rootMargin: "15% 0px -95% 0px",
      },
    );

    for (const item of items) {
      observer.observe(item.slugElement);
    }

    return () => observer.disconnect();
  }, [activeId, items]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const callback = debounce(() => {
      if (!active.current) {
        return;
      }

      if (window.scrollY === 0) {
        setActiveId(items[0].id);
        return;
      }

      if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
        setActiveId(items[items.length - 1]?.id);
        return;
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (window.scrollY < item.topOffset) {
          setActiveId(items[i - 1]?.id);
          break;
        }
      }
    }, 100);

    window.addEventListener("scroll", callback);
    return () => window.removeEventListener("scroll", callback);
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return items.map(({ id, level, text }) => (
    <li key={id}>
      <a
        className={clsx(
          "-ml-px block border-s py-1",
          level == 2 ? "ps-4" : "ps-8",
          activeId === id ? "border-link text-link" : "text-fg-muted hover:border-link-hovered hover:text-fg-subtle",
        )}
        onClick={() => {
          setActiveId(id);

          active.current = false;
          setTimeout(() => {
            active.current = true;
          }, 500);
        }}
        href={`${pathname}#${id}`}
      >
        {text}
      </a>
    </li>
  ));
};

// noinspection JSUnusedGlobalSymbols
export default function Layout() {
  return (
    <>
      <article
        className={
          "prose dark:prose-invert w-full max-w-none px-4 py-6 md:px-6 lg:max-w-[calc(100%-theme(spacing.48))]"
        }
      >
        <MDXProvider disableParentContext components={mdxComponents}>
          <Outlet />
        </MDXProvider>
      </article>
      <nav className={"hidden w-48 shrink-0 lg:block"}>
        <ul className={"sticky top-16 p-4 text-sm"}>
          <Toc />
        </ul>
      </nav>
    </>
  );
}
