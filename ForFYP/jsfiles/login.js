// Import the functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

console.log("login.js is running");

let isRecaptchaVerified = false;

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

window.sendCheck = function (event) {
    var number = document.getElementById('User_phone').value;
    const toCheckNum = `60${number}`;
    const PhoneNumber = `+60${number}`;

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

    signInWithPhoneNumber(auth, PhoneNumber, window.recaptchaVerifier)
        .then(function (confirmationResult) {
            window.confirmationResult = confirmationResult;

            document.getElementById('sender').style.display = 'none';
            document.getElementById('verifier').style.display = 'block';

            console.log("OTP Sent");
            alert("OTP Sent, please check your phone :D");
        }).catch(function (error) {
            console.error(error);
            alert("Failed to send OTP. Please try again later.");
        });
}

function setRecaptchaVerified() {
    isRecaptchaVerified = true;
}

window.codeverify = function (event) {
    event.preventDefault();

    var code = document.getElementById('verifyCode').value;

    if (!window.confirmationResult) {
        alert('Please send an OTP first.');
        return;
    }

    window.confirmationResult.confirm(code)
        .then(function () {
            console.log('OTP Verified');
            alert("User Verified! Welcome to HRConnect Pro");
            window.location.href = "dashboard.php";
        }).catch(function () {
            alert("OTP Not correct! Please verify again");
            console.log('OTP Not correct');
        });
}

window.onload = initRecaptcha;