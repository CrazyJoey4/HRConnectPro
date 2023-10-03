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

        <div class="InputText search-box">
            <input type="text" id="searchInput" placeholder="Search by name or email">
        </div>

        <div class="table-block">
            <table class="userTable" id="userTable">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
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
                    <input type="text" name="UserName" id="UserName" autocomplete="off" required>
                    <label>Name</label><br />
                </div>

                <div class="phoneInput">
                    <div class="InputText phoneCode">
                        <input type="text" name="countryCode" id="countryCode" autocomplete="off" value="+60" readonly>
                    </div>
                    <div class="InputText">
                        <input type="text" name="phoneNo" id="phoneNo" autocomplete="off" required>
                        <label>Phone Number</label>
                    </div>
                </div>

                <div class="forEmail">
                    <div class="InputText">
                        <input type="text" name="email" id="email" autocomplete="off" required>
                        <label>Email</label><br />
                    </div>
                    <div class="InputText emailCode">
                        <input type="text" name="constEmail" id="constEmail" value="@hrconnect.com" readonly>
                    </div>
                </div>

                <div class="InputOption">
                    <select class="depOption" name="depOption" id="depOption" required>
                        <option value="">Select Department</option>
                    </select>
                </div>

                <div class="InputOption">
                    <select class="posOption" name="posOption" id="posOption" required>
                        <option value="">Select Position</option>
                    </select>
                </div>

                <div class="InputText">
                    <input type="text" name="salary" id="salary" autocomplete="off" required>
                    <label>Salary</label><br />
                </div>

                <div class="addEmp-btn">
                    <input type="submit" name="Add" id="Add" value="Add Employee" class="addEmp"
                        onclick="addEmp(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>

        <div id="editOverlay" class="overlay">
            <form>
                <h3><b>Edit Employee Details</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputText" style="display:none">
                    <input type="text" name="empID" id="empID" readonly>
                    <label>ID</label><br />
                </div>

                <div class="InputText">
                    <input type="text" name="editName" id="editName" autocomplete="off" required>
                    <label>Name</label><br />
                </div>

                <div class="forEmail">
                    <div class="InputText">
                        <input type="text" name="editEmail" id="editEmail" autocomplete="off" required>
                        <label>Email</label><br />
                    </div>
                </div>

                <div class="InputOption">
                    <select class="depOption" name="editDepOption" id="editDepOption" required>
                        <option value="">Select Department</option>
                    </select>
                </div>

                <div class="InputOption">
                    <select class="posOption" name="editPosOption" id="editPosOption" required>
                        <option value="">Select Position</option>
                    </select>
                </div>

                <div class="InputText">
                    <input type="text" name="editSalary" id="editSalary" autocomplete="off" required>
                    <label>Salary</label><br />
                </div>

                <div class="addEmp-btn">
                    <input type="button" name="Save" id="editSave" value="Save Changes" class="addEmp"
                        onclick="saveUserChanges()">
                    <button type="button" class="cancelbtn" onclick="closeEditOverlay()">Cancel</button>
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

        function closeEditOverlay() {
            document.getElementById("editOverlay").style.display = "none";
        }
    </script>
</body>

</html>