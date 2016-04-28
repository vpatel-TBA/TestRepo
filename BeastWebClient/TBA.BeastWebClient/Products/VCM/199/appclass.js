var appParameter_199 = null;
var signalrService = null;

F2.Apps["199"] = (function () {
    var App_Class = function (appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.$root = $(root); 
        var $tbody = $('tbody', this.$root);
        var $caption = $('caption', this.$root);

        if (appConfig.context != null) {
            appParameter_199 = new Object();
            appParameter_199.AppId = appConfig.context.appId;
            appParameter_199.AppName = appConfig.context.appName;
            appParameter_199.UserId = userInfo.UserId;
            appParameter_199.CustomerId = userInfo.CustomerId;
            appParameter_199.AppType = appConfig.context.appType;
            appParameter_199.AuthToken = userInfo.Token;
            appParameter_199.ClientType = "Web";
            appParameter_199.ClientVersion = detectBrowser().toString();
            appParameter_199.EmailId = userInfo.EmailId;
            appParameter_199.ElementType = "";
            appParameter_199.ElementId = "";
            appParameter_199.ElementValue = "";
            appParameter_199.SignalRConnectionId = "";
            appParameter_199.AppInstanceId = userInfo.InstanceId;
            appParameter_199.InitiatorEmailId = userInfo.InitiatorEmailId;
            appParameter_199.SharedSignalRConnectionId = userInfo.SharedSignalrId;
            appParameter_199.AppMode = appConfig.context.appMode;
            appParameter_199.AppKey = "";
        }

        App_Class.prototype.init = function () {
            // perform init actions
            F2.log("Init 199 Bond Yield.");

            if (signalrService == null)
                signalrService = new SignalrService();
            signalrService.InitSignalRConnection(appParameter_199);

            $('#199 :text[title="datepick"]').datepicker({ format: 'mm/dd/yyyy', autoclose: true, weekStart: 0 }).on('changeDate', function (ev) {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_199.UserId = userInfo.UserId;
                        appParameter_199.CustomerId = userInfo.CustomerId;
                        appParameter_199.AuthToken = userInfo.Token;
                        appParameter_199.EmailId = userInfo.EmailId;
                        appParameter_199.ElementType = "DDList";
                        appParameter_199.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_199.ElementValue = value;
                        signalrService.UpdateValueInApplication(appParameter_199);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:datepick(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("199_appclass.js", strerrordesc);
                }
            });

            $('#199 :text').click(function () {

                if ($(this).hasClass("priceWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");

                        var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);

                        var eleInfo = instanceType_199 + "^" + paraValues + "^" + idValPair;

                        display_PriceWidget(eleInfo, $(this).val(), $(this).attr("name"), clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_priceWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("199_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("termWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");

                        var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);

                        var eleInfo = instanceType_199 + "^" + paraValues + "^" + idValPair;

                        display_TermWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_termWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("199_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("basisWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");

                        var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);

                        var eleInfo = instanceType_199 + "^" + paraValues + "^" + idValPair;

                        display_BasisWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_basisWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("199_appclass.js", strerrordesc);
                    }
                }

            });

            $("#199 input[type='button']").click(function () {

                if (!$(this).hasClass("inputDisable")) {
                    try {

                        if ($(this).attr("id") != '199_70') {
                            var itemType = "DDList";
                            var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;

                            var valToSubmit = $(this).eq(0).find('td').find('input').attr("name");
                            if (valToSubmit == "1")
                                $(this).eq(0).find('td').find('input').attr("name", "0");
                            else
                                $(this).eq(0).find('td').find('input').attr("name", "1");

                            var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + valToSubmit;

                            // if ($(this).val() != "") {
                            SendToBeast(instanceType_199 + "#" + paraValues, idValPair);
                            if ($(this).attr("id") != '199_3004' && $(this).attr("id") != '199_3006' && $(this).attr("id") != '199_3005') {

                                $('#searchlst2').hide();
                                $('.bondYield_Manual2').show();
                                //}
                            }
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:button_inputDisable(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("199_appclass.js", strerrordesc);
                    }
                }

            });

            $("#searchlst2 tbody tr").click(function () {

                if (!$(this).hasClass("inputDisable")) {
                    try {

                        var itemType = "DDList";
                        var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;

                        var valToSubmit = $(this).eq(0).find('td').find('input').attr("name");

                        if ($(this).eq(0).find('td').attr("class") != 'first1' && $(this).eq(0).find('td').attr("class") != "first" && $(this).eq(0).find('td').find('input').attr("name") != "" && $(this).eq(0).find('td').find('input').val() != "Next" && $(this).eq(0).find('td').find('input').val() != "Prev") {
                            if (valToSubmit == "1")
                                $(this).eq(0).find('td').find('input').attr("name", "0");
                            else
                                $(this).eq(0).find('td').find('input').attr("name", "1");



                            var idValPair = itemType + "#" + $(this).eq(0).find('td').find('input').attr("id").substring($(this).eq(0).find('td').find('input').attr("id").lastIndexOf('_') + 1) + "#" + valToSubmit;

                            // if ($(this).val() != "") {
                            SendToBeast(instanceType_199 + "#" + paraValues, idValPair);

                            $('#searchlst2').hide();
                            $('.bondYield_Manual2').show();
                            //}

                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:button_inputDisable(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("199_appclass.js", strerrordesc);
                    }
                }

            });


            $("#199 select").change(function () {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_199.UserId = userInfo.UserId;
                        appParameter_199.CustomerId = userInfo.CustomerId;
                        appParameter_199.AuthToken = userInfo.Token;
                        appParameter_199.EmailId = userInfo.EmailId;
                        appParameter_199.ElementType = "DDList";
                        appParameter_199.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_199.ElementValue = value;

                        signalrService.UpdateValueInApplication(appParameter_199);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:select_DDList(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("199_appclass.js", strerrordesc);
                }
            });

            $("#199 :text").bind("paste", function (e) {
                //e.preventDefault();
                return true;
            });

            $("#199 :text").bind('keydown', function (event) {
                try {
                    var keyNumber = event.keyCode;
                    if ($(this).attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //if (event.shiftKey) event.preventDefault ? event.preventDefault() : event.returnValue = false;

                    if ((keyNumber > 47 && keyNumber < 58) || (keyNumber > 95 && keyNumber < 106) || (keyNumber > 34 && keyNumber < 41) || keyNumber == 8 || keyNumber == 13 || keyNumber == 46 || event.keyCode == 17 || event.keyCode == 86) {
                        event.returnValue = true;
                    }
                    else {
                        if (event.keyCode == 9) {
                            event.returnValue = true;
                        }
                        else {
                            if (event.keyCode == 110 || event.keyCode == 190) {
                                // if ($(this).val().indexOf(".") != -1)
                                // event.preventDefault ? event.preventDefault() : event.returnValue = false;
                            }
                            //else
                            //event.preventDefault ? event.preventDefault() : event.returnValue = false;
                        }
                    }

                    if (keyNumber == 13) {
                        var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + $(this).val();

                        // if ($.trim($(this).val()) != "") {
                        SendToBeast(instanceType_199 + "#" + paraValues, idValPair);
                        return false;
                        //}
                        //   else {
                        alert("Input cannot be blank.");
                        // }
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("199_appclass.js", strerrordesc);
                }
            });

            //$("#199 :text").bind('blur', function (event) {
            //    try {
            //        var keyNumber = event.keyCode; if ($(this).attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false; if (event.shiftKey) event.preventDefault ? event.preventDefault() : event.returnValue = false;

            //        //if ((keyNumber > 47 && keyNumber < 58) || (keyNumber > 95 && keyNumber < 106) || (keyNumber > 34 && keyNumber < 41) || keyNumber == 8 || keyNumber == 13 || keyNumber == 46) {
            //        //    event.returnValue = true;
            //        //}
            //        //else {
            //        //    if (event.keyCode == 9) {
            //        //        event.returnValue = true;
            //        //    }
            //        //    else {
            //        //        if (event.keyCode == 110 || event.keyCode == 190) {
            //        //            // if ($(this).val().indexOf(".") != -1)
            //        //            // event.preventDefault ? event.preventDefault() : event.returnValue = false;
            //        //        }
            //        //        //else
            //        //        //event.preventDefault ? event.preventDefault() : event.returnValue = false;
            //        //    }
            //        //}

            //        //  if (keyNumber == 13) {
            //        var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
            //        var itemType = "DDList";
            //        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + $(this)[0].name;

            //        //if ($.trim($(this).val()) != "") {
            //        //SendToBeast(instanceType_199 + "#" + paraValues, idValPair);
            //        //}
            //        //else {
            //        //    alert("Input cannot be blank.");
            //        //}
            //        //}
            //    }
            //    catch (err) {
            //        var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
            //        onJavascriptLog("199_appclass.js", strerrordesc);
            //    }
            //});
            $("#199_3000").bind('blur', function (event) {
                try {
                    var keyNumber = event.keyCode; if ($(this).attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false; if (event.shiftKey) event.preventDefault ? event.preventDefault() : event.returnValue = false;

                    //if ((keyNumber > 47 && keyNumber < 58) || (keyNumber > 95 && keyNumber < 106) || (keyNumber > 34 && keyNumber < 41) || keyNumber == 8 || keyNumber == 13 || keyNumber == 46) {
                    //    event.returnValue = true;
                    //}
                    //else {
                    //    if (event.keyCode == 9) {
                    //        event.returnValue = true;
                    //    }
                    //    else {
                    //        if (event.keyCode == 110 || event.keyCode == 190) {
                    //            // if ($(this).val().indexOf(".") != -1)
                    //            // event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //        }
                    //        //else
                    //        //event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //    }
                    //}

                    //  if (keyNumber == 13) {
                    var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
                    var itemType = "DDList";
                    var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + $(this)[0].name;

                    //if ($.trim($(this).val()) != "") {
                    SendToBeast(instanceType_199 + "#" + paraValues, idValPair);
                    //}
                    //else {
                    //    alert("Input cannot be blank.");
                    //}
                    //}
                }
                catch (err) {
                    var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("199_appclass.js", strerrordesc);
                }
            });
            $("#199_3001").bind('blur', function (event) {
                try {
                    var keyNumber = event.keyCode; if ($(this).attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false; if (event.shiftKey) event.preventDefault ? event.preventDefault() : event.returnValue = false;

                    //if ((keyNumber > 47 && keyNumber < 58) || (keyNumber > 95 && keyNumber < 106) || (keyNumber > 34 && keyNumber < 41) || keyNumber == 8 || keyNumber == 13 || keyNumber == 46) {
                    //    event.returnValue = true;
                    //}
                    //else {
                    //    if (event.keyCode == 9) {
                    //        event.returnValue = true;
                    //    }
                    //    else {
                    //        if (event.keyCode == 110 || event.keyCode == 190) {
                    //            // if ($(this).val().indexOf(".") != -1)
                    //            // event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //        }
                    //        //else
                    //        //event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //    }
                    //}

                    //  if (keyNumber == 13) {
                    var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
                    var itemType = "DDList";
                    var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + $(this)[0].name;

                    //if ($.trim($(this).val()) != "") {
                    SendToBeast(instanceType_199 + "#" + paraValues, idValPair);
                    //}
                    //else {
                    //    alert("Input cannot be blank.");
                    //}
                    //}
                }
                catch (err) {
                    var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("199_appclass.js", strerrordesc);
                }
            });
            $("#199_3002").bind('blur', function (event) {
                try {
                    var keyNumber = event.keyCode; if ($(this).attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false; if (event.shiftKey) event.preventDefault ? event.preventDefault() : event.returnValue = false;

                    //if ((keyNumber > 47 && keyNumber < 58) || (keyNumber > 95 && keyNumber < 106) || (keyNumber > 34 && keyNumber < 41) || keyNumber == 8 || keyNumber == 13 || keyNumber == 46) {
                    //    event.returnValue = true;
                    //}
                    //else {
                    //    if (event.keyCode == 9) {
                    //        event.returnValue = true;
                    //    }
                    //    else {
                    //        if (event.keyCode == 110 || event.keyCode == 190) {
                    //            // if ($(this).val().indexOf(".") != -1)
                    //            // event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //        }
                    //        //else
                    //        //event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //    }
                    //}

                    //  if (keyNumber == 13) {
                    var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
                    var itemType = "DDList";
                    var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + $(this)[0].name;

                    //if ($.trim($(this).val()) != "") {
                    SendToBeast(instanceType_199 + "#" + paraValues, idValPair);
                    //}
                    //else {
                    //    alert("Input cannot be blank.");
                    //}
                    //}
                }
                catch (err) {
                    var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("199_appclass.js", strerrordesc);
                }
            });
            $("#199_3003").bind('blur', function (event) {
                try {
                    var keyNumber = event.keyCode; if ($(this).attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false; if (event.shiftKey) event.preventDefault ? event.preventDefault() : event.returnValue = false;

                    //if ((keyNumber > 47 && keyNumber < 58) || (keyNumber > 95 && keyNumber < 106) || (keyNumber > 34 && keyNumber < 41) || keyNumber == 8 || keyNumber == 13 || keyNumber == 46) {
                    //    event.returnValue = true;
                    //}
                    //else {
                    //    if (event.keyCode == 9) {
                    //        event.returnValue = true;
                    //    }
                    //    else {
                    //        if (event.keyCode == 110 || event.keyCode == 190) {
                    //            // if ($(this).val().indexOf(".") != -1)
                    //            // event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //        }
                    //        //else
                    //        //event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    //    }
                    //}

                    //  if (keyNumber == 13) {
                    var paraValues = UserID_199 + "^" + CustomerID_199 + "^" + instanceMode_199;
                    var itemType = "DDList";
                    var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1) + "#" + $(this)[0].name;

                    //if ($.trim($(this).val()) != "") {
                    SendToBeast(instanceType_199 + "#" + paraValues, idValPair);
                    //}
                    //else {
                    //    alert("Input cannot be blank.");
                    //}
                    //}
                }
                catch (err) {
                    var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("199_appclass.js", strerrordesc);
                }
            });

        };
    };
    return App_Class;
})();

