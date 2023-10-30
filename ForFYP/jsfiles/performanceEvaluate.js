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

        querySnapshot.forEach((doc) => {
            const projectData = doc.data();

            const newRow = projectTable.insertRow();
            newRow.innerHTML = `
                <td>${projectData.project_name}</td>
                <td id="nameCol">${projectData.project_manager}</td>
                <td id="dateCol">${projectData.start_date}</td>
                <td id="dateCol">${projectData.end_date}</td>
                <td id="statusCol">${projectData.project_status}</td>
                <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="evaluationForm('${projectData.project_id}')"><i class='material-icons'>description</i></button></td>
                <td class="actioncol" id="actioncol1"><button class="editbtn" onclick="editProject('${projectData.project_id}')"><i class='material-icons'>edit</i></button></td>
                <td class="actioncol" id="actioncol2"><button class="editbtn" onclick="deleteProject('${projectData.project_id}')"><i class='material-icons'>delete</i></button></td>
                `;
        });
    }
});


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
async function generateEmp(selectedDep) {
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

// For generate employee
async function handleDepartmentChange() {
    const depSelect = document.getElementById("depOption");
    const managerInput = document.getElementById("manager");
    const selectedDep = depSelect.value;

    generateEmp(selectedDep);

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

                    // Update field
                    managerInput.value = managerName;
                } else {
                    managerInput.value = '';
                }
            } else {
                managerInput.value = '';
            }
        } else {
            managerInput.value = '';
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
    const PaysRef = collection(firestore, 'project');
    const querySnapshot = await getDocs(query(PaysRef, orderBy('project_id', 'desc'), limit(1)));

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
    const PaysRef = collection(firestore, 'evaluation');
    const querySnapshot = await getDocs(query(PaysRef, orderBy('eva_id', 'desc'), limit(1)));

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

// For add project
window.addProject = async function (event) {
    event.preventDefault();

    if (confirm("Are you sure the details are correct?")) {

        // Get project details from the form
        const projectManager = document.getElementById("manager").value;
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
        })
            .then(function (docRef) {
                alert("Project added!");
                toRefresh();
            })
            .catch(function (error) {
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


// For the create Evaluation button
window.evaluationForm = function (projectId) {
    const overlay = document.getElementById('overlay3');
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

    // Add new questions
    for (let index = 0; index < questionDivs.length; index++) {
        const question = questionDivs[index];
        const questionInput = question.querySelector('input[name="question[]"]');
        const weightInput = question.querySelector('input[name="weight[]"]');
        const questionText = questionInput.value.trim();
        const weight = parseInt(weightInput.value);

        if (questionText === '' || isNaN(weight) || weight < 1 || weight > 5) {
            hasEmptyFields = true;
            console.error(`Question ${index + 1} has invalid or empty fields.`);
        } else {
            generateNewEvaID().then(async (eva_id) => {
                await addDoc(collection(firestore, "evaluation"), {
                    eva_id: eva_id,
                    project_id: projectID,
                    eva_question: questionText,
                    eva_weight: weight,
                    question_number: index + 1,
                });
            });
        }
    }

    if (hasEmptyFields) {
        console.log('Please fill in all fields with valid data.');
        alert('Please fill in all fields with valid data.');
        return;
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