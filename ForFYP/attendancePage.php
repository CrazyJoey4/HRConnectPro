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
    <script defer src="jsfiles/attendance.js"></script>

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
                <button class='add_btn clock_btn clockIn' id="clockInButton">Clock In &nbsp;<i
                        class="fas fa-clock"></i></button>
                <button class='add_btn clock_btn clockOut' id="clockInButton">Clock Out &nbsp;<i
                        class="far fa-clock"></i></button>
            </div>
        </div>



    </div>


</body>

</html>