import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useMediaQuery } from "./index";

type MediaQueryList = {
  readonly matches: boolean;
  readonly media: string;
  onchange: MediaQueryListener | null;
  addEventListener(type: "change", listener: MediaQueryListener): void;
  removeEventListener(type: "change", listener: MediaQueryListener): void;
  dispatchEvent(event: Event): boolean;
};

type MediaQueryListener = (this: MediaQueryList, ev: MediaQueryListEvent) => void;

class MatchMediaMock {
  private mediaQueries: {
    [key: string]: ((this: MediaQueryList, ev: MediaQueryListEvent) => void)[];
  } = {};

  private mediaQueryList!: MediaQueryList;

  private currentMediaQuery!: string;

  constructor() {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string): MediaQueryList => {
        this.mediaQueryList = {
          matches: query === this.currentMediaQuery,
          media: query,
          onchange: null,
          addEventListener: (type, listener) => {
            if (type !== "change") return;

            this.addListener(query, listener);
          },
          removeEventListener: (type, listener) => {
            if (type !== "change") return;

            this.removeListener(query, listener);
          },
          dispatchEvent: vi.fn(),
        };

        return this.mediaQueryList;
      },
    });
  }

  private addListener(mediaQuery: string, listener: MediaQueryListener): void {
    if (!this.mediaQueries[mediaQuery]) {
      this.mediaQueries[mediaQuery] = [];
    }

    const query = this.mediaQueries[mediaQuery];
    const listenerIndex = query.indexOf(listener);

    if (listenerIndex !== -1) return;
    query.push(listener);
  }

  private removeListener(mediaQuery: string, listener: MediaQueryListener): void {
    if (!this.mediaQueries[mediaQuery]) return;

    const query = this.mediaQueries[mediaQuery];
    const listenerIndex = query.indexOf(listener);

    if (listenerIndex === -1) return;
    query.splice(listenerIndex, 1);
  }

  public useMediaQuery(mediaQuery: string): never | void {
    this.currentMediaQuery = mediaQuery;

    if (!this.mediaQueries[mediaQuery]) return;

    const mqListEvent: Partial<MediaQueryListEvent> = {
      matches: true,
      media: mediaQuery,
    };

    this.mediaQueries[mediaQuery].forEach((listener) => {
      listener.call(this.mediaQueryList, mqListEvent as MediaQueryListEvent);
    });
  }

  public getMediaQueries(): string[] {
    return Object.keys(this.mediaQueries);
  }

  public getListeners(mediaQuery: string): MediaQueryListener[] {
    if (!this.mediaQueries[mediaQuery]) return [];
    return this.mediaQueries[mediaQuery].slice();
  }

  public clear(): void {
    this.mediaQueries = {};
  }

  public destroy(): void {
    this.clear();
    // @ts-expect-error type
    delete window.matchMedia;
  }
}

describe("useMediaQuery", () => {
  let matchMedia: MatchMediaMock;

  beforeEach(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });

  test("should return true when the media query matches", () => {
    const query = "(min-width: 500px)";

    matchMedia.useMediaQuery(query);

    const { result } = renderHook(() => useMediaQuery(query));

    expect(result.current).toBe(true);
  });

  test("should return false when the media query does not match", () => {
    const query = "(max-width: 1000px)";

    matchMedia.useMediaQuery("(max-width: 500px)");

    const { result } = renderHook(() => useMediaQuery(query));

    expect(result.current).toBe(false);
  });

  test("should update the result when the media query changes", () => {
    matchMedia.useMediaQuery("(max-width: 500px)");

    const query = "(min-width: 768px)";

    matchMedia.useMediaQuery(query);

    const { result } = renderHook(() => useMediaQuery(query));

    expect(result.current).toBe(true);
  });
});
