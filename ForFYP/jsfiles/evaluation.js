import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, doc, getDocs, getDoc, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
// var userId = "EMP_005";



// Function to fetch evaluation details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchEvaluationDetails = async function () {
        const evaluationTable = document.getElementById('evaluationTable');
        evaluationTable.innerHTML = `
            <th class="nameCol">Project Name</th>
            <th class="nameCol">Project Manager</th>
            <th class="dateCol">Start Date</th>
            <th class="dateCol">End Date</th>
            <th class="actioncol">Action</th>
        `;

        const currentDate = new Date();

        const projectsRef = collection(firestore, 'project');
        const performanceRef = collection(firestore, 'performance');

        // Query 1: Projects where the project_manager is the current user
        const querySnapshotManager = await getDocs(
            query(projectsRef, where('project_manager', '==', userId))
        );

        // Query 2: Projects where unsubmitID contains the current user
        const querySnapshotUnsubmitID = await getDocs(
            query(projectsRef, where('uid', 'array-contains', userId))
        );

        // Merge the results
        const projects = new Set();

        querySnapshotManager.forEach((projectDoc) => {
            projects.add(projectDoc.data());
        });

        querySnapshotUnsubmitID.forEach((projectDoc) => {
            projects.add(projectDoc.data());
        });

        // Go through the merged projects and add to the table
        projects.forEach(async (projectData) => {
            const projectId = projectData.project_id;
            const endDate = new Date(projectData.end_date);

            const performanceQuerySnapshot = await getDocs(
                query(performanceRef, where('unsubmitID', 'array-contains', userId))
            );

            const performance2QuerySnapshot = await getDocs(
                query(performanceRef, where('manager_id', '==', userId))
            );

            // Check if there are evaluation questions for the project
            const evaluationQuestionsExist = await doEvaluationQuestionsExist(projectId);

            if ((endDate < currentDate) && (performanceQuerySnapshot.empty || performance2QuerySnapshot.empty)) {
                if (evaluationQuestionsExist) {
                    const managerData = await getUserData(projectData.project_manager);
                    const row = evaluationTable.insertRow();

                    row.innerHTML = `
                        <td class="nameCol">${projectData.project_name}</td>
                        <td class="nameCol">${managerData}</td>
                        <td class="dateCol">${projectData.start_date}</td>
                        <td class="dateCol">${projectData.end_date}</td>
                        <td class="actioncol" id="actioncol1">
                            <button class="editbtn" onclick="fetchEvaluationQuestions('${projectId}')">
                                <i class='material-icons'>edit</i>
                            </button>
                        </td>
                    `;
                }
            }
        });

        // Function to check if evaluation questions exist for a project
        async function doEvaluationQuestionsExist(projectId) {
            const querySnapshot = await getDocs(
                query(collection(firestore, 'evaluation'), where('project_id', '==', projectId))
            );

            return !querySnapshot.empty;
        }

    }
});




// Function to fetch performance details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchPerformanceDetails = async function () {
        const performanceTable = document.getElementById('performanceTable');
        performanceTable.innerHTML = `
            <th class="nameCol">Project Name</th>
            <th class="rateCol">Performance Rating</th>
            <th class="descCol">Supervisor's Comments</th>
        `;

        const performanceRef = collection(firestore, 'performance');
        const projectsRef = collection(firestore, 'project');

        // Query projects where the current user is a team member
        const projectsQuerySnapshot = await getDocs(query(projectsRef, where('uid', 'array-contains', userId)));

        for (const projectDoc of projectsQuerySnapshot.docs) {
            const projectData = projectDoc.data();
            const projectId = projectDoc.id;

            // Query the performance collection for completed evaluations
            const performanceQuerySnapshot = await getDocs(
                query(performanceRef, where('project_id', '==', projectId), where('unsubmitID', 'array-contains', userId))
            );

            // If there are no unfilled evaluations, add the project to the table
            if (performanceQuerySnapshot.empty) {
                const row = performanceTable.insertRow();
                row.innerHTML = `
                    <td class="nameCol">${projectData.project_name}</td>
                    <td class="rateCol">${projectData.evaluation_rate}</td>
                    <td class="descCol">${projectData.evaluation_review}</td>
                `;
            }
        }
    }
});


// Function to get user data
async function getUserData(userId) {
    const usersRef = collection(firestore, 'users');
    const userQuerySnapshot = await getDocs(query(usersRef, where('uid', '==', userId)));

    if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();
        const userName = userData.name;
        return userName;
    } else {
        return 'Name not found';
    }
}

// For generate team members
async function generateTeamMembers(projectID) {
    const memberSelect = document.getElementById("memberSelect");
    memberSelect.innerHTML = `<option value="">Select a Team Member</option>`;

    // Get the project document
    const projectRef = collection(firestore, 'project');
    const projectQuerySnapshot = await getDocs(query(projectRef, where('project_id', '==', projectID)));

    if (!projectQuerySnapshot.empty) {
        const projectDoc = projectQuerySnapshot.docs[0];
        const projectData = projectDoc.data();
        const teamMemberUIDs = projectData.uid;
        teamMemberUIDs.push(projectData.project_manager);

        for (const uid of teamMemberUIDs) {
            if (uid !== userId) {
                const userName = await getUserData(uid);
                const option = document.createElement("option");
                option.value = uid;
                option.text = userName;
                memberSelect.appendChild(option);
            }
        }
    }
}





// For fetch Evaluation Questions
window.fetchEvaluationQuestions = async function (projectId) {
    const overlayBg = document.getElementById('overlayBg');
    const overlay = document.getElementById('overlay');
    overlayBg.style.display = 'block';
    overlay.style.display = 'block';

    const projectID = document.getElementById('evaProjectID');
    projectID.value = projectId;

    generateTeamMembers(projectId);

    const questionsContainer = document.getElementById('Questions');
    questionsContainer.innerHTML = '';

    const querySnapshot = await getDocs(query(collection(firestore, 'evaluation'), where('project_id', '==', projectId), orderBy('question_number', 'asc')));

    querySnapshot.forEach(async (question) => {
        const questionData = question.data();
        const questionDiv = document.createElement('div');
        const evaID = `eva_rate_${questionData.question_number}`;

        questionDiv.innerHTML = `
            <input style="display:none" type="text" name="evaWeight" id="evaWeight" value=${questionData.eva_weight}>
            <input style="display:none" type="text" name="evaQuestionID" id="evaQuestionID" value=${questionData.eva_id}>
            <h5>Q${questionData.question_number} ${questionData.eva_question}</h5>
            <div class="option" id="rateOptions">
                <p>Strongly disagree</p>
            
                <input class="checkbox-option" type="radio" name="${evaID}" id="${evaID}_1" value="1" required />
                <label class="for-checkbox-option" for="${evaID}_1">1</label>
            
                <input class="checkbox-option" type="radio" name="${evaID}" id="${evaID}_2" value="2" />
                <label class="for-checkbox-option" for="${evaID}_2">2</label>
            
                <input class="checkbox-option" type="radio" name="${evaID}" id="${evaID}_3" value="3" />
                <label class="for-checkbox-option" for="${evaID}_3">3</label>
            
                <input class="checkbox-option" type="radio" name="${evaID}" id="${evaID}_4" value="4" />
                <label class="for-checkbox-option" for="${evaID}_4">4</label>
            
                <input class="checkbox-option" type="radio" name="${evaID}" id="${evaID}_5" value="5" />
                <label class="for-checkbox-option" for="${evaID}_5">5</label>
            
                <p>Strongly Agree</p>
            </div>
        `;
        questionsContainer.appendChild(questionDiv);
    });

    const questionDiv = document.createElement('div');
    // Fetch project data
    const projectRef = collection(firestore, 'project');
    const q = query(projectRef, where('project_manager', '==', userId), where('project_id', '==', projectId));
    const querySnapshot2 = await getDocs(q);

    if (!querySnapshot2.empty) {
        questionDiv.innerHTML += `
            <div class="InputTextarea">
                <label>Manager's Comment</label><br>
                <textarea name="managerComment" id="managerComment" required></textarea>
            </div>
        `;
    }
    questionsContainer.appendChild(questionDiv);
}



// For the submit Evaluation button
window.addEvaluate = async function (event) {
    event.preventDefault();

    const projectID = document.getElementById('evaProjectID').value;
    const memberID = document.getElementById('memberSelect').value;

    console.log(projectID);
    console.log(memberID);

    let totalWeightedRating = 0;
    let totalWeight = 0;

    // Validate
    if (memberSelect.value === '') {
        alert('Please select a team member.');
        return;
    }

    // Calculate the overall rating
    const weightInputs = document.querySelectorAll('input[name="evaWeight"]');
    const ratingInputs = document.querySelectorAll('input[type=radio]:checked');
    const questionIDInputs = document.querySelectorAll('input[name="evaQuestionID"]');

    if (ratingInputs.length !== weightInputs.length || ratingInputs.length !== questionIDInputs.length) {
        alert("Invalid form data. Please try again.");
        return;
    }

    ratingInputs.forEach((input, index) => {
        const rating = parseInt(input.value);
        const weight = parseInt(weightInputs[index].value);
        totalWeightedRating += rating * weight;
        totalWeight += weight;
    });

    // Calculate the average rating
    const averageRating = totalWeightedRating / totalWeight;
    const subRating = Math.max(1, Math.min(5, averageRating));

    const submittedEvaluations = [];

    // Save the submitted evaluation for each rating
    ratingInputs.forEach(async (input, index) => {
        const rating = parseInt(input.value);
        const evaID = questionIDInputs[index].value;

        submittedEvaluations.push({
            eva_id: evaID,
            given_rate: rating,
        });
    });

    await addDoc(collection(firestore, 'SubmittedEvaluations'), {
        project_id: projectID,
        evaluations: submittedEvaluations,
        uid: userId,
        received_uid: memberID,
    });

    console.log('Sub Rating:', subRating.toFixed(2));

    // Update in performance for the employee
    const performanceRef = collection(firestore, 'performance');
    const projectQuery = query(performanceRef, where('project_id', '==', projectID), where('uid', '==', memberID));
    const projectQuerySnapshot = await getDocs(projectQuery);

    if (!projectQuerySnapshot.empty) {
        projectQuerySnapshot.forEach(async (doc) => {
            const performanceDocRef = doc.ref;
            const performanceData = doc.data();

            const existingRating = parseFloat(performanceData.evaluation_rate) || 0;
            const totalRating = (existingRating + subRating) / 2;
            const updatedRating = Math.min(Math.max(totalRating, 1), 5);

            const finalRating = updatedRating.toFixed(2);

            console.log('Final Rating:', finalRating);

            // Update performance data
            await updateDoc(performanceDocRef, {
                evaluation_rate: finalRating,
                unsubmitID: performanceData.unsubmitID.filter(id => id !== userId),
            });

            console.log('Performance data updated successfully.');
        });
    } else {
        console.error('Performance data not found for the specified project and user.');
    }

    alert('Performance data updated successfully.');
    toRefresh();
}





// For Search
function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("evaluationTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[0];
        const managerColumn = rows[i].getElementsByTagName("td")[1];

        if (nameColumn || managerColumn) {
            const nameText = nameColumn.textContent || nameColumn.innerText;
            const managerText = managerColumn.textContent || managerColumn.innerText;

            if (nameText.toUpperCase().indexOf(filter) > -1 || managerText.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

function filterTable2() {
    const input = document.getElementById("searchInput2");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("performanceTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[0];

        if (nameColumn) {
            const nameText = nameColumn.textContent || nameColumn.innerText;

            if (nameText.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// Attach an event listener to the search input field
document.getElementById("searchInput").addEventListener("keyup", filterTable);
document.getElementById("searchInput2").addEventListener("keyup", filterTable2);


window.addEventListener('DOMContentLoaded', function () {

});

function toRefresh() {
    setTimeout(() => {
        location.reload();
    }, 1000);
}