// Mock backend for Demo Mode
export const isDemoMode = false; // FORCE DISABLED

let demoUser: any = null;

export const demoAuth = {
  signIn: async (email: string) => {
    // If logging in with demo email, assign a standard ID so it works reliably
    demoUser = { uid: "demo-user-1", email, displayName: "Demo User" };
    localStorage.setItem("demo_user", JSON.stringify(demoUser));
    return { user: demoUser };
  },
  register: async (email: string, name: string) => {
    demoUser = { uid: "demo-user-1", email, displayName: name };
    localStorage.setItem("demo_user", JSON.stringify(demoUser));
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
    if (users.length <= 1) {
      const initialUsers = [
        { id: "fake-1", name: "Sarah Jenkins", year: "2", branch: "Biology", bio: "Looking for study buddies!", photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"], onboarded: true, answers: { studyVibe: 'Dead Silence (Library)', weekendVibe: 'Downtown Bar', stressLevel: '12 hours before', hotTake: 'Tests are dumb.' } },
        { id: "fake-2", name: "Mike Chen", year: "4", branch: "Computer Science", bio: "Always coding. Coffee addict.", photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"], onboarded: true, answers: { studyVibe: 'Low-fi Beats (Coffee Shop)', weekendVibe: 'Movie in Dorm', stressLevel: 'A week early', hotTake: 'I love sleep.' } },
        { id: "fake-3", name: "Emma Wilson", year: "1", branch: "Art History", bio: "New to campus! Show me around?", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"], onboarded: true, answers: { studyVibe: 'Dead Silence (Library)', weekendVibe: 'Frat Basement', stressLevel: '12 hours before', hotTake: 'Frats are overrated.' } }
      ];
      localStorage.setItem("demo_users", JSON.stringify(initialUsers));
      return initialUsers.filter((u: any) => u.id !== demoUser?.uid);
    }
    return users.filter((u: any) => u.id !== demoUser?.uid && u.onboarded);
  },
  updateProfile: async (uid: string, data: any) => {
    const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
    const index = users.findIndex((u: any) => u.id === uid);
    if (index >= 0) {
      users[index] = { ...users[index], ...data, onboarded: true };
    } else {
      users.push({ id: uid, ...data, onboarded: true });
    }
    localStorage.setItem("demo_users", JSON.stringify(users));
  },
  getConversations: () => {
    return [
      {
        id: "conv-1",
        otherUserId: "fake-1",
        otherUserName: "Sarah Jenkins",
        otherUserPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
        lastMessageText: "Haha, I agree! West Campus dining hall is the worst.",
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        unread: true
      }
    ];
  },
  getMessages: (conversationId: string) => {
    const allMsgs = JSON.parse(localStorage.getItem(`demo_messages_${conversationId}`) || "[]");
    if (allMsgs.length === 0 && conversationId === "conv-1") {
      return [
        { id: "m1", text: "What's the most overrated dining hall on campus?", senderId: demoUser?.uid, senderName: demoUser?.displayName },
        { id: "m2", text: "Haha, I agree! West Campus dining hall is the worst.", senderId: "fake-1", senderName: "Sarah Jenkins" }
      ];
    }
    return allMsgs;
  },
  sendMessage: (conversationId: string, text: string, senderId: string, senderName: string) => {
    const msgs = JSON.parse(localStorage.getItem(`demo_messages_${conversationId}`) || "[]");
    msgs.push({ id: Date.now().toString(), text, senderId, senderName, createdAt: new Date() });
    localStorage.setItem(`demo_messages_${conversationId}`, JSON.stringify(msgs));
  }
};
