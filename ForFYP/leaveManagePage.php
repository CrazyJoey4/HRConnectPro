<!DOCTYPE html>
<html>

<head>
    <title> Leave Approval </title>
    <link rel="icon" href="media/hr-icon.png">

    <?php
    include "./navBar.php";
    ?>
</head>

<body>
    <div class="wrap">
        <div class="topTitle">
            <h1>Leave Approval</h1>
        </div>

        <div class="InputOption">
            <label for="tableSelect">Select Table:</label>
            <select id="tableSelect" onchange="toggleTable()">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>

        <div class="table-block" id="pendingDetailTable">
            <table class="detailsTable penTable" id="penTable">
                <tr>
                    <th class="nameCol">Name</th>
                    <th class="typeCol">Type</th>
                    <th class="durationCol">Duration</th>
                    <th class="dateCol">Start Date</th>
                    <th class="dateCol">End Date</th>
                    <th class="descCol">Description</th>
                    <th class="docCol">Document</th>
                    <th class="statusCol">Status</th>
                    <th colspan='2'>Action</th>
                </tr>
            </table>
        </div>

        <div class="table-block" id="approvedDetailTable" style="display:none">
            <table class="detailsTable appTable" id="appTable">
                <tr>
                    <th class="nameCol">Name</th>
                    <th class="typeCol">Type</th>
                    <th class="durationCol">Duration</th>
                    <th class="dateCol">Start Date</th>
                    <th class="dateCol">End Date</th>
                    <th class="statusCol">Status</th>
                </tr>
            </table>
        </div>

        <div class="table-block" id="rejectedDetailTable" style="display:none">
            <table class="detailsTable rejTable" id="rejTable">
                <tr>
                    <th class="nameCol">Name</th>
                    <th class="typeCol">Type</th>
                    <th class="durationCol">Duration</th>
                    <th class="dateCol">Start Date</th>
                    <th class="dateCol">End Date</th>
                    <th class="statusCol">Status</th>
                    <th class="remarkCol">Remark</th> 
                </tr>
            </table>
        </div>

        <div class="overlay-bg" id="overlayBg"></div>

        <div id="overlay" class="overlay" style>
            <form>
                <h3><b>Reject Leave</b></h3>

                <hr style="border-bottom:2px solid grey;">

                <div class="InputText">
                    <label for="rejectReason">Reason for Reject :</label>
                    <textarea id="rejectReason" placeholder="Enter reason for rejection"></textarea>
                </div>

                <div class="addBtn-btn">
                    <input type="submit" name="Add" id="Add" value="Add Leave" class="addBtn"
                        onclick="rejectLeave(event)">

                    <button type="reset" class="cancelbtn" onclick="off()">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script type="module" src="jsfiles/leaveApproval.js"></script>
    <script>
        function toggleTable() {
            const tableSelect = document.getElementById("tableSelect");
            const pendingTable = document.getElementById("pendingDetailTable");
            const approvedTable = document.getElementById("approvedDetailTable");
            const rejectedTable = document.getElementById("rejectedDetailTable");

            if (tableSelect.value === "pending") {
                pendingTable.style.display = "block";
                approvedTable.style.display = "none";
                rejectedTable.style.display = "none";
            }
            else if (tableSelect.value === "approved") {
                pendingTable.style.display = "none";
                approvedTable.style.display = "block";
                rejectedTable.style.display = "none";
            }
            else if (tableSelect.value === "rejected") {
                pendingTable.style.display = "none";
                approvedTable.style.display = "none";
                rejectedTable.style.display = "block";
            }
        }
    </script>
</body>

</html>