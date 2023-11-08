import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, deleteUser } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, doc, getDocs, query, where, updateDoc, deleteDoc, addDoc, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

// Fetch project details
document.addEventListener("DOMContentLoaded", async function () {
    window.fetchprojectDetails = async function () {
        const projectTable = document.getElementById('projectTable');

        const projectRef = collection(firestore, 'project');
        const querySnapshot = await getDocs(query(projectRef));

        querySnapshot.forEach(async (doc) => {
            const projectData = doc.data();
            const managerName = await getManagerName(projectData.project_manager);

            // Check if there are related evaluation questions
            const hasEvaluationQuestions = await checkForEvaluationQuestions(projectData.project_id);

            const newRow = projectTable.insertRow();
            newRow.innerHTML = `
                <td>${projectData.project_name}</td>
                <td id="nameCol">${managerName}</td>
                <td id="dateCol">${projectData.start_date}</td>
                <td id="dateCol">${projectData.end_date}</td>
                <td id="statusCol">${projectData.project_status}</td>
                ${hasEvaluationQuestions ? `
                <td class="actioncol" id="actioncol3"><button class="editbtn" onclick="generatePDF('${projectData.project_id}')">View Evaluations</button></td>
                ` : '<td id="warningCol">Please update evaluation questions</td>'}
                <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="evaluationForm('${projectData.project_id}')"><i class='material-icons'>description</i></button></td>
                <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="editProject('${projectData.project_id}')"><i class='material-icons'>edit</i></button></td>
                <td class="actioncol" id="actioncol2"><button class="editbtn" onclick="deleteProject('${projectData.project_id}')"><i class='material-icons'>delete</i></button></td>
                `;
        });
    }

    // Function to check if there are related evaluation questions
    async function checkForEvaluationQuestions(projectID) {
        const querySnapshot = await getDocs(query(collection(firestore, 'evaluation'), where('project_id', '==', projectID)));
        return !querySnapshot.empty;
    }

});


// Function to retrieve the manager's name using the manager ID
async function getManagerName(managerID) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('uid', '==', managerID));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return userData.name;
    } else {
        return 'Manager Not Found';
    }
}

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

// For generate employee list
async function generateEmp(selectedDep, managerID) {
    const employeesSelect = document.getElementById("employeesSelect");
    employeesSelect.innerHTML = '';

    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("dep_id", "==", selectedDep));

    try {
        const Snapshot = await getDocs(q);
        if (!Snapshot.empty) {
            const ul = document.createElement('ul');

            // Create a "Select All" button
            const selectAllButton = document.createElement('button');
            selectAllButton.textContent = 'Select All';
            selectAllButton.className = 'addBtn selectAllBtn';

            selectAllButton.addEventListener('click', function () {
                event.preventDefault();
                const checkboxes = ul.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = true;
                });
                updateSelectedEmployees();
            });

            // Create "Select All" button
            const selectAllLabel = document.createElement('label');
            selectAllLabel.appendChild(selectAllButton);

            // Add the "Select All" to the list
            const selectAllLi = document.createElement('li');
            selectAllLi.appendChild(selectAllLabel);
            ul.appendChild(selectAllLi);

            Snapshot.forEach((doc) => {
                const empData = doc.data();


                if (empData.uid !== managerID) {
                    const li = document.createElement('li');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'checkbox-option';
                    checkbox.name = 'employees[]';
                    checkbox.value = empData.uid;

                    const label = document.createElement('label');
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(empData.name));

                    li.appendChild(label);
                    ul.appendChild(li);
                }
            });

            employeesSelect.appendChild(ul);
        }
    } catch (error) {
        console.error("Error getting users: ", error);
    }
}

const depInput = document.getElementById('depOption');
depInput.addEventListener('change', async function () {
    handleDepartmentChange();

    document.getElementById('selectedEmployeeNames').innerHTML = '';
});

// For generate employee and get manager name
async function handleDepartmentChange() {
    const depSelect = document.getElementById("depOption");
    const managerInput = document.getElementById("manager");
    const managerIDInput = document.getElementById("managerID");
    const selectedDep = depSelect.value;

    // generateEmp(selectedDep, managerID);

    const depRef = collection(firestore, 'department');
    const q = query(depRef, where('dep_id', '==', selectedDep));

    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const departmentData = querySnapshot.docs[0].data();
            const managerPid = departmentData.manager_pid;

            if (managerPid) {
                // find the manager by manager_pid
                const usersRef = collection(firestore, 'users');
                const userQuery = query(usersRef, where('pos_id', '==', managerPid));
                const userQuerySnapshot = await getDocs(userQuery);

                if (!userQuerySnapshot.empty) {
                    // Get the manager's name
                    const managerData = userQuerySnapshot.docs[0].data();
                    const managerName = managerData.name;
                    const managerID = managerData.uid;

                    // Update field
                    managerInput.value = managerName;
                    managerIDInput.value = managerID;

                    generateEmp(selectedDep, managerID);
                } else {
                    managerInput.value = '';
                    managerIDInput.value = '';
                }
            } else {
                managerInput.value = '';
                managerIDInput.value = '';
            }
        } else {
            managerInput.value = '';
            managerIDInput.value = '';
        }
    } catch (error) {
        console.error("Error querying department: ", error);
    }
}

// For showing selected employee
const employeesSelect = document.getElementById("employeesSelect");
employeesSelect.addEventListener("change", updateSelectedEmployees);

function updateSelectedEmployees() {
    const selectedEmployeeNames = document.getElementById('selectedEmployeeNames');
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="employees[]"]');
    const selectedNames = [];

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const label = checkbox.nextSibling;
            selectedNames.push(label.textContent);
        }
    });

    selectedEmployeeNames.innerHTML = '';

    if (selectedNames.length > 0) {
        const ol = document.createElement('ol');
        selectedNames.forEach((name) => {
            const li = document.createElement('li');
            li.textContent = name;
            ol.appendChild(li);
        });
        selectedEmployeeNames.appendChild(ol);
    } else {
        selectedEmployeeNames.innerHTML = 'No employees selected';
    }
}


// For genetrate project ID
async function generateNewID() {
    const ProjectRef = collection(firestore, 'project');
    const querySnapshot = await getDocs(query(ProjectRef, orderBy('project_id', 'desc'), limit(1)));

    let newUID = 'P000001';

    if (!querySnapshot.empty) {
        const lastUID = querySnapshot.docs[0].data().project_id;
        const numericPart = parseInt(lastUID.slice(1), 10) + 1;

        if (!isNaN(numericPart)) {
            const formattedNumericPart = String(numericPart).padStart(6, '0');
            newUID = `P${formattedNumericPart}`;
        } else {
            console.error("Failed to parse numeric part of the ID.");
        }
    }
    return newUID;
}

// For genetrate evaluation ID
async function generateNewEvaID() {
    const EvaluateRef = collection(firestore, 'evaluation');
    const querySnapshot = await getDocs(query(EvaluateRef, orderBy('eva_id', 'desc'), limit(1)));

    let newUID = 'E000001';

    if (!querySnapshot.empty) {
        const lastUID = querySnapshot.docs[0].data().project_id;
        const numericPart = parseInt(lastUID.slice(1), 10) + 1;

        if (!isNaN(numericPart)) {
            const formattedNumericPart = String(numericPart).padStart(6, '0');
            newUID = `E${formattedNumericPart}`;
        } else {
            console.error("Failed to parse numeric part of the ID.");
        }
    }
    return newUID;
}

// For genetrate performance ID
async function generateNewPerID() {
    const PerRef = collection(firestore, 'performance');
    const querySnapshot = await getDocs(query(PerRef, orderBy('per_id', 'desc'), limit(1)));

    let newUID = 'PF000001';

    if (!querySnapshot.empty) {
        const lastUID = querySnapshot.docs[0].data().project_id;
        const numericPart = parseInt(lastUID.slice(2), 10) + 1;

        if (!isNaN(numericPart)) {
            const formattedNumericPart = String(numericPart).padStart(6, '0');
            newUID = `PF${formattedNumericPart}`;
        } else {
            console.error("Failed to parse numeric part of the ID.");
        }
    }
    return newUID;
}

// For add project
window.addProject = async function (event) {
    event.preventDefault();

    if (confirm("Are you sure the details are correct?")) {

        // Get project details from the form
        const projectManager = document.getElementById("managerID").value;
        const projectName = document.getElementById("name").value;
        const projectDescription = document.getElementById("description").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;


        const employeeSelect = document.querySelectorAll('.checkbox-option');
        const selectedEmployees = [];

        employeeSelect.forEach(checkbox => {
            if (checkbox.checked) {
                selectedEmployees.push(checkbox.value);
            }
        });

        // Validate fields
        if (projectName === "" || startDate === "" || endDate === "" || projectDescription === "" || selectedEmployees.length === 0) {
            alert('Please fill in all required fields and select at least one employee!');
            return;
        }

        // Capitalize the first letter of each word in the name
        let capitalizedName = projectName.toLowerCase().replace(/\b\w/g, function (l) {
            return l.toUpperCase();
        });


        const ProjectID = await generateNewID();

        addDoc(collection(firestore, "project"), {
            project_id: ProjectID,
            uid: selectedEmployees,
            project_manager: projectManager,
            project_name: capitalizedName,
            project_status: "Ongoing",
            project_desc: projectDescription,
            start_date: startDate,
            end_date: endDate,
        }).then(function (projectDocRef) {
            alert("Project added!");

            // Create performance records for each team member
            const performancePromises = selectedEmployees.map(async employeeID => {
                const performanceID = await generateNewPerID();
                const per_id = `${performanceID}_${employeeID}`;
                const unsubmitID = [...selectedEmployees, projectManager].filter(id => id !== employeeID);

                return addDoc(collection(firestore, 'performance'), {
                    per_id: per_id,
                    project_id: ProjectID,
                    uid: employeeID,
                    manager_id: projectManager,
                    evaluation_rate: 0,
                    evaluation_review: '',
                    unsubmitID: unsubmitID,
                }).then(() => {
                    console.log("Performance record created for employee: " + employeeID);
                }).catch(error => {
                    console.error("Error creating performance record for employee " + employeeID + ": " + error);
                    alert("Error creating performance record for employee " + employeeID + ": " + error);
                });
            });

            Promise.all(performancePromises)
                .then(() => {
                    console.log("Performance records created for all team members completed");
                    alert("Performance records created for all team members completed");
                })
                .catch(error => {
                    console.error("Error creating performance records for team members: " + error);
                    alert("Error creating performance records for team members: " + error);
                });

        }).then(() => {
            toRefresh();
        }).catch(function (error) {
            console.error("Error adding project: ", error);
            alert("Error adding project: " + error);
        });

        // Clear form
        document.getElementById("overlay").style.display = "none";
        document.getElementById("overlayBg").style.display = "none";

        // Reset form fields and selected options
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        employeesSelect.selectedIndex = -1;
    }
}

// For Edit project
window.editProject = async function (projectID) {
    const projectRef = collection(firestore, 'project');
    const projectQuery = query(projectRef, where('project_id', '==', projectID));

    getDocs(projectQuery)
        .then(async (querySnapshot) => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const projectData = doc.data();

                const managerName = await getManagerName(projectData.project_manager);

                document.getElementById("projectID").value = projectID;
                document.getElementById("editName").value = projectData.project_name;
                document.getElementById("editManager").value = managerName;
                document.getElementById("editDescription").value = projectData.project_desc;
                document.getElementById("statusOption").value = projectData.project_status;

                // Retrieve and display the names of selected project members
                const membersRef = collection(firestore, 'project');
                const membersQuery = query(membersRef, where('project_id', '==', projectID));
                getDocs(membersQuery)
                    .then(async (membersSnapshot) => {
                        if (!membersSnapshot.empty) {
                            const selectedEmployeeNames = [];

                            // Assuming you have a "users" collection where you store employee names
                            const usersRef = collection(firestore, 'users');

                            for (const memberDoc of membersSnapshot.docs) {
                                const memberData = memberDoc.data();
                                const employeeID = memberData.uid;

                                // Retrieve the employee name
                                const userQuery = query(usersRef, where('uid', '==', employeeID));
                                const userSnapshot = await getDocs(userQuery);

                                if (!userSnapshot.empty) {
                                    const userData = userSnapshot.docs[0].data();
                                    const employeeName = userData.name;
                                    selectedEmployeeNames.push(employeeName);
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching project members:', error);
                    });

                document.getElementById("overlay2").style.display = "block";
                document.getElementById("overlayBg").style.display = "block";
            } else {
                console.log('Project not found.');
            }
        })
        .catch((error) => {
            console.log('Error fetching project details:', error);
        });
}

// For Save edited project details
window.saveProjectChanges = async function (event) {
    event.preventDefault();

    const projectID = document.getElementById("projectID").value;
    const newProjectName = document.getElementById("editName").value;
    const newProjectManager = document.getElementById("editManager").value;
    const newProjectDescription = document.getElementById("editDescription").value;
    const newProjectStatus = document.getElementById("statusOption").value;

    // Validate fields
    if (!newProjectName || !newProjectManager || !newProjectDescription || !newProjectStatus) {
        alert('Please fill in all the project details.');
        return;
    }

    const projectRef = collection(firestore, 'project');
    const projectQuery = query(projectRef, where('project_id', '==', projectID));

    getDocs(projectQuery)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const projectDocRef = doc.ref;

                return updateDoc(projectDocRef, {
                    project_name: newProjectName,
                    project_manager: newProjectManager,
                    project_desc: newProjectDescription,
                    project_status: newProjectStatus,
                }).then(() => {
                    alert("Project details updated successfully.");
                }).catch((error) => {
                    console.error("Error updating project details:", error);
                });
            } else {
                console.log('Project not found.');
            }
        })
        .catch((error) => {
            console.log('Error fetching project details:', error);
        });

    document.getElementById("overlay2").style.display = "none";
    document.getElementById("overlayBg").style.display = "none";

    toRefresh();
}

// For delete project
window.deleteProject = async function (projectId) {
    if (confirm("Are you sure you want to delete this Project?")) {
        try {
            // Delete evaluation records related to the project
            const evaluationQuery = query(collection(firestore, 'evaluation'), where('project_id', '==', projectId));
            const evaluationSnapshot = await getDocs(evaluationQuery);

            evaluationSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log("Evaluation record deleted successfully");
            });

            // Delete performance records related to the project
            const performanceQuery = query(collection(firestore, 'performance'), where('project_id', '==', projectId));
            const performanceSnapshot = await getDocs(performanceQuery);

            performanceSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log("Performance record deleted successfully");
            });

            // Finally, delete the project record
            const projectRef = collection(firestore, 'project');
            const q = query(projectRef, where('project_id', '==', projectId));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log("Project record deleted successfully");
            });

            alert("Project and related records deleted successfully");
            toRefresh();
        } catch (error) {
            console.error("Error deleting Project and related records:", error);
        }
    }
}



// For the create Evaluation button
window.evaluationForm = function (projectId) {
    const overlayBg = document.getElementById('overlayBg');
    const overlay = document.getElementById('overlay3');
    overlayBg.style.display = 'block';
    overlay.style.display = 'block';

    const evaForm = document.getElementById('evaluationQuestions');
    evaForm.innerHTML = '';

    // Set the project name in the form
    const projectID = document.getElementById('evaProjectID');
    projectID.value = projectId;

    const projectNameField = document.getElementById('projectName');

    const projectRef = collection(firestore, 'project');
    const q = query(projectRef, where('project_id', '==', projectId));

    getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
            const projectData = querySnapshot.docs[0].data();
            const projectName = projectData.project_name;
            projectNameField.value = projectName;
        } else {
            console.log('Project document does not exist');
        }
    }).catch((error) => {
        console.log('Error fetching project profile:', error);
    });
}

// For saving evaluation criteria
window.saveEvaluation = async function (event) {
    event.preventDefault();

    const projectID = document.getElementById('evaProjectID').value;
    const evaluationQuestions = document.getElementById('evaluationQuestions');
    const questionDivs = evaluationQuestions.getElementsByClassName('question');

    let hasEmptyFields = false;

    const existingQuestionsQuery = query(
        collection(firestore, 'evaluation'),
        where('project_id', '==', projectID)
    );

    const existingQuestionsSnapshot = await getDocs(existingQuestionsQuery);

    // Add new questions
    for (let index = 0; index < questionDivs.length; index++) {
        const question = questionDivs[index];
        const questionInput = question.querySelector('input[name="question[]"]');
        const weightInput = question.querySelector('input[name="weight[]"]');
        const questionText = questionInput.value.trim();
        const weight = parseInt(weightInput.value);

        if (questionText === '' || isNaN(weight) || weight < 1 || weight > 5) {
            hasEmptyFields = true;

            alert('Please fill in all fields with valid data.');
            console.error(`Question ${index + 1} has invalid or empty fields.`);

            return;
        } else {
            generateNewEvaID().then(async (eva_id) => {
                const newEva_id = `${eva_id}_${index + 1}`;
                console.log(newEva_id);

                await addDoc(collection(firestore, "evaluation"), {
                    eva_id: newEva_id,
                    project_id: projectID,
                    eva_question: questionText,
                    eva_weight: weight,
                    question_number: index + 1,
                });
            });
        }
    }

    if (existingQuestionsSnapshot.size > 0) {
        const deleteConfirmation = confirm('There are existing questions. Do you want to replace them with new questions?');

        if (!deleteConfirmation) {
            return;
        }

        // User confirmed, delete existing questions
        existingQuestionsSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    }

    console.log('Questions updated successfully.');
    alert('Questions updated successfully.');
    toRefresh();
}



// For Search
function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("projectTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const nameColumn = rows[i].getElementsByTagName("td")[0];

        if (nameColumn || departmentColumn) {
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

// For generate PDF
window.generatePDF = async function (projectID) {
    const evaluationQuestions = await fetchEvaluationQuestions(projectID);

    const documentDefinition = {
        content: [
            { text: 'Evaluation Questions', style: 'header' },
            evaluationQuestions.map((question, index) => ({ text: `${index + 1}. ${question}`, style: 'question' }))
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 20]
            },
            question: {
                fontSize: 12,
                margin: [0, 0, 0, 10]
            }
        }
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

    // Generate a blob from the PDF
    pdfDocGenerator.getBlob((blob) => {
        const objectURL = URL.createObjectURL(blob);
        window.open(objectURL, '_blank');
    });
}

async function fetchEvaluationQuestions(projectID) {
    const questions = [];

    const querySnapshot = await getDocs(query(collection(firestore, 'evaluation'), where('project_id', '==', projectID), orderBy('question_number', 'asc')));

    querySnapshot.forEach((doc) => {
        const questionData = doc.data();
        questions.push(`Weight: ${questionData.eva_weight} - ${questionData.eva_question}`);
    });

    return questions;
}