var appParameter_105 = null;
var signalrService = null;

F2.Apps["105"] = (function () {
    var App_Class = function (appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.$root = $(root);
        var $tbody = $('tbody', this.$root);
        var $caption = $('caption', this.$root);

        if (appConfig.context != null) {
            appParameter_105 = new Object();
            appParameter_105.AppId = appConfig.context.appId;
            appParameter_105.AppName = appConfig.context.appName;
            appParameter_105.UserId = userInfo.UserId;
            appParameter_105.CustomerId = userInfo.CustomerId;
            appParameter_105.AppType = appConfig.context.appType;
            appParameter_105.AuthToken = userInfo.Token;
            appParameter_105.ClientType = "Web";
            appParameter_105.ClientVersion = detectBrowser().toString();
            appParameter_105.EmailId = userInfo.EmailId;
            appParameter_105.ElementType = "";
            appParameter_105.ElementId = "";
            appParameter_105.ElementValue = "";
            appParameter_105.SignalRConnectionId = "";
            appParameter_105.AppInstanceId = userInfo.InstanceId;
            appParameter_105.InitiatorEmailId = userInfo.InitiatorEmailId;
            appParameter_105.SharedSignalRConnectionId = userInfo.SharedSignalrId;
            appParameter_105.AppMode = appConfig.context.appMode;
            appParameter_105.AppKey = "";
        }

        App_Class.prototype.init = function () {
            // perform init actions 
            F2.log("Init SifId : 105. Calc : SC");
            if (signalrService == null)
                signalrService = new SignalrService();
            signalrService.InitSignalRConnection(appParameter_105);

            $('#105 :text[title="datepick"]').datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true,
                weekStart: 0,
                onSelect: function (date) {
                    try {
                        var value = $(this).val();
                        if (value != "") {
                            appParameter_105.UserId = userInfo.UserId;
                            appParameter_105.CustomerId = userInfo.CustomerId;
                            appParameter_105.AuthToken = userInfo.Token;
                            appParameter_105.EmailId = userInfo.EmailId;
                            appParameter_105.ElementType = "DDList";
                            appParameter_105.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_105.ElementValue = value;
                            appParameter_105.AppInstanceId = userInfo.InstanceId;
                            appParameter_105.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_105);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:datepick(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog(" 105_appclass.js", strerrordesc);
                    }
                }
            });

            $('#105 :text').click(function () {
                if ($(this).hasClass("priceWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_105.UserID + "^" + appParameter_105.CustomerID + "^" + appParameter_105.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_105.AppId + "^" + paraValues + "^" + idValPair;
                        PWM_Func_display_PriceWidget(eleInfo, $(this).val(), $(this).attr("name"), clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_priceWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("105_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("termWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_105.UserID + "^" + appParameter_105.CustomerID + "^" + appParameter_105.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_105.AppId + "^" + paraValues + "^" + idValPair;
                        TWM_Func_DisplayTermWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_termWidget(); Error is :" + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("105_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("basisWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_105.UserID + "^" + appParameter_105.CustomerID + "^" + appParameter_105.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_105.AppId + "^" + paraValues + "^" + idValPair;
                        display_BasisWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_basisWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("105_appclass.js", strerrordesc);
                    }
                }
            });

            $("#105 input[type='button']").click(function () {
                if (!$(this).hasClass("inputDisable")) {
                    try {
                        var value = $(this).attr("name");
                        if (value == "1")
                            $(this).attr("name", "0");
                        else
                            $(this).attr("name", "1");
                        if (value != "") {
                            appParameter_105.UserId = userInfo.UserId;
                            appParameter_105.CustomerId = userInfo.CustomerId;
                            appParameter_105.AuthToken = userInfo.Token;
                            appParameter_105.EmailId = userInfo.EmailId;
                            appParameter_105.ElementType = "DDList";
                            appParameter_105.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_105.ElementValue = value;
                            appParameter_105.AppInstanceId = userInfo.InstanceId;
                            appParameter_105.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_105);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:button_inputDisable(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        alert(strerrordesc);
                        onJavascriptLog("105_appclass.js", strerrordesc);
                    }
                }
            });

            $("#105 select").change(function () {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_105.UserId = userInfo.UserId;
                        appParameter_105.CustomerId = userInfo.CustomerId;
                        appParameter_105.AuthToken = userInfo.Token;
                        appParameter_105.EmailId = userInfo.EmailId;
                        appParameter_105.ElementType = "DDList";
                        appParameter_105.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_105.ElementValue = value;
                        appParameter_105.AppInstanceId = userInfo.InstanceId;
                        appParameter_105.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                        signalrService.UpdateValueInApplication(appParameter_105);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:select_DDList(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("105_appclass.js", strerrordesc);
                }
            });

            $("#105 :text").bind("paste", function (e) {
                if ($(this).attr('id') == '105_150' || $(this).attr('id') == '105_152' || $(this).attr('id') == '105_153') {
                }
                else {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }
            });

            $("#105 :text").bind('keydown', function (event) {
                try {
                    var keyNumber = event.keyCode;
                    var currentControl = $(this);
                    if (currentControl.attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    if (keyNumber == 13 || keyNumber == 9) {
                        var hasChanged = currentControl.hasClass('changeDone');
                        if (hasChanged) {
                            currentControl.removeClass('changeDone');
                            var value = currentControl.val();
                            if (value != "") {
                                appParameter_105.UserId = userInfo.UserId;
                                appParameter_105.CustomerId = userInfo.CustomerId;
                                appParameter_105.AuthToken = userInfo.Token;
                                appParameter_105.EmailId = userInfo.EmailId;
                                appParameter_105.ElementType = "DDList";
                                appParameter_105.ElementId = currentControl.attr("id").substring(currentControl.attr("id").lastIndexOf('_') + 1);
                                appParameter_105.ElementValue = value;
                                appParameter_105.AppInstanceId = userInfo.InstanceId;
                                appParameter_105.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                                signalrService.UpdateValueInApplication(appParameter_105);
                            }
                        }
                    }
                    else {
                        if ((keyNumber > 47 && keyNumber < 58) || (keyNumber > 95 && keyNumber < 106) || keyNumber == 8 || keyNumber == 46) {
                            currentControl.addClass('changeDone');
                        }
                        else if (event.keyCode == 110 || event.keyCode == 190) {
                            if ($(this).val().indexOf(".") != -1)
                                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                            currentControl.addClass('changeDone');
                        }
                        else if (keyNumber > 34 && keyNumber < 41) {
                            event.returnValue = true;
                        }
                        else {
                            event.preventDefault();
                        }
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("105_appclass.js", strerrordesc);
                }
            });
        };
    };
    return App_Class;
})();
