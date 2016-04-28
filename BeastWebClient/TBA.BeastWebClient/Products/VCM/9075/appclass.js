var appParameter_9075 = null;
var signalrService = null;

F2.Apps["9075"] = (function () {
    var App_Class = function (appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.$root = $(root);
        var $tbody = $('tbody', this.$root);
        var $caption = $('caption', this.$root);

        if (appConfig.context != null) {
            appParameter_9075 = new Object();
            appParameter_9075.AppId = appConfig.context.appId;
            appParameter_9075.AppName = appConfig.context.appName;
            appParameter_9075.UserId = userInfo.UserId;
            appParameter_9075.CustomerId = userInfo.CustomerId;
            appParameter_9075.AppType = appConfig.context.appType;
            appParameter_9075.AuthToken = userInfo.Token;
            appParameter_9075.ClientType = "Web";
            appParameter_9075.ClientVersion = detectBrowser().toString();
            appParameter_9075.EmailId = userInfo.EmailId;
            appParameter_9075.ElementType = "";
            appParameter_9075.ElementId = "";
            appParameter_9075.ElementValue = "";
            appParameter_9075.SignalRConnectionId = "";
            appParameter_9075.AppInstanceId = userInfo.InstanceId;
            appParameter_9075.InitiatorEmailId = userInfo.InitiatorEmailId;
            appParameter_9075.SharedSignalRConnectionId = userInfo.SharedSignalrId;
            appParameter_9075.AppMode = appConfig.context.appMode;
            appParameter_9075.AppKey = "";
        }

        App_Class.prototype.init = function () {
            // perform init actions 
            F2.log("Init SifId : 9075. Calc : CSC");
            if (signalrService == null)
                signalrService = new SignalrService();
            signalrService.InitSignalRConnection(appParameter_9075);

            $('#9075 :text[title="datepick"]').datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true,
                weekStart: 0,
                onSelect: function (date) {
                    try {
                        var value = $(this).val();
                        if (value != "") {
                            appParameter_9075.UserId = userInfo.UserId;
                            appParameter_9075.CustomerId = userInfo.CustomerId;
                            appParameter_9075.AuthToken = userInfo.Token;
                            appParameter_9075.EmailId = userInfo.EmailId;
                            appParameter_9075.ElementType = "DDList";
                            appParameter_9075.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_9075.ElementValue = value;
                            appParameter_9075.AppInstanceId = userInfo.InstanceId;
                            appParameter_9075.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_9075);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:datepick(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog(" 9075_appclass.js", strerrordesc);
                    }
                }
            });

            $('#9075 :text').click(function () {
                if ($(this).hasClass("priceWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9075.UserID + "^" + appParameter_9075.CustomerID + "^" + appParameter_9075.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9075.AppId + "^" + paraValues + "^" + idValPair;
                        PWM_Func_display_PriceWidget(eleInfo, $(this).val(), $(this).attr("name"), clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_priceWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9075_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("termWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9075.UserID + "^" + appParameter_9075.CustomerID + "^" + appParameter_9075.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9075.AppId + "^" + paraValues + "^" + idValPair;
                        TWM_Func_DisplayTermWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_termWidget(); Error is :" + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9075_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("basisWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9075.UserID + "^" + appParameter_9075.CustomerID + "^" + appParameter_9075.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9075.AppId + "^" + paraValues + "^" + idValPair;
                        display_BasisWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_basisWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9075_appclass.js", strerrordesc);
                    }
                }
            });

            $("#9075 input[type='button']").click(function () {
                if (!$(this).hasClass("inputDisable")) {
                    try {
                        var value = $(this).attr("name");
                        if (value == "1")
                            $(this).attr("name", "0");
                        else
                            $(this).attr("name", "1");
                        if (value != "") {
                            appParameter_9075.UserId = userInfo.UserId;
                            appParameter_9075.CustomerId = userInfo.CustomerId;
                            appParameter_9075.AuthToken = userInfo.Token;
                            appParameter_9075.EmailId = userInfo.EmailId;
                            appParameter_9075.ElementType = "DDList";
                            appParameter_9075.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_9075.ElementValue = value;
                            appParameter_9075.AppInstanceId = userInfo.InstanceId;
                            appParameter_9075.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_9075);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:button_inputDisable(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        alert(strerrordesc);
                        onJavascriptLog("9075_appclass.js", strerrordesc);
                    }
                }
            });

            $("#9075 select").change(function () {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_9075.UserId = userInfo.UserId;
                        appParameter_9075.CustomerId = userInfo.CustomerId;
                        appParameter_9075.AuthToken = userInfo.Token;
                        appParameter_9075.EmailId = userInfo.EmailId;
                        appParameter_9075.ElementType = "DDList";
                        appParameter_9075.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_9075.ElementValue = value;
                        appParameter_9075.AppInstanceId = userInfo.InstanceId;
                        appParameter_9075.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                        signalrService.UpdateValueInApplication(appParameter_9075);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:select_DDList(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("9075_appclass.js", strerrordesc);
                }
            });

            $("#9075 :text").bind("paste", function (e) {
                if ($(this).attr('id') == '9075_150' || $(this).attr('id') == '9075_152' || $(this).attr('id') == '9075_153') {
                }
                else {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }
            });

            $("#9075 :text").bind('keydown', function (event) {
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
                                appParameter_9075.UserId = userInfo.UserId;
                                appParameter_9075.CustomerId = userInfo.CustomerId;
                                appParameter_9075.AuthToken = userInfo.Token;
                                appParameter_9075.EmailId = userInfo.EmailId;
                                appParameter_9075.ElementType = "DDList";
                                appParameter_9075.ElementId = currentControl.attr("id").substring(currentControl.attr("id").lastIndexOf('_') + 1);
                                appParameter_9075.ElementValue = value;
                                appParameter_9075.AppInstanceId = userInfo.InstanceId;
                                appParameter_9075.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                                signalrService.UpdateValueInApplication(appParameter_9075);
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
                    onJavascriptLog("9075_appclass.js", strerrordesc);
                }
            });
        };
    };
    return App_Class;
})();
