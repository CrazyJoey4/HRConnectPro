<!DOCTYPE html>
<html>

<head>
    <title> Performance </title>
    <link rel="icon" href="media/hr-icon.png">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/vfs_fonts.js"></script>

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="topTitle">
            <h1>Performance Management</h1>
            <button class='add_btn' onclick="on()">Add Project &nbsp;<i class='material-icons'>add</i></button>
        </div>

        <div class="search_filter">
            <div class="InputText search-box">
                <input type="text" id="searchInput" placeholder="Search by project name">
            </div>
        </div>

        <br>

        <div class="table-block">
            <table class="detailsTable projectTable" id="projectTable">
                <tr>
                    <th class="projectCol">Project</th>
                    <th class="nameCol">Project Manager</th>
                    <th class="dateCol">Start Date</th>
                    <th class="dateCol">End Date</th>
                    <th class="statusCol">Status</th>
                    <th class="statusCol">Evaluation</th>

                    <th colspan='3'>Action</th>
                </tr>
            </table>
        </div>

        <div class="overlay-bg" id="overlayBg"></div>


        <!-- Add Project Form -->
        <div id="overlay" class="overlay projectForm">
            <form>
                <h3><b>Project Details</b></h3>
                <hr style="border-bottom:2px solid grey;">

                <div class="InputText">
                    <input type="text" name="name" id="name" autocomplete="off" required>
                    <label>Project Name</label><br>
                </div>

                <div class="InputOption">
                    <select class="depOption" name="depOption" id="depOption" required>
                        <option value="">Select Department</option>
                    </select>
                </div>

                <div class="InputText">
                    <input style="display:none" type="text" name="managerID" id="managerID">
                    <input type="text" name="manager" id="manager" required readonly>
                    <label>Project Manager</label><br>
                </div>

                <div class="employeeSelect_flex">
                    <div class="InputOption selectWrap">
                        <label>Select Project Members</label><br>
                        <div id="employeesSelect"></div>
                    </div>

                    <div class="selectedEmployees selectWrap showNames">
                        <label>Selected Employees:</label>
                        <div id="selectedEmployeeNames"></div>
                    </div>
                </div>

                <div class="InputTextarea">
                    <label>Project Description</label><br>
                    <textarea name="description" id="description" required></textarea>
                </div>

                <div class="forDate">
                    <div class="InputText">
                        <label>Start Date</label><br />
                        <input type="text" name="startDate" id="startDate">
                    </div>

                    <div class="InputText">
                        <label>End Date</label><br />
                        <input type="text" name="endDate" id="endDate">
                    </div>
                </div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Add Project" class="addBtn"
                        onclick="addProject(event)">
                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>


        <!-- Edit Project Details -->
        <div id="overlay2" class="overlay editProjectForm">
            <form>
                <h3><b>Project Evaluation Details</b></h3>
                <hr style="border-bottom:2px solid grey;">

                <div style="display:none">
                    <input type="text" name="projectID" id="projectID">
                </div>

                <div class="InputText">
                    <input type="text" name="editName" id="editName" autocomplete="off" required>
                    <label>Project Name</label><br>
                </div>

                <div class="InputText">
                    <input type="text" name="editManager" id="editManager" required readonly>
                    <label>Project Manager</label><br>
                </div>

                <div class="InputTextarea">
                    <label>Project Description</label><br>
                    <textarea name="editDescription" id="editDescription" required></textarea>
                </div>

                <div class="InputOption">
                    <select class="statusOption" name="statusOption" id="statusOption" required>
                        <option value="">Select Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Save Changes" class="addBtn"
                        onclick="saveProjectChanges(event)">
                    <button type="reset" class="cancelbtn" onclick="off2()">Cancel</button>
                </div>
            </form>
        </div>


        <!-- For evaluation Form -->
        <div id="overlay3" class="overlay evaluationForm">
            <form id="evaluationForm">
                <h3><b>Add Evaluation Questions</b></h3>
                <hr style="border-bottom:2px solid grey;">

                <div class="InputText">
                    <input style="display:none" type="text" name="evaProjectID" id="evaProjectID">
                    <input type="text" name="projectName" id="projectName" required readonly>
                    <label>Project Name</label><br>
                </div>

                <div id="evaluationQuestions">
                    <div id="question"></div>
                </div>

                <div class="addBtn-btn">
                    <button type="button" onclick="addQuestionInput()" class="addBtn">Add Question</button>
                </div>

                <div class="addBtn-btn">
                    <input type="submit" class="addBtn" onclick="saveEvaluation(event)" name="saveQuestions"
                        id="saveQuestions" value="Add Evaluation">
                    <button type="reset" class="cancelbtn" onclick="off3()">Cancel</button>
                </div>
            </form>
        </div>

    </div>

    <script type="module" src="jsfiles/performanceMng.js"></script>
    <script>
        function on() {
            document.getElementById("overlayBg").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        }

        function off() {
            document.getElementById('employeesSelect').innerHTML = "";
            document.getElementById("overlayBg").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }

        function off2() {
            document.getElementById("overlayBg").style.display = "none";
            document.getElementById("overlay2").style.display = "none";
        }

        function off3() {
            document.getElementById("overlayBg").style.display = "none";
            document.getElementById("overlay3").style.display = "none";
        }

        window.addEventListener('DOMContentLoaded', function () {
            fetchprojectDetails();
        });

        function closeEditOverlay() {
            document.getElementById("editOverlay").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";
        }

        $(function () {
            const today = new Date();
            const currentYear = today.getFullYear();
            const nextYear = currentYear + 1;
            const yearRange = currentYear + ':' + nextYear;

            $("#startDate").datepicker({
                dateFormat: "yy-mm-dd",
                changeYear: true,
                changeMonth: true,
                yearRange: yearRange,
                minDate: today,
                onSelect: function (selectedDate) {
                    $("#endDate").datepicker("option", "minDate", selectedDate);
                }
            });

            $("#endDate").datepicker({
                dateFormat: "yy-mm-dd",
                changeYear: true,
                changeMonth: true,
                yearRange: yearRange,
                minDate: today,
            });
        });

        // Function to update question numbers
        function updateQuestionNumbers() {
            const form = document.getElementById('evaluationQuestions');
            const questionDivs = form.getElementsByClassName('question');
            const showButton = document.getElementById('saveQuestions');

            for (let i = 0; i < questionDivs.length; i++) {
                const questionLabel = questionDivs[i].querySelector('label');
                questionLabel.textContent = `Question ${i + 1}:`;
            }

            if (questionDivs.length == 0) {
                showButton.style.display = 'none';
            } else {
                showButton.style.display = 'block';
            }
        }


        // Function to remove a question section
        function removeQuestion(button) {
            if (confirm("Are you sure you want to delete this question?")) {
                const questionDiv = button.parentElement.parentElement;
                questionDiv.remove();

                updateQuestionNumbers();
            }
        }

        // Function to add a new question input
        function addQuestionInput() {
            const form = document.getElementById('evaluationQuestions');
            const questionDivs = document.getElementsByClassName('question');
            const questionCount = questionDivs.length + 1;

            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');

            questionDiv.innerHTML = `
                <label for="question${questionCount}">Question ${questionCount}:</label>
                <div class="InputText dyQuestion evaQuestion">
                    <input type="text" name="question[]" placeholder="Evaluation Question" id="question${questionCount}" required>
                </div>
                <div class="InputText dyQuestion evaWeight">
                    <input type="number" name="weight[]" placeholder="Weight (1-5)" min="1" max="5" required>
                </div>
                <div class="addBtn-btn removeBtn">
                    <button type="button" class="cancelbtn" onclick="removeQuestion(this)">Remove</button>
                </div>
            `;

            form.appendChild(questionDiv);
            updateQuestionNumbers();
        }
        updateQuestionNumbers();
    </script>

</body>

</html>