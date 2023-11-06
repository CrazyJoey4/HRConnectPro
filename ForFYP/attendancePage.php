<!DOCTYPE html>
<html>

<head>
    <title>Attendance</title>
    <link rel="icon" href="media/hr-icon.png">
    <?php include "./navBar.php"; ?>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.25/webcam.min.js"></script>
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.25/webcam.min.js"></script>
    <script src="jsfiles/faceapi/face-api.min.js"></script>

    <script defer src="jsfiles/faceapi/face-api.min.js"></script>
    <script type="module" defer src="jsfiles/attendance.js"></script>

</head>

<body>
    <div class="wrap">
        <h1>Attendance</h1>


        <div class="toClockWrap">
            <div class="videoCapture">
                <video id="video" width="600" height="450" autoplay></video>
                <canvas id="canvas" width="600" height="450"></canvas>
            </div>

            <div class="buttonGroup">
                <div class="currentDateTime">
                    <div class="dateTime" id="dateTime"></div>
                    <div class="clock" id="clock"></div>
                </div>

                <button class='add_btn clock_btn clockIn' id="clockInButton">Clock In &nbsp;<i
                        class="fas fa-clock"></i></button>
                <button class='add_btn clock_btn clockOut' id="clockOutButton">Clock Out &nbsp;<i
                        class="far fa-clock"></i></button>
            </div>
        </div>

    </div>

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

        // Start updating the time
        updateTime();
    </script>
</body>

</html>