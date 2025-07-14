import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD28zj9ocnXMBlSmzN4cB4AL-7wE615TWk",
  authDomain: "ampway.firebaseapp.com",
  projectId: "ampway",
  storageBucket: "ampway.firebasestorage.app",
  messagingSenderId: "810814194205",
  appId: "1:810814194205:web:857e5328cd5e9c8d92bcf4",
  measurementId: "G-R1TGF67FZ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
export { auth, db , provider, signInWithPopup};
