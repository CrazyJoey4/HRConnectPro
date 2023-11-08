import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
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

// Face Recognition
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

// Load Model
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("jsfiles/faceapi/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("jsfiles/faceapi/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("jsfiles/faceapi/models"),
]).then(startWebcam);

// Open Camera
function startWebcam() {
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: false,
        })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error(error);
        });
}

async function getLabeledFaceDescriptions() {
    const labels = [userId];
    return Promise.all(
        labels.map(async (label) => {
            const descriptions = [];
            for (let i = 1; i <= 5; i++) {
                const img = await faceapi.fetchImage(`jsfiles/faceapi/labels/${label}/${i}.jpg`);
                const detection = await faceapi
                    .detectSingleFace(img)
                    .withFaceLandmarks()
                    .withFaceDescriptor();
                if (detection) {
                    descriptions.push(detection.descriptor);
                }
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );
}

video.addEventListener("play", async () => {
    const labeledFaceDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        const results = resizedDetections.map((d) => {
            return faceMatcher.findBestMatch(d.descriptor);
        });
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
                label: result,
            });
            drawBox.draw(canvas);
        });
    }, 100);
});



// Attendance
const clockInButton = document.getElementById("clockInButton");
const clockOutButton = document.getElementById("clockOutButton");
clockOutButton.disabled = true;

let clockInTime = null;

// Function to format the date to "YYYY-MM-DD"
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// For clock in
clockInButton.addEventListener("click", async () => {
    const image = await captureImage();

    if (image) {
        const detection = await recognizeFace(image);

        if (detection && detection !== "unknown") {
            const currentDate = new Date();
            const formattedDate = formatDateToYYYYMMDD(currentDate);

            alert("Attendance marked. You are clocked in!");

            const clockInTime = new Date(new Date().getTime()).toLocaleTimeString();

            const imageFileName = `${userId}_${formattedDate}_in.jpg`;
            const imageRef = ref(storage, `employeeAttendance/${userId}/${imageFileName}`);

            try {
                // Upload the image to Firebase Storage
                await uploadBytes(imageRef, image);

                // Save the clock-in data with the image URL
                const imageUrl = await getDownloadURL(imageRef);
                saveClockInData(userId, formattedDate, clockInTime, imageUrl);

                clockInButton.disabled = true;
                clockOutButton.disabled = false;

                setTimeout(() => {
                    clockOutButton.disabled = false;
                }, 10000);
            } catch (error) {
                console.error("Error uploading image to Firebase Storage:", error);
            }
        } else {
            alert("Unknown face. Please try again or contact your administrator.");
        }
    } else {
        alert("Error capturing image. Please try again.");
    }
});

async function saveClockInData(userId, currentDate, currentTime, imageUrl) {
    try {
        const docRef = await addDoc(collection(firestore, 'attendance'), {
            uid: userId,
            date: currentDate,
            clock_in: currentTime,
            image_url_in: imageUrl,
        });
        console.log("Clock-in data recorded with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

// For clock out 
clockOutButton.addEventListener("click", async () => {
    const image = await captureImage();

    if (image) {
        const detection = await recognizeFace(image);

        if (detection) {
            const currentDate = new Date();
            const formattedDate = formatDateToYYYYMMDD(currentDate);



            const clockInTimeDoc = await getClockInTime(userId, formattedDate);
            console.log(clockInTimeDoc.data().clock_in);

            if (clockInTimeDoc.exists()) {
                const clockOutTime = new Date(new Date().getTime()).toLocaleTimeString();
                clockInTime = clockInTimeDoc.data().clock_in;


                const imageFileName = `${userId}_${formattedDate}_out.jpg`;
                const imageRef = ref(storage, `employeeAttendance/${userId}/${imageFileName}`);

                try {
                    await uploadBytes(imageRef, image);
                    const imageUrl = await getDownloadURL(imageRef);

                    // Calculate clock duration
                    const clockDuration = calculateClockDuration(clockInTime, clockOutTime);
                    console.log(clockDuration);
                    saveClockOutData(userId, formattedDate, clockOutTime, imageUrl, clockDuration);

                    clockInButton.disabled = true;
                    clockOutButton.disabled = true;
                    alert("Attendance marked. You are clocked out!");
                } catch (error) {
                    console.error("Error uploading image to Firebase Storage:", error);
                }
            }
        } else {
            alert("Face not recognized. Please try again.");
        }
    } else {
        alert("Error capturing image. Please try again.");
    }
});

async function saveClockOutData(userId, currentDate, clockOutTime, imageUrl, clockDuration) {
    const attendanceRef = collection(firestore, 'attendance');
    const querySnapshot = await getDocs(query(attendanceRef, where('uid', '==', userId), where('date', '==', currentDate)));

    if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(attendanceRef, docId);

        try {
            await updateDoc(docRef, {
                clock_out: clockOutTime,
                clock_duration: clockDuration,
                image_url_out: imageUrl,
            });

            console.log("Attendance data updated for UID ", userId, " and Date ", currentDate);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    } else {
        console.error("Document not found for UID ", userId, " and Date ", currentDate);
    }
}


// To get clock in time
async function getClockInTime(userId, currentDate) {
    const attendanceRef = collection(firestore, 'attendance');
    const querySnapshot = await getDocs(query(attendanceRef, where('uid', '==', userId), where('date', '==', currentDate)));

    if (!querySnapshot.empty) {
        return querySnapshot.docs[0];
    } else {
        return null;
    }
}

// To calculate duration in minutes
function calculateClockDuration(clockInTime, clockOutTime) {
    // Parse the clock-in and clock-out times to JavaScript Date objects
    const clockIn = parseTimeStringToDateTime(clockInTime);
    const clockOut = parseTimeStringToDateTime(clockOutTime);

    // Calculate the duration in minutes
    const durationMilliseconds = clockOut - clockIn;
    const durationMinutes = Math.floor(durationMilliseconds / 60000);

    // Convert duration to hours and minutes
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    // Create the duration string
    const durationString = `${hours} hours ${minutes} minutes`;

    return durationString;
}

// Function to parse time string to a Date object
function parseTimeStringToDateTime(timeString) {
    const [time, meridian] = timeString.split(' ');
    let [hour, minute, second] = time.split(':').map(Number);

    let currentDate = new Date();

    if (meridian === 'PM' && hour !== 12) {
        hour += 12;
    }

    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, minute, second);

    return currentDate;
}


// Function to capture an image from the video
async function captureImage() {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = video.width;
        canvas.height = video.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, video.width, video.height);

        // Convert the canvas content to a data URL in JPEG format
        const image = canvas.toDataURL("image/jpeg");

        // Resolve the image data
        resolve(image);
    });
}

// Function to recognize the face in the captured image
async function recognizeFace(imageData) {
    const labeledFaceDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    const img = new Image();
    img.src = imageData;
    await img.decode();

    const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (detection) {
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        return bestMatch._label;
    }

    return null;
}

async function checkClockedInOnLoad(userId) {
    const currentDate = new Date();
    const formattedDate = formatDateToYYYYMMDD(currentDate);

    const attendanceRef = collection(firestore, 'attendance');
    const querySnapshot = await getDocs(query(attendanceRef, where('uid', '==', userId), where('date', '==', formattedDate)));

    if (!querySnapshot.empty) {
        const hasClockIn = querySnapshot.docs[0].data().clock_in;
        const hasClockOut = querySnapshot.docs[0].data().clock_out;

        if (hasClockIn && hasClockOut) {
            // Both clock_in and clock_out times exist
            clockInButton.disabled = true;
            clockOutButton.disabled = true;
        } else if (hasClockIn && !hasClockOut) {
            // Only clock_in time exists 
            clockInButton.disabled = true;
            clockOutButton.disabled = false;
        } else {
            // Default
            clockInButton.disabled = false;
            clockOutButton.disabled = true;
        }
    } else {
        // Default
        clockInButton.disabled = false;
        clockOutButton.disabled = true;
    }
}


window.addEventListener('DOMContentLoaded', function () {
    checkClockedInOnLoad(userId);
});
