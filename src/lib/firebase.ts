import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, push, remove, update, onValue, type DatabaseReference } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC-aqBrJpryeguemcDMHMv2OZ2SN6xLr5Y",
  authDomain: "codespire-6e8dd.firebaseapp.com",
  databaseURL: "https://codespire-6e8dd-default-rtdb.firebaseio.com",
  projectId: "codespire-6e8dd",
  storageBucket: "codespire-6e8dd.firebasestorage.app",
  messagingSenderId: "908750579352",
  appId: "1:908750579352:web:b193e1dcd6ec6a7f1652ed",
  measurementId: "G-DPNCZ8CSKK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, get, set, push, remove, update, onValue };
export type { DatabaseReference };
