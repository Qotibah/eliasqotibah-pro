// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ أضف هذا السطر

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjUb9pEEY3IO6vmx8PlkoLjII2CH0TqjA",
  authDomain: "cliqe-app.firebaseapp.com",
  projectId: "cliqe-app",
  storageBucket: "cliqe-app.firebasestorage.app",
  messagingSenderId: "177664242808",
  appId: "1:177664242808:web:c61f801ae8db1fdc12298d",
  measurementId: "G-FJCXM40N5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ أنشئ Firestore instance

export { auth, db }; // ✅ صدّر auth و db معاً
