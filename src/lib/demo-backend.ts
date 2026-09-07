export const isDemoMode = false;
export const demoDb: any = {
  getProfiles: async () => [],
  getConversations: () => [],
  getMessages: () => [],
  sendMessage: () => {},
  updateProfile: async () => {}
};
export const demoAuth: any = {
  login: async () => {},
  register: async () => {},
  logout: async () => {}
};
