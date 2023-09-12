<!DOCTYPE html>
<html>

<head>
    <title> Profile </title>
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
                        <input type="text" name="name" id="name">
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

                    <div class="update-btn">
                        <input type="submit" name="Update" id="Update" value="Update Profile" class="update"
                            onclick="update(event)">
                    </div>
                </div>
            </form>
        </div>
    </div>
    <script type="module" src="jsfiles/user.js"></script>
</body>

</html>