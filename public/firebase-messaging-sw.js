importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js");

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("../firebase-messaging-sw.js")
        .then(function (registration) {
            console.log("Registro exitoso, el alcance es:", registration.scope);
        })
        .catch(function (err) {
            console.log("Service worker fallo en el registro, error:", err);
        });
}

firebase.initializeApp({
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_AUTH_DOMAIN_AQUI",
    databaseURL: "TU_DATABASE_URL_AQUI",
    projectId: "TU_PROJECT_ID_AQUI",
    storageBucket: "TU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "TU_MESSAGING_SENDER_ID_AQUI",
    appId: "TU_APP_ID_AQUI",
    measurementId: "TU_MEASUREMENT_ID_AQUI",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // Toma la hora mandada del push
    // const hora = new Date(Number(payload.data.timestamp)).toLocaleTimeString();

    // Customize notification here
    const notificationTitle = "Ordenes pendientes!";
    const notificationOptions = {
        // body: `${hora}`,
        body: "Ordenes sin verificar",
        icon: "/favicon.ico",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
