<!DOCTYPE html>
<html>

<head>
    <title> Leave Management </title>
    <link rel="icon" href="media/hr-icon.png">

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

        <div class="InputText search-box">
            <input type="text" id="searchInput" placeholder="Search by name or type">
        </div>

        <div class="table-block">
            <table class="detailsTable leaveTable" id="leaveTable">
                <tr>
                    <th class="idCol">ID</th>
                    <th class="nameCol">Name</th>
                    <th class="typeCol">Type</th>
                    <th class="durationCol">Duration</th>
                    <th class="descCol">Description</th>
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
                    </select>
                </div>

                <div class="InputText">
                    <input type="number" name="credit" id="credit" autocomplete="off" required>
                    <label>Credit</label><br />
                </div>

                <div class="InputText">
                    <input type="text" name="desc" id="desc" autocomplete="off">
                    <label>Description</label><br />
                </div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Add Leave" class="addBtn" onclick="addleave(event)">

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
    </script>
</body>

</html>