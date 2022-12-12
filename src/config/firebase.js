import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, } from "firebase/database"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "netflix-clone-f56a8.firebaseapp.com",
  projectId: "netflix-clone-f56a8",
  storageBucket: "netflix-clone-f56a8.appspot.com",
  messagingSenderId: "113605899048",
  appId: "1:113605899048:web:181f6687e928924afe961d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const database = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
