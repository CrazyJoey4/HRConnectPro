// Import the functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
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

// Initialize Firebase and export the firebaseApp object
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

let isRecaptchaVerified = false;

document.addEventListener('DOMContentLoaded', function () {
    fetch('countries.json')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                const countryCodeSelect = document.getElementById('countryCode');

                // Loop through the data and add options to the select element
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.dial_code;

                    // Create a <span> element for the flag icon
                    const flagIcon = document.createElement('i');
                    flagIcon.className = `flag-icon flag-icon-${item.code.toLowerCase()}`;

                    // Append the flag <span> and the text to the option element
                    option.appendChild(flagIcon);
                    option.appendChild(document.createTextNode(`${item.name} (${item.dial_code})`));

                    // Append the option to the select element
                    countryCodeSelect.appendChild(option);
                });
            } else {
                console.error('Invalid JSON format: data is not an array.');
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing country codes:', error);
        });
});

// Validation
function initRecaptcha() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'expired-callback': () => {
            // Recaptcha verification expired
            alert("reCAPTCHA verification expired. Please refresh the page and try again.");
            location.reload();
        }
    });
    window.recaptchaVerifier.render();
    window.recaptchaVerifier.verify().then(setRecaptchaVerified);
}

function isValidPhoneNumber(phoneNumber) {
    const phonePattern = /^\d{9,10}$/;
    return phonePattern.test(phoneNumber);
}

document.getElementById('User_phone').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendCheck();
    }
});

document.getElementById('verifyCode').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        codeVerify();
    }
});

window.sendCheck = function (event) {
    var number = document.getElementById('User_phone').value;
    var code = document.getElementById('countryCode').value;
    var woPlus = code.slice(1);

    const toCheckNum = `${woPlus}${number}`;
    const PhoneNumber = `${code}${number}`;

    if (number.trim() === '') {
        alert('Please enter a phone number.');
        return;
    }

    if (!isValidPhoneNumber(number)) {
        alert('Please enter a valid phone number.');
        return;
    }

    if (!isRecaptchaVerified) {
        alert('Please complete the reCAPTCHA.');
        return;
    }


    // Check if the phone number exists in Firestore
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('phoneNo', '==', toCheckNum));

    getDocs(q)
        .then((Snapshot) => {
            if (Snapshot.size === 0) {
                alert("User Unauthorized.\nPlease reach to Admin for the issue.");
            }
            else {
                const uid = Snapshot.docs[0].data().uid;
                localStorage.setItem('userId', uid);

                signInWithPhoneNumber(auth, PhoneNumber, window.recaptchaVerifier)
                    .then(function (confirmationResult) {
                        window.confirmationResult = confirmationResult;

                        document.getElementById('sender').style.display = 'none';
                        document.getElementById('verifier').style.display = 'block';

                        console.log("OTP Sent");
                        alert("OTP Sent, please check your phone :D");
                    }).catch(function (error) {
                        console.error("Error sending OTP: ", error);
                        alert("Failed to send OTP. Please try again later.");
                    });
            }
        }).catch((error) => {
            console.error("Error checking phone number in Firestore: ", error);
            alert("An error occurred. Please try again later.");
        });
}

function setRecaptchaVerified() {
    isRecaptchaVerified = true;
}

window.codeVerify = function (event) {
    var code = document.getElementById('verifyCode').value;

    if (!window.confirmationResult) {
        alert('Please send an OTP first.');
        return;
    }

    window.confirmationResult.confirm(code)
        .then(function (success) {
            console.log('OTP Verified');

            alert("User Verified! Welcome to HRConnect Pro");
            window.location.href = "dashboard.php";

        }).catch(function (error) {
            alert("OTP Not correct! Please verify again\n", error);
            console.log('OTP Not correct');
        });
}

window.onload = initRecaptcha;