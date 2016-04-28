var appParameter_451 = null;
var signalrService = null;

F2.Apps["451"] = (function () {
    var App_Class = function (appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.$root = $(root);
        var $tbody = $('tbody', this.$root);
        var $caption = $('caption', this.$root);
        if (appConfig.context != null) {
            appParameter_451 = new Object();
            appParameter_451.AppId = appConfig.context.appId;
            appParameter_451.AppName = appConfig.context.appName;
            appParameter_451.UserId = userInfo.UserId;
            appParameter_451.CustomerId = userInfo.CustomerId;
            appParameter_451.AppType = appConfig.context.appType;
            appParameter_451.AuthToken = userInfo.Token;
            appParameter_451.ClientType = "Web";
            appParameter_451.ClientVersion = detectBrowser().toString();
            appParameter_451.EmailId = userInfo.EmailId;
            appParameter_451.ElementType = "";
            appParameter_451.ElementId = "";
            appParameter_451.ElementValue = "";
            appParameter_451.SignalRConnectionId = "";
            appParameter_451.AppInstanceId = userInfo.InstanceId;
            appParameter_451.InitiatorEmailId = userInfo.InitiatorEmailId;
            appParameter_451.SharedSignalRConnectionId = userInfo.SharedSignalrId;
            appParameter_451.AppMode = appConfig.context.appMode;
            appParameter_451.AppKey = "";
        }

        App_Class.prototype.init = function () {
            // perform init actions 
            F2.log("Init SifId : 451. Calc : SG;aPGV");
            if (signalrService == null)
                signalrService = new SignalrService();
            signalrService.InitSignalRConnection(appParameter_451);

            $("#ExportToCSV").click(function () {
                exportSwaptionDataToCSV.apply(this);
            });

            function exportSwaptionDataToCSV() {
                //Taking all the rows of three tables
                var allDataRows = $("#tblGrid,#tblPremGrid,#tblStrikeGrid").find('tr:has(td),tr:has(th)');

                //Adding time details in first cell
                allDataRows[0].children[0].innerHTML = "LocalTime : " + Date().toString();
                //Need to confirm to add server time.

                //allDataRows[0].children[9].innerHTML = "ServerTimeRemains";
                var premToggle = allDataRows[18].children[0].innerHTML;
                allDataRows[18].children[0].innerHTML = "Prem";

                //delimiter code for CSV format
                var columnDelimeterCode = String.fromCharCode(11); // vertical tab character
                var rowDelimeterCode = String.fromCharCode(0); // null character

                // actual delimiter characters for CSV format
                var columnDelimeter = '","';
                var rowDelimeter = '"\r\n"';

                // Grab text from table into CSV formatted string
                var csv = '"' + allDataRows.map(function (i, row) {
                    var $row = $(row), $cols = $row.find('td,th');

                    return $cols.map(function (j, col) {
                        var $col = $(col), text = $col.text();

                        return text.replace(/"/g, '""'); // escape double quotes

                    }).get().join(columnDelimeterCode);

                }).get().join(rowDelimeterCode)
                    .split(rowDelimeterCode).join(rowDelimeter)
                    .split(columnDelimeterCode).join(columnDelimeter) + '"';

                // Data URI
                csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

                if (window.navigator.msSaveBlob) { // IE 10+
                    window.navigator.msSaveOrOpenBlob(new Blob([csv], { type: "text/plain;charset=utf-8;" }), "VolPremStrike.csv")
                }
                else {
                    $(this).attr({ 'download': "VolPremStrike.csv", 'href': csvData, 'target': '_blank' });
                }

                allDataRows[18].children[0].innerHTML = premToggle;
            }

            //Need to define click event like this as button is removed and added again so click will be destroyed.
            $(document).on("click", ".swaptionApplication table tr th #451_6", function () {
                try {
                    var value = $(this).attr("name");
                    if (value == "1")
                        $(this).attr("name", "0");
                    else
                        $(this).attr("name", "1");
                    if (value != "") {
                        appParameter_451.UserId = userInfo.UserId;
                        appParameter_451.CustomerId = userInfo.CustomerId;
                        appParameter_451.AuthToken = userInfo.Token;
                        appParameter_451.EmailId = userInfo.EmailId;
                        appParameter_451.ElementType = "DDList";
                        appParameter_451.ElementId = "6";
                        appParameter_451.ElementValue = value;
                        appParameter_451.AppInstanceId = userInfo.InstanceId;
                        appParameter_451.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                        signalrService.UpdateValueInApplication(appParameter_451);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            });
        };
    };
    return App_Class;
})();
