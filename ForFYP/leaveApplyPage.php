<!DOCTYPE html>
<html>

<head>
    <title> Leave Management </title>
    <link rel="icon" href="media/hr-icon.png">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.9/index.global.min.js'></script>
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.0/main.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.0/main.min.js"></script>

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="topTitle">
            <h1>Apply Leave</h1>
            <button class='add_btn' onclick="on()">Apply Leave &nbsp;<i class='material-icons'>add</i></button>
        </div>

        <hr style="border-bottom:2px solid grey;">

        <div id='calendar'></div>

        <div class="InputOption">
            <label for="tableSelect">Select Table:</label>
            <select id="tableSelect" onchange="toggleTable()">
                <option value="active">Active</option>
                <option value="all">All History</option>
            </select>
        </div>

        <div class="table-block" id="ActiveDetailTable">
            <table class="detailsTable leaveTable" id="leaveTable">
                <tr>
                    <th class="typeCol">Type</th>
                    <th class="durationCol">Duration</th>
                    <th class="dateCol">Start Date</th>
                    <th class="dateCol">End Date</th>
                    <th class="statusCol">Status</th>
                    <th class="docCol">Document</th>
                    <th colspan='2'>Action</th>
                </tr>
            </table>
        </div>

        <div class="table-block" id="AllDetailTable" style="display:none">
            <table class="detailsTable allLeaveTable" id="leaveAllTable">
                <tr>
                    <th class="typeCol">Type</th>
                    <th class="durationCol">Duration</th>
                    <th class="dateCol">Start Date</th>
                    <th class="dateCol">End Date</th>
                    <th class="statusCol">Status</th>
                    <th class="docCol">Document</th>
                    <th colspan='2' class="descCol">Remarks</th>
                </tr>
            </table>
        </div>

        <div class="overlay-bg" id="overlayBg"></div>

        <div id="overlay" class="overlay">
            <form>
                <h3><b>Apply Leave Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputOption">
                    <select class="typeOption" name="typeOption" id="typeOption" required>
                        <option value="">Select Type</option>
                    </select>
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

                <div class="InputText">
                    <input type="text" name="desc" id="desc" autocomplete="off">
                    <label>Description</label><br />
                </div>

                <label>Attach File (optional)</label><br />
                <div class="InputFile">
                    <input type="file" name="leaveDoc" id="leaveDoc">
                </div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Add Leave" class="addBtn"
                        onclick="applyleave(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>

    </div>

    <script type="module" src="jsfiles/leaveApply.js"></script>
    <script>
        function on() {
            document.getElementById("overlay").style.display = "block";
            document.getElementById("overlayBg").style.display = "block";
        }

        function off() {
            document.getElementById("overlay").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";
        }

        function closeEditOverlay() {
            document.getElementById("editOverlay").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";
        }

        window.addEventListener('DOMContentLoaded', function () {
            fetchLeaveDetails();
            fetchAllLeaveDetails();
        });

        $(function () {
            const today = new Date();
            const currentYear = today.getFullYear();
            const yearRange = currentYear + ':' + currentYear;

            $("#startDate").datepicker({
                dateFormat: "yy-mm-dd",
                changeYear: true,
                changeMonth: true,
                yearRange: yearRange,
                minDate: today,
            });

            $("#endDate").datepicker({
                dateFormat: "yy-mm-dd",
                changeYear: true,
                changeMonth: true,
                yearRange: yearRange,
                minDate: today,
            });
        });

        function toggleTable() {
            const tableSelect = document.getElementById("tableSelect");
            const activeTable = document.getElementById("ActiveDetailTable");
            const allTable = document.getElementById("AllDetailTable");

            if (tableSelect.value === "active") {
                activeTable.style.display = "block";
                allTable.style.display = "none";
            }
            else if (tableSelect.value === "all") {
                activeTable.style.display = "none";
                allTable.style.display = "block";
            }
        }
    </script>
</body>

</html>