var appParameter_2093 = null;
var signalrService = null;

F2.Apps["2093"] = (function () {
    var App_Class = function (appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.$root = $(root); 
        var $tbody = $('tbody', this.$root);
        var $caption = $('caption', this.$root);

        if (appConfig.context != null) {
            appParameter_2093 = new Object();
            appParameter_2093.AppId = appConfig.context.appId;
            appParameter_2093.AppName = appConfig.context.appName;
            appParameter_2093.UserId = userInfo.UserId;
            appParameter_2093.CustomerId = userInfo.CustomerId;
            appParameter_2093.AppType = appConfig.context.appType;
            appParameter_2093.AuthToken = userInfo.Token;
            appParameter_2093.ClientType = "Web";
            appParameter_2093.ClientVersion = detectBrowser().toString();
            appParameter_2093.EmailId = userInfo.EmailId;
            appParameter_2093.ElementType = "";
            appParameter_2093.ElementId = "";
            appParameter_2093.ElementValue = "";
            appParameter_2093.SignalRConnectionId = "";
            appParameter_2093.AppInstanceId = userInfo.InstanceId;
            appParameter_2093.InitiatorEmailId = userInfo.InitiatorEmailId;
            appParameter_2093.SharedSignalRConnectionId = userInfo.SharedSignalrId;
            appParameter_2093.AppMode = appConfig.context.appMode;
            appParameter_2093.AppKey = "";
        }

        App_Class.prototype.init = function () {
            // perform init actions
            F2.log("Init Bond Yield.");

            if (signalrService == null)
                signalrService = new SignalrService();
            signalrService.InitSignalRConnection(appParameter_2093);

            $('#2093 :text[title="datepick"]').datepicker({ format: 'mm/dd/yyyy', autoclose: true, weekStart: 0 }).on('changeDate', function (ev) {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_2093.UserId = userInfo.UserId;
                        appParameter_2093.CustomerId = userInfo.CustomerId;
                        appParameter_2093.AuthToken = userInfo.Token;
                        appParameter_2093.EmailId = userInfo.EmailId;
                        appParameter_2093.ElementType = "DDList";
                        appParameter_2093.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_2093.ElementValue = value;
                        signalrService.UpdateValueInApplication(appParameter_2093);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:datepick(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("2093_appclass.js", strerrordesc);
                }
            });

            $('#2093 :text').click(function () {

                if ($(this).hasClass("priceWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");

                        var paraValues = UserID_2093 + "^" + CustomerID_2093 + "^" + instanceMode_2093;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);

                        var eleInfo = instanceType_2093 + "^" + paraValues + "^" + idValPair;

                        display_PriceWidget(eleInfo, $(this).val(), $(this).attr("name"), clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_priceWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("2093_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("termWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");

                        var paraValues = UserID_2093 + "^" + CustomerID_2093 + "^" + instanceMode_2093;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);

                        var eleInfo = instanceType_2093 + "^" + paraValues + "^" + idValPair;

                        display_TermWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_termWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("2093_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("basisWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");

                        var paraValues = UserID_2093 + "^" + CustomerID_2093 + "^" + instanceMode_2093;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);

                        var eleInfo = instanceType_2093 + "^" + paraValues + "^" + idValPair;

                        display_BasisWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_basisWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("2093_appclass.js", strerrordesc);
                    }
                }

            });

            $("#2093 input[type='button']").click(function () {

                if (!$(this).hasClass("inputDisable")) {
                    try {
                        var itemType = "DDList";
                        var paraValues = UserID_2093 + "^" + CustomerID_2093 + "^" + instanceMode_2093;

                        var valToSubmit = $(this).attr("name");
                        if (valToSubmit == "1")
                            $(this).attr("name", "0");
                        else
                            $(this).attr("name", "1");

                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + valToSubmit;

                        if ($(this).val() != "") {
                            SendToBeast(instanceType_2093 + "#" + paraValues, idValPair);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:button_inputDisable(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("2093_appclass.js", strerrordesc);
                    }
                }
            });

            $("#2093 select").change(function () {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_2093.UserId = userInfo.UserId;
                        appParameter_2093.CustomerId = userInfo.CustomerId;
                        appParameter_2093.AuthToken = userInfo.Token;
                        appParameter_2093.EmailId = userInfo.EmailId;
                        appParameter_2093.ElementType = "DDList";
                        appParameter_2093.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_2093.ElementValue = value;

                        signalrService.UpdateValueInApplication(appParameter_2093);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:select_DDList(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("2093_appclass.js", strerrordesc);
                }
            });

            $("#2093 :text").on("input paste", function (e) {
                //e.preventDefault();
                //alert(1);
                try {
                    var sss = '';

                    var ary = new Array();

                    var cusipCtr = 0;
                    var isValidLoop = true;
                    var currentID;

                    var isIE = false;

                    try {
                        if ($.browser.msie == true)
                            isIE = true;
                    }
                    catch (e) {
                        isIE = false;
                    }

                    if (isIE == true) {
                        //alert("In IE");
                        currentID = parseInt($(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1));

                        var hdfData = "";
                        var PasteData = window.clipboardData.getData("Text");

                        if (PasteData == null || PasteData == "") {
                            alert('No valid data to copy orders. Please check the clipboard or try to copy and paste again.');
                            return false;
                        }

                        var str;
                        var rowCount = 1;
                        var cellCount = 0;

                        for (var i = 0; i < PasteData.length; i++) {
                            var ch = PasteData.substr(i, 1);
                            str = ch.charCodeAt(0);

                            if (str == 13) {
                                rowCount = rowCount + 1;
                                cellCount = 0;
                                hdfData += "#";
                            }
                            else if (str == 9) {
                                if (cellCount < 9) {
                                    hdfData += "@";
                                }
                            }
                            else if (str != 9 && str != 10) {
                                hdfData += ch;
                            }
                        }

                        ary = hdfData.split('#');

                        for (cusipCtr = 0; cusipCtr < ary.length; cusipCtr++) {
                            var cusipVal = $.trim(ary[cusipCtr]);

                            var curntCusipField = "2093_" + currentID;

                            if ($("#" + curntCusipField).length > 0) {

                                if (isValidLoop == true) {

                                    var paraValues = UserID_2093 + "^" + CustomerID_2093 + "^" + instanceMode_2093;
                                    var itemType = "DDList";
                                    var idValPair = itemType + "#" + currentID + "#" + cusipVal;

                                    if (cusipVal != "") {
                                        if (cusipVal.length == 9) {
                                            SendToBeast(instanceType_2093 + "#" + paraValues, idValPair);

                                            if (currentID == "120") {
                                                isValidLoop = false;
                                            }
                                            else {
                                                currentID++;
                                            }
                                        }
                                        else {
                                            $("#" + curntCusipField).val('');
                                            alert("Invalid length for CUSIP : " + cusipVal);
                                            $("#" + curntCusipField).attr('name', '');
                                            e.returnValue = false;
                                        }
                                    }
                                    else {
                                        //alert("Input cannot be blank.");
                                        SendToBeast(instanceType_2093 + "#" + paraValues, idValPair);
                                    }
                                }
                                else {
                                    alert("CUSIP : " + cusipVal + " not submitted due to insufficient fields.");
                                }
                            }
                        }
                    }
                    else {
                        //alert("In Else");
                        //alert(event.type);
                        //alert($(this).val());
                        if (event.type == 'input') {

                            //alert(event.type);

                            //alert($(this).val());

                            //alert(event.type);

                            var PasteDataTmp = $(this).val();

                            var ary = PasteDataTmp.split(" ");

                            var str;
                            var rowCount = 1;
                            var cellCount = 0;

                            currentID = parseInt($(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1));

                            //var ary = new Array();

                            //ary = hdfData.split('#');

                            var cusipCtr = 0;

                            var isValidLoop = true;

                            if (ary.length > 1) {

                                for (cusipCtr = 0; cusipCtr < ary.length; cusipCtr++) {

                                    var cusipVal = $.trim(ary[cusipCtr]);

                                    var curntCusipField = "2093_" + currentID;

                                    if ($("#" + curntCusipField).length > 0) {

                                        if (isValidLoop == true) {

                                            var paraValues = UserID_2093 + "^" + CustomerID_2093 + "^" + instanceMode_2093;
                                            var itemType = "DDList";
                                            var idValPair = itemType + "#" + currentID + "#" + cusipVal;

                                            if (cusipVal != "") {
                                                if (cusipVal.length == 9) {
                                                    SendToBeast(instanceType_2093 + "#" + paraValues, idValPair);

                                                    if (currentID == "120") {
                                                        isValidLoop = false;
                                                    }
                                                    else {
                                                        currentID++;
                                                    }
                                                }
                                                else {
                                                    alert("Invalid length for CUSIP : " + cusipVal);
                                                    $("#" + curntCusipField).val('');
                                                }
                                            }
                                            else {
                                                //alert("Input cannot be blank.");
                                                SendToBeast(instanceType_2093 + "#" + paraValues, idValPair);
                                            }
                                        }
                                        else {
                                            alert("CUSIP : " + cusipVal + " not submitted due to insufficient fields.");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch (ex) {
                    //alert(ex);
                }
            });

            $("#2093 :text").bind('keydown', function (event) {
                try {
                    if ($(this).hasClass('inputDisable')) {
                        event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    }
                    else {

                        var keyNumber;
                        if (window.event) {
                            keyNumber = event.keyCode;
                        }
                        else {
                            keyNumber = event.which;
                        }

                        if ($(this).attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false;

                        //if (event.shiftKey) event.preventDefault ? event.preventDefault() : event.returnValue = false;

                        //                    if ((keyNumber > 47 && keyNumber < 58) || (keyNumber > 95 && keyNumber < 106) || (keyNumber > 34 && keyNumber < 41) || keyNumber == 8 || keyNumber == 13 || keyNumber == 46) {
                        //                        event.returnValue = true;
                        //                    }
                        //                    else {
                        //                        if (event.keyCode == 9) {
                        //                            event.returnValue = true;
                        //                        }
                        //                        else {
                        //                            if (event.keyCode == 110 || event.keyCode == 190) {
                        //                                if ($(this).val().indexOf(".") != -1)
                        //                                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                        //                            }
                        //                            else
                        //                                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                        //                        }
                        //                    }

                        if (keyNumber == 13) {

                            if (($.browser.mozilla == true) || ($.browser.chrome == true))
                                event.preventDefault ? event.preventDefault() : event.returnValue = false;

                            var paraValues = UserID_2093 + "^" + CustomerID_2093 + "^" + instanceMode_2093;
                            var itemType = "DDList";
                            var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + $.trim($(this).val());

                            if ($.trim($(this).val()) != "") {
                                //if ($.trim($(this).val()).length == 9) {
                                SendToBeast(instanceType_2093 + "#" + paraValues, idValPair);
                                //}                               
                            }
                            else {
                                //alert("Input cannot be blank.");
                                SendToBeast(instanceType_2093 + "#" + paraValues, idValPair);
                            }
                        }
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("2093_appclass.js", strerrordesc);
                }
            });
        };
    };
    return App_Class;
})();