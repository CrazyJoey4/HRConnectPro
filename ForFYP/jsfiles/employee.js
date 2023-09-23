import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvlxv-MrRhV3Bvuq6sVChj96LMnQvp4EY",
    authDomain: "hrconnect-db.firebaseapp.com",
    projectId: "hrconnect-db",
    storageBucket: "hrconnect-db.appspot.com",
    messagingSenderId: "97453104866",
    appId: "1:97453104866:web:bb3e3508b7796abb02c8bb"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

var userId = localStorage.getItem('userId');

console.log('js is connected');

function fetchUserData() {
    const table = document.querySelector("table");

}