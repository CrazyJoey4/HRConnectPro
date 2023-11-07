// Import the functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

// Function to fetch all user IDs from the "users" collection
async function fetchUserIDs() {
    const usersRef = collection(firestore, 'users');
    const usersQuery = query(usersRef);

    const userIDs = [];

    const userSnapshot = await getDocs(usersQuery);
    userSnapshot.forEach((doc) => {
        const userData = doc.data().uid;
        userIDs.push(userData);
    });

    console.log(userIDs);
    return userIDs;
}

// Function to check if an employee has clocked in for a given date
async function hasClockedInForDate(userId, date) {
    const attendanceRef = collection(firestore, 'attendance');
    const queryByDate = query(attendanceRef, where('uid', '==', userId), where('date', '==', date));

    const querySnapshot = await getDocs(queryByDate);
    return !querySnapshot.empty;
}

// Function to create a pie chart showing employees who have clocked in or not
async function createClockInPieChart() {
    const userIDs = await fetchUserIDs();

    const labels = ['Clocked In', 'Not Clocked In'];
    const employeesClockedIn = [];
    const employeesNotClockedIn = [];

    for (const userId of userIDs) {
        const now = new Date();
        const dateString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        console.log(dateString);
        const hasClockedIn = await hasClockedInForDate(userId, dateString);
        if (hasClockedIn) {
            employeesClockedIn.push(userId);
        } else {
            employeesNotClockedIn.push(userId);
        }
    }

    // Create a chart
    const ctx = document.getElementById('clockInPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
                {
                    data: [employeesClockedIn.length, employeesNotClockedIn.length],
                    backgroundColor: ['#5C469C', '#D4ADFC'],
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Employee Checked in',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    });
}

// Function to fetch leave data based on status
async function fetchLeaveDataByStatus(status) {
    const leaveApplyRef = collection(firestore, 'leaveApply');
    const queryByStatus = query(leaveApplyRef, where('approve_status', '==', status));

    const querySnapshot = await getDocs(queryByStatus);
    return querySnapshot.size; // Get the number of leaves with the specified status
}

// Function to create a pie chart showing leave status distribution
async function createLeaveStatusPieChart() {
    const pendingLeaves = await fetchLeaveDataByStatus('Pending');
    const approvedLeaves = await fetchLeaveDataByStatus('Approved');
    const rejectedLeaves = await fetchLeaveDataByStatus('Rejected');

    const labels = ['Pending', 'Approved', 'Rejected'];
    const data = [pendingLeaves, approvedLeaves, rejectedLeaves];

    // Create a chart
    const ctx = document.getElementById('leaveStatusPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: ['#96c0ff', '#96ffb0', '#ff9696'],
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Status',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    });
}

// Function to fetch performance data and classify it
async function fetchPerformanceDataAndClassify() {
    const performanceRef = collection(firestore, 'performance');
    const queryAllPerformance = query(performanceRef);

    const querySnapshot = await getDocs(queryAllPerformance);

    let evaluations = {};
    let yetToSubmitCount = 0;
    let completedCount = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        const employeeID = data.uid;

        if (Array.isArray(data.unsubmitID) && data.unsubmitID.length > 0) {
            yetToSubmitCount += data.unsubmitID.length;
        } else {
            completedCount++;
        }

        // Check if the employee has evaluations already stored
        if (employeeID in evaluations) {
            evaluations[employeeID].push(data);
        } else {
            evaluations[employeeID] = [data];
        }
    });

    // Now you can access evaluations by employee ID
    console.log(evaluations);
    console.log(yetToSubmitCount);
    console.log(completedCount);

    return { yetToSubmitCount, completedCount, evaluations };
}


// Function to create a pie chart showing performance classification
async function createPerformanceStatusPieChart() {
    const { yetToSubmitCount, completedCount, evaluations } = await fetchPerformanceDataAndClassify();

    const labels = ['Yet to Submit', 'Completed'];
    const data = [yetToSubmitCount, completedCount];

    // Create a chart
    const ctx = document.getElementById('performanceStatusPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: ['#ff9696', '#96ffb0'],
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Status',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    });

    console.log(evaluations);
}


// Add the charts when the document is ready
window.addEventListener('DOMContentLoaded', () => {
    createClockInPieChart();
    createLeaveStatusPieChart();
    createPerformanceStatusPieChart();
});

