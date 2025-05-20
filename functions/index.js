const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.sendNotificationToAdmin = functions.firestore
    .document("restaurantes/{uid}/ordenes/{id}")
    .onWrite(async (event) => {
        let verificado = event.after.get("verificado");

        if (verificado === false) {
            // let restaurantID = event.after.get("restauranteId")

            // dev admin id = wBJ6GvWK44ShWK9QQCV6paJpRzu2
            // production admin id = FxzoJFyqP3b0SKFEygPXSWcEugz1

            let adminData = await db
                .collection("admin")
                .doc("FxzoJFyqP3b0SKFEygPXSWcEugz1")
                .get();

            // let restaurantData = await db
            // .collection("restaurantes")
            // .doc(restaurantID)
            // .get();

            let fcmToken = adminData.get("fcmToken");
            // let fcmToken2 = restaurantData.get("fcmToken");

            let date = Date.now().toString();
            // const hora = new Date(Number(date)).toLocaleTimeString()

            var payload = {
                data: {
                    timestamp: date, // values must be strings!
                },
                notification: {
                    title: "Ordenes pendientes!",
                    body: "Ordenes sin verificar",
                },
                // webpush: {
                //   fcm_options: {
                //     link: "https://ubix-react-native.web.app/",
                //   },
                // },
                // token: tokens,
            };

            const options = {
                priority: "high",
                // timeToLive: 60 * 60 * 24
            };

            let response = await admin
                .messaging()
                .sendToDevice(fcmToken, payload, options);
            // .then((response) => {
            //   console.log("Notificaciones de admin enviadas a todos los dispositivos:", response);
            // });
        }
    });

exports.sendNotificationToDriver = functions.firestore
    .document("conductores/{uid}/notificaciones/{id}")
    .onWrite(async (event) => {
        let entregado = event.after.get("entregado");

        if (entregado === false) {
            let conductorID = event.after.get("conductorId");
            let date = Date.now().toString();

            var message = {
                data: {
                    timestamp: date, // values must be strings!
                },
                notification: {
                    title: "Orden entrante!",
                    body: "Orden pendiente de entrega",
                },
                topic: conductorID,
            };

            let response = await admin.messaging().send(message);
            // .then((response) => {
            //   console.log(
            //     "Notificacion de repartidor enviada a su dispositivo:",
            //     response
            //   );
            // });
        }
    });

// exports.sendNotificationToFCMToken = functions.firestore
//   .document("conductores/{uid}")
//   .onWrite(async (event) => {
//     // const uid = event.after.get('userUid');
//     // const title = event.after.get('title');
//     // const content = event.after.get('content');
//     // let userDoc = await admin.firestore().doc(`conductores/${uid}`).get();
//     // let fcmToken = userDoc.get('fcm');

//     let fcmToken =
//       "";

//     var message = {
//       notification: {
//         title: title,
//         body: content,
//       },
//       token: fcmToken,
//     };

//     let response = await admin.messaging().send(message);
//     console.log(response);
//   });

// Activacion de Negocios
exports.activaterestaurantUno = functions.pubsub
    .schedule("0 9 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "9:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantDos = functions.pubsub
    .schedule("30 9 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "9:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantTres = functions.pubsub
    .schedule("0 10 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "10:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });
exports.activaterestaurantCuatro = functions.pubsub
    .schedule("30 10 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "10:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });
exports.activaterestaurantCinco = functions.pubsub
    .schedule("0 11 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "11:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantSeis = functions.pubsub
    .schedule("30 11 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "11:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantSiete = functions.pubsub
    .schedule("0 12 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "12:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantOcho = functions.pubsub
    .schedule("30 12 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "12:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantNueve = functions.pubsub
    .schedule("0 13 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "13:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantDiez = functions.pubsub
    .schedule("30 13 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "13:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantOnce = functions.pubsub
    .schedule("0 14 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "14:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantDoce = functions.pubsub
    .schedule("30 14 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "14:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

exports.activaterestaurantTrece = functions.pubsub
    .schedule("0 15 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("apertura", "==", "15:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: true,
            });
        });
    });

// Desactivacion de Negocios
exports.desactivaterestaurantUno = functions.pubsub
    .schedule("0 14 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "14:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantDos = functions.pubsub
    .schedule("30 14 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "14:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantTres = functions.pubsub
    .schedule("0 15 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "15:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantCuatro = functions.pubsub
    .schedule("30 15 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "15:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantCinco = functions.pubsub
    .schedule("0 16 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "16:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantSeis = functions.pubsub
    .schedule("30 16 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "16:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantSiete = functions.pubsub
    .schedule("0 17 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "17:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });
exports.desactivaterestaurantOcho = functions.pubsub
    .schedule("30 17 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "17:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });
exports.desactivaterestaurantNueve = functions.pubsub
    .schedule("0 18 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "18:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantDiez = functions.pubsub
    .schedule("30 18 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "18:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantOnce = functions.pubsub
    .schedule("0 19 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "19:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantDoce = functions.pubsub
    .schedule("30 19 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "19:30")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });

exports.desactivaterestaurantTrece = functions.pubsub
    .schedule("0 20 * * *")
    .timeZone("America/Caracas")
    .onRun(async (context) => {
        const collection = await db
            .collection("restaurantes")
            .where("cierre", "==", "20:00")
            .get();
        collection.forEach((doc) => {
            doc.ref.update({
                abierto: false,
            });
        });
    });
