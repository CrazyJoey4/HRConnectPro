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
// var userId = "EMP_005";


window.addEventListener('DOMContentLoaded', function () {
    checkLoggedIn();
    getName();
    getPosition();
});


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
                    UserName.textContent = userData.name;
                });
            } else {
                console.log('User document does not exist');
            }
        }).catch((error) => {
            console.log('Error fetching position:', error);
        });
}

// For get position
async function getPosition() {
    const usersRef = collection(firestore, 'users');
    const q = await getDocs(query(usersRef, where('uid', '==', userId)));

    q.forEach(async (doc) => {
        const user = doc.data();
        const depID = user.dep_id;
        const posID = user.pos_id;

        const depRef = collection(firestore, 'department');
        const q = query(depRef, where('dep_id', '==', depID));
        const depSnapshot = await getDocs(q);

        if (!depSnapshot.empty) {
            const currentPage = window.location.pathname.split('/').pop();
            const depData = depSnapshot.docs[0].data();
            const isHRManager = depData.manager_pid === posID;

            if (isHRManager) {
                document.getElementById("management_part").style.display = "block";

                const departmentTab = document.createElement('li');
                departmentTab.innerHTML = `<a href="depManagePage.php" ${currentPage === 'depManagePage.php' ? 'class="active"' : ''}><span class="fa fa-building"></span> Department </a>`;
                const managePart = document.querySelector('.sidenav .management_tab');

                managePart.insertBefore(departmentTab, managePart.firstChild);
            }
        } else {
            console.log("Cannot fetch");
        }
    });
}