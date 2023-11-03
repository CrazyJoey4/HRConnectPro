<!DOCTYPE html>
<html>

<head>
    <title> Performance </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <h1>Performance Record</h1>

        <div class="search_filter">
            <div class="InputOption">
                <label for="tableSelect">Select Table:</label>
                <select id="tableSelect" onchange="toggleTable()">
                    <option value="yetSubmitTable">Yet to Submit</option>
                    <option value="evaluation">Evaluation Records</option>
                </select>
            </div>
        </div>

        <br>

        <div class="table-block" id="evaTable">
            <div class="search_filter">
                <div class="InputText search-box">
                    <input type="text" id="searchInput" placeholder="Search by project name or project manager">
                </div>
            </div>

            <br>

            <table class="detailsTable evaluationTable" id="evaluationTable">
                <tr>
                    <th class="nameCol">Project Name</th>
                    <th class="nameCol">Project Manager</th>
                    <th class="dateCol">Start Date</th>
                    <th class="dateCol">End Date</th>
                    <th>Action</th>
                </tr>
            </table>
        </div>

        <div class="table-block" id="perTable" style="display:none">
            <div class="search_filter">
                <div class="InputText search-box">
                    <input type="text" id="searchInput2" placeholder="Search by project name">
                </div>
            </div>

            <br>

            <table class="detailsTable performanceTable" id="performanceTable">
                <tr>
                    <th class="nameCol">Project Name</th>
                    <th class="rateCol">Performance Rating</th>
                    <th class="descCol">Supervisor's Comments</th>
                </tr>
            </table>
        </div>

        <div class="overlay-bg" id="overlayBg"></div>

        <div id="overlay" class="overlay evaluationForm">
            <form>
                <h3><b>Evaluate Employee Performance</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputOption">
                    <select class="memberSelect" name="memberSelect" id="memberSelect" required>
                        <option value="">Select a Team Member</option>
                    </select>
                </div>

                <input style="display:none" type="text" name="evaProjectID" id="evaProjectID">

                <div id="Questions"></div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Submit Evaluation" class="addBtn"
                        onclick="addEvaluate(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>

    </div>

    <script type="module" src="jsfiles/evaluation.js"></script>
    <script>
        function on() {
            document.getElementById("overlayBg").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        }

        function off() {
            document.getElementById("overlayBg").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }

        window.addEventListener('DOMContentLoaded', function () {
            fetchEvaluationDetails();
            fetchPerformanceDetails();
        });

        function toggleTable() {
            const tableSelect = document.getElementById("tableSelect");
            const evaluationTable = document.getElementById("evaTable");
            const performanceTable = document.getElementById("perTable");

            if (tableSelect.value === "yetSubmitTable") {
                evaluationTable.style.display = "block";
                performanceTable.style.display = "none";
            }
            else if (tableSelect.value === "evaluation") {
                evaluationTable.style.display = "none";
                performanceTable.style.display = "block";
            }
        }

        // Function to close the reject overlay form
        function closeRejectOverlay() {
            document.getElementById("overlayBg").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }
    </script>
</body>

</html>