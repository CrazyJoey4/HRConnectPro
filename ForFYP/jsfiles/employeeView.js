import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
const firestore = getFirestore(firebaseApp);

var userId = localStorage.getItem('userId');

// Fetch Specific Employee details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchEmployeeDetails = async function () {
        const employeeTable = document.getElementById('userTable');

        const usersRef = collection(firestore, 'users');
        const q = await query(usersRef, where('uid', '==', userId));

        try {
            const Snapshot = await getDocs(q);
            if (!Snapshot.empty) {
                Snapshot.forEach(async (doc) => {
                    const user = doc.data();
                    const depID = user.dep_id;

                    const depRef = collection(firestore, 'users');
                    const q = query(depRef, where('dep_id', '==', depID));
                    const depSnapshot = await getDocs(q);

                    depSnapshot.forEach(async (doc) => {
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
                                    <td id="nameCol">${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.phoneNo}</td>
                                    <td>${posName}</td>
                                    <td>${depName}</td>
                                `;
                        } else {
                            console.log("Cannot fetch");
                        }
                    });


                });
            }
        } catch (error) {
            console.error("Error getting positions: ", error);
        }
    }
});


// For Search
function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("userTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[1];
        const emailColumn = rows[i].getElementsByTagName("td")[2];

        if (nameColumn || emailColumn) {
            const nameText = nameColumn.textContent || nameColumn.innerText;
            const emailText = emailColumn.textContent || emailColumn.innerText;

            if (nameText.toUpperCase().indexOf(filter) > -1 || emailText.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// Attach an event listener to the search input field
document.getElementById("searchInput").addEventListener("keyup", filterTable);


function toRefresh() {
    setTimeout(() => {
        location.reload();
    }, 1000);
}