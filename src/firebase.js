// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYXXA7c1WWSLu7PSQ1XlKf0tB3AlLPRJw",
  authDomain: "date-proposal-73725.firebaseapp.com",
  projectId: "date-proposal-73725",
  storageBucket: "date-proposal-73725.firebasestorage.app",
  messagingSenderId: "844815402978",
  appId: "1:844815402978:web:5d28f55912291d74649bbb",
  measurementId: "G-YEW9KXJTFC",
};

// Initialize Firebase
const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export { auth };
export default db;
