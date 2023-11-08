<!DOCTYPE html>
<html>

<head>
    <title> Dashboard </title>
    <link rel="icon" href="media/hr-icon.png">

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <h1>Dashboard</h1>

        <div class="currentDateTime">
            <div class="dateTime" id="dateTime"></div>
            <div class="clock" id="clock"></div>
        </div>

        <div class="forChart">
            <canvas class="forBarGraph" id="top10Chart"></canvas>
        </div>

        <div class="forChart">
            <canvas class="forGraph" id="clockInPieChart"></canvas>
            <canvas class="forGraph" id="leaveStatusPieChart"></canvas>
        </div>

        <div class="forChart">
            <canvas class="forGraph" id="performanceStatusPieChart"></canvas>
            <canvas class="forGraph" id="projectStatusPieChart"></canvas>
        </div>
        
        <div class="forChart">
            <canvas class="forBarGraph" id="employeeCountsByDepartmentChart"></canvas>
        </div>

        
        
    </div>

    <script type="module" src="jsfiles/dashboard.js"></script>

    <script>
        function updateTime() {
            const dateElement = document.getElementById('dateTime');
            const clockElement = document.getElementById('clock');

            const now = new Date();

            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayString = days[now.getDay()];

            const dateString = `${now.getDate().toString().padStart(2, '0')} - ${(now.getMonth() + 1).toString().padStart(2, '0')} - ${now.getFullYear()}`;
            const timeString = now.toLocaleTimeString();

            dateElement.textContent = `${dayString} | ${dateString}`;
            clockElement.textContent = timeString;

            setTimeout(updateTime, 1000);
        }

        updateTime();
    </script>
</body>

</html>