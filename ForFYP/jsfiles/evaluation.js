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

        // Create a map to store merged project data
        const mergedProjects = new Map();

        // Function to add a project to the mergedProjects map
        function addProjectToMerged(project) {
            if (!mergedProjects.has(project.project_id)) {
                mergedProjects.set(project.project_id, [project]);
            } else {
                mergedProjects.get(project.project_id).push(project);
            }
        }

        // Process querySnapshotManager
        querySnapshotManager.forEach((projectDoc) => {
            const projectData = projectDoc.data();
            addProjectToMerged(projectData);
        });

        // Process querySnapshotUnsubmitID
        querySnapshotUnsubmitID.forEach((projectDoc) => {
            const projectData = projectDoc.data();
            addProjectToMerged(projectData);
        });

        // Iterate through merged projects and add to the table
        mergedProjects.forEach(async (projects, projectId) => {
            const mergedProjectData = projects[0];

            const endDate = new Date(mergedProjectData.end_date);

            // Check if there are evaluation questions for the project
            const evaluationQuestionsExist = await doEvaluationQuestionsExist(projectId);
            const submissionExist = await ifSubmitted(projectId, userId);

            if (endDate < currentDate) {
                if (evaluationQuestionsExist && submissionExist) {
                    const managerData = await getUserData(mergedProjectData.project_manager);
                    const row = evaluationTable.insertRow();

                    row.innerHTML = `
                        <td class="nameCol">${mergedProjectData.project_name}</td>
                        <td class="nameCol">${managerData}</td>
                        <td class="dateCol">${mergedProjectData.start_date}</td>
                        <td class="dateCol">${mergedProjectData.end_date}</td>
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

        // Function to check if user submitted evaluation
        async function ifSubmitted(projectId, userId) {
            const querySnapshot = await getDocs(
                query(collection(firestore, 'performance'), where('unsubmitID', 'array-contains', userId), where('project_id', '==', projectId))
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

        // Array to store promises
        const fetchPromises = [];

        projectsQuerySnapshot.forEach((projectDoc) => {
            const projectData = projectDoc.data();
            const projectId = projectData.project_id;

            // Query the performance collection for completed evaluations for the current user
            const performanceQuery = query(performanceRef, where('project_id', '==', projectId), where('uid', '==', userId));

            // Add the promise to the array
            fetchPromises.push(getDocs(performanceQuery));
        });

        // Use Promise.all to fetch performance data for all projects
        const performanceSnapshots = await Promise.all(fetchPromises);

        performanceSnapshots.forEach(async (performanceQuerySnapshot, index) => {
            if (!performanceQuerySnapshot.empty) {
                const performanceData = performanceQuerySnapshot.docs[0].data();
                const projectData = projectsQuerySnapshot.docs[index].data();

                if (performanceData.evaluation_rate != 0 && performanceData.evaluation_rate != null) {
                    const row = performanceTable.insertRow();
                    row.innerHTML = `
                        <td class="nameCol">${projectData.project_name}</td>
                        <td class="rateCol">${performanceData.evaluation_rate}</td>
                        ${performanceData.evaluation_review = "" ? `
                        <td class="descCol">${performanceData.evaluation_review}</td>
                        ` : '<td>Manager have not review yet</td>'}
                    `;

                }

            }
        });
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
                const hasPerformanceRecord = await checkPerformanceRecord(projectID, uid);

                if (hasPerformanceRecord) {
                    const userName = await getUserData(uid);
                    const option = document.createElement("option");
                    option.value = uid;
                    option.text = userName;
                    memberSelect.appendChild(option);
                }
            }
        }
    }
}

async function checkPerformanceRecord(projectID, uid) {
    const performanceRef = collection(firestore, 'performance');
    const performanceQuery = query(performanceRef, where('project_id', '==', projectID), where('uid', '==', uid));
    const performanceQuerySnapshot = await getDocs(performanceQuery);

    if (!performanceQuerySnapshot.empty) {
        const performanceDoc = performanceQuerySnapshot.docs[0].data();
        const unsubmitID = performanceDoc.unsubmitID;
        return unsubmitID.includes(userId);
    }

    return false;
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

// For submit Evaluation
window.addEvaluate = async function (event) {
    event.preventDefault();

    const projectID = document.getElementById('evaProjectID').value;
    const memberID = document.getElementById('memberSelect').value;
    const managerCommentInput = document.getElementById('managerComment');
    const managerComment = managerCommentInput ? managerCommentInput.value : '';

    let totalWeightedRating = 0;
    let totalWeight = 0;

    // Validate
    if (memberID === '') {
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

    // Include the managerComment if it exists
    if (managerComment) {
        submittedEvaluations.push({
            managerComment: managerComment,
        });
    }

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
            let updatedRating;

            if (existingRating === 0) {
                updatedRating = subRating;
            } else {
                const totalRating = (existingRating + subRating) / 2;
                updatedRating = Math.min(Math.max(totalRating, 1), 5);
            }

            finalRating = updatedRating.toFixed(2);

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


function toRefresh() {
    setTimeout(() => {
        location.reload();
    }, 1000);
}