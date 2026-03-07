import {initializeApp, getApps, getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyCJ7luiuy5MH8XznU4ZOOV9Ux_9PgaBpDU",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "fichasololevelingswade-next.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "fichasololevelingswade-next",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "fichasololevelingswade-next.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1086631974476",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:1086631974476:web:940aed90fc3a5057f146e9",
};

if (!firebaseConfig.apiKey) {
  console.warn(
    "⚠️ Firebase: API Key não encontrada! Verifique seu arquivo .env.local",
  );
}

// Inicializa o Firebase apenas se não houver uma instância ativa (Singleton pattern para Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};
export default app;
