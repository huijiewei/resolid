import { customAlphabet } from "nanoid";

export const randomString = (size: number = 16) => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const nanoid = customAlphabet(alphabet, size);

  return nanoid();
};
