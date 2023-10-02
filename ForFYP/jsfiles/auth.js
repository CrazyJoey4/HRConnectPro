// Import the functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

checkLoggedIn();
getName();

// Check if the user is logged in
function checkLoggedIn() {
    console.log(userId);
    if (!userId) {
        // User is not logged in, redirect to login page or perform other actions
        auth.signOut()
            .then(() => {
                window.location.assign('index.php');
            })
            .catch(error => {
                console.error(error);
            });
    }
}

// For Sign Out
const signout = document.getElementById('signOut');

signout.addEventListener('click', () => {
    if (confirm("Are you sure you want to log out?")) {
        // User confirmed, proceed with logout
        auth.signOut()
            .then(() => {
                localStorage.clear();
                window.location.assign('index.php');
            })
            .catch(error => {
                console.error(error);
            });
    }
});

// For Get Name
function getName() {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('uid', '==', userId));
    const UserName = document.getElementById('user_name');

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    console.log(userData.name);
                    UserName.textContent = userData.name;
                });
            } else {
                console.log('User document does not exist');
            }
        }).catch((error) => {
            console.log('Error fetching position:', error);
        });
}