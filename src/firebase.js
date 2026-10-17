import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyClNV6MywAFLwyrN7kxR_ZV7yW8_y_MqMo",
    authDomain: "newlunacare.firebaseapp.com",
    projectId: "newlunacare",
    storageBucket: "newlunacare.firebasestorage.app",
    messagingSenderId: "47333217295",
    appId: "1:47333217295:web:68f71a1057822a3129bf7a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);