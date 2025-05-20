import app from "firebase/app"; // ES6
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/messaging";

import firebaseConfig from "./config";

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig);
    }
    this.db = app.firestore();
    this.fire = app.firestore;
    this.storage = app.storage();
    this.auth = app.auth();
    this.messaging = app.messaging();
  }
}

const firebase = new Firebase();
export default firebase;
