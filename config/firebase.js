import { initializeApp } from "firebase/app";
import SECREATS from "./secreats";
import admin from "firebase-admin";
import serviceAccount from "../url-shortner-4174e-firebase-adminsdk-xkc5q-88ba6353bf.json";

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseConfig = {
  apiKey: SECREATS.FIREBASE_APIKEY,
  authDomain: SECREATS.FIREBASE_AUTHDOMAIN,
  projectId: SECREATS.FIREBASE_PROJECTID,
  storageBucket: SECREATS.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: SECREATS.FIREBASE_MESSAGINGSENDERID,
  appId: SECREATS.FIREBASE_APPID,
};

export const app = initializeApp(firebaseConfig);
