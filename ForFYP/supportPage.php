<!DOCTYPE html>
<html>

<head>
    <title> Support </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <h1>FAQs</h1>

        <div id="faq"></div>
    </div>


    <script src="tinymce/js/tinymce/tinymce.min.js"></script>
    <script>
        tinymce.init({
            selector: '#faq',
            plugins: 'searchreplace autoresize image table lists',
        });
    </script>
</body>

</html>