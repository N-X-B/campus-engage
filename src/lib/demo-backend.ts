// Mock backend for Demo Mode
export const isDemoMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("your-key");

let demoUser: any = null;

export const demoAuth = {
  signIn: async (email: string) => {
    demoUser = { uid: "demo-123", email, displayName: "Demo User" };
    localStorage.setItem("demo_user", JSON.stringify(demoUser));
    return { user: demoUser };
  },
  register: async (email: string, name: string) => {
    demoUser = { uid: "demo-" + Date.now(), email, displayName: name };
    localStorage.setItem("demo_user", JSON.stringify(demoUser));
    
    // Save to demo DB
    const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
    users.push({ id: demoUser.uid, ...demoUser, onboarded: false });
    localStorage.setItem("demo_users", JSON.stringify(users));
    
    return { user: demoUser };
  },
  logout: () => {
    demoUser = null;
    localStorage.removeItem("demo_user");
  },
  getUser: () => {
    if (!demoUser) {
      const stored = localStorage.getItem("demo_user");
      if (stored) demoUser = JSON.parse(stored);
    }
    return demoUser;
  }
};

export const demoDb = {
  getProfiles: async () => {
    const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
    // Generate some fake profiles if empty
    if (users.length <= 1) {
      return [
        { id: "fake-1", name: "Sarah Jenkins", year: "2", branch: "Biology", bio: "Looking for study buddies!", photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"] },
        { id: "fake-2", name: "Mike Chen", year: "4", branch: "Computer Science", bio: "Always coding. Coffee addict.", photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"] },
        { id: "fake-3", name: "Emma Wilson", year: "1", branch: "Art History", bio: "New to campus! Show me around?", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"] }
      ];
    }
    return users.filter((u: any) => u.id !== demoUser?.uid && u.onboarded);
  },
  updateProfile: async (uid: string, data: any) => {
    const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
    const index = users.findIndex((u: any) => u.id === uid);
    if (index >= 0) {
      users[index] = { ...users[index], ...data, onboarded: true };
      localStorage.setItem("demo_users", JSON.stringify(users));
    }
  },
  getMessages: () => {
    return JSON.parse(localStorage.getItem("demo_messages") || "[]");
  },
  sendMessage: (text: string, senderId: string, senderName: string) => {
    const msgs = JSON.parse(localStorage.getItem("demo_messages") || "[]");
    msgs.push({ id: Date.now().toString(), text, senderId, senderName, createdAt: new Date() });
    localStorage.setItem("demo_messages", JSON.stringify(msgs));
  }
};
