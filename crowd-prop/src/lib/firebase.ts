import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEbr_0paRErJY7Nr3tX_gXoDsxYp1AH78",
  authDomain: "crowd-prop.firebaseapp.com",
  projectId: "crowd-prop",
  storageBucket: "crowd-prop.firebasestorage.app",
  messagingSenderId: "1080880610797",
  appId: "1:1080880610797:web:3a25d88b15f04351567be4",
  measurementId: "G-DS97ZB7YZX",
};

const app = initializeApp(firebaseConfig);
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
