// Este es un archivo de ejemplo. Copia este archivo como firebase.ts y reemplaza los valores con tus credenciales de Firebase

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// PASO 1: Ve a https://console.firebase.google.com/
// PASO 2: Crea un nuevo proyecto o selecciona uno existente
// PASO 3: Ve a Project Settings > General > Your apps
// PASO 4: Haz clic en "Add app" y selecciona Web
// PASO 5: Copia la configuración que aparece

const firebaseConfig = {
  apiKey: "AIzaSyC-tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// PASO 6: Ve a Authentication > Sign-in method
// PASO 7: Habilita "Email/Password"
// PASO 8: Ve a Firestore Database > Create database
// PASO 9: Selecciona "Start in test mode" (para desarrollo)

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// El resto del código es igual que en firebase.ts
// ... (copia todo el contenido de firebase.ts aquí)

export { db, auth }; 