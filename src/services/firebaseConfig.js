// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app"; // Esta é a única que deve ficar
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Se formos usar o Storage no futuro (para upload de imagens diretamente do app, por exemplo):
// import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpJ5g8boqujqO9hBUbf9ON9PGGc7xbwPM",
  authDomain: "vibe-acai.firebaseapp.com",
  projectId: "vibe-acai",
  storageBucket: "vibe-acai.firebasestorage.app",
  messagingSenderId: "99706982649",
  appId: "1:99706982649:web:687c98dae7c273fdecd228"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços do Firebase que vamos usar
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };