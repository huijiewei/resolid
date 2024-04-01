export const authUtils = {
  getDisplayName: <T extends { username: string; nickname?: string }>(identity: T) => {
    return identity.nickname || identity.username;
  },
};
