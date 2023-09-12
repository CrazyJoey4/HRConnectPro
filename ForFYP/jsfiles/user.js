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

// Display User Information
document.addEventListener("DOMContentLoaded", function () {
    window.displayProfile = function () {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('uid', '==', userId));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        // Display user data
                        document.getElementById('name').value = userData.name;
                        document.getElementById('gender').value = userData.gender;
                        document.getElementById('dob').value = userData.dob;
                        document.getElementById('email').value = userData.email;
                        document.getElementById('address').value = userData.address;
                        document.getElementById('phoneNo').value = userData.phoneNo;

                        console.log('User document fetched');
                    });
                } else {
                    console.log('User document does not exist');
                }
            })
            .catch((error) => {
                console.log('Error fetching user profile:', error);
            });
    }
    displayProfile();
});

// Update Details
window.update = function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const phoneNo = document.getElementById('phoneNo').value;

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('uid', '==', userId));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userDocRef = doc.ref;
                    // Update the username field
                    return updateDoc(userDocRef, { 
                        name: name,
                        gender: gender,
                        dob: dob,
                        email: email,
                        phoneNo: phoneNo,
                    });
                });
            } else {
                alert('User document does not exist');
                throw new Error('User document does not exist');
            }
        })
        .then(() => {
            // Update successful
            alert('Username updated successfully');
        })
        .catch((error) => {
            // Error occurred during update
            alert('Error updating username:', error);
        });
}