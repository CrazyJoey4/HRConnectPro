<!DOCTYPE html>
<html>

<head>
    <title> Payroll </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="topTitle">
            <h1>Payroll Record</h1>
        </div>

        <div class="InputText search-box">
            <input type="text" id="searchInput" placeholder="Search by name or department">
        </div>

        <div class="table-block">
            <table class="detailsTable payrollTable" id="payrollTable">
                <tr>
                    <th class="idCol">ID</th>
                    <th class="dateCol">Upload Date</th>
                    <th class="fileCol">File</th>
                </tr>
            </table>
        </div>

    </div>

    <script type="module" src="jsfiles/payrollView.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', function () {
            fetchPayrollDetails();
        });
    </script>

</body>

</html>