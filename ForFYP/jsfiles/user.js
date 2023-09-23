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
                        document.getElementById('dob').value = userData.dob;
                        document.getElementById('email').value = userData.email;
                        document.getElementById('address').value = userData.address;
                        document.getElementById('phoneNo').value = userData.phoneNo;

                        const genderInput = document.getElementById('genderInput');
                        const genderOptions = document.getElementById('genderOptions');

                        const gender = userData.gender;
                        if (gender) {
                            // Gender exists
                            document.getElementById('gender').value = gender;
                            genderInput.style.display = 'block';
                            genderOptions.style.display = 'none';
                        } else {
                            // Gender not exists
                            genderInput.style.display = 'none';
                            genderOptions.style.display = 'block';
                        }

                        console.log('User document fetched');
                    });
                } else {
                    console.log('User document does not exist');
                }
            })
            .catch((error) => {
                console.log('Error fetching user profile:', error);
            });
    };
    displayProfile();
});

// Option Select
document.addEventListener('DOMContentLoaded', function () {
    const genderInput = document.getElementById('genderInput');
    const genderOptions = document.getElementById('genderOptions');

    const gender = document.getElementById('gender').value.trim();

    if (gender === '') {
        genderInput.style.display = 'none';
        genderOptions.style.display = 'block';
    } else {
        genderInput.style.display = 'block';
        genderOptions.style.display = 'none';
    }
});

// Update Details
window.update = function (event) {
    event.preventDefault();

    const confirmed = window.confirm('Please ensure the details are correct.\nAre you sure you want to update your details?');

    if (!confirmed) {
        return; // If the user cancels, do nothing
    }

    let gender;

    // Check if the gender input field is visible
    const genderInput = document.getElementById('genderInput');
    if (genderInput.style.display === 'block') {
        gender = document.getElementById('gender').value;
    } else {
        // If the gender radio buttons are visible, get the selected value
        const genderRadios = document.getElementsByName('User_gender');
        for (const radio of genderRadios) {
            if (radio.checked) {
                gender = radio.value;
                break;
            }
        }
    }

    const name = document.getElementById('name').value;
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
            alert('User details updated successfully');

            setTimeout(() => {
                location.reload();
            }, 1000);
        })
        .catch((error) => {
            alert('Error updating:', error);
        });
}