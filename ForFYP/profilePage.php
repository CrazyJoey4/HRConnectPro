<!DOCTYPE html>
<html>

<head>
    <title> Profile </title>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>


    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="profile-block">
            <form class="userForm" id="userForm" onsubmit="update(event)">
                <div class="container">
                    <h2 style="text-transform: uppercase;">Profile</h2>
                </div>

                <div class="profile-wrap">
                    <div class="InputText">
                        <label>Name</label><br />
                        <input type="text" name="name" id="name" autocomplete="off">
                    </div>

                    <div class="InputText" id="genderInput">
                        <label>Gender</label><br />
                        <input type="text" name="gender" id="gender" disabled>
                    </div>

                    <div class="option" id="genderOptions" style="text-align: left; display: none;">
                        <label>Gender</label>
                        <br>
                        <input class="checkbox-option" type="radio" name="User_gender" id="Male" value="Male" />
                        <label class="for-checkbox-option" for="Male">Male</label>

                        <input class="checkbox-option" type="radio" name="User_gender" id="Female" value="Female" />
                        <label class="for-checkbox-option" for="Female">Female</label>
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

                    <div class="update-btn">
                        <input type="submit" name="Update" id="Update" value="Update Profile" class="update"
                            onclick="update(event)">
                    </div>
                </div>
            </form>
        </div>
    </div>
    <script type="module" src="jsfiles/user.js"></script>

    <script>
        $(function () {
            $("#dob").datepicker({
                dateFormat: "yy-mm-dd", // Set the desired date format
                changeYear: true,      // Enable year dropdown
                changeMonth: true,
                yearRange: "1900:+0"  // Set the range of years (from 1900 to current year)
            });
        });
    </script>
</body>

</html>