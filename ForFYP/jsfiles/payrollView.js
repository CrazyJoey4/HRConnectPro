import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

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
const storage = getStorage(firebaseApp);

var userId = localStorage.getItem('userId');

// Fetch Payroll details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchPayrollDetails = async function () {
        const payrollTable = document.getElementById('payrollTable');

        const payRef = collection(firestore, 'payroll');
        const q = query(payRef, where('uid', '==', userId));
        const paySnapshot = await getDocs(q);

        if (!paySnapshot.empty) {
            paySnapshot.forEach((doc) => {
                const payData = doc.data();
                const payFile = payData.pay_doc_url;
                const payName = payData.pay_id;

                const newRow = payrollTable.insertRow();
                newRow.innerHTML = `
                    <td>${payData.pay_id}</td>
                    <td class="dateCol">${payData.pay_date}</td>
                    <td id="fileCol"><a href="${payFile}" target="_blank">${payName}.pdf</a></td>
                `;
            });
        }
    }
});


// For Search
function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("payrollTable");
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
