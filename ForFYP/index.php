<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v2.1.9/css/unicons.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css">

    <link rel="stylesheet" href="cssfiles/loginStyle.css">
    <link rel="icon" href="media/hr-icon.png">

    <title>HRConnect Pro</title>
</head>

<body>
    <div class="login-block">
        <form class="loginForm">
            <div class="container">
                <img class="logo" src="media/HRLogoQuote(white).png" alt="HR-Logo" width="300px">
            </div>
            <div class="wrap">
                <div id="sender">
                    <div class="phoneInput">
                        <div class="InputOption">
                            <select class="countryCode" name="countryCode" id="countryCode"></select>
                        </div>
                        <div class="InputText">
                            <input type="text" name="User_phone" id="User_phone" autocomplete="off" required>
                            <label>Phone Number</label>
                        </div>
                    </div>

                    <div class="recaptcha" id="recaptcha-container"></div>

                    <div class="login-btn">
                        <input type="button" name="Send" id="Send" value="Send" class="login"
                            onclick="sendCheck(event)">
                    </div>
                </div>

                <div id="verifier" style="display: none">
                    <div class="InputText">
                        <input type="text" id="verifyCode" placeholder="OTP Code">
                        <label>OTP Code</label>
                    </div>

                    <div class="login-btn">
                        <input type="button" name="Sign" id="Sign" value="Sign In" class="login"
                            onclick="codeVerify(event)">
                    </div>
                </div>
            </div>
        </form>
    </div>

    <script src="https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.15.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore-compat.js"></script>

    <script type="module" src="jsfiles/login.js"></script>

    <script>
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
        const firebaseApp = firebase.initializeApp(firebaseConfig);
    </script>
</body>

</html>