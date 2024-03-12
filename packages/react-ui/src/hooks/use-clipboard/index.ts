import { useEffect, useState } from "react";

export const useClipboard = (timeout = 2000, onError: (error: Error) => void = () => {}) => {
  const [copied, setCopied] = useState(false);

  const copy = async (source: string) => {
    try {
      await navigator.clipboard.writeText(source);
    } catch (e) {
      onError?.(e as Error);
    }

    setCopied(true);
  };

  useEffect(() => {
    const id = copied ? setTimeout(() => setCopied(false), timeout) : null;

    return () => {
      id && clearTimeout(id);
    };
  }, [timeout, copied]);

  return { copy, copied };
};
