<!DOCTYPE html>
<html>

<head>
    <title> Dashboard </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <h1>Dashboard</h1>

        <p>
            <span id='labelTag'>
                <?php
                $pythonScript = 'app.py';

                // Use shell_exec to run the Python script and capture its output
                $output = shell_exec("python $pythonScript"); // Capture both stdout and stderr
                
                // Check if there was an error
                if ($output === null) {
                    echo "Error executing Python script.";
                } else {
                    // Print or process the output as needed
                    echo $output;
                }
                ?>
            </span>
        </p>
    </div>
</body>

</html>