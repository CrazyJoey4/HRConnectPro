<!DOCTYPE html>
<html>

<head>
    <title> Employee </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="topTitle">
            <h1>Employee List</h1>
        </div>

        <div class="InputText search-box">
            <input type="text" id="searchInput" placeholder="Search by name or email">
        </div>

        <div class="table-block">
            <table class="detailsTable userTable" id="userTable">
                <tr>
                    <th class="idCol">ID</th>
                    <th class="nameCol">Name</th>
                    <th class="emailCol">Email</th>
                    <th class="contactCol">Contact</th>
                    <th class="posCol">Position</th>
                    <th class="depCol">Department</th>
                </tr>

            </table>
        </div>
    </div>

    <script type="module" src="jsfiles/employeeView.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', function () {
            fetchEmployeeDetails();
        });
    </script>
</body>

</html>