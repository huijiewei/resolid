import { isBrowser } from "@resolid/utils";
import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicEffect = isBrowser() ? useLayoutEffect : useEffect;
