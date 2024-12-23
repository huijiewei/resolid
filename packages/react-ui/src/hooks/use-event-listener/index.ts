import { isBrowser } from "@resolid/utils";
import { type RefObject, useEffect, useRef } from "react";
import { useIsomorphicEffect } from "../use-isomorphic-effect";

type UseEventListenerTarget = Window | Document | HTMLElement | RefObject<HTMLElement | null>;

type ExtractTargetElement<Target> = Target extends RefObject<infer Element> ? Element : Target;

type ExtractEventMap<Target> =
  ExtractTargetElement<Target> extends Window
    ? WindowEventMap
    : ExtractTargetElement<Target> extends Document
      ? DocumentEventMap
      : HTMLElementEventMap;

type ExtractEventName<Target> = keyof ExtractEventMap<ExtractTargetElement<Target>>;

type ExtractEvent<Target, EventName extends ExtractEventName<Target>> = ExtractEventMap<
  ExtractTargetElement<Target>
>[EventName];

export const useEventListener = <
  TargetEventName extends ExtractEventName<Target>,
  TargetEvent extends ExtractEvent<Target, TargetEventName>,
  Target extends UseEventListenerTarget = Window,
>(
  eventName: TargetEventName,
  handler: (event: TargetEvent) => void,
  target?: Target,
  options?: boolean | AddEventListenerOptions,
) => {
  const handlerRef = useRef(handler);
  const optionsRef = useRef(options);

  useIsomorphicEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useIsomorphicEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    if (!(typeof eventName === "string" && target !== null)) {
      return;
    }

    const targetElement: Exclude<UseEventListenerTarget, RefObject<HTMLElement>> | null =
      typeof target === "undefined" ? window : "current" in target ? target.current : target;

    if (!targetElement?.addEventListener) {
      return;
    }

    const eventOptions = optionsRef.current;

    const eventListener = (event: Event) => handlerRef.current(event as unknown as TargetEvent);

    targetElement.addEventListener(eventName, eventListener, eventOptions);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [target, eventName]);
};
