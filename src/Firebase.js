// AUTHENTICATION IMPORTS
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { OAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";


// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// AUTHENTICATION WITH EMAIL AND PASSWORD
const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password).then((res) => {
            console.log(res);
        });
    } catch {
        alert("Invalid password or email");
    }
};

// AUTHENTICATION WITH EMAIL AND PASSWORD
const registerWithEmailAndPassword = async (email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password).then((res) => {
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

// LOGOUT
const logout = () => {
    signOut(auth);
};

// EXPORTS
export {
    auth,
    app,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
};