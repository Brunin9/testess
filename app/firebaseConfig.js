import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsgaR-7pUFvmefDa6QvHx8Tia8xdhcz3s",
  authDomain: "testeapp-ca442.firebaseapp.com",
  projectId: "testeapp-ca442",
  storageBucket: "testeapp-ca442.firebasestorage.app",
  messagingSenderId: "379123178813",
  appId: "1:379123178813:web:e6c673340a9c26cb32b954"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);