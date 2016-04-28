var appParameter_9074 = null;
var signalrService = null;

F2.Apps["9074"] = (function () {
    var App_Class = function (appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.$root = $(root);
        var $tbody = $('tbody', this.$root);
        var $caption = $('caption', this.$root);

        if (appConfig.context != null) {
            appParameter_9074 = new Object();
            appParameter_9074.AppId = appConfig.context.appId;
            appParameter_9074.AppName = appConfig.context.appName;
            appParameter_9074.UserId = userInfo.UserId;
            appParameter_9074.CustomerId = userInfo.CustomerId;
            appParameter_9074.AppType = appConfig.context.appType;
            appParameter_9074.AuthToken = userInfo.Token;
            appParameter_9074.ClientType = "Web";
            appParameter_9074.ClientVersion = detectBrowser().toString();
            appParameter_9074.EmailId = userInfo.EmailId;
            appParameter_9074.ElementType = "";
            appParameter_9074.ElementId = "";
            appParameter_9074.ElementValue = "";
            appParameter_9074.SignalRConnectionId = "";
            appParameter_9074.AppInstanceId = userInfo.InstanceId;
            appParameter_9074.InitiatorEmailId = userInfo.InitiatorEmailId;
            appParameter_9074.SharedSignalRConnectionId = userInfo.SharedSignalrId;
            appParameter_9074.AppMode = appConfig.context.appMode;
            appParameter_9074.AppKey = "";
        }

        App_Class.prototype.init = function () {
            // perform init actions 
            F2.log("Init SifId : 9074. Calc : CCN");
            if (signalrService == null)
                signalrService = new SignalrService();
            signalrService.InitSignalRConnection(appParameter_9074);

            $('#9074 :text[title="datepick"]').datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true,
                weekStart: 0,
                onSelect: function (date) {
                    try {
                        var value = $(this).val();
                        if (value != "") {
                            appParameter_9074.UserId = userInfo.UserId;
                            appParameter_9074.CustomerId = userInfo.CustomerId;
                            appParameter_9074.AuthToken = userInfo.Token;
                            appParameter_9074.EmailId = userInfo.EmailId;
                            appParameter_9074.ElementType = "DDList";
                            appParameter_9074.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_9074.ElementValue = value;
                            appParameter_9074.AppInstanceId = userInfo.InstanceId;
                            appParameter_9074.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_9074);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:datepick(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog(" 9074_appclass.js", strerrordesc);
                    }
                }
            });

            $('#9074 :text').click(function () {
                if ($(this).hasClass("priceWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9074.UserID + "^" + appParameter_9074.CustomerID + "^" + appParameter_9074.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9074.AppId + "^" + paraValues + "^" + idValPair;
                        PWM_Func_display_PriceWidget(eleInfo, $(this).val(), $(this).attr("name"), clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_priceWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9074_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("termWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9074.UserID + "^" + appParameter_9074.CustomerID + "^" + appParameter_9074.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9074.AppId + "^" + paraValues + "^" + idValPair;
                        TWM_Func_DisplayTermWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_termWidget(); Error is :" + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9074_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("basisWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9074.UserID + "^" + appParameter_9074.CustomerID + "^" + appParameter_9074.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9074.AppId + "^" + paraValues + "^" + idValPair;
                        display_BasisWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_basisWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9074_appclass.js", strerrordesc);
                    }
                }
            });

            $("#9074 input[type='button']").click(function () {
                if (!$(this).hasClass("inputDisable")) {
                    try {
                        var value = $(this).attr("name");
                        if (value == "1")
                            $(this).attr("name", "0");
                        else
                            $(this).attr("name", "1");
                        if (value != "") {
                            appParameter_9074.UserId = userInfo.UserId;
                            appParameter_9074.CustomerId = userInfo.CustomerId;
                            appParameter_9074.AuthToken = userInfo.Token;
                            appParameter_9074.EmailId = userInfo.EmailId;
                            appParameter_9074.ElementType = "DDList";
                            appParameter_9074.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_9074.ElementValue = value;
                            appParameter_9074.AppInstanceId = userInfo.InstanceId;
                            appParameter_9074.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_9074);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:button_inputDisable(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        alert(strerrordesc);
                        onJavascriptLog("9074_appclass.js", strerrordesc);
                    }
                }
            });

            $("#9074 select").change(function () {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_9074.UserId = userInfo.UserId;
                        appParameter_9074.CustomerId = userInfo.CustomerId;
                        appParameter_9074.AuthToken = userInfo.Token;
                        appParameter_9074.EmailId = userInfo.EmailId;
                        appParameter_9074.ElementType = "DDList";
                        appParameter_9074.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_9074.ElementValue = value;
                        appParameter_9074.AppInstanceId = userInfo.InstanceId;
                        appParameter_9074.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                        signalrService.UpdateValueInApplication(appParameter_9074);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:select_DDList(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("9074_appclass.js", strerrordesc);
                }
            });

            $("#9074 :text").bind("paste", function (e) {
                if ($(this).attr('id') == '9074_150' || $(this).attr('id') == '9074_152' || $(this).attr('id') == '9074_153') {
                }
                else {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }
            });

            $("#9074 :text").bind('keydown', function (event) {
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
                                appParameter_9074.UserId = userInfo.UserId;
                                appParameter_9074.CustomerId = userInfo.CustomerId;
                                appParameter_9074.AuthToken = userInfo.Token;
                                appParameter_9074.EmailId = userInfo.EmailId;
                                appParameter_9074.ElementType = "DDList";
                                appParameter_9074.ElementId = currentControl.attr("id").substring(currentControl.attr("id").lastIndexOf('_') + 1);
                                appParameter_9074.ElementValue = value;
                                appParameter_9074.AppInstanceId = userInfo.InstanceId;
                                appParameter_9074.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                                signalrService.UpdateValueInApplication(appParameter_9074);
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
                    onJavascriptLog("9074_appclass.js", strerrordesc);
                }
            });
        };
    };
    return App_Class;
})();
