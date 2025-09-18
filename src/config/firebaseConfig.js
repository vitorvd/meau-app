import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsZ6Kl6ZDLSkK5-QAScAo8-vcB9TWKxoA",
  authDomain: "devapps-2c969.firebaseapp.com",
  databaseURL: "https://devapps-2c99-default-rtdb.firebaseio.com",
  projectId: "devapps-2c969",
  storageBucket: "devapps-2c969.appspot.com",
  messagingSenderId: "182277622716",
  appId: "1:182277622716:web:0a52352e5d8931929d79b9",
  measurementId: "G-9LTM97WR6E"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

