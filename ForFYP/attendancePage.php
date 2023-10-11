<!DOCTYPE html>
<html>

<head>
    <title> Attendance </title>
    <link rel="icon" href="media/hr-icon.png">
    <?php include "./navBar.php"; ?>
    <script src="https://cdn.jsdelivr.net/npm/face-api.js"></script>
</head>

<body>
    <div class="wrap">
        <h1>Attendance</h1>

        <video id="video" autoplay></video>
        <canvas id="canvas"></canvas>
        <button id="captureButton">Capture</button>
    </div>

    <script>
        async function startCamera() {
            const video = document.getElementById('video');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        }

        async function loadFaceAPI() {
            await faceapi.loadModels('/models');
            startCamera();
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadFaceAPI();
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const captureButton = document.getElementById('captureButton');

            captureButton.addEventListener('click', async () => {
                // Capture a frame from the video
                canvas.width = video.width;
                canvas.height = video.height;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

                // Perform face detection
                const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();

                if (detections.length > 0) {
                    // Face(s) detected
                    alert('Face(s) detected! You can proceed to attendance processing.');
                } else {
                    // No face detected
                    alert('No face detected. Please try again.');
                }
            });
        });
    </script>
</body>

</html>