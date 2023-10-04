<!DOCTYPE html>
<html>

<head>
    <title> Attendance </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <h1>Attendance</h1>

        <video id="video" autoplay></video>
        <canvas id="canvas"></canvas>
    </div>

    <script type="text/javascript">
        let video = document.getElementById('video');
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');

        function onOpenCvReady() {
            // OpenCV.js is ready
            startCamera();
        }

        function startCamera() {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    video.srcObject = stream;
                    detectFaces();
                })
                .catch((error) => {
                    console.error('Error accessing webcam:', error);
                });
        }

        function detectFaces() {
            // Use OpenCV.js to perform face detection here
            // Draw rectangles around detected faces on the canvas
        }
    </script>
</body>

</html>