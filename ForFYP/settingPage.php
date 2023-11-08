<!DOCTYPE html>
<html>

<head>
    <title> Setting </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <!--    
            <h1>Settings</h1>
        
         <div class="tab_btn">
            <button class="tablinks leaveManagement" onclick="openTab(event, 'leaveManagement')">Leave Management</button>
            <button class="tablinks" onclick="openTab(event, 'faqManagement')">FAQ Management</button>
        </div> -->

        <div id="leaveManagement" class="tabcontent">
            <div class="topTitle">
                <h1>Leave Management</h1>
                <button class='add_btn' onclick="on()">Add Leave &nbsp;<i class='material-icons'>add</i></button>
            </div>

            <div class="InputText search-box">
                <input type="text" id="searchInput" placeholder="Search by name or type">
            </div>

            <div class="table-block">
                <table class="detailsTable leaveTable" id="leaveTable">
                    <tr>
                        <th class="idCol">ID</th>
                        <th class="nameCol">Name</th>
                        <th class="typeCol">Type</th>
                        <th class="creditCol">Credit</th>
                        <th class="descCol">Description</th>
                        <th colspan='2'>Action</th>
                    </tr>

                </table>
            </div>

            <div class="overlay-bg" id="overlayBg"></div>

            <div id="overlay" class="overlay">
                <form>
                    <h3><b>Leave Details</b></h3>

                    <hr style="border-bottom:2px solid grey;">

                    <div class="InputText">
                        <input type="text" name="name" id="name" autocomplete="off" required>
                        <label>Name</label><br />
                    </div>

                    <div class="InputOption">
                        <select class="typeOption" name="typeOption" id="typeOption" required>
                            <option value="">Select Type</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Half Yearly">Half Yearly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    <div class="InputText">
                        <input type="number" name="credit" id="credit" autocomplete="off" required>
                        <label>Credit</label><br />
                    </div>

                    <div class="InputText">
                        <input type="text" name="desc" id="desc" autocomplete="off">
                        <label>Description</label><br />
                    </div>

                    <div class="addBtn-btn">
                        <input type="submit" name="Add" id="Add" value="Add Leave" class="addBtn"
                            onclick="addleave(event)">

                        <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                    </div>
                </form>
            </div>

            <div id="editOverlay" class="overlay">
                <form>
                    <h3><b>Edit Leave Details</b></h3>

                    <hr style="border-bottom:2px solid grey;">

                    <div style="display:none">
                        <input type="text" name="leaveID" id="leaveID" readonly>
                    </div>

                    <div class="InputText">
                        <input type="text" name="editName" id="editName" autocomplete="off" required>
                        <label>Name</label><br />
                    </div>

                    <div class="InputOption">
                        <select class="editTypeOption" name="editTypeOption" id="editTypeOption" required>
                            <option value="">Select Type</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Half Yearly">Half Yearly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    <div class="InputText">
                        <input type="number" name="editCredit" id="editCredit" autocomplete="off" required>
                        <label>Credit</label><br />
                    </div>

                    <div class="InputText">
                        <input type="text" name="editDesc" id="editDesc" autocomplete="off">
                        <label>Description</label><br />
                    </div>

                    <div class="addBtn-btn">
                        <input type="button" name="Save" id="editSave" value="Save Changes" class="addBtn"
                            onclick="saveChanges()">
                        <button type="button" class="cancelbtn" onclick="closeEditOverlay()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- <div id="faqManagement" class="tabcontent">
            <h1>FAQs</h1>

            <div id="faq"></div>

        </div> -->


    </div>

    <script type="module" src="jsfiles/leaveMng.js"></script>
    <script>
        function on() {
            document.getElementById("overlay").style.display = "block";
            document.getElementById("overlayBg").style.display = "block";
        }

        function off() {
            document.getElementById("overlay").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";
        }

        function closeEditOverlay() {
            document.getElementById("editOverlay").style.display = "none";
            document.getElementById("overlayBg").style.display = "none";
        }

        window.addEventListener('DOMContentLoaded', function () {
            fetchLeaveDetails();
        });

        /*
        function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }

        window.addEventListener('DOMContentLoaded', function () {
            openTab(event, 'leaveManagement');
            document.querySelector(".leaveManagement").classList.add("active");
        });
        */
    </script>

    <script src="tinymce/js/tinymce/tinymce.min.js"></script>
    <script>
        tinymce.init({
            selector: '#faq',
            plugins: 'searchreplace autoresize image table lists',
        });
    </script>

</body>

</html>