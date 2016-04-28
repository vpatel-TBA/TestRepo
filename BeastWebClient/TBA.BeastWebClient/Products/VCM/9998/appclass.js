var appParameter_9998 = null;
var signalrService = null;

F2.Apps["9998"] = (function () {
    var App_Class = function (appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.$root = $(root);
        var $tbody = $('tbody', this.$root);
        var $caption = $('caption', this.$root);

        if (appConfig.context != null) {
            appParameter_9998 = new Object();
            appParameter_9998.AppId = appConfig.context.appId;
            appParameter_9998.AppName = appConfig.context.appName;
            appParameter_9998.UserId = userInfo.UserId;
            appParameter_9998.CustomerId = userInfo.CustomerId;
            appParameter_9998.AppType = appConfig.context.appType;
            appParameter_9998.AuthToken = userInfo.Token;
            appParameter_9998.ClientType = "Web";
            appParameter_9998.ClientVersion = detectBrowser().toString();
            appParameter_9998.EmailId = userInfo.EmailId;
            appParameter_9998.ElementType = "";
            appParameter_9998.ElementId = "";
            appParameter_9998.ElementValue = "";
            appParameter_9998.SignalRConnectionId = "";
            appParameter_9998.AppInstanceId = userInfo.InstanceId;
            appParameter_9998.InitiatorEmailId = userInfo.InitiatorEmailId;
            appParameter_9998.SharedSignalRConnectionId = userInfo.SharedSignalrId;
            appParameter_9998.AppMode = appConfig.context.appMode;
            appParameter_9998.AppKey = "";
        }

        App_Class.prototype.init = function () {
            // perform init actions 
            F2.log("Init SifId : 9998. Calc : TS");
            if (signalrService == null)
                signalrService = new SignalrService();
            signalrService.InitSignalRConnection(appParameter_9998);

            $('#9998 :text[title="datepick"]').datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true,
                weekStart: 0,
                onSelect: function (date) {
                    try {
                        var value = $(this).val();
                        if (value != "") {
                            appParameter_9998.UserId = userInfo.UserId;
                            appParameter_9998.CustomerId = userInfo.CustomerId;
                            appParameter_9998.AuthToken = userInfo.Token;
                            appParameter_9998.EmailId = userInfo.EmailId;
                            appParameter_9998.ElementType = "DDList";
                            appParameter_9998.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_9998.ElementValue = value;
                            appParameter_9998.AppInstanceId = userInfo.InstanceId;
                            appParameter_9998.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_9998);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:datepick(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog(" 9998_appclass.js", strerrordesc);
                    }
                }
            });

            $('#9998 :text').click(function () {
                if ($(this).hasClass("priceWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9998.UserID + "^" + appParameter_9998.CustomerID + "^" + appParameter_9998.InstanceMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9998.AppId + "^" + paraValues + "^" + idValPair;
                        PWM_Func_display_PriceWidget(eleInfo, $(this).val(), $(this).attr("name"), clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_priceWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9998_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("termWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9998.UserID + "^" + appParameter_9998.CustomerID + "^" + appParameter_9998.InstanceMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9998.AppId + "^" + paraValues + "^" + idValPair;
                        TWM_Func_DisplayTermWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_termWidget(); Error is :" + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9998_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("basisWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_9998.UserID + "^" + appParameter_9998.CustomerID + "^" + appParameter_9998.InstanceMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_9998.AppId + "^" + paraValues + "^" + idValPair;
                        display_BasisWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_basisWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("9998_appclass.js", strerrordesc);
                    }
                }
            });

            $("#9998 input[type='button']").click(function () {
                if (!$(this).hasClass("inputDisable")) {
                    try {
                        var value = $(this).attr("name");
                        if (value == "1")
                            $(this).attr("name", "0");
                        else
                            $(this).attr("name", "1");
                        if (value != "") {
                            appParameter_9998.UserId = userInfo.UserId;
                            appParameter_9998.CustomerId = userInfo.CustomerId;
                            appParameter_9998.AuthToken = userInfo.Token;
                            appParameter_9998.EmailId = userInfo.EmailId;
                            appParameter_9998.ElementType = "DDList";
                            appParameter_9998.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_9998.ElementValue = value;
                            appParameter_9998.AppInstanceId = userInfo.InstanceId;
                            appParameter_9998.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_9998);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:button_inputDisable(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        alert(strerrordesc);
                        onJavascriptLog("9998_appclass.js", strerrordesc);
                    }
                }
            });

            $("#9998 select").change(function () {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_9998.UserId = userInfo.UserId;
                        appParameter_9998.CustomerId = userInfo.CustomerId;
                        appParameter_9998.AuthToken = userInfo.Token;
                        appParameter_9998.EmailId = userInfo.EmailId;
                        appParameter_9998.ElementType = "DDList";
                        appParameter_9998.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_9998.ElementValue = value;
                        appParameter_9998.AppInstanceId = userInfo.InstanceId;
                        appParameter_9998.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                        signalrService.UpdateValueInApplication(appParameter_9998);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:select_DDList(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("9998_appclass.js", strerrordesc);
                }
            });

            $("#9998 :text").bind("paste", function (e) {
                if ($(this).attr('id') == '9998_150' || $(this).attr('id') == '9998_152' || $(this).attr('id') == '9998_153') {
                }
                else {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }
            });
            $("#9998 :text").bind('keydown', function (event) {
                try {
                    var keyNumber = event.keyCode;
                    if ($(this).attr("title") == "datepick") event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    if (keyNumber == 13) {
                        var value = $(this).val();
                        if (value != "") {
                            appParameter_9998.UserId = userInfo.UserId;
                            appParameter_9998.CustomerId = userInfo.CustomerId;
                            appParameter_9998.AuthToken = userInfo.Token;
                            appParameter_9998.EmailId = userInfo.EmailId;
                            appParameter_9998.ElementType = "DDList";
                            appParameter_9998.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_9998.ElementValue = value;
                            appParameter_9998.AppInstanceId = userInfo.InstanceId;
                            appParameter_9998.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_9998);
                        }
                        event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:text_keydown(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("9998_appclass.js", strerrordesc);
                }
            });
        };
    };
    return App_Class;
})();
