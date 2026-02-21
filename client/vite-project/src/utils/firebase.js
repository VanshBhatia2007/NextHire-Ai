import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ← fix here

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nexthire-6ff5a.firebaseapp.com",
  projectId: "nexthire-6ff5a",
  storageBucket: "nexthire-6ff5a.firebasestorage.app",
  messagingSenderId: "939663303000",
  appId: "1:939663303000:web:4351b6dfcec4b7500b452d",
  measurementId: "G-B5H1WD2PKC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };