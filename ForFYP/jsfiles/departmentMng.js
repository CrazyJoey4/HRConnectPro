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

// Fetch department details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchDepDetails = async function () {
        const DepTable = document.getElementById('depTable');

        const depRef = collection(firestore, 'department');
        const querySnapshot = await getDocs(query(depRef, orderBy('dep_id', 'asc')));

        querySnapshot.forEach(async (doc) => {
            const department = doc.data();

            const newRow = DepTable.insertRow();
            newRow.innerHTML = `
                <td>${department.dep_id}</td>
                <td id="nameCol">${department.dep_name}</td>
                <td>${department.manager_pid}</td>
                <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="editdep('${department.dep_id}')"><i class='material-icons'>edit</i></button></td>
                <td class="actioncol" id="actioncol2"><button class="editbtn" onclick="deletedep('${department.dep_id}')"><i class='material-icons'>delete</i></button></td>
                `;
        });
    }
});

// Fetch position details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchPosDetails = async function () {
        const PosTable = document.getElementById('posTable');

        const posRef = collection(firestore, 'positions');
        const querySnapshot = await getDocs(query(posRef, orderBy('pos_id', 'asc')));

        querySnapshot.forEach(async (doc) => {
            const position = doc.data();
            const depID = position.dep_id;

            const depRef = collection(firestore, 'department');
            const q = query(depRef, where('dep_id', '==', depID));
            const depSnapshot = await getDocs(q);

            if (!depSnapshot.empty) {
                const depData = depSnapshot.docs[0].data();
                const depName = depData.dep_name;

                const newRow = PosTable.insertRow();
                newRow.innerHTML = `
                    <td>${position.pos_id}</td>
                    <td id="nameCol">${depName}</td>
                    <td id="nameCol">${position.pos_desc}</td>
                    <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="editpos('${position.pos_id}')"><i class='material-icons'>edit</i></button></td>
                    <td class="actioncol" id="actioncol2"><button class="editbtn" onclick="deletepos('${position.pos_id}')"><i class='material-icons'>delete</i></button></td>
                `;
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

// For genetrate department ID
async function generateNewID() {
    const usersRef = collection(firestore, 'department');
    const querySnapshot = await getDocs(query(usersRef, orderBy('dep_id', 'desc'), limit(1)));

    let newID = 'DEP_001';

    if (!querySnapshot.empty) {
        const lastID = querySnapshot.docs[0].data().dep_id;
        const numericPart = parseInt(lastID.slice(4), 10) + 1;

        const formattedNumericPart = String(numericPart).padStart(3, '0');

        // Combine the prefix and the numeric part
        newID = `DEP_${formattedNumericPart}`;
    }
    return newID;
}

// For genetrate manager position ID
async function generateNewPID() {
    const posRef = collection(firestore, 'positions');
    const querySnapshot = await getDocs(query(posRef, orderBy('pos_id', 'desc'), limit(1)));

    let newID = 'P00001';

    if (!querySnapshot.empty) {
        const lastID = querySnapshot.docs[0].data().pos_id;
        const numericPart = parseInt(lastID.slice(1), 10) + 1;

        const formattedNumericPart = String(numericPart).padStart(5, '0');

        // Combine the prefix and the numeric part
        newID = `P${formattedNumericPart}`;
    }
    return newID;
}

// Add department
window.adddep = async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;

    // Validate fields
    if (name == "") {
        alert('Please enter the name !');
        return;
    }

    const depID = await generateNewID();
    const managerPID = await generateNewPID();

    addDoc(collection(firestore, "department"), {
        dep_id: depID,
        dep_name: name,
        manager_pid: managerPID,
    })
        .then(async function (docRef) {
            alert("Department added : ", docRef.dep_name);

            const posName = `${name} Manager`;

            // Add position data to Firestore
            await addDoc(collection(firestore, "positions"), {
                pos_id: managerPID,
                pos_desc: posName,
                dep_id: depID,
            });

            toRefresh();
        })
        .catch(function (error) {
            console.error("Error adding department: ", error);
            alert("Error adding department: ", error);
        });

    // Clear the form and close the overlay
    document.getElementById("overlay").style.display = "none";
    document.getElementById("name").value = "";
}

// Add position
window.addpos = async function (event) {
    event.preventDefault();

    const name = document.getElementById("posName").value;
    const selectedDep = document.getElementById("depOption").value;

    // Validate fields
    if (name == "" || selectedDep == "") {
        alert('Please enter the position name and select a department !');
        return;
    }

    const posID = await generateNewPID();

    addDoc(collection(firestore, "positions"), {
        dep_id: selectedDep,
        pos_desc: name,
        pos_id: posID,
    })
        .then(async function () {
            alert("Position added : ", name);

            toRefresh();
        })
        .catch(function (error) {
            console.error("Error adding department: ", error);
            alert("Error adding department: ", error);
        });

    // Clear form
    document.getElementById("overlay").style.display = "none";
    document.getElementById("name").value = "";
}



// For Edit department button
window.editdep = async function (depId) {
    const depRef = collection(firestore, 'department');
    const q = query(depRef, where('dep_id', '==', depId));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const depData = doc.data();

                    document.getElementById("depID").value = depData.dep_id;
                    document.getElementById("editName").value = depData.dep_name;

                    document.getElementById("editOverlay").style.display = "block";
                    document.getElementById("overlayBg").style.display = "block";
                });
            } else {
                console.log('department document does not exist');
            }
        })
        .catch((error) => {
            console.log('Error fetching dep profile:', error);
        });
}

window.saveDepChanges = async function () {
    const depID = document.getElementById("depID").value;
    const newName = document.getElementById("editName").value;

    // Validate fields
    if (newName == "") {
        alert('Please enter the name !');
        return;
    }

    // Update in Firestore
    const depRef = collection(firestore, 'department');
    const q = query(depRef, where('dep_id', '==', depID));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const depRef = doc.ref;
                    return updateDoc(depRef, {
                        dep_name: newName,
                    })
                        .then(() => {
                            console.log("Department details updated successfully");
                            document.getElementById("editOverlay").style.display = "none";
                            document.getElementById("overlayBg").style.display = "none";

                            toRefresh();
                        })
                        .catch((error) => {
                            console.error("Error updating details:", error);
                        });
                });
            } else {
                console.log('Department document does not exist');
            }
        })
        .catch((error) => {
            console.log('Error fetching :', error);
        });
}

// For Edit position button
window.editpos = async function (posId) {
    const posRef = collection(firestore, 'positions');
    const q = query(posRef, where('pos_id', '==', posId));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (doc) => {
                    const posData = doc.data();
                    const depID = posData.dep_id;

                    const depRef = collection(firestore, 'department');
                    const q = query(depRef, where('dep_id', '==', depID));
                    const depSnapshot = await getDocs(q);

                    if (!depSnapshot.empty) {
                        const depData = depSnapshot.docs[0].data();
                        const depName = depData.dep_name;

                        document.getElementById("posID").value = posData.pos_id;
                        document.getElementById("depName").value = depName;
                        document.getElementById("editPosName").value = posData.pos_desc;

                        document.getElementById("editOverlay2").style.display = "block";
                        document.getElementById("overlayBg").style.display = "block";
                    } else {
                        console.log("Cannot fetch");
                    }
                });
            } else {
                console.log('Position document does not exist');
            }
        })
        .catch((error) => {
            console.log('Error fetching position :', error);
        });
}

window.savePosChanges = async function () {
    const posID = document.getElementById("posID").value;
    const newName = document.getElementById("editPosName").value;

    // Validate fields
    if (newName == "") {
        alert('Please enter the name !');
        return;
    }

    // Update in Firestore
    const posRef = collection(firestore, 'positions');
    const q = query(posRef, where('pos_id', '==', posID));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const posRef = doc.ref;
                    return updateDoc(posRef, {
                        pos_desc: newName,
                    })
                        .then(() => {
                            console.log("Position details updated successfully");

                            document.getElementById("editOverlay2").style.display = "none";
                            document.getElementById("overlayBg").style.display = "none";

                            toRefresh();
                        })
                        .catch((error) => {
                            console.error("Error updating details:", error);
                        });
                });
            } else {
                console.log('Position document does not exist');
            }
        })
        .catch((error) => {
            console.log('Error fetching :', error);
        });
}



// For delete department
window.deletedep = async function (depId) {
    if (confirm("Are you sure you want to delete this department?")) {
        const depRef = collection(firestore, 'department');
        const q = query(depRef, where('dep_id', '==', depId));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(async (doc) => {
                        const depRef = doc.ref;

                        const positionsRef = collection(firestore, 'positions');
                        const positionsQuery = query(positionsRef, where('dep_id', '==', depId));

                        try {
                            const positionsSnapshot = await getDocs(positionsQuery);
                            positionsSnapshot.forEach(async (positionDoc) => {
                                const positionRef = positionDoc.ref;
                                await deleteDoc(positionRef);
                            });
                        } catch (error) {
                            console.error("Error deleting related positions: ", error);
                        }

                        deleteDoc(depRef)
                            .then(() => {
                                console.log("Department deleted successfully");
                                alert("Department deleted successfully");

                                toRefresh();
                            })
                            .catch((error) => {
                                console.error("Error deleting :", error);
                            });
                    });
                } else {
                    console.log('Department document does not exist');
                }
            })
            .catch((error) => {
                console.log('Error fetching dep profile:', error);
            });
    }
}

// For delete position
window.deletepos = async function (posId) {
    if (confirm("Are you sure you want to delete this position?")) {
        const posRef = collection(firestore, 'positions');
        const q = query(posRef, where('pos_id', '==', posId));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const posRef = doc.ref;
                        deleteDoc(posRef)
                            .then(() => {
                                console.log("Position deleted successfully");
                                alert("Position deleted successfully");

                                toRefresh();
                            })
                            .catch((error) => {
                                console.error("Error deleting user:", error);
                            });
                    });
                } else {
                    console.log('User document does not exist');
                }
            })
            .catch((error) => {
                console.log('Error fetching user profile:', error);
            });
    }
}



// For Search
function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("depTable");
    const rows = table.getElementsByTagName("tr");

    const table2 = document.getElementById("posTable");
    const rows2 = table2.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[1];

        if (nameColumn) {
            const nameText = nameColumn.textContent || nameColumn.innerText;

            if (nameText.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }

    for (let i = 1; i < rows2.length; i++) {
        const nameColumn = rows2[i].getElementsByTagName("td")[1];

        if (nameColumn) {
            const nameText = nameColumn.textContent || nameColumn.innerText;

            if (nameText.toUpperCase().indexOf(filter) > -1) {
                rows2[i].style.display = "";
            } else {
                rows2[i].style.display = "none";
            }
        }
    }
}

// Attach an event listener to the search input field
document.getElementById("searchInput").addEventListener("keyup", filterTable);

window.addEventListener('DOMContentLoaded', function () {
    generateDep();
});

function toRefresh() {
    setTimeout(() => {
        location.reload();
    }, 1000);
}