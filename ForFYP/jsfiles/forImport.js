// Import the functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
const firestore = getFirestore(firebaseApp);

const jsonData = {
    attendance: [
        {
            uid: "EMP_001",
            date: "2023-05-18",
            clock_in: "08:00 AM",
            clock_out: "05:00 PM",
            clock_duration: "9 hours 0 minutes",
        },
        {
            uid: "EMP_004",
            date: "2023-05-19",
            clock_in: "08:15 AM",
            clock_out: "04:45 PM",
            clock_duration: "8 hours 30 minutes",
        },
        {
            uid: "EMP_005",
            date: "2023-05-20",
            clock_in: "08:30 AM",
            clock_out: "05:15 PM",
            clock_duration: "8 hours 45 minutes",
        },
        {
            uid: "EMP_006",
            date: "2023-05-21",
            clock_in: "08:10 AM",
            clock_out: "05:30 PM",
            clock_duration: "9 hours 20 minutes",
        },
        {
            uid: "EMP_007",
            date: "2023-05-22",
            clock_in: "08:20 AM",
            clock_out: "05:10 PM",
            clock_duration: "8 hours 50 minutes",
        },
        {
            uid: "EMP_008",
            date: "2023-05-23",
            clock_in: "08:05 AM",
            clock_out: "05:25 PM",
            clock_duration: "9 hours 20 minutes",
        },
        {
            uid: "EMP_009",
            date: "2023-05-24",
            clock_in: "08:25 AM",
            clock_out: "05:05 PM",
            clock_duration: "8 hours 40 minutes",
        },
        {
            uid: "EMP_010",
            date: "2023-05-25",
            clock_in: "08:15 AM",
            clock_out: "05:15 PM",
            clock_duration: "9 hours 0 minutes",
        },
        {
            uid: "EMP_011",
            date: "2023-05-26",
            clock_in: "08:20 AM",
            clock_out: "05:20 PM",
            clock_duration: "9 hours 0 minutes",
        },
        {
            uid: "EMP_012",
            date: "2023-05-27",
            clock_in: "08:00 AM",
            clock_out: "05:30 PM",
            clock_duration: "9 hours 30 minutes",
        },
        {
            uid: "EMP_013",
            date: "2023-05-28",
            clock_in: "08:10 AM",
            clock_out: "05:20 PM",
            clock_duration: "9 hours 10 minutes",
        },
        {
            uid: "EMP_014",
            date: "2023-05-29",
            clock_in: "08:15 AM",
            clock_out: "05:25 PM",
            clock_duration: "9 hours 10 minutes",
        },
        {
            uid: "EMP_015",
            date: "2023-05-30",
            clock_in: "08:05 AM",
            clock_out: "05:15 PM",
            clock_duration: "9 hours 10 minutes",
        },
        {
            uid: "EMP_016",
            date: "2023-05-31",
            clock_in: "08:25 AM",
            clock_out: "05:15 PM",
            clock_duration: "8 hours 50 minutes",
        },
        {
            uid: "EMP_017",
            date: "2023-06-01",
            clock_in: "08:10 AM",
            clock_out: "05:30 PM",
            clock_duration: "9 hours 20 minutes",
        },
        {
            uid: "EMP_018",
            date: "2023-06-02",
            clock_in: "08:05 AM",
            clock_out: "05:20 PM",
            clock_duration: "9 hours 15 minutes",
        },
        {
            uid: "EMP_019",
            date: "2023-06-03",
            clock_in: "08:30 AM",
            clock_out: "05:10 PM",
            clock_duration: "8 hours 40 minutes",
        },
        {
            uid: "EMP_020",
            date: "2023-06-04",
            clock_in: "08:20 AM",
            clock_out: "05:30 PM",
            clock_duration: "9 hours 10 minutes",
        },
        {
            uid: "EMP_021",
            date: "2023-06-05",
            clock_in: "08:10 AM",
            clock_out: "05:15 PM",
            clock_duration: "8 hours 5 minutes",
        },
        {
            uid: "EMP_022",
            date: "2023-06-06",
            clock_in: "08:15 AM",
            clock_out: "05:25 PM",
            clock_duration: "9 hours 10 minutes",
        },
        {
            uid: "EMP_023",
            date: "2023-06-07",
            clock_in: "08:05 AM",
            clock_out: "05:30 PM",
            clock_duration: "9 hours 25 minutes",
        },
        {
            uid: "EMP_024",
            date: "2023-06-08",
            clock_in: "08:20 AM",
            clock_out: "05:20 PM",
            clock_duration: "8 hours 50 minutes",
        },
        {
            uid: "EMP_025",
            date: "2023-06-09",
            clock_in: "08:25 AM",
            clock_out: "05:15 PM",
            clock_duration: "8 hours 50 minutes",
        },
        {
            uid: "EMP_026",
            date: "2023-06-10",
            clock_in: "08:10 AM",
            clock_out: "05:10 PM",
            clock_duration: "8 hours 50 minutes",
        },
        {
            uid: "EMP_027",
            date: "2023-06-11",
            clock_in: "08:15 AM",
            clock_out: "05:05 PM",
            clock_duration: "8 hours 50 minutes",
        },
    ],
};


const attendanceCollection = collection(firestore, 'attendance');

const insertDataButton = document.getElementById("insertDataButton");
insertDataButton.addEventListener("click", async () => {
    jsonData.attendance.forEach(async (record) => {
        await addDoc(attendanceCollection, record);
    });
});