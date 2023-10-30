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
        const querySnapshot = await getDocs(query(payRef));

        querySnapshot.forEach((doc) => {
            const payData = doc.data();

            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('uid', '==', payData.uid));
            getDocs(q)
                .then(async (userQuerySnapshot) => {
                    if (!userQuerySnapshot.empty) {
                        const userData = userQuerySnapshot.docs[0].data();
                        const depID = userData.dep_id;
                        const userName = userData.name;

                        const payFile = payData.pay_doc_url;
                        const payName = payData.pay_id;

                        const depRef = collection(firestore, 'department');
                        const q = query(depRef, where('dep_id', '==', depID));
                        const depSnapshot = await getDocs(q);

                        if (!depSnapshot.empty) {
                            const depData = depSnapshot.docs[0].data();
                            const depName = depData.dep_name;

                            const newRow = payrollTable.insertRow();
                            newRow.innerHTML = `
                            <td>${payData.uid}</td>
                            <td id="nameCol">${userName}</td>
                            <td>${depName}</td>
                            <td class="dateCol">${payData.pay_date}</td>
                            <td id="fileCol"><a href="${payFile}" target="_blank">${payName}.pdf</a></td>
                            <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="editPay('${payData.pay_id}')"><i class='material-icons'>edit</i></button></td>
                            <td class="actioncol" id="actioncol2"><button class="editbtn" onclick="deletePay('${payData.pay_id}')"><i class='material-icons'>delete</i></button></td>
                        `;
                        }
                    }
                });
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

// For fetching employee
async function generatePos(selectedDep) {
    const empSelect = document.getElementById("empOption");

    empSelect.innerHTML = "<option>Select Employee</option>";

    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("dep_id", "==", selectedDep));

    try {
        const Snapshot = await getDocs(q);
        if (!Snapshot.empty) {
            Snapshot.forEach((doc) => {
                const empData = doc.data();
                const option = document.createElement("option");
                option.value = empData.uid;
                option.text = empData.name;
                empSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error getting users: ", error);
    }
}

const depInput = document.getElementById('depOption');
depInput.addEventListener('change', function () {
    handleDepartmentChange();
});

// For generate employee
function handleDepartmentChange() {
    const depSelect = document.getElementById("depOption");
    const selectedDep = depSelect.value;

    generatePos(selectedDep);
}

// For genetrate Payroll ID
async function generateNewID() {
    const PaysRef = collection(firestore, 'payroll');
    const querySnapshot = await getDocs(query(PaysRef, orderBy('pay_id', 'desc'), limit(1)));

    let newUID = 'PR00001';

    if (!querySnapshot.empty) {
        const lastUID = querySnapshot.docs[0].data().pay_id;
        const numericPart = parseInt(lastUID.slice(2), 10) + 1;

        if (!isNaN(numericPart)) {
            const formattedNumericPart = String(numericPart).padStart(5, '0');
            newUID = `PR${formattedNumericPart}`;
        } else {
            console.error("Failed to parse numeric part of the ID.");
        }
    }
    return newUID;
}

// Add Payroll
window.addPay = async function (event) {
    event.preventDefault();

    // Get payroll details from the form
    const selectedEmp = document.getElementById("empOption").value;
    const payDoc = document.getElementById("empPayDoc").files[0];
    const payDate = new Date().toISOString().split('T')[0];

    // Validate fields
    if (selectedEmp == "" || !payDoc) {
        alert('Please select an employee and upload the file !');
        return;
    }

    const PayID = await generateNewID();

    // Create a storage reference for the payroll document
    const storageRef = ref(storage, `payroll/${PayID}`);

    // Upload the payroll document to Firebase Storage
    const uploadTask = uploadBytes(storageRef, payDoc);

    uploadTask
        .then(async (snapshot) => {
            const downloadURL = await getDownloadURL(snapshot.ref);

            addDoc(collection(firestore, "payroll"), {
                pay_id: PayID,
                uid: selectedEmp,
                pay_date: payDate,
                pay_doc_url: downloadURL,
            })
                .then(function (docRef) {
                    alert("Payslip added!");

                    toRefresh();
                })
                .catch(function (error) {
                    console.error("Error adding payroll: ", error);
                    alert("Error adding payroll: ", error);
                });
        })
        .catch(function (error) {
            console.error("Error uploading payroll document: ", error);
            alert("Error uploading payroll document: ", error);
        });

    // Clear form
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlayBg").style.display = "none";
    document.getElementById("depOption").value = "<option value=''>Select Department</option>";
    document.getElementById("empOption").value = "<option value=''>Select Employee</option>";
    document.getElementById("empPayDoc").value = "";
}



// For Edit button
window.editPay = async function (payId) {
    const payRef = collection(firestore, 'payroll');
    const q = query(payRef, where('pay_id', '==', payId));

    getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
                const payData = doc.data();

                const depRef = collection(firestore, 'users');
                const q = query(depRef, where('uid', '==', payData.uid));
                const userSnapshot = await getDocs(q);

                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    const userName = userData.name;

                    document.getElementById("empID").value = payData.uid;
                    document.getElementById("payID").value = payData.pay_id;
                    document.getElementById("editName").value = userName;

                    document.getElementById("editOverlay").style.display = "block";
                    document.getElementById("overlayBg").style.display = "block";
                } else {
                    console.log("Cannot fetch");
                }
            });
        } else {
            console.log('User document does not exist');
        }
    }).catch((error) => {
        console.log('Error fetching user profile:', error);
    });
}

// For Save edited details
window.saveUserChanges = async function () {
    const payID = document.getElementById("payID").value;
    const userID = document.getElementById("empID").value;
    const newPayDocInput = document.getElementById("editPayDoc").files[0];
    const newPayDate = new Date().toISOString().split('T')[0];

    // Validate fields
    if (!newPayDocInput) {
        alert('Please upload the updated payroll file!');
        return;
    }

    const storageRef = ref(storage, `payroll/${payID}`);

    try {
        const uploadTask = uploadBytes(storageRef, newPayDocInput);
        uploadTask.then(async (snapshot) => {
            const downloadURL = await getDownloadURL(snapshot.ref);

            const payRef = collection(firestore, 'payroll');
            const q2 = query(payRef, where('uid', '==', userID));

            getDocs(q2)
                .then((paySnapshot) => {
                    if (!paySnapshot.empty) {
                        const payDocRef = paySnapshot.docs[0].ref;
                        return updateDoc(payDocRef, {
                            pay_date: newPayDate,
                            pay_doc_url: downloadURL,
                        }).then(() => {
                            alert("Payroll file updated successfully");
                        }).catch((error) => {
                            console.error("Error updating payroll file:", error);
                        });
                    }
                }).catch((error) => {
                    console.error('Error fetching payroll details:', error);
                });

            document.getElementById("editOverlay").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";

            toRefresh();
        });
    } catch (error) {
        console.error("Error uploading payroll file:", error);
    }
}


// For delete payroll
window.deletePay = async function (payrollId) {
    if (confirm("Are you sure you want to delete this payslip?")) {
        const PayRef = collection(firestore, 'payroll');
        const q = query(PayRef, where('pay_id', '==', payrollId));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const userRef = doc.ref;
                        deleteDoc(userRef)
                            .then(() => {
                                console.log("Payslip record deleted successfully");
                                alert("Payslip record deleted successfully");

                                toRefresh();
                            })
                            .catch((error) => {
                                console.error("Error deleting Payslip:", error);
                            });
                    });
                } else {
                    console.log('Payslip document does not exist');
                }
            })
            .catch((error) => {
                console.log('Error fetching Payslip record:', error);
            });
    }
}

// For Search
function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("payrollTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[1];
        const departmentColumn = rows[i].getElementsByTagName("td")[2];

        if (nameColumn || departmentColumn) {
            const nameText = nameColumn.textContent || nameColumn.innerText;
            const depText = departmentColumn.textContent || departmentColumn.innerText;

            if (nameText.toUpperCase().indexOf(filter) > -1 || depText.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// Attach an event listener to the search input field
document.getElementById("searchInput").addEventListener("keyup", filterTable);


window.addEventListener('DOMContentLoaded', function () {
    generateDep();
    checkAuth();
});

function toRefresh() {
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// For avoid employee enter without access
async function checkAuth() {
    var userId = localStorage.getItem('userId');
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

            }
            else {
                window.location.assign('dashboard.php');
            }
        } else {
            console.log("Cannot fetch");
        }
    });
}