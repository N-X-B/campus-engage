importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ",
  authDomain: "project-f784e72e-e435-42c2-bff.firebaseapp.com",
  projectId: "project-f784e72e-e435-42c2-bff",
  storageBucket: "project-f784e72e-e435-42c2-bff.firebasestorage.app",
  messagingSenderId: "38583279350",
  appId: "1:38583279350:web:252b7c8bef0151e0cb16d7",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title || "Campus Engage";
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Get the click_action URL from the notification's custom data payload, or default to Inbox
  const urlToOpen = (event.notification.data && event.notification.data.click_action) || '/inbox';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
