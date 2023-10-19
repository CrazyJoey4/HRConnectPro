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


// Function to extract unique months and years from payroll records
function extractUniqueMonthsAndYears() {
    const months = new Set();
    const years = new Set();

    const payRef = collection(firestore, 'payroll');
    const querySnapshot = getDocs(payRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const payData = doc.data();
            const payDate = new Date(payData.pay_date);

            months.add(payDate.getMonth() + 1);
            years.add(payDate.getFullYear());
        });

        // Sort the unique months and years
        const uniqueMonths = Array.from(months).sort();
        const uniqueYears = Array.from(years).sort();

        // Populate the dropdowns with options
        populateDropdown("filterMonth", uniqueMonths);
        populateDropdown("filterYear", uniqueYears);
    });
}

// Function to populate a dropdown with options
function populateDropdown(dropdownId, values) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = "<option value=''>All</option>";

    values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.text = value;
        dropdown.appendChild(option);
    });
}

// Function to filter and display payroll records
function filterPayroll(month, year) {
    const payrollTable = document.getElementById('payrollTable');
    payrollTable.innerHTML = `
        <th class="idCol">ID</th>
        <th class="dateCol">Upload Date</th>
        <th class="fileCol">File</th>
        `;

    const payRef = collection(firestore, 'payroll');
    const querySnapshot = getDocs(payRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const payData = doc.data();
            const payDate = new Date(payData.pay_date);

            if (
                (month === "" || payDate.getMonth() + 1 === parseInt(month)) && (year === "" || payDate.getFullYear() === parseInt(year)) &&
                payData.uid === userId
            ) {
                const newRow = payrollTable.insertRow();
                newRow.innerHTML = `
                    <td>${payData.pay_id}</td>
                    <td class="dateCol">${payData.pay_date}</td>
                    <td id="fileCol"><a href="${payData.pay_doc_url}" target="_blank">${payData.pay_id}.pdf</a></td>
                `;
            }
        });
    });
}


// Add event listeners to the month and year dropdowns
const filterMonthDropdown = document.getElementById("filterMonth");
const filterYearDropdown = document.getElementById("filterYear");

filterMonthDropdown.addEventListener("change", function () {
    const selectedMonth = filterMonthDropdown.value;
    const selectedYear = filterYearDropdown.value;
    filterPayroll(selectedMonth, selectedYear);
});

filterYearDropdown.addEventListener("change", function () {
    const selectedMonth = filterMonthDropdown.value;
    const selectedYear = filterYearDropdown.value;
    filterPayroll(selectedMonth, selectedYear);
});

extractUniqueMonthsAndYears();
