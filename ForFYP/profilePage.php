<!DOCTYPE html>
<html>

<head>
    <title> Profile </title>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.3.0/crypto-js.js"></script>

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
                        <input type="number" name="phoneNo" id="phoneNo">
                    </div>

                    <div class="forBank">
                        <div class="InputOption">
                            <select class="bankType" name="bankType" id="bankType">
                                <option>Select Bank Type</option>
                            </select>
                        </div>

                        <div class="InputText">
                            <label>Bank Number</label><br />
                            <input type="number" name="bankNo" id="bankNo">
                        </div>
                    </div>

                    <div class="InputText InputOption">
                        <label>Marital Status</label>
                        <br>
                        <select class="maritalOptions" name="maritalOptions" id="maritalOptions">
                            <option>Select Marital Status</option>
                            <option value="1">Single</option>
                            <option value="2">Married</option>
                            <option value="3">Divorced</option>
                            <option value="4">Separated</option>
                            <option value="5">Widowed</option>
                        </select>
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
                dateFormat: "yy-mm-dd",
                changeYear: true,
                changeMonth: true,
                yearRange: "1900:+0"
            });
        });
    </script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            fetch('malaysiaBank.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        const bankTypeSelect = document.getElementById('bankType');

                        // Loop through the data and add options to the select element
                        data.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.name;

                            option.appendChild(document.createTextNode(`${item.name}`));

                            bankTypeSelect.appendChild(option);
                        });
                    } else {
                        console.error('Invalid JSON format: data is not an array.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching or parsing country codes:', error);
                });
        });
    </script>
</body>

</html>