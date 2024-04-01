import { authUtils } from "../../core/auth/utils";
import type { UserAuthSession } from "./service";

export const userUtils = {
  ...authUtils,
  isEmailVerified: (user: UserAuthSession) => {
    return user.emailVerifiedAt != null;
  },
};
