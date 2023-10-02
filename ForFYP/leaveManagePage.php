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
            <h1>Leave Management</h1>
            <button class='add_btn' onclick="on()">Add Leave &nbsp;<i class='material-icons'>add</i></button>
        </div>

        <div class="table-block">
            <table class="leaveTable" id="leaveTable">
                <tr>
                    <th>ID</th>
                    <th>Leave Type</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th colspan='2'>Action</th>
                </tr>

            </table>
        </div>

        <div id="overlay" class="overlay">
            <form>
                <h3><b>Leave Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputText">
                    <input type="text" name="leaveType" id="leaveType" autocomplete="off" required>
                    <label>Leave Type</label><br />
                </div>

                <div class="InputText">
                    <input type="text" name="leaveName" id="leaveName" autocomplete="off" required>
                    <label>Leave Name</label><br />
                </div>

                <div class="InputText">
                    <input type="text" name="leaveAmount" id="leaveAmount" autocomplete="off" required>
                    <label>Amount</label><br />
                </div>

                <div class="addEmp-btn">
                    <input type="submit" name="Add" id="Add" value="Add Employee" class="addEmp"
                        onclick="addEmp(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function on() {
            document.getElementById("overlay").style.display = "block";
        }

        function off() {
            document.getElementById("overlay").style.display = "none";
        }

        window.addEventListener('DOMContentLoaded', function () {
            fetchUserDetails();
        });
    </script>

</body>

</html>