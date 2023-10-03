<!DOCTYPE html>
<html>

<head>
    <title> Department Management </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="topTitle">
            <h1>Department Management</h1>
            <div class="topBtn">
                <button class='add_btn' onclick="on()">Add Department &nbsp;<i class='material-icons'>add</i></button>
                <button class='add_btn' onclick="on2()">Add Position &nbsp;<i class='material-icons'>add</i></button>
            </div>
        </div>

        <div class="InputText search-box">
            <input type="text" id="searchInput" placeholder="Search by department name">
        </div>

        <div class="InputOption">
            <label for="tableSelect">Select Table:</label>
            <select id="tableSelect" onchange="toggleTable()">
                <option value="position">Position Table</option>
                <option value="department">Department Table</option>
            </select>
        </div>

        <div class="table-block" id="departmentDetailTable" style="display:none">
            <table class="detailsTable depTable" id="depTable">
                <tr>
                    <th class="idCol">ID</th>
                    <th class="nameCol">Name</th>
                    <th class="posCol">Manager Position ID</th>
                    <th colspan='2'>Action</th>
                </tr>
            </table>
        </div>

        <div class="table-block" id="positionDetailTable">
            <table class="detailsTable posTable" id="posTable">
                <tr>
                    <th class="idCol">Position ID</th>
                    <th class="depCol">Department</th>
                    <th class="posNameCol">Name</th>
                    <th colspan='2'>Action</th>
                </tr>
            </table>
        </div>

        <div class="overlay-bg" id="overlayBg"></div>

        <div id="overlay" class="overlay">
            <form>
                <h3><b>Department Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputText">
                    <input type="text" name="name" id="name" autocomplete="off" required>
                    <label>Name</label><br />
                </div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Add Department" class="addBtn"
                        onclick="adddep(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>

        <div id="editOverlay" class="overlay">
            <form>
                <h3><b>Edit Department Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div style="display:none">
                    <input type="text" name="depID" id="depID" readonly>
                </div>

                <div class="InputText">
                    <input type="text" name="editName" id="editName" autocomplete="off" required>
                    <label>Name</label><br />
                </div>

                <div class="addBtn-btn">
                    <input type="button" name="Save" id="editSave" value="Save Changes" class="addBtn"
                        onclick="saveDepChanges()">
                    <button type="button" class="cancelbtn" onclick="closeEditOverlay()">Cancel</button>
                </div>
            </form>
        </div>


        <div id="overlay2" class="overlay">
            <form>
                <h3><b>Position Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputOption">
                    <select class="depOption" name="depOption" id="depOption" required>
                        <option value="">Select Department</option>
                    </select>
                </div>

                <div class="InputText">
                    <input type="text" name="posName" id="posName" autocomplete="off" required>
                    <label>Position Name</label><br />
                </div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Add Position" class="addBtn"
                        onclick="addpos(event)">

                    <button type="reset" class="cancelbtn" onclick="off2()">Cancel</button>
                </div>
            </form>
        </div>

        <div id="editOverlay2" class="overlay">
            <form>
                <h3><b>Edit Position Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div style="display:none">
                    <input type="text" name="posID" id="posID" readonly>
                </div>

                <div class="InputText">
                    <input type="text" name="depName" id="depName" autocomplete="off" readonly>
                </div>

                <div class="InputText">
                    <input type="text" name="editPosName" id="editPosName" autocomplete="off" required>
                    <label>Name</label><br />
                </div>

                <div class="addBtn-btn">
                    <input type="button" name="Save" id="editSave" value="Save Changes" class="addBtn"
                        onclick="savePosChanges()">
                    <button type="button" class="cancelbtn" onclick="closeEditOverlay2()">Cancel</button>
                </div>
            </form>
        </div>


    </div>

    <script type="module" src="jsfiles/departmentMng.js"></script>
    <script>
        function on() {
            document.getElementById("overlayBg").style.display = "block";
            document.getElementById("overlay").style.display = "block";
        }

        function on2() {
            document.getElementById("overlayBg").style.display = "block";
            document.getElementById("overlay2").style.display = "block";
        }

        function off() {
            document.getElementById("overlayBg").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }

        function off2() {
            document.getElementById("overlayBg").style.display = "none";
            document.getElementById("overlay2").style.display = "none";
        }

        function closeEditOverlay() {
            document.getElementById("editOverlay").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";
        }

        function closeEditOverlay2() {
            document.getElementById("editOverlay2").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";
        }

        function toggleTable() {
            const tableSelect = document.getElementById("tableSelect");
            const departmentTable = document.getElementById("departmentDetailTable");
            const positionTable = document.getElementById("positionDetailTable");

            if (tableSelect.value === "department") {
                departmentTable.style.display = "block";
                positionTable.style.display = "none";
            } else if (tableSelect.value === "position") {
                departmentTable.style.display = "none";
                positionTable.style.display = "block";
            }
        }

        window.addEventListener('DOMContentLoaded', function () {
            fetchDepDetails();
            fetchPosDetails();
        });
    </script>
</body>

</html>