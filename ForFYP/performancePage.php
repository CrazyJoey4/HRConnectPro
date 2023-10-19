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
            <div class="InputText search-box">
                <input type="text" id="searchInput" placeholder="Search by employee name">
            </div>

            <div class="InputOption">
                <select class="projectFilter" name="projectFilter" id="projectFilter">
                    <option value="">Filter by Project</option>
                </select>
            </div>
        </div>

        <br>

        <div class="table-block">
            <table class="detailsTable performanceTable" id="performanceTable">
                <tr>
                    <th class="nameCol">Employee Name</th>
                    <th class="projectCol">Project</th>
                    <th class="rateCol">Performance Rating</th>
                    <th class="descCol">Supervisor's Comments</th>
                    <th class="dateCol">Date</th>
                    <th colspan='2'>Action</th>
                </tr>
            </table>
        </div>

        <div class="overlay-bg" id="overlayBg"></div>

        <div id="overlay" class="overlay">
            <form>
                <h3><b>Evaluate Employee Performance</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputOption">
                    <select class="projectSelect" name="projectSelect" id="projectSelect" required>
                        <option value="">Select a Project</option>
                    </select>
                </div>

                <div class="InputOption">
                    <select class="employeeSelect" name="employeeSelect" id="employeeSelect" required>
                        <option value="">Select an Employee</option>
                    </select>
                </div>

                <div id="customQuestions"></div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Add Leave" class="addBtn" onclick="addleave(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>

    </div>

</body>

</html>