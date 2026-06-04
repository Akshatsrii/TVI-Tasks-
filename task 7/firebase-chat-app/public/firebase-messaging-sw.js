importScripts(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);


const messaging =
firebase.messaging();

messaging.onBackgroundMessage(
(payload) => {

  self.registration.showNotification(
    payload.notification.title,
    {
      body:
      payload.notification.body
    }
  );

});