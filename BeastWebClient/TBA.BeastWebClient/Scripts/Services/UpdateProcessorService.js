function UpdateProcessorService() {
    this.ProcessApplicationStatusUpdates = function (responseParameters) {
        if (responseParameters.ElementValue == "true") {
            $("#" + responseParameters.AppId + "_ImageStatus").removeClass("warning").removeClass("disConnect").addClass("connect");
            $("#" + responseParameters.AppId + "_ImageStatus").attr("title", "Image data is live and fine.");
        }
        else {
            $("#" + responseParameters.AppId + "_ImageStatus").removeClass("warning").removeClass("connect").addClass("disConnect");
            $("#" + responseParameters.AppId + "_ImageStatus").attr("title", "Image is closed due to some reason.");
        }
    }

    this.ProcessListUpdates = function (responseParameters) {
        if ($("#" + responseParameters.AppId + "_" + responseParameters.ElementId).length) {
            var elementValue = responseParameters.ElementValue.split('#')[0].split('|');            // elementProcess's value stored as array
            var elementCount = elementValue.length;                                                 // Array length of element value stored
            var elementSplit;                                                                       // Stores value after splitting with given character
            var elementPreSplit;                                                                    // Stores value after splitting with = than passes to elementSplit

            var selectElement = null;                                                               // Dropdownlist
            var optionElement = "";                                                                 // Options which are appended to Dropdownlist
            var currentElementId = -1;                                                              // Will hold the element id of current field
            var currentElementValue = "";                                                           // Will hold the element value of current field
            var currentElementTitle = "";                                                           // Will hold the element title of current field

            optionElement += "<option value='notselected'>" + "--Select--" + "</option>";
            for (i = 0; i < elementCount; i++) {
                element = elementValue[i];

                selectElement = $("select#" + responseParameters.AppId + "_" + responseParameters.ElementId);

                $(selectElement).empty();
                if (element.indexOf("=") == -1)
                    currentElementId = parseInt(currentElementId) + 1;
                else
                    currentElementId = parseInt($.trim(element.split('=')[1]));

                elementPreSplit = element.split('=')[0];
                elementSplit = elementPreSplit.split('~');

                currentElementValue = elementSplit[0];
                if (elementSplit.length == 2)
                    currentElementTitle = elementSplit[1].split('=')[0];

                optionElement += "<option value='" + currentElementId + "' title='" + currentElementTitle + "'>" + currentElementValue + "</option>";
            }

            var selectedValue = typeof responseParameters.SelectedValue === "undefined" ? "notselected" : responseParameters.SelectedValue;
            $(selectElement).html(optionElement);
            $(selectElement).val(selectedValue);
            if ((typeof $(selectElement)[0] != "undefined") && $(selectElement)[0].selectedIndex == -1)
                $(selectElement)[0].selectedIndex = 0;
        }
    }

    this.ProcessPropertiesUpdates = function (responseParameters) {
        var element = $("#" + responseParameters.AppId + "_" + responseParameters.ElementId);
        var property = responseParameters.ElementValue.split('|');
        try {
            //strProps = "V=1|M=0|E=0|F=3|R=-1|B=-1";
            if (!(property[0] == "V=1")) {
                $(element).hide();
            }
            else {
                var isInputDisable = false;

                $(element).show();

                if (!(property[2] == "E=1")) {
                    if ($(element).is('input')) {
                        isInputDisable = true;
                    }
                    else {
                        $(element).attr('disabled', 'disabled');
                    }
                }
                else {
                    if ($(element).is('input')) {
                        if ($(element).hasClass('inputDisable')) {
                            if ($(element).is('input[type="button"]')) {
                                $(element).attr('disabled', false).removeClass("inputDisable");
                            }
                            else {
                                $(element).removeClass("inputDisable").removeAttr('readonly').css("border", "");

                            }
                        }
                    }
                }

                $(element).removeClass().addClass(getClassForElement(property[5])).addClass(getClassForElement(property[4])).addClass(getClassForElement(property[3]));

                if (isInputDisable == true) {
                    if ($(element).is('input[type="button"]')) {
                        $(element).addClass('inputDisable').attr("disabled", true);
                    }
                    else {
                        $(element).addClass('inputDisable').attr('readonly', 'readonly').css("border", "0px");
                    }
                }
                else {
                    var isBasisField = IsBasisWidget(property[6]);
                    var isTermField = IsTermWidget(property[6]);
                    var isPriceWidget = UsesPriceWidget(parseInt(property[3].split('=')[1]));

                    if (isPriceWidget == true) {
                        $(element).addClass('priceWidget').css("cursor", "pointer").attr('readonly', 'readonly');
                    }
                    else if (isBasisField == true) {
                        $(element).addClass('basisWidget').css("cursor", "pointer").attr('readonly', 'readonly');
                    }
                    else if (isTermField == true) {
                        $(element).addClass('termWidget').css("cursor", "pointer").attr('readonly', 'readonly');
                    }
                }

                if ($(element).is('input[type="text"]')) {
                    setManualHighlighter(element, property[1]); //setManualHighlighter
                }
            }

            //Add color to element as per css class.
            var allClass = $(element).attr("class");
            var aryClass = null;

            if (allClass == undefined)
                isUpdatable = false;
            else
                aryClass = allClass.split(' ');

            if (aryClass != null) {
                $(element).css({
                    'background-color': getColorFromClass(aryClass[1]),
                    'color': getColorFromClass(aryClass[0])
                });
                setTimeout(function () {
                    $(element).css({
                        'background-color': getColorFromClass(aryClass[0]),
                        'color': getColorFromClass(aryClass[1])
                    });
                }, 1000);
            }
        }
        catch (error) {
            ;
        }
    }

    this.ProcessElementUpdates = function (responseParameters) {
        try {
            var elementParent = responseParameters.AppId;
            var elementId = responseParameters.ElementId;
            var elementProcess = $("#" + elementParent + "_" + elementId);
            var elementValue = responseParameters.ElementValue;                                 // Value of element
            var elementDisplay = responseParameters.ElementDisplayValue;                        // Text to be displayed
            //elementProcess, elementValue, elementParent, elementId, updtTyp,  elementDisplay
            var isUpdatable = true;
            //var OrigVal = elementValue;
            var allClass = $(elementProcess).attr("class");                                  // Store all the class associated with any element
            var classSplit = null;                                                           // Store class names attached to an element after splitting

            if (allClass == undefined)
                isUpdatable = false;
            else
                classSplit = allClass.split(' ');

            var isDateField = false;
            if ($(elementProcess).hasClass("updt") == false) {
                if ($(elementProcess).is("input") && elementValue != "") {
                    var eleTitle = $(elementProcess).attr('title');                     // For date picker
                    if (eleTitle != "" && eleTitle != undefined) {
                        if (eleTitle == "datepick") {
                            elementValue = elementValue.split(' ')[0];
                            isUpdatable = false;
                            isDateField = true;
                            $(elementProcess).val(elementValue);
                        }
                    }
                }

                if ((!$(elementProcess).is("input[type='text']")) && (!$(elementProcess).is("input[type='button']"))) {
                    $(elementProcess).val(elementValue);
                }
                else if (isDateField == false) {
                    var hasFocus = $(elementProcess).is(':focus');
                    if (hasFocus == false) {
                        $(elementProcess).val(elementDisplay);
                        $(elementProcess).attr("name", elementValue);
                    }
                    else {
                        $(elementProcess).val(elementValue);
                        $(elementProcess).attr("name", elementDisplay);
                    }
                }


                if ($(elementProcess).hasClass("updt") == false) {
                    $(elementProcess).addClass("updt");
                };

                if (classSplit != null) {
                    $(elementProcess).css({
                        'background-color': getColorFromClass(classSplit[1]),
                        'color': getColorFromClass(classSplit[0])
                    });
                    setTimeout(function () {
                        $(elementProcess).css({
                            'background-color': getColorFromClass(classSplit[0]),
                            'color': getColorFromClass(classSplit[1])
                        });
                    }, 1000);
                }

            }
        }
        catch (error) {
            ;
        }
    }

    this.ProcessTooltipUpdates = function (responseParameters) {
        var eleTitle = $("#" + responseParameters.AppId + "_" + responseParameters.ElementId).attr('title');
        if (eleTitle != "datepick") {
            if (isChartField(responseParameters.ElementId) == false) {
                $("#" + responseParameters.AppId + "_" + responseParameters.ElementId).attr('title', responseParameters.ElementValue);
            }
        }
    }

    this.ProcessCommanUpdates = function (responseParameters) {
        if (isChartField($.trim(responseParameters.ElementId)) == false) {
            this.ProcessElementUpdates(responseParameters);
        }
        else {
            var chartInfo = responseParameters.ElementValue.split('#')[0];
            if (responseParameters.AppId == "2132" && responseParameters.ElementId == "500000") {
                BchartCreate(chartInfo, "values per capita, inflation-adjusted (dollars)", "life expectancy (years)");
            }
        }
    }

    this.ProcessInvalidToken = function (responseParameters) {
        if (typeof ($("#exceptionModal").data('bs.modal') || {}).isShown == "undefined")
            ShowExceptionPopUp("Fail to authenticate requst please login again.");
    }

    this.ProcessExceptionDetail = function (exception) {
        if (typeof ($("#exceptionModal").data('bs.modal') || {}).isShown == "undefined")
            ShowExceptionPopUp(exception);
    }

    this.StoreInstanceId = function (responseParameters) {
        $("#" + responseParameters.AppId + "_instanceId").text(responseParameters.AppInstanceId);
    }

    this.SetImageTitle = function (responseParameters) {
        $("#" + responseParameters.AppId + "_title").text("-" + responseParameters.ElementValue);
    }

    this.SetImageDataAvailabilityInfo = function (responseParameters) {
        //Setting tooltip for image data info.
        if (responseParameters.ElementValue) {
            $("#" + responseParameters.AppId + "_ImageStatus").attr("title", responseParameters.ElementValue);
        } else {
            $("#" + responseParameters.AppId + "_ImageStatus").attr("title", "Image data is live and fine.");
        }
        //Setting image color on base of F of properties.
        var colorCode = responseParameters.ElementDisplayValue.split('|')[3];
        if (colorCode == "F=0" || colorCode == "F=100") {
            $("#" + responseParameters.AppId + "_ImageStatus").removeClass("disConnect").removeClass("warning").addClass("connect");
        }
        else if (colorCode == "F=200" || colorCode == "F=210") {
            $("#" + responseParameters.AppId + "_ImageStatus").removeClass("connect").removeClass("disConnect").addClass("warning");
        }
        else if (colorCode == "F=300" || colorCode == "F=310" || colorCode == "F=320") {
            $("#" + responseParameters.AppId + "_ImageStatus").removeClass("warning").removeClass("connect").addClass("disConnect");
        }

    }

    this.SetAuditTrailInfo = function (responseParameters) {
        //Setting tooltip for Audit info.
        if (responseParameters.ElementValue) {
            $("#" + responseParameters.AppId + "_AuditInfo").attr("title", responseParameters.ElementValue);
        } else {
            $("#" + responseParameters.AppId + "_AuditInfo").attr("title", "Audit data not available.");
        }
    }

    this.ProcessSwaptionData = function (responseParameters) {
        for (var i = 0; i < responseParameters.length; i++) {
            $("#" + responseParameters[i].Id).text(responseParameters[i].Data);
            animateTD(responseParameters[i].Id);
        }
    }

    this.ProcessSwaptionTitleDataUpdates = function (responseParameters) {
        $("#" + responseParameters.ElementId).text(responseParameters.ElementValue);
        $("#" + responseParameters.ElementId).attr('title', responseParameters.ElementDisplayValue);
    }

    function animateTD(eleID) {
        $("td#" + eleID).css('background-color', '#C0C0C0').css('color', "#000000");
        setTimeout(function () { $("#" + eleID).css('background-color', '#FFFFFF').css('color', "#333333"); }, 1000);
    }

    function setManualHighlighter(element, manualProp) {
        if (manualProp == "M=1") {
            $(element).addClass('ManualChange').trigger('ManualClassChange');
        }
        else {
            $(element).removeClass('ManualChange');
        }
    }

    function UsesPriceWidget(nFormat) {
        return (nFormat >= 1200 && nFormat <= 1999) || (nFormat >= 5200 && nFormat <= 5999);
    }

    function IsTermWidget(fieldID) {
        if (fieldID == "T=21")
            return true;
        return false;
    }

    function IsBasisWidget(fieldID) {
        if (fieldID == "T=52")
            return true;
        return false;
    }

    function getClassForElement(clrProp) {
        return clrProp.replace("=", "_");
    }

    function getColorFromClass(clrClass) {
        try {
            var colorName = "";
            var colorInfo = clrClass.split('_');
            var colorNumber = colorInfo[1];
            var colorType = colorInfo[0];

            switch (parseInt(colorNumber)) {
                case -1:
                    if (colorType == "B")
                        colorName = "RGB(255, 255, 255)";
                    else
                        colorName = "RGB(47,47,47)"; //1B1B1B
                    break;
                case 0:
                    colorName = "RGB(51,51,51)";
                    break;
                case 1:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 2:
                    colorName = "RGB(0, 255, 255)";
                    break;
                case 3:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 4:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 5:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 6:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 7:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 8:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 9:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 10:
                    colorName = "RGB(0, 255, 255)";
                    break;
                case 11:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 12:
                    colorName = "RGB(0, 255, 0)";
                    break;
                case 13:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 14:
                    colorName = "RGB(141, 160, 216)";
                    break;
                case 15:
                    colorName = "RGB(141, 160, 216)";
                    break;
                case 16:
                    colorName = "RGB(141, 160, 216)";
                    break;
                case 17:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 18:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 19:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 20:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 21:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 22:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 23:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 24:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 25:
                    colorName = "RGB(192, 192, 192)";
                    break;
                case 26:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 27:
                    colorName = "RGB(0, 255, 0)";
                    break;
                case 28:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 29:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 30:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 31:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 32:
                    //colorName = "RGB(128, 255, 255)";
                    colorName = "RGB(91, 163, 240)";
                    break;
                case 33:
                    colorName = "RGB(255, 128, 255)";
                    break;
                case 34:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 35:
                    colorName = "RGB(0, 160, 0)";
                    break;
                case 36:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 37:
                    colorName = "RGB(240, 240, 240)";
                    break;
                case 38:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 39:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 40:
                    colorName = "RGB(0, 255, 255)";
                    break;
                case 41:
                    colorName = "RGB(64, 64, 255)";
                    break;
                case 42:
                    colorName = "RGB(128, 128, 255)";
                    break;
                case 43:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 44:
                    colorName = "RGB(192, 192, 192)";
                    break;
                case 45:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 46:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 47:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 48:
                    colorName = "RGB(0, 255, 0)";
                    break;
                case 49:
                    colorName = "RGB(160, 255, 160)";
                    break;
                case 50:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 51:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 52:
                    colorName = "RGB(192, 0, 0)";
                    break;
                case 53:
                    //colorName = "RGB(128, 255, 128)";
                    colorName = "RGB(0, 128, 0)";
                    break;
                case 54:
                    colorName = "RGB(255, 128, 128)";
                    break;
                case 55:
                    //colorName = "RGB(128, 255, 255)";
                    colorName = "RGB(91, 163, 240)";
                    break;
                case 56:
                    colorName = "RGB(255, 0, 255)";
                    break;
                case 57:
                    //colorName = "RGB(128, 255, 255)";
                    colorName = "RGB(91, 163, 240)";
                    break;
                case 58:
                    colorName = "RGB(0, 128, 0)";
                    break;
                case 59:
                    colorName = "RGB(128, 128, 0)";
                    break;
                case 60:
                    colorName = "RGB(128, 0, 0)";
                    break;
                case 61:
                    colorName = "RGB(0, 255, 0)";
                    break;
                case 62:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 63:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 64:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 65:
                    colorName = "RGB(64, 64, 64)";
                    break;
                case 66:
                    colorName = "RGB(128, 128, 128)";
                    break;
                case 67:
                    colorName = "RGB(192, 192, 192)";
                    break;
                case 68:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 69:
                    colorName = "RGB(160, 160, 160)";
                    break;
                case 70:
                    colorName = "RGB(96, 96, 96)";
                    break;
                case 71:
                    colorName = "RGB(224, 224, 255)";
                    break;
                case 72:
                    colorName = "RGB(255, 224, 255)";
                    break;
                case 73:
                    colorName = "RGB(255, 224, 192)";
                    break;
                case 74:
                    colorName = "RGB(255, 255, 192)";
                    break;
                case 75:
                    colorName = "RGB(224, 255, 192)";
                    break;
                case 76:
                    colorName = "RGB(224, 208, 255)";
                    break;
                case 77:
                    colorName = "RGB(255, 208, 208)";
                    break;
                case 78:
                    colorName = "RGB(208, 224, 255)";
                    break;
                case 79:
                    colorName = "RGB(32,  32,  64)";
                    break;
                case 80:
                    colorName = "RGB(64,  32,  64)";
                    break;
                case 81:
                    colorName = "RGB(64,  32,  0)";
                    break;
                case 82:
                    colorName = "RGB(64,  64,  0)";
                    break;
                case 83:
                    colorName = "RGB(32,  64,  0)";
                    break;
                case 84:
                    colorName = "RGB(32,  32,  64)";
                    break;
                case 85:
                    colorName = "RGB(64,  32,  32)";
                    break;
                case 86:
                    colorName = "RGB(32,  32,  64)";
                    break;
                case 87:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 88:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 89:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 90:
                    colorName = "RGB(0, 255, 0)";
                    break;
                case 91:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 92:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 93:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 94:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 95:
                    colorName = "RGB(128, 0, 0)";
                    break;
                case 96:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 97:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 98:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 99:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 100:
                    colorName = "RGB(0, 0, 127)";
                    break;
                case 101:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 102:
                    colorName = "RGB(255, 255, 192)";
                    break;
                case 103:
                    colorName = "RGB(192, 255, 192)";
                    break;
                case 104:
                    colorName = "RGB(255, 255, 192)";
                    break;
                case 105:
                    colorName = "RGB(255, 192, 192)";
                    break;
                case 106:
                    colorName = "RGB(255, 64, 64)";
                    break;
                case 107:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 108:
                    colorName = "RGB(240, 240, 240)";
                    break;
                case 109:
                    colorName = "RGB(255, 192, 192)";
                    break;
                case 110:
                    colorName = "RGB(192, 255, 192)";
                    break;
                case 111:
                    colorName = "RGB(192, 192, 255)";
                    break;
                case 112:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 113:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 114:
                    colorName = "RGB(0, 255, 0)";
                    break;
                case 115:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 116:
                    colorName = "RGB(0, 255, 255)";
                    break;
                case 117:
                    colorName = "RGB(255, 0, 255)";
                    break;
                case 118:
                    colorName = "RGB(255, 128, 128)";
                    break;
                case 119:
                    colorName = "RGB(128, 128, 255)";
                    break;
                case 120:
                    colorName = "RGB(128, 255, 128)";
                    break;
                case 121:
                    colorName = "RGB(80, 80, 80)";
                    break;
                case 122:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 123:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 124:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 125:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 126:
                    colorName = "RGB(200, 200, 200)";
                    break;
                case 127:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 128:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 129:
                    colorName = "RGB(255,255,0)";
                    break;
                case 130:
                    colorName = "RGB(255, 0,0)";
                    break;
                case 131:
                    colorName = "RGB(0, 255,255)";
                    break;
                case 132:
                    colorName = "RGB(200,200,200)";
                    break;
                case 133:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 134:
                    colorName = "RGB(0, 255,255)";
                    break;
                case 135:
                    colorName = "RGB(255,255,0)";
                    break;
                case 136:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 137:
                    colorName = "RGB(128, 128, 128)";
                    break;
                case 138:
                    colorName = "RGB(192, 192, 192)";
                    break;
                case 139:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 140:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 141:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 142:
                    colorName = "RGB(0, 255, 255)";
                    break;
                case 143:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 144:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 145:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 146:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 147:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 148:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 149:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 150:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 151:
                    colorName = "RGB(0, 255, 255)";
                    break;
                case 152:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 153:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 154:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 155:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 156:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 157:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 158:
                    colorName = "RGB(0, 255, 255)";
                    break;
                case 159:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 160:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 161:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 162:
                    colorName = "RGB(0, 255, 255)";
                    break;
                case 163:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 164:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 165:
                    colorName = "RGB(255, 255, 0)";
                    break;
                case 166:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 167:
                    colorName = "RGB(0, 0, 255)";
                    break;
                case 168:
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 169:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 170:
                    colorName = "RGB(255, 255, 255)";
                    break;
                case 171:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 172:
                    colorName = "RGB(128, 128, 128)";
                    break;
                case 173:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 174:
                    colorName = "RGB(64, 128, 64)";
                    break;
                case 175:
                    colorName = "RGB(255, 192, 0)";
                    break;
                case 176:
                    colorName = "RGB(255, 64, 64)";
                    break;
                case 177:
                    colorName = "RGB(0, 0, 0)";
                    break;
                case 178:
                    colorName = "RGB(255, 255, 128)";
                    break;
                case 179:
                    colorName = "RGB(128, 255, 128)";
                    break;
                case 180:
                    colorName = "RGB(224, 32, 255)";
                    break;
                case 181:
                    colorName = "RGB(255, 96, 96)";
                    break;
                case 182:
                    colorName = "RGB(240, 240, 240)";
                    break;
                case 183:
                    //colorName = "RGB(226, 19, 19)";
                    colorName = "RGB(255, 0, 0)";
                    break;
                case 184:
                    //            colorName = "RGB(0, 255, 0)";
                    colorName = "RGB(0, 128, 0)";
                    break;
                case 185:
                    colorName = "RGB(65, 76, 202)";
                    break;
                case 186:
                    colorName = "RGB(255, 255, 255)";
                    break;
                default:
                    colorName = "RGB(255, 255, 255)";
                    break;
            }
        }
        catch (err) {
            var strerrordesc = "Function:getColorFromClass(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
            //onJavascriptLog("VolSeparate.js", strerrordesc);
            ;
        }
        return colorName;
    }

    function isChartField(elementId) {
        if (elementId == "88888888" || elementId == "88888889" || elementId == "88888890" || elementId == "500000" || elementId == "88888881" || elementId == "88888882" || elementId == "88888883" || elementId == "88888884" || elementId == "13")
            return true;
        return false;
    }
}