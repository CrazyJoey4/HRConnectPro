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

// Fetch Pending Leave details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchPendingLeaveDetails = async function () {
        const pendingTable = document.getElementById('penTable');

        const usersRef = collection(firestore, 'users');
        const currentUserQuery = query(usersRef, where('uid', '==', userId));
        const currentUserSnapshot = await getDocs(currentUserQuery);

        if (currentUserSnapshot.empty) {
            console.error('Current user not found.');
            return;
        }

        const userData = currentUserSnapshot.docs[0].data();
        const currentDepID = userData.dep_id;

        const usersSameDepQuery = query(usersRef, where('dep_id', '==', currentDepID));
        const usersSameDepSnapshot = await getDocs(usersSameDepQuery);

        if (!usersSameDepSnapshot.empty) {
            const userIDs = usersSameDepSnapshot.docs.map(doc => doc.data().uid);

            const leaveRef = collection(firestore, 'leaveApply');
            const q = query(leaveRef, where('approve_status', '==', 'Pending'), where('uid', 'in', userIDs));
            const leaveSnapshot = await getDocs(q);

            if (!leaveSnapshot.empty) {
                leaveSnapshot.forEach(async (doc) => {
                    const leaveAData = doc.data();
                    const leaveApplyID = leaveAData.leaveApply_id;
                    const leaveName = await getEmployeeName(leaveAData.uid);
                    const leaveType = await getLeaveName(leaveAData.leave_type);
                    const leaveDescription = leaveAData.apply_desc;
                    const leaveStartDate = leaveAData.start_date;
                    const leaveEndDate = leaveAData.end_date;
                    const leaveDuration = getLeaveDuration(leaveStartDate, leaveEndDate);
                    const leaveStatus = leaveAData.approve_status;
                    const leaveDoc = leaveAData.leave_doc;

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

                    // Add the fetched data to the table
                    const newRow = pendingTable.insertRow();
                    newRow.innerHTML = `
                    <td id="nameCol">${leaveName}</td>
                    <td id="typeCol">${leaveType}</td>
                    <td id="dateCol">${leaveDuration} day(s)</td>
                    <td id="dateCol">${leaveStartDate}</td>
                    <td id="dateCol">${leaveEndDate}</td>
                    <td id="descCol">${leaveDescription}</td>
                    <td id="fileCol">
                        ${leaveDoc ? `<a href="${leaveDoc}" target="_blank" rel="noopener noreferrer">View Document</a>` : ''}
                    </td>
                    <td id="statusCol" style="background: ${statusColor}">${leaveStatus}</td>
                    <td class="actioncol" id="actioncol1"><button class="editbtn" style="background: var(--forGreenBTN)" onclick="approveLeave('${leaveApplyID}')"><i class="fas fa-check"></i></button></td>
                    <td class="actioncol" id="actioncol2"><button class="editbtn" style="background: var(--forRedBG)" onclick="openRejectOverlay('${leaveApplyID}')"><i class="fas fa-times"></i></button></td>
                `;
                });
            }
        }
    }
});

// Fetch Approved Leave details
window.fetchApprovedLeaveDetails = async function () {
    const approvedTable = document.getElementById('appTable');

    const usersRef = collection(firestore, 'users');
    const currentUserQuery = query(usersRef, where('uid', '==', userId));
    const currentUserSnapshot = await getDocs(currentUserQuery);

    if (currentUserSnapshot.empty) {
        console.error('Current user not found.');
        return;
    }

    const userData = currentUserSnapshot.docs[0].data();
    const currentDepID = userData.dep_id;

    const usersSameDepQuery = query(usersRef, where('dep_id', '==', currentDepID));
    const usersSameDepSnapshot = await getDocs(usersSameDepQuery);

    if (!usersSameDepSnapshot.empty) {
        const userIDs = usersSameDepSnapshot.docs.map(doc => doc.data().uid);

        const leaveRef = collection(firestore, 'leaveApply');
        const q = query(leaveRef, where('approve_status', '==', 'Approved'), where('uid', 'in', userIDs));
        const leaveSnapshot = await getDocs(q);

        if (!leaveSnapshot.empty) {
            leaveSnapshot.forEach(async (doc) => {
                const leaveAData = doc.data();
                const leaveName = await getEmployeeName(leaveAData.uid);
                const leaveType = await getLeaveName(leaveAData.leave_type);
                const leaveStartDate = leaveAData.start_date;
                const leaveEndDate = leaveAData.end_date;
                const leaveDuration = getLeaveDuration(leaveStartDate, leaveEndDate);
                const leaveStatus = leaveAData.approve_status;

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

                // Add the fetched data to the table
                const newRow = approvedTable.insertRow();
                newRow.innerHTML = `
                        <td id="nameCol">${leaveName}</td>
                        <td id="typeCol">${leaveType}</td>
                        <td id="dateCol">${leaveDuration} day(s)</td>
                        <td id="dateCol">${leaveStartDate}</td>
                        <td id="dateCol">${leaveEndDate}</td>
                        <td id="statusCol" style="background: ${statusColor}">${leaveStatus}</td>
                    `;
            });
        }

    }
}

// Fetch Rejected Leave details
window.fetchRejectedLeaveDetails = async function () {
    const rejectedTable = document.getElementById('rejTable');

    const usersRef = collection(firestore, 'users');
    const currentUserQuery = query(usersRef, where('uid', '==', userId));
    const currentUserSnapshot = await getDocs(currentUserQuery);

    if (currentUserSnapshot.empty) {
        console.error('Current user not found.');
        return;
    }

    const userData = currentUserSnapshot.docs[0].data();
    const currentDepID = userData.dep_id;

    const usersSameDepQuery = query(usersRef, where('dep_id', '==', currentDepID));
    const usersSameDepSnapshot = await getDocs(usersSameDepQuery);

    if (!usersSameDepSnapshot.empty) {
        const userIDs = usersSameDepSnapshot.docs.map(doc => doc.data().uid);

        const leaveRef = collection(firestore, 'leaveApply');
        const q = query(leaveRef, where('approve_status', '==', 'Rejected'), where('uid', 'in', userIDs));
        const leaveSnapshot = await getDocs(q);

        if (!leaveSnapshot.empty) {
            leaveSnapshot.forEach(async (doc) => {
                const leaveAData = doc.data();
                const leaveName = await getEmployeeName(leaveAData.uid);
                const leaveType = await getLeaveName(leaveAData.leave_type);
                const leaveStartDate = leaveAData.start_date;
                const leaveEndDate = leaveAData.end_date;
                const leaveDuration = getLeaveDuration(leaveStartDate, leaveEndDate);
                const leaveStatus = leaveAData.approve_status;
                const leaveRemark = leaveAData.reject_desc;

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

                // Add the fetched data to the table
                const newRow = rejectedTable.insertRow();
                newRow.innerHTML = `
                        <td id="nameCol">${leaveName}</td>
                        <td id="typeCol">${leaveType}</td>
                        <td id="dateCol">${leaveDuration} day(s)</td>
                        <td id="dateCol">${leaveStartDate}</td>
                        <td id="dateCol">${leaveEndDate}</td>
                        <td id="statusCol" style="background: ${statusColor}">${leaveStatus}</td>
                        <td id="remarkCol">${leaveRemark}</td>
                    `;
            });
        }
    }

}

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

// To approve leave
window.approveLeave = async function (leaveApplyID) {
    if (confirm("Are you sure you want to approve this leave application?")) {
        const leaveRef = collection(firestore, 'leaveApply');
        const q = query(leaveRef, where('leaveApply_id', '==', leaveApplyID));

        getDocs(q)
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const leaveRef = doc.ref;
                        return updateDoc(leaveRef, { approve_status: 'Approved' })
                            .then(() => {
                                console.log("Leave approved successfully");
                                toRefresh();
                            })
                            .catch((error) => {
                                console.error("Error approving leave:", error);
                            });
                    });
                } else {
                    console.log('Leave document does not exist');
                }
            })
            .catch((error) => {
                console.log('Error fetching leave:', error);
            });
    }
}

// Function to open the reject overlay form
window.openRejectOverlay = function (leaveApplyID) {
    document.getElementById("rejectReason").value = "";
    document.getElementById("overlayBg").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    const leaveApplyId = leaveApplyID;
    document.getElementById("leaveApplyID").value = leaveApplyId;
}

// To reject leave
window.rejectLeave = async function (event) {
    event.preventDefault();

    const reason = document.getElementById("rejectReason").value.trim();

    if (reason === "") {
        alert("Please enter a reason for rejection.");
        return;
    }

    const leaveApplyId = document.getElementById("leaveApplyID").value;

    const leaveRef = collection(firestore, 'leaveApply');
    const q = query(leaveRef, where('leaveApply_id', '==', leaveApplyId));

    getDocs(q)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const leaveRef = doc.ref;
                    return updateDoc(leaveRef, {
                        approve_status: 'Rejected',
                        reject_desc: reason,
                    })
                        .then(() => {
                            alert("Leave rejected successfully");
                            closeRejectOverlay();
                            toRefresh();
                        })
                        .catch((error) => {
                            console.error("Error rejecting leave:", error);
                        });
                });
            } else {
                console.log('Leave document does not exist');
            }
        })
        .catch((error) => {
            console.log('Error fetching leave:', error);
        });
}


window.addEventListener('DOMContentLoaded', function () {
    fetchPendingLeaveDetails();
    fetchApprovedLeaveDetails();
    fetchRejectedLeaveDetails();
});


function toRefresh() {
    setTimeout(() => {
        location.reload();
    }, 1000);
}