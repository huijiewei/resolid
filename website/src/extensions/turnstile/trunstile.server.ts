import { env } from "node:process";
import type { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";

export const trunstileVerify = async (token: string) => {
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      response: token,
      secret: env.RX_TURNSTILE_SECRET,
    }),
  });

  const data: TurnstileServerValidationResponse = await response.json();

  return {
    success: data.success,
    error: data["error-codes"]?.length ? data["error-codes"][0] : null,
  };
};
