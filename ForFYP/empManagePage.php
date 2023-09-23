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
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th width='10%' colspan='2'>Action</th>
                </tr>


            </table>
        </div>

        <div id="overlay" class="overlay">
            <form>
                <h3><b>Employee Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputText">
                    <label>Name</label><br />
                    <input type="text" name="name" id="name" autocomplete="off">
                </div>

                <div class="InputText">
                    <label>Gender</label><br />
                    <input type="text" name="gender" id="gender">
                </div>

                <div class="InputText">
                    <label>Birth Date</label><br />
                    <input type="text" name="dob" id="dob">
                </div>

                <div class="InputText">
                    <label>Email</label><br />
                    <input type="text" name="email" id="email">
                </div>

                <div class="InputText">
                    <label>Address</label><br />
                    <input type="text" name="address" id="address">
                </div>

                <div class="InputText">
                    <label>Phone Number</label><br />
                    <input type="text" name="phoneNo" id="phoneNo">
                </div>

                <div class="overlay-add-btn">
                    <input type="submit" name="Update" id="Update" value="Update Profile" class="addEmp"
                        onclick="update(event)">

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
    </script>
</body>

</html>