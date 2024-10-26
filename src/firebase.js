import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAw_aU6X_diTVoBGv7KTJ6GAWFgwVTF0Hk",
  authDomain: "partyplanify.firebaseapp.com",
  projectId: "partyplanify",
  storageBucket: "partyplanify.appspot.com",
  messagingSenderId: "67498791756",
  appId: "1:67498791756:web:33ab985d94b042c94f35e9",
  measurementId: "G-PPZ69FJJH8"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);