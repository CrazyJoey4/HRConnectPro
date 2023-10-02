import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchUserDetails = async function () {
        const employeeTable = document.getElementById('leaveTable');

        const leaveRef = collection(firestore, 'leave');
        const querySnapshot = await getDocs(leaveRef);

        querySnapshot.forEach(async (doc) => {
            const leave = doc.data();

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
                        <td><button onclick="editUser('${userId}')">Edit</button></td>
                    `;

                console.log(userId);
            } else {
                console.log("Cannot fetch");
            }
        });
    }
});

// For fetching departments
async function generateDep() {
    const depSelect = document.getElementById("depOption");

    const depRef = collection(firestore, 'department');
    const querySnapshot = await getDocs(depRef);

    querySnapshot.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.data().dep_id;
        option.text = doc.data().dep_name;
        depSelect.appendChild(option);
    });
}

// For fetching positions
function generatePos(selectedDep) {
    console.log(selectedDep);
    const posSelect = document.getElementById("posOption");
    posSelect.innerHTML = "<option>Select Position</option>";

    const positionsRef = collection(firestore, "positions");
    const q = query(positionsRef, where("dep_id", "==", selectedDep));

    getDocs(q)
        .then((Snapshot) => {
            if (!Snapshot.empty) {
                Snapshot.forEach((doc) => {
                    const posData = doc.data();
                    const option = document.createElement("option");
                    option.value = posData.pos_id;
                    option.text = posData.pos_desc;
                    posSelect.appendChild(option);
                })
            }
        }).catch((error) => {
            console.error("Error getting positions: ", error);
        });
}

const depInput = document.getElementById('depOption');
depInput.addEventListener('change', function () {
    handleDepartmentChange();
});

function handleDepartmentChange() {
    const depSelect = document.getElementById("depOption");
    const selectedDep = depSelect.value;

    generatePos(selectedDep);
}

// For genetrate Employee ID
async function generateNewUID() {
    const usersRef = collection(firestore, 'users');
    const querySnapshot = await getDocs(query(usersRef, orderBy('uid', 'desc'), limit(1)));

    let newUID = 'EMP_001';

    if (!querySnapshot.empty) {
        const lastUID = querySnapshot.docs[0].data().uid;
        const numericPart = parseInt(lastUID.slice(4), 10) + 1;

        const formattedNumericPart = String(numericPart).padStart(3, '0');

        // Combine the prefix and the numeric part
        newUID = `EMP_${formattedNumericPart}`;
    }
    return newUID;
}

// Add Employee
window.addEmp = async function (event) {
    event.preventDefault();

    // Get employee details from the form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phoneNo = document.getElementById("phoneNo").value;
    const salary = document.getElementById("salary").value;

    const selectedDep = document.getElementById("depOption").value;
    const selectedPos = document.getElementById("posOption").value;

    // Validate the email field
    if (name == "" || email == "" || phoneNo == "" || selectedDep === "" || selectedPos === "" || salary === "") {
        alert('Please enter all fields and select a department and position !');
        return;
    }

    if (validate_phone(phoneNo) == false) {
        alert('Please enter a valid phone number!');
        return;
    }

    if (validate_email(email) == false) {
        alert('Please enter a valid email!');
        return;
    }

    const userID = await generateNewUID();
    const currentDate = new Date().toISOString().split('T')[0];

    // Add employee data to Firestore
    addDoc(collection(firestore, "users"), {
        name: name,
        email: email,
        phoneNo: phoneNo,
        salary: salary,
        dep_id: selectedDep,
        pos_id: selectedPos,

        uid: userID,
        hire_date: currentDate,
        emp_status_id: "1",
        leave_balance: "",

        gender: "",
        dob: "",
        address: "",
        bankType: "",
        bankNo: "",
        marital_status: "",
    })
        .then(function (docRef) {
            console.log("Employee added with ID: ", docRef.id);
            alert("Employee added with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding employee: ", error);
            alert("Error adding employee: ", error);
        });

    // Clear the form and close the overlay
    document.getElementById("overlay").style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneNo").value = "";
    document.getElementById("salary").value = "";

    document.getElementById("depOption").value = "<option>Select Department</option>";
    document.getElementById("posOption").value = "<option>Select Position</option>";
}



// For Edit button
function editUser(userId) {
    console.log(userId);
}

// Validate Functions
function validate_email(email) {
    var expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
        return true;
    } else {
        return false;
    }
}

function validate_phone(phoneNumber) {
    const phonePattern = /^\d{10,11}$/;
    return phonePattern.test(phoneNumber);
}

window.addEventListener('DOMContentLoaded', function () {
    generateDep();
});