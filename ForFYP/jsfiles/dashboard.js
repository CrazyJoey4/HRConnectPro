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

// To fetch all user IDs
async function fetchUserIDs() {
    const usersRef = collection(firestore, 'users');
    const usersQuery = query(usersRef);

    const userIDs = [];

    const userSnapshot = await getDocs(usersQuery);
    userSnapshot.forEach((doc) => {
        const userData = doc.data().uid;
        userIDs.push(userData);
    });

    return userIDs;
}

// To check if an employee has clocked in for a given date
async function hasClockedInForDate(userId, date) {
    const attendanceRef = collection(firestore, 'attendance');
    const queryByDate = query(attendanceRef, where('uid', '==', userId), where('date', '==', date));

    const querySnapshot = await getDocs(queryByDate);
    return !querySnapshot.empty;
}

// To create a pie chart showing employees who have clocked in or not
async function createClockInPieChart() {
    const userIDs = await fetchUserIDs();

    const labels = ['Clocked In', 'Not Clocked In'];
    const employeesClockedIn = [];
    const employeesNotClockedIn = [];

    for (const userId of userIDs) {
        const now = new Date();
        const dateString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

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


// To fetch leave data based on status
async function fetchLeaveDataByStatus(status) {
    const leaveApplyRef = collection(firestore, 'leaveApply');
    const queryByStatus = query(leaveApplyRef, where('approve_status', '==', status));

    const querySnapshot = await getDocs(queryByStatus);
    return querySnapshot.size; // Get the number of leaves with the specified status
}

// To create a pie chart showing leave status distribution
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
                    text: 'Laave Approval Status',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    });
}


// To fetch performance data and classify it
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

    return { yetToSubmitCount, completedCount, evaluations };
}

// To create a pie chart showing performance classification
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
                    text: 'Evaluation Submission Status',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    });
}

// To count employees by department
async function countEmployeesByDepartment() {
    // Initialize objects to store department names and employee counts
    const departmentNames = {};
    const departmentCounts = {};

    // Fetch data from the "department" collection
    const departmentRef = collection(firestore, 'department');
    const departmentSnapshot = await getDocs(departmentRef);

    // Iterate through the departments and initialize counts
    departmentSnapshot.forEach((doc) => {
        const data = doc.data();
        const depId = data.dep_id;
        departmentNames[depId] = data.dep_name;
        departmentCounts[depId] = 0;
    });

    // Fetch data from the "users" collection to count employees in each department
    const usersRef = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersRef);

    usersSnapshot.forEach((doc) => {
        const data = doc.data();
        const depId = data.dep_id;

        // Check if the department exists
        if (departmentCounts[depId] !== undefined) {
            departmentCounts[depId]++;
        }
    });

    return { departmentNames, departmentCounts };
}

// To create a bar chart showing employee counts by department
async function createEmployeeCountsByDepartmentChart() {
    const { departmentNames, departmentCounts } = await countEmployeesByDepartment();

    const labels = Object.values(departmentNames);
    const data = Object.values(departmentCounts);

    // Create a chart
    const ctx = document.getElementById('employeeCountsByDepartmentChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Employee Count',
                    data: data,
                    backgroundColor: '#5C469C',
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Employee',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    });
}

let rankingData = [];

// To calculate the ranking based on performance and attendance
async function calculateRanking() {
    const performanceRef = collection(firestore, 'performance');
    const attendanceRef = collection(firestore, 'attendance');
    const usersRef = collection(firestore, 'users');

    rankingData = [];

    const performanceSnapshot = await getDocs(performanceRef);

    // Initialize a Map to store total ratings for each user
    const totalRatingsMap = new Map();

    performanceSnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.uid;
        const evaluationRate = data.evaluation_rate || 0;

        // Check if the employee already has a total rating in the Map
        if (totalRatingsMap.has(userId)) {
            // If yes, update the total rating
            totalRatingsMap.set(userId, totalRatingsMap.get(userId) + evaluationRate);
        } else {
            // If no, add the user to the Map with the initial rating
            totalRatingsMap.set(userId, evaluationRate);
        }
    });

    // Fetch data from the attendance for the last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const attendanceSnapshot = await getDocs(query(attendanceRef, where('date', '>=', lastMonth)));

    attendanceSnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.uid;

        // Check if the employee has attended every day
        if (totalRatingsMap.has(userId)) {
            const attendanceBonus = calculateAttendanceBonus([data.date]);
            totalRatingsMap.set(userId, totalRatingsMap.get(userId) + attendanceBonus);
        }
    });

    // Initialize a Set to keep track of processed user IDs
    const processedUserIds = new Set();

    // Iterate through users to build the rankingData array
    const usersSnapshot = await getDocs(usersRef);
    usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        const userId = userData.uid;

        // Check if the employee has ratings in the Map and has not been processed before
        if (totalRatingsMap.has(userId) && !processedUserIds.has(userId)) {
            // If yes, add the user to the rankingData array with the total rating
            rankingData.push({
                userId: userId,
                userName: userData.name,
                totalRating: totalRatingsMap.get(userId),
            });

            // Add the processed user to the Set to avoid duplicates
            processedUserIds.add(userId);
        }
    });

    // Sort in descending order
    rankingData.sort((a, b) => b.totalRating - a.totalRating);
}

// Helper function to calculate attendance bonus
function calculateAttendanceBonus(attendanceDates) {
    const bonusFactor = 0.5;
    const totalDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();

    if (attendanceDates && attendanceDates.length === totalDaysInMonth) {
        return bonusFactor;
    } else {
        return 0;
    }
}


// Function to create a bar chart for the top 10 employees
async function createTop10Chart() {
    // Call the calculateRanking function
    await calculateRanking();

    // After calculating the ranking, get the top 10 employees
    const top10Employees = rankingData.slice(0, 10);

    const barColors = [
        'rgba(92, 70, 156, 1)',
        'rgba(116, 92, 170, 1)',
        'rgba(141, 114, 183, 1)',
        'rgba(166, 137, 197, 1)',
        'rgba(192, 160, 211, 1)',
        'rgba(217, 183, 225, 1)',
        'rgba(242, 206, 239, 1)',
        'rgba(236, 198, 220, 1)',
        'rgba(230, 189, 200, 1)',
        'rgba(224, 181, 181, 1)'];
    const backgroundColors = barColors.slice(0, top10Employees.length);

    // Create the top 10 chart
    const labels = top10Employees.map((employee) => employee.userName);
    const data = top10Employees.map((employee) => employee.totalRating);

    // Create a chart
    const ctx = document.getElementById('top10Chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Rating',
                    data: data,
                    backgroundColor: backgroundColors,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Employees of the Month',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    });
}


// To count projects by status
async function countProjectsByStatus() {
    const projectRef = collection(firestore, 'project');
    const projectSnapshot = await getDocs(projectRef);

    // Initialize counters for completed and ongoing projects
    let completedCount = 0;
    let ongoingCount = 0;

    projectSnapshot.forEach((doc) => {
        const data = doc.data();
        const projectStatus = data.project_status;

        // Check the project status and increment the respective counter
        if (projectStatus === 'Completed') {
            completedCount++;
        } else if (projectStatus === 'Ongoing') {
            ongoingCount++;
        }
    });

    return { completedCount, ongoingCount };
}

// To create a pie chart showing project status distribution
async function createProjectStatusPieChart() {
    const { completedCount, ongoingCount } = await countProjectsByStatus();

    const labels = ['Completed', 'Ongoing'];
    const data = [completedCount, ongoingCount];

    // Create a chart
    const ctx = document.getElementById('projectStatusPieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: ['#96ffb0', '#96c0ff'],
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Project Current Status',
                    font: {
                        size: 16,
                    },
                },
            },
        },
    });
}


window.addEventListener('DOMContentLoaded', () => {
    createClockInPieChart();
    createLeaveStatusPieChart();
    createPerformanceStatusPieChart();
    createEmployeeCountsByDepartmentChart();
    createTop10Chart();
    createProjectStatusPieChart();
});