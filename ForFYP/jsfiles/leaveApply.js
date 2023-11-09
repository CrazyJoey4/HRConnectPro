import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
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

// Fetch Active Leave details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchLeaveDetails = async function () {
        const leaveTable = document.getElementById('leaveTable');
        const allLeaveTable = document.getElementById('leaveAllTable');

        const leaveRef = collection(firestore, 'leaveApply');
        const q = query(leaveRef, where('uid', '==', userId), orderBy('leave_type', 'asc'), orderBy('approve_status', 'asc'), orderBy('start_date', 'asc'));
        const leaveSnapshot = await getDocs(q);

        if (!leaveSnapshot.empty) {
            leaveSnapshot.forEach(async (doc) => {
                const leaveAData = doc.data();
                const leaveApplyID = leaveAData.leaveApply_id;
                const leaveType = await getLeaveName(leaveAData.leave_type);
                const leaveStartDate = leaveAData.start_date;
                const leaveEndDate = leaveAData.end_date;
                const leaveStatus = leaveAData.approve_status;
                const leaveDuration = getLeaveDuration(leaveStartDate, leaveEndDate);
                const leaveDoc = leaveAData.leave_doc;
                const leaveReason = leaveAData.reject_desc;

                let statusColor = '';
                switch (leaveStatus) {
                    case 'Approved':
                        statusColor = 'var(--forGreenBG)';
                        break;
                    case 'Pending':
                        statusColor = 'var(--forBlueBG)';
                        break;
                    case 'Rejected':
                        statusColor = 'var(--forRedBG)';
                        break;
                    default:
                        statusColor = 'black';
                        break;
                }

                if(isDateInFuture(leaveEndDate)){
                    const newRow = leaveTable.insertRow();
                    newRow.innerHTML = `
                        <td id="nameCol">${leaveType}</td>
                        <td id="dateCol">${leaveDuration} day(s)</td>
                        <td id="dateCol">${leaveStartDate}</td>
                        <td id="dateCol">${leaveEndDate}</td>
                        <td id="statusCol" style="background: ${statusColor}">${leaveStatus}</td>
                        <td id="fileCol">
                            ${leaveDoc ? `<a href="${leaveDoc}" target="_blank" rel="noopener noreferrer">View Document</a>` : ''}
                        </td>
                        <td class="actioncol" id="actioncol1">
                            ${leaveStatus === 'Rejected'
                            ? ` Reason </td>
                            <td id="statusCol" style="background: ${statusColor}">${leaveReason}</td>`
                            : `<button class="editbtn" onclick="deleteLeave('${leaveApplyID}')"><i class='material-icons'>delete</i></button>`}
                        </td>
                    `;
                }
            });
        }
    }
});

// For comparing date
function isDateInFuture(dateString) {
    const currentDate = new Date();
    const endDate = new Date(dateString); 
    return endDate > currentDate;
}

// Fetch All history Leave details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchAllLeaveDetails = async function () {
        const allLeaveTable = document.getElementById('leaveAllTable');

        const leaveRef = collection(firestore, 'leaveApply');
        const q = query(leaveRef, where('uid', '==', userId), orderBy('leave_type', 'asc'), orderBy('approve_status', 'asc'), orderBy('start_date', 'asc'));
        const leaveSnapshot = await getDocs(q);

        if (!leaveSnapshot.empty) {
            leaveSnapshot.forEach(async (doc) => {
                const leaveAData = doc.data();
                const leaveType = await getLeaveName(leaveAData.leave_type);
                const leaveStartDate = leaveAData.start_date;
                const leaveEndDate = leaveAData.end_date;
                const leaveStatus = leaveAData.approve_status;
                const leaveDuration = getLeaveDuration(leaveStartDate, leaveEndDate);
                const leaveDoc = leaveAData.leave_doc;
                const leaveReason = leaveAData.reject_desc;

                let statusColor = '';
                switch (leaveStatus) {
                    case 'Approved':
                        statusColor = 'var(--forGreenBG)';
                        break;
                    case 'Pending':
                        statusColor = 'var(--forBlueBG)';
                        break;
                    case 'Rejected':
                        statusColor = 'var(--forRedBG)';
                        break;
                    default:
                        statusColor = 'black';
                        break;
                }

                const newRow = allLeaveTable.insertRow();
                newRow.innerHTML = `
                    <td id="nameCol">${leaveType}</td>
                    <td id="dateCol">${leaveDuration} day(s)</td>
                    <td id="dateCol">${leaveStartDate}</td>
                    <td id="dateCol">${leaveEndDate}</td>
                    <td id="statusCol" style="background: ${statusColor}">${leaveStatus}</td>
                    <td id="fileCol">
                        ${leaveDoc ? `<a href="${leaveDoc}" target="_blank" rel="noopener noreferrer">View Document</a>` : ''}
                    </td>
                    <td class="descCol" id="descCol">
                        ${leaveStatus === 'Rejected'
                        ? ` Reason </td>
                        <td id="statusCol" style="background: ${statusColor}">${leaveReason}</td>`
                        : ''}
                    </td>
                `;
            });
        }
    }
});


// Function to get employee name using uid
async function getEmployeeName(uid) {
    const usersRef = collection(firestore, 'users');
    const querySnapshot = await getDocs(query(usersRef, where('uid', '==', uid)));
    if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        return user.name;
    } else {
        return "Employee Name Not Found";
    }
}

// Function to get leave name using leave id
async function getLeaveName(typeID) {
    const leaveRef = collection(firestore, 'leave');
    const querySnapshot = await getDocs(query(leaveRef, where('leave_id', '==', typeID)));
    if (!querySnapshot.empty) {
        const leaveData = querySnapshot.docs[0].data();
        return leaveData.leave_name;
    } else {
        return "Leave Name Not Found";
    }
}

// Function to calculate duration
function getLeaveDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const durationInMilliseconds = end - start;

    // Calculate the number of days
    const days = Math.floor(durationInMilliseconds / (24 * 60 * 60 * 1000));

    // Calculate the number of weekends
    let weekends = 0;
    for (let i = 0; i < days; i++) {
        const currentDate = new Date(start.getTime() + (i * 24 * 60 * 60 * 1000));
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            weekends++;
        }
    }

    // Excluding weekends
    const leaveDuration = days - weekends + 1;

    return leaveDuration;
}

// For genetrate Leave ID
async function generateNewID() {
    const leaveRef = collection(firestore, 'leaveApply');
    const querySnapshot = await getDocs(query(leaveRef, orderBy('leaveApply_id', 'desc'), limit(1)));

    let newID = 'LA000001';

    if (!querySnapshot.empty) {
        const lastID = querySnapshot.docs[0].data().leaveApply_id;
        const numericPart = parseInt(lastID.slice(2), 10) + 1;

        const formattedNumericPart = String(numericPart).padStart(6, '0');

        newID = `LA${formattedNumericPart}`;
    }
    return newID;
}

// For fetching leave type
async function generateType() {
    const depSelect = document.getElementById("typeOption");

    const leaveRef = collection(firestore, 'leave');
    const querySnapshot = await getDocs(leaveRef);

    querySnapshot.forEach((doc) => {
        const option = document.createElement("option");
        option.value = doc.data().leave_id;
        option.text = doc.data().leave_name;
        depSelect.appendChild(option);
    });
}

// Add Leave
window.applyleave = async function (event) {
    event.preventDefault();

    // Get Leave details from the form
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const description = document.getElementById("desc").value;
    const selectedType = document.getElementById("typeOption").value;
    const leaveDoc = document.getElementById("leaveDoc").files[0];

    // Validate fields
    if (startDate == "" || endDate == "" || selectedType == "") {
        alert('Please enter all fields and select a leave type!');
        return;
    }

    // Generate a new leave ID
    const leaveID = await generateNewID();

    // if provided document
    let docUrl = null;
    if (leaveDoc) {
        const storageRef = ref(storage, `leaveDocuments/${leaveID}`);
        const snapshot = await uploadBytes(storageRef, leaveDoc);
        docUrl = await getDownloadURL(snapshot.ref);
    }
    else {
        docUrl = "";
    }

    // Find manager id
    const usersRef = collection(firestore, 'users');
    const q = await getDocs(query(usersRef, where('uid', '==', userId)));

    q.forEach(async (doc) => {
        const user = doc.data();
        const depID = user.dep_id;

        const depRef = collection(firestore, 'department');
        const q = query(depRef, where('dep_id', '==', depID));
        const depSnapshot = await getDocs(q);

        if (!depSnapshot.empty) {
            const depData = depSnapshot.docs[0].data();
            const depManager = depData.manager_pid;

            // Add leave details
            addDoc(collection(firestore, "leaveApply"), {
                leaveApply_id: leaveID,
                uid: userId,
                manager_uid: depManager,
                approve_status: "Pending",

                apply_desc: description,
                reject_desc: "",
                start_date: startDate,
                end_date: endDate,
                leave_type: selectedType,
                leave_doc: docUrl,

            })
                .then(function (docRef) {
                    alert("Leave added, please wait for approval from manager");
                    toRefresh();
                })
                .catch(function (error) {
                    console.error("Error adding Leave: ", error);
                    alert("Error adding Leave: " + error);
                });
        } else {
            console.log("Cannot fetch");
        }
    });

    // Clear form
    document.getElementById("overlay").style.display = "none";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("typeOption").value = "";
    document.getElementById("leaveDoc").value = "";
}


// For cancel leave
window.deleteLeave = async function (leaveId) {
    if (confirm("Are you sure you want to delete this leave?")) {
        const leaveRef = collection(firestore, 'leaveApply');
        const q = query(leaveRef, where('leaveApply_id', '==', leaveId));

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


window.addEventListener('DOMContentLoaded', function () {
    generateType();
    fetchLeaveEventsFromFirebase();
});

// Initialize FullCalendar
var calendarEl = document.getElementById('calendar');
var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    content: {
        customClass: 'custom-calendar',
    }
});

// Function to fetch leave events and add them to the calendar
async function fetchLeaveEventsFromFirebase() {
    const leaveRef = collection(firestore, 'leaveApply');
    const usersRef = collection(firestore, 'users');
    const userQuery = query(usersRef, where('uid', '==', userId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
        // Handle the case where the current user is not found
        console.error('Current user not found.');
        return;
    }

    const currentUserData = userSnapshot.docs[0].data();
    const currentDepID = currentUserData.dep_id;

    // Query leave events with "Approved" status
    const leaveQuery = query(leaveRef, where('approve_status', '==', 'Approved'));

    // Fetch the approved leave events
    const leaveSnapshot = await getDocs(leaveQuery);

    if (!leaveSnapshot.empty) {
        const leaveEvents = [];

        for (const doc of leaveSnapshot.docs) {
            const leaveData = doc.data();

            // Fetch the department of the user associated with this leave event
            const employeeUserSnapshot = await getDocs(query(usersRef, where('uid', '==', leaveData.uid)));

            if (employeeUserSnapshot.empty) {
                console.error('User for leave event not found.');
                continue;
            }

            const employeeUserData = employeeUserSnapshot.docs[0].data();
            const employeeDepartment = employeeUserData.dep_id;

            if (employeeDepartment === currentDepID) {
                const employeeNamePromise = getEmployeeName(leaveData.uid);

                // Use Promise.all to resolve both the leave event and employee name fetching
                const [employeeName] = await Promise.all([employeeNamePromise]);

                // Format the data into FullCalendar event format
                const event = {
                    title: `${employeeName} is on leave`,
                    start: `${leaveData.start_date}T00:00:00`,
                    end: `${leaveData.end_date}T23:59:59`,
                };

                leaveEvents.push(event);
            }
        }

        calendar.addEventSource(leaveEvents);
        calendar.render();
    }
}

function toRefresh() {
    setTimeout(() => {
        location.reload();
    }, 1000);
}