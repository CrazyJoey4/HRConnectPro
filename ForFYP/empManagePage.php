<!DOCTYPE html>
<html>

<head>
    <title> Employee Management </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="topTitle">
            <h1>Employee Management</h1>
            <button class='add_btn' onclick="on()">Add Employee &nbsp;<i class='material-icons'>add</i></button>
        </div>

        <div class="table-block">
            <table class="userTable" id="userTable">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th colspan='2'>Action</th>
                </tr>

            </table>
        </div>

        <div id="overlay" class="overlay">
            <form>
                <h3><b>Employee Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputText">                    
                    <input type="text" name="name" id="name" autocomplete="off" required>
                    <label>Name</label><br />
                </div>

                <div class="InputText">                    
                    <input type="text" name="phoneNo" id="phoneNo" autocomplete="off" required>
                    <label>Phone Number</label><br />
                </div>

                <div class="InputText">                    
                    <input type="text" name="email" id="email" autocomplete="off" required>
                    <label>Email</label><br />
                </div>

                <br />

                <div class="addEmp-btn">
                    <input type="submit" name="Add" id="Add" value="Add Employee" class="addEmp"
                        onclick="addEmp(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script type="module" src="jsfiles/employee.js"></script>
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