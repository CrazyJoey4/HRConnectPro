import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

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

// Fetch Employee details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchUserDetails = async function () {
        const employeeTable = document.getElementById('userTable');

        const usersRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(query(usersRef, orderBy('uid', 'asc')));

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
                        <td id="nameCol">${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.phoneNo}</td>
                        <td>${posName}</td>
                        <td>${depName}</td>
                        <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="editUser('${user.uid}')"><i class='material-icons'>edit</i></button></td>
                        <td class="actioncol" id="actioncol2"><button class="editbtn" onclick="deleteUser('${user.uid}')"><i class='material-icons'>delete</i></button></td>
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
    const editdepSelect = document.getElementById("editDepOption");

    const depRef = collection(firestore, 'department');
    const querySnapshot = await getDocs(depRef);

    querySnapshot.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.data().dep_id;
        option.text = doc.data().dep_name;
        depSelect.appendChild(option);

        const editOption = document.createElement("option");
        editOption.value = doc.data().dep_id;
        editOption.text = doc.data().dep_name;
        editdepSelect.appendChild(editOption);
    });
}

// For fetching positions
async function generatePos(selectedDep) {
    const posSelect = document.getElementById("posOption");
    const editPosSelect = document.getElementById("editPosOption");

    posSelect.innerHTML = "<option>Select Position</option>";
    editPosSelect.innerHTML = "<option>Select Position</option>";

    const positionsRef = collection(firestore, "positions");
    const q = query(positionsRef, where("dep_id", "==", selectedDep));

    try {
        const Snapshot = await getDocs(q);
        if (!Snapshot.empty) {
            Snapshot.forEach((doc) => {
                const posData = doc.data();
                const option = document.createElement("option");
                option.value = posData.pos_id;
                option.text = posData.pos_desc;
                posSelect.appendChild(option);

                const editOption = document.createElement("option");
                editOption.value = posData.pos_id;
                editOption.text = posData.pos_desc;
                editPosSelect.appendChild(editOption);
            });
        }
    } catch (error) {
        console.error("Error getting positions: ", error);
    }
}

const depInput = document.getElementById('depOption');
depInput.addEventListener('change', function () {
    handleDepartmentChange();
});

const editdepInput = document.getElementById('editDepOption');
editdepInput.addEventListener('change', function () {
    handleDepartmentChange2();
});

// For generate position
function handleDepartmentChange() {
    const depSelect = document.getElementById("depOption");
    const selectedDep = depSelect.value;

    generatePos(selectedDep);
}

function handleDepartmentChange2() {
    const depSelect = document.getElementById("editDepOption");
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

window.addEmp = async function (event) {
    event.preventDefault();

    const name = document.getElementById("UserName").value;
    const email = document.getElementById("email").value;
    const constemail = document.getElementById("constEmail").value;
    const countryCode = document.getElementById("countryCode").value;
    const phoneNo = document.getElementById("phoneNo").value;
    const salary = document.getElementById("salary").value;
    const imageUploadInput = document.getElementById("imageUpload");
    const selectedDep = document.getElementById("depOption").value;
    const selectedPos = document.getElementById("posOption").value;

    if (name == "" || email == "" || phoneNo == "" || selectedDep == "" || selectedPos == "" || salary == "") {
        alert('Please enter all fields and select a department and position!');
        return;
    }

    let capitalizedName = name.toLowerCase().replace(/\b\w/g, function (l) {
        return l.toUpperCase();
    });

    var woPlus = countryCode.slice(1);

    if (validate_phone(phoneNo) == false) {
        alert('Please enter a valid phone number!');
        return;
    }

    const userID = await generateNewUID();
    const finalPhone = `${woPlus}${phoneNo}`
    const currentDate = new Date().toISOString().split('T')[0];
    const finalEmail = `${email}${constemail}`;

    const phoneDuplicate = await checkPhoneDuplicate(finalPhone);

    if (phoneDuplicate) {
        alert('The provided phone number is already associated with another employee. Please enter a unique phone number.');
        return;
    }

    const selectedFiles = imageUploadInput.files;
    const maxImages = 5;

    if (selectedFiles.length !== maxImages) {
        alert('Please select exactly 5 images for the employee.');
        return;
    }

    const imageRefs = [];
    let uploadedImageCount = 0;

    // Function to upload a single image
    function uploadImage(imageIndex) {
        const index = imageIndex + 1;
        const imageName = `employeeFace/${userID}/${index}.jpg`;
        const imageRef = ref(storage, imageName);

        const file = selectedFiles[imageIndex];
        const uploadTask = uploadBytesResumable(imageRef, file);

        return new Promise((resolve, reject) => {
            on(
                uploadTask,
                "state_changed",
                () => { },
                (error) => {
                    alert("Image upload error:", error);
                    console.error("Image upload error:", error);
                    reject(error);
                },
                () => {
                    alert("Image upload successful for image #" + (index));
                    console.log("Image upload successful for image #" + (index));
                    imageRefs.push(imageRef);
                    uploadedImageCount++;

                    if (uploadedImageCount === maxImages) {
                        resolve();
                    }
                }
            );
        });
    }

    // Use a loop to upload all images
    const uploadPromises = [];
    for (let i = 0; i < maxImages; i++) {
        uploadPromises.push(uploadImage(i));
    }

    console.log("All images uploaded successfully!");

    addDoc(collection(firestore, "users"), {
        name: capitalizedName,
        email: finalEmail,
        phoneNo: finalPhone,
        salary: salary,
        dep_id: selectedDep,
        pos_id: selectedPos,
        uid: userID,
        hire_date: currentDate,
        leave_balance: 0,
        gender: "",
        dob: "",
        address: "",
        bankType: "",
        bankNo: "",
        marital_status: "",
    })
        .then(function (docRef) {
            alert("Employee added ", docRef.uid);
            toRefresh();
        })
        .catch(function (error) {
            console.error("Error adding employee: ", error);
            alert("Error adding employee: ", error);
        });


    // Clear form
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlayBg").style.display = "none";
    document.getElementById("UserName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneNo").value = "";
    document.getElementById("salary").value = "";
    document.getElementById("imageUpload").value = "";
    document.getElementById("depOption").value = "<option value=''>Select Department</option>";
    document.getElementById("posOption").value = "<option value=''>Select Position</option>";

    toRefresh();
}



// For Edit button
window.editUser = async function (userId) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('uid', '==', userId));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();

                    document.getElementById("empID").value = userData.uid;
                    document.getElementById("editName").value = userData.name;
                    document.getElementById("editEmail").value = userData.email;
                    document.getElementById("editSalary").value = userData.salary;

                    document.getElementById("editOverlay").style.display = "block";
                    document.getElementById("overlayBg").style.display = "block";
                });
            } else {
                console.log('User document does not exist');
            }
        })
        .catch((error) => {
            console.log('Error fetching user profile:', error);
        });
}

// For Save edited details
window.saveUserChanges = async function () {
    const userID = document.getElementById("empID").value;
    const newName = document.getElementById("editName").value;
    const newEmail = document.getElementById("editEmail").value;
    const newDep = document.getElementById("editDepOption").value;
    const newPos = document.getElementById("editPosOption").value;
    const newSalary = document.getElementById("editSalary").value;

    // Validate fields
    if (newName == "" || newEmail == "" || newDep == "" || newPos == "" || newSalary == "") {
        alert('Please enter all fields and select a department and position !');
        return;
    }

    // Update in Firestore
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('uid', '==', userID));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userRef = doc.ref;
                    return updateDoc(userRef, {
                        name: newName,
                        email: newEmail,
                        dep_id: newDep,
                        pos_id: newPos,
                        salary: newSalary,
                    })
                        .then(() => {
                            console.log("User details updated successfully");
                            document.getElementById("editOverlay").style.display = "none";
                            document.getElementById("overlayBg").style.display = "none";

                            toRefresh();
                        })
                        .catch((error) => {
                            console.error("Error updating user details:", error);
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

// For delete user
window.deleteUser = async function (userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('uid', '==', userId));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const userRef = doc.ref;
                        deleteDoc(userRef)
                            .then(() => {
                                console.log("User deleted successfully");
                                alert("User deleted successfully");

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

// Validate
function validate_phone(phoneNumber) {
    const phonePattern = /^\d{9,10}$/;
    return phonePattern.test(phoneNumber);
}

// Avoid phone number duplication
async function checkPhoneDuplicate(phoneNumber) {
    const usersRef = collection(firestore, 'users');
    const querySnapshot = await getDocs(query(usersRef, where('phoneNo', '==', phoneNumber)));

    return !querySnapshot.empty;
}

// Validate selected files
const imageUploadInput = document.getElementById("imageUpload");

imageUploadInput.addEventListener("change", function () {
    const selectedFiles = imageUploadInput.files;

    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (file.type !== "image/jpeg") {
            alert("Please select only .jpg files.");
            imageUploadInput.value = "";
            return;
        }
    }
});

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