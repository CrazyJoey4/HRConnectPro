<!DOCTYPE html>
<html>

<head>
    <title> Payroll </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="topTitle">
            <h1>Payroll</h1>
            <button class='add_btn' onclick="on()">Add Payroll &nbsp;<i class='material-icons'>add</i></button>
        </div>

        <div class="InputText search-box">
            <input type="text" id="searchInput" placeholder="Search by name or department">
        </div>

        <div class="table-block">
            <table class="detailsTable payrollTable" id="payrollTable">
                <tr>
                    <th class="idCol">ID</th>
                    <th class="nameCol">Name</th>
                    <th class="depCol">Department</th>
                    <th class="dateCol">Upload Date</th>
                    <th class="fileCol">File</th>
                    <th colspan='2'>Action</th>
                </tr>
            </table>
        </div>

        <div class="overlay-bg" id="overlayBg"></div>

        <div id="overlay" class="overlay">
            <form>
                <h3><b>Payroll Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputOption">
                    <select class="depOption" name="depOption" id="depOption" required>
                        <option value="">Select Department</option>
                    </select>
                </div>

                <div class="InputOption">
                    <select class="empOption" name="empOption" id="empOption" required>
                        <option value="">Select Employee</option>
                    </select>
                </div>

                <div class="InputFile">
                    <input type="file" name="empPayDoc" id="empPayDoc">
                </div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Add Payroll" class="addBtn" onclick="addPay(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>

        <div id="editOverlay" class="overlay">
            <form>
                <h3><b>Edit Payroll Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div style="display:none">
                    <input type="text" name="payID" id="payID">
                    <input type="text" name="empID" id="empID">
                </div>

                <div class="InputText">
                    <input type="text" name="editName" id="editName" autocomplete="off" readonly>
                </div>

                <div class="InputFile">
                    <input type="file" name="editPayDoc" id="editPayDoc">
                </div>

                <div class="addBtn-btn">
                    <input type="button" name="Save" id="editSave" value="Save Changes" class="addBtn"
                        onclick="saveUserChanges()">
                    <button type="button" class="cancelbtn" onclick="closeEditOverlay()">Cancel</button>
                </div>
            </form>
        </div>

    </div>

    <script type="module" src="jsfiles/payroll.js"></script>
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
            fetchPayrollDetails();
        });

        function closeEditOverlay() {
            document.getElementById("editOverlay").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";
        }
    </script>

</body>

</html>