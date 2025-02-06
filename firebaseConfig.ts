import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: "liveliness-fb4f5.firebaseapp.com",
    databaseURL: "https://liveliness-fb4f5-default-rtdb.firebaseio.com",
    projectId: "liveliness-fb4f5",
    storageBucket: "liveliness-fb4f5.appspot.com",
    messagingSenderId: "384716729772",
    appId: "1:384716729772:web:f705abef4b977f6fe71e09",
    measurementId: "G-1B4RFG5VSH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics: Analytics;
isSupported().then((yes) => {
    if (yes) {
        analytics = getAnalytics(app);
    }
});

export { analytics, app, auth };
