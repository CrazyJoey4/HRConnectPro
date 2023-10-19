<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.css"
        integrity="sha512-Z0kTB03S7BU+JFU0nw9mjSBcRnZm2Bvm0tzOX9/OuOuz01XQfOpa0w/N9u6Jf2f1OAdegdIPWZ9nIZZ+keEvBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <link rel="stylesheet" href="./cssfiles/main.css">
    <script type="module" src="jsfiles/auth.js">
        window.addEventListener('DOMContentLoaded', function () {
            checkLoggedIn();
        });
    </script>

</head>

<body>
    <nav>
        <!-- For Navigation Bar -->
        <div class="sidenav">
            <div class="topwrap">
                <img class="logo" src="media/hr-icon(trans).png" />
                <h3>HRConnect Pro</h3>
            </div>

            <hr>

            <ul>
                <li><a href="dashboard.php" <?php if (basename($_SERVER['PHP_SELF']) == 'dashboard.php')
                    echo 'class="active"'; ?>><span class="fa fa-television"></span> Dashboard </a></li>

                <li><a href="employeePage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'employeePage.php')
                    echo 'class="active"'; ?>><span class="fa fa-user-tie"></span> Employee </a></li>

                <li><a href="leaveApplyPage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'leaveApplyPage.php')
                    echo 'class="active"'; ?>><span class="fa fa-calendar"></span> Leave </a></li>

                <li><a href="attendancePage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'attendancePage.php')
                    echo 'class="active"'; ?>><span class="fa fa-check"></span> Attendance </a></li>

                <li><a href="performancePage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'performancePage.php')
                    echo 'class="active"'; ?>><span class="fa fa-trophy"></span> Performance Record </a></li>

                <li><a href="viewPayrollPage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'viewPayrollPage.php')
                    echo 'class="active"'; ?>><span class="fa fa-wallet"></span> Payroll </a></li>

                <li><a href="addfeedbackPage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'addfeedbackPage.php')
                    echo 'class="active"'; ?>><span class="fa fa-comment-dots"></span> Feedback </a></li>

                <li><a href="supportPage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'supportPage.php')
                    echo 'class="active"'; ?>><span class="fa fa-question"></span> FAQs </a></li>

            </ul>
            <div id="management_part" style="display:none">
                <hr>

                <h4>Management</h4>

                <ul class="management_tab">
                    <li><a href="empManagePage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'empManagePage.php')
                        echo 'class="active"'; ?>><span class="fa fa-user-tie"></span> Employee Management </a></li>

                    <li><a href="performanceMnagePage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'performanceMnagePage.php')
                        echo 'class="active"'; ?>><span class="fa fa-bullseye"></span> Project Performance </a></li>

                    <li><a href="leaveManagePage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'leaveManagePage.php')
                        echo 'class="active"'; ?>><span class="fa fa-calendar"></span> Leave Approval </a></li>

                    <li><a href="payrollPage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'payrollPage.php')
                        echo 'class="active"'; ?>><span class="fa fa-wallet"></span> Payroll </a></li>

                    <li><a href="feedbackPage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'feedbackPage.php')
                        echo 'class="active"'; ?>><span class="fa fa-comment-dots"></span> Feedback </a></li>

                    <li><a href="settingPage.php" <?php if (basename($_SERVER['PHP_SELF']) == 'settingPage.php')
                        echo 'class="active"'; ?>><span class="fa fa-cog"></span> Settings </a></li>
                </ul>
            </div>
        </div>

        <div class="topnav">
            <div class="profiletxt">
                <h5 class="user_name" id="user_name"></h5>
                <span class="hid-info" id="user_position"></span>
                <span class="hid-info" id="user_dep"></span>
            </div>

            <div class="profilepic">
                <img src="media/hr-icon.png" alt="ProfilePicture" width="50px">
            </div>

            <div class="dropdown">
                <button><span class="fa fa-chevron-down"></span></button>
                <div class="dropdown-options">
                    <a href="profilePage.php"><span class="fa fa-user"></span> Profile </a>
                    <a id="signOut"><span class="fa fa-sign-out"></span> Logout </a>
                </div>
            </div>
        </div>
    </nav>
</body>

</html>