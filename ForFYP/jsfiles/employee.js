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

// Fetch Employee details
document.addEventListener("DOMContentLoaded", function () {
    window.fetchUserDetails = async function () {
        const employeeTable = document.getElementById('userTable');

        const usersRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersRef);

        querySnapshot.forEach(async (doc) => {
            const user = doc.data();
            const depID = user.dep_id;
            const posID = user.pos_id;

            const depRef = collection(firestore, 'department');
            const q = query(depRef, where('dep_id', '==', depID));
            const depSnapshot = await getDocs(q);

            const posRef = collection(firestore, 'positions');
            const q2 = query(posRef, where('pos_id', '==', posID));
            const posSnapshot = await getDocs(q2);

            if (!depSnapshot.empty && !posSnapshot.empty) {
                const depData = depSnapshot.docs[0].data();
                const depName = depData.dep_name;

                const posData = posSnapshot.docs[0].data();
                const posName = posData.pos_desc;

                const newRow = employeeTable.insertRow();
                newRow.innerHTML = `
                        <td>${user.uid}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.phoneNo}</td>
                        <td>${posName}</td>
                        <td>${depName}</td>
                        <td><button onclick="editUser('${doc.uid}')">Edit</button></td>
                    `;
            } else {
                console.log("Cannot fetch");
            }
        });
    }
});


// For Edit button
function editUser(userId) {
    // Implement code to populate the form fields for editing the selected user
    // You can use the "userId" to fetch user details from the database
    // and populate the form fields in the overlay form.
}