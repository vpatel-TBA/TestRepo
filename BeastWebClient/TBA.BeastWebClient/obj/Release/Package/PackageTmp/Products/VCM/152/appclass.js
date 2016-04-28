var appParameter_152 = null;
var signalrService = null;

F2.Apps["152"] = (function () {
    var App_Class = function (appConfig, appContent, root) {
        this.appConfig = appConfig;
        this.appContent = appContent;
        this.$root = $(root);
        var $tbody = $('tbody', this.$root);
        var $caption = $('caption', this.$root);

        if (appConfig.context != null) {
            appParameter_152 = new Object();
            appParameter_152.AppId = appConfig.context.appId;
            appParameter_152.AppName = appConfig.context.appName;
            appParameter_152.UserId = userInfo.UserId;
            appParameter_152.CustomerId = userInfo.CustomerId;
            appParameter_152.AppType = appConfig.context.appType;
            appParameter_152.AuthToken = userInfo.Token;
            appParameter_152.ClientType = "Web";
            appParameter_152.ClientVersion = detectBrowser().toString();
            appParameter_152.EmailId = userInfo.EmailId;
            appParameter_152.ElementType = "";
            appParameter_152.ElementId = "";
            appParameter_152.ElementValue = "";
            appParameter_152.SignalRConnectionId = "";
            appParameter_152.AppInstanceId = userInfo.InstanceId;
            appParameter_152.InitiatorEmailId = userInfo.InitiatorEmailId;
            appParameter_152.SharedSignalRConnectionId = userInfo.SharedSignalrId;
            appParameter_152.AppMode = appConfig.context.appMode;
            appParameter_152.AppKey = "";
        }

        App_Class.prototype.init = function () {
            // perform init actions 
            F2.log("Init SifId : 152. Calc : BYC");
            if (signalrService == null)
                signalrService = new SignalrService();
            signalrService.InitSignalRConnection(appParameter_152);

            $('#152 :text[title="datepick"]').datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true,
                weekStart: 0,
                onSelect: function (date) {
                    try {
                        var value = $(this).val();
                        if (value != "") {
                            appParameter_152.UserId = userInfo.UserId;
                            appParameter_152.CustomerId = userInfo.CustomerId;
                            appParameter_152.AuthToken = userInfo.Token;
                            appParameter_152.EmailId = userInfo.EmailId;
                            appParameter_152.ElementType = "DDList";
                            appParameter_152.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_152.ElementValue = value;
                            appParameter_152.AppInstanceId = userInfo.InstanceId;
                            appParameter_152.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_152);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:datepick(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog(" 152_appclass.js", strerrordesc);
                    }
                }
            });

            $('#152 :text').click(function () {
                if ($(this).hasClass("priceWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_152.UserID + "^" + appParameter_152.CustomerID + "^" + appParameter_152.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_152.AppId + "^" + paraValues + "^" + idValPair;
                        PWM_Func_display_PriceWidget(eleInfo, $(this).val(), $(this).attr("name"), clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_priceWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("152_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("termWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_152.UserID + "^" + appParameter_152.CustomerID + "^" + appParameter_152.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_152.AppId + "^" + paraValues + "^" + idValPair;
                        TWM_Func_DisplayTermWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_termWidget(); Error is :" + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("152_appclass.js", strerrordesc);
                    }
                }
                else if ($(this).hasClass("basisWidget")) {
                    try {
                        var clsAryMed = $(this).attr("class");
                        var paraValues = appParameter_152.UserID + "^" + appParameter_152.CustomerID + "^" + appParameter_152.AppMode;
                        var itemType = "DDList";
                        var idValPair = itemType + "#" + $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        var eleInfo = appParameter_152.AppId + "^" + paraValues + "^" + idValPair;
                        display_BasisWidget(eleInfo, clsAryMed.split(' ')[2].split('_')[1], $(this));
                    }
                    catch (err) {
                        var strerrordesc = "Function:text_basisWidget(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        onJavascriptLog("152_appclass.js", strerrordesc);
                    }
                }
            });

            $("#152 input[type='button']").click(function () {
                if (!$(this).hasClass("inputDisable")) {
                    try {
                        var value = $(this).attr("name");
                        if (value == "1")
                            $(this).attr("name", "0");
                        else
                            $(this).attr("name", "1");
                        if (value != "") {
                            appParameter_152.UserId = userInfo.UserId;
                            appParameter_152.CustomerId = userInfo.CustomerId;
                            appParameter_152.AuthToken = userInfo.Token;
                            appParameter_152.EmailId = userInfo.EmailId;
                            appParameter_152.ElementType = "DDList";
                            appParameter_152.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                            appParameter_152.ElementValue = value;
                            appParameter_152.AppInstanceId = userInfo.InstanceId;
                            appParameter_152.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                            signalrService.UpdateValueInApplication(appParameter_152);
                        }
                    }
                    catch (err) {
                        var strerrordesc = "Function:button_inputDisable(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                        alert(strerrordesc);
                        onJavascriptLog("152_appclass.js", strerrordesc);
                    }
                }
            });

            $("#152 select").change(function () {
                try {
                    var value = $(this).val();
                    if (value != "") {
                        appParameter_152.UserId = userInfo.UserId;
                        appParameter_152.CustomerId = userInfo.CustomerId;
                        appParameter_152.AuthToken = userInfo.Token;
                        appParameter_152.EmailId = userInfo.EmailId;
                        appParameter_152.ElementType = "DDList";
                        appParameter_152.ElementId = $(this).attr("id").substring($(this).attr("id").lastIndexOf('_') + 1);
                        appParameter_152.ElementValue = value;
                        appParameter_152.AppInstanceId = userInfo.InstanceId;
                        appParameter_152.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                        signalrService.UpdateValueInApplication(appParameter_152);
                    }
                }
                catch (err) {
                    var strerrordesc = "Function:select_DDList(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
                    onJavascriptLog("152_appclass.js", strerrordesc);
                }
            });

            $("#152 :text").bind("paste", function (e) {
                if ($(this).attr('id') == '152_150' || $(this).attr('id') == '152_152' || $(this).attr('id') == '152_153') {
                }
                else {
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }
            });

            $("#152 :text").bind('keydown', function (event) {
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
                                appParameter_152.UserId = userInfo.UserId;
                                appParameter_152.CustomerId = userInfo.CustomerId;
                                appParameter_152.AuthToken = userInfo.Token;
                                appParameter_152.EmailId = userInfo.EmailId;
                                appParameter_152.ElementType = "DDList";
                                appParameter_152.ElementId = currentControl.attr("id").substring(currentControl.attr("id").lastIndexOf('_') + 1);
                                appParameter_152.ElementValue = value;
                                appParameter_152.AppInstanceId = userInfo.InstanceId;
                                appParameter_152.SharedSignalRConnectionId = userInfo.SharedSignalrId;
                                signalrService.UpdateValueInApplication(appParameter_152);
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
                    onJavascriptLog("152_appclass.js", strerrordesc);
                }
            });
        };
    };
    return App_Class;
})();
