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

// Fetch Leave details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchLeaveDetails = async function () {
        const LeaveTable = document.getElementById('leaveTable');

        const leaveRef = collection(firestore, 'leave');
        const querySnapshot = await getDocs(query(leaveRef, orderBy('leave_id', 'asc')));

        querySnapshot.forEach(async (doc) => {
            const leave = doc.data();

            const newRow = LeaveTable.insertRow();
            newRow.innerHTML = `
                <td>${leave.leave_id}</td>
                <td id="nameCol">${leave.leave_name}</td>
                <td id="typeCol">${leave.leave_type}</td>
                <td id="creditCol">${leave.leave_credit}</td>
                <td>${leave.leave_desc}</td>
                <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="editleave('${leave.leave_id}')"><i class='material-icons'>edit</i></button></td>
                <td class="actioncol" id="actioncol2"><button class="editbtn" onclick="deleteleave('${leave.leave_id}')"><i class='material-icons'>delete</i></button></td>
                `;
        });
    }
});

// For genetrate Leave ID
async function generateNewID() {
    const leaveRef = collection(firestore, 'leave');
    const querySnapshot = await getDocs(query(leaveRef, orderBy('leave_id', 'desc'), limit(1)));

    let newID = 'L00001';

    if (!querySnapshot.empty) {
        const lastID = querySnapshot.docs[0].data().leave_id;
        const numericPart = parseInt(lastID.slice(1), 10) + 1;

        const formattedNumericPart = String(numericPart).padStart(5, '0');

        // Combine the prefix and the numeric part
        newID = `L${formattedNumericPart}`;
    }
    return newID;
}

// Add Leave
window.addleave = async function (event) {
    event.preventDefault();

    // Get Leave details from the form
    const name = document.getElementById("name").value;
    const credit = document.getElementById("credit").value;
    const description = document.getElementById("desc").value;
    const selectedType = document.getElementById("typeOption").value;

    // Validate fields
    if (name == "" || credit == "" || selectedType == "") {
        alert('Please enter all fields and select a leave type !');
        return;
    }

    const leaveID = await generateNewID();

    addDoc(collection(firestore, "leave"), {
        leave_id: leaveID,
        leave_name: name,
        leave_credit: credit,
        leave_desc: description,
        leave_type: selectedType,
    })
        .then(function (docRef) {
            alert("Leave added ", docRef.uid);

            toRefresh();
        })
        .catch(function (error) {
            console.error("Error adding Leave: ", error);
            alert("Error adding Leave: ", error);
        });

    // Clear form
    document.getElementById("overlay").style.display = "none";
    document.getElementById("name").value = "";
    document.getElementById("credit").value = "";
    document.getElementById("desc").value = "";

    document.getElementById("typeOption").value = "<option value=''>Select Type</option>";
}

// For Edit button
window.editleave = async function (leaveId) {
    const leaveRef = collection(firestore, 'leave');
    const q = query(leaveRef, where('leave_id', '==', leaveId));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const leaveData = doc.data();

                    document.getElementById("leaveID").value = leaveData.leave_id;
                    document.getElementById("editName").value = leaveData.leave_name;
                    document.getElementById("editCredit").value = leaveData.leave_credit;
                    document.getElementById("editTypeOption").value = leaveData.leave_type;
                    document.getElementById("editDesc").value = leaveData.leave_desc;

                    document.getElementById("editOverlay").style.display = "block";
                    document.getElementById("overlayBg").style.display = "block";
                });
            } else {
                console.log('leave document does not exist');
            }
        })
        .catch((error) => {
            console.log('Error fetching leave profile:', error);
        });
}

window.saveChanges = async function () {
    const leaveID = document.getElementById("leaveID").value;
    const newName = document.getElementById("editName").value;
    const newCredit = document.getElementById("editCredit").value;
    const newType = document.getElementById("editTypeOption").value;
    const newDesc = document.getElementById("editDesc").value;

    // Validate fields
    if (newName == "" || newCredit == "" || newType == "") {
        alert('Please enter all fields and select a leave and position !');
        return;
    }

    // Update in Firestore
    const leaveRef = collection(firestore, 'leave');
    const q = query(leaveRef, where('leave_id', '==', leaveID));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const leaveRef = doc.ref;
                    return updateDoc(leaveRef, {
                        leave_name: newName,
                        leave_credit: newCredit,
                        leave_type: newType,
                        leave_desc: newDesc,
                    })
                        .then(() => {
                            console.log("Leave details updated successfully");
                            document.getElementById("editOverlay").style.display = "none";
                            document.getElementById("overlayBg").style.display = "none";

                            toRefresh();
                        })
                        .catch((error) => {
                            console.error("Error updating leave details:", error);
                        });
                });
            } else {
                console.log('leave document does not exist');
            }
        })
        .catch((error) => {
            console.log('Error fetching leave profile:', error);
        });
}

// For delete leave
window.deleteleave = async function (leaveId) {
    if (confirm("Are you sure you want to delete this leave?")) {
        const leaveRef = collection(firestore, 'leave');
        const q = query(leaveRef, where('leave_id', '==', leaveId));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const leaveRef = doc.ref;
                        deleteDoc(leaveRef)
                            .then(() => {
                                console.log("Leave deleted successfully");
                                alert("Leave deleted successfully");

                                toRefresh();
                            })
                            .catch((error) => {
                                console.error("Error deleting leave:", error);
                            });
                    });
                } else {
                    console.log('leave document does not exist');
                }
            })
            .catch((error) => {
                console.log('Error fetching leave profile:', error);
            });
    }
}

// For Search
function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("leaveTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[1];
        const typeColumn = rows[i].getElementsByTagName("td")[2];

        if (nameColumn || typeColumn) {
            const nameText = nameColumn.textContent || nameColumn.innerText;
            const typeText = typeColumn.textContent || typeColumn.innerText;

            if (nameText.toUpperCase().indexOf(filter) > -1 || typeText.toUpperCase().indexOf(filter) > -1) {
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