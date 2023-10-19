<!DOCTYPE html>
<html>

<head>
    <title> Leave Management </title>
    <link rel="icon" href="media/hr-icon.png">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.3.0/crypto-js.js"></script>

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

        <div class="InputText search-box">
            <input type="text" id="searchInput" placeholder="Search by name or type">
        </div>

        <div class="table-block">
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
    </script>
</body>

</html>