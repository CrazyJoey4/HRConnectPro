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

        <div class="forFilter">
            <div class="InputOption">
                <label>Month</label></br>
                <select class="dateFilter filterMonth" name="filterMonth" id="filterMonth"></select>
            </div>
    
            <div class="InputOption">
                <label>Year</label></br>
                <select class="dateFilter filterYear" name="filterYear" id="filterYear"></select>
            </div>
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