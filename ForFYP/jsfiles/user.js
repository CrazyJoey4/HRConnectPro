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
const maxLength = 17;

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
                        document.getElementById('bankNo').value = userData.bankNo;

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

                        const maritalStatus = userData.marital_status;
                        if (maritalStatus) {
                            // Marital status exists
                            const maritalOption = document.getElementsByName('User_marital');
                            maritalOption.forEach((option) => {
                                if (option.value === maritalStatus) {
                                    option.checked = true;
                                }
                            });
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

// For format bank account number
function formatBankNumber(input) {
    const numericValue = input.value.replace(/\D/g, '');

    if (numericValue.length > maxLength) {
        input.value = numericValue.slice(0, maxLength);
    }
}

// Validate bankNo input field while keyup
const bankNoInput = document.getElementById('bankNo');

bankNoInput.addEventListener('keyup', function () {
    formatBankNumber(this);
});

// Update Details
window.update = function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const phoneNo = document.getElementById('phoneNo').value;
    const bankNo = document.getElementById('bankNo').value;
    const bankType = document.getElementById('bankType').value;
    const selectedMarital = document.getElementById('bankNo').value;

    if (name == "" || dob == "" || email == "" || address == "" || phoneNo == "" || bankNo == "") {
        alert('Please fill in all required fields.');
        return;
    }

    const confirmed = window.confirm('Please ensure the details are correct.\nAre you sure you want to update your details?');

    if (!confirmed) {
        return;
    }

    let gender;

    // For Gender
    const genderInput = document.getElementById('genderInput');
    if (genderInput.style.display === 'block') {
        gender = document.getElementById('gender').value;
    } else {
        const genderChosen = document.getElementsByName('User_gender');
        for (const radio of genderChosen) {
            if (radio.checked) {
                gender = radio.value;
                break;
            }
        }
    }

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
                        address: address,
                        phoneNo: phoneNo,
                        bankType: bankType,
                        bankNo: bankNo,
                        marital_status: selectedMarital,
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