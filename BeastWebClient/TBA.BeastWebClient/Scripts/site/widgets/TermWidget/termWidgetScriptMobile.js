var twmWidgetHtml = "";
var twmBEAST_VALUE, twmTERM_FORMAT, twmTERM_VALUE;
var twmTERM_FORMAT_CYCLE = [3, 5, 2, 0, 1]; //Year/Month, Months, Weeks, Days, BusinessDays
var twmCycleCounter = 0;
var twmCURRENT_TERM_DISPLAY;
var twmIS_HTML_LOADED = true;
var twmIS_NEGATIVE = false;
var twmTARGET_ELEMENT_INFO = "";
var twmWIDGET_DIV_ID = "";
var twmGLOBAL_MONTHS = 0;
var twm_LIST_HTML = "<div style=\"float: left; width:50%; text-align:center;\">"
                        + "<span class=\"twmSpnPriceSectionTitle\">[TITLE]</span><br />"
                        + "<div class=\"dvSpinUpArrow\" onclick=\"TWM_Func_GetNextOption('fwrd','[DIVID]');\"></div>"
                        + "<div id=\"[DIVID]\" class=\"dvSpinViewFrame\"></div>"
                        + "<div class=\"dvSpinDownArrow\" onclick=\"TWM_Func_GetNextOption('back','[DIVID]');\"></div>"
                        + "</div>";

var twm_ARR_YM_YEAR = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                        , "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"
                        , "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
var twm_ARR_YM_YEAR_INDEX = 0;

var twm_ARR_YM_MONTH = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
var twm_ARR_YM_MONTH_INDEX = 0;

var twm_ARR_MONTH = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                    , "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"
                    , "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"
                    , "30", "31", "32", "33", "34", "35", "36", "48", "60", "72"];
var twm_ARR_MONTH_INDEX = 0;

var twm_ARR_WEEK = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                    , "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"
                    , "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"
                    , "30", "31", "32", "33", "34", "35", "36", "40", "50", "52"];
var twm_ARR_WEEK_INDEX = 0;

var twm_ARR_DAY = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                    , "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"
                    , "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"
                    , "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360"];
var twm_ARR_DAY_INDEX = 0;

var twm_ARR_BUSINESSDAY = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
                    , "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"
                    , "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"
                    , "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360"];
var twm_ARR_BUSINESSDAY_INDEX = 0;

var twmTermFormats = {
    "Beast_Days": 0,
    "Beast_BusDays": 1,
    "Beast_Weeks": 2,
    "Beast_YearMonths": 3,
    "Beast_Years": 4,
    "Beast_Months": 5,
    "Beast_None": 6
};

//function TWM_Func_DisplayTermWidget(eleIDForWidget, defFormat, termEle, widgetDivId) {
function TWM_Func_DisplayTermWidget(eleIDForWidget, defFormat, termEle) {
    try {
        twmWIDGET_DIV_ID = "dvTermWidgetMobile";

        twmTARGET_ELEMENT_INFO = eleIDForWidget;

        TWM_Func_LoadHTML();

        var vBeastValue = $(termEle).attr("name");

        if (parseInt(vBeastValue, 10) < 0) {
            twmIS_NEGATIVE = true;
            vBeastValue = vBeastValue.replace("-", "");
        }
        else {
            twmIS_NEGATIVE = false;
        }

        if (vBeastValue == "" || vBeastValue == undefined || isNaN(vBeastValue))
            vBeastValue = "0";

        twmBEAST_VALUE = vBeastValue;

        TWM_Func_ParseBeastValue();

        TWM_Func_SetView_YearMonths();

        TWM_Func_SetSelectedCell();

        /* ============================ */

        //$('#' + twmWIDGET_DIV_ID + 'Parent').modal({ backdrop: true, keyboard: true });
        //$("div:Last").removeClass("modal-backdrop in");
        //positionWidget($(termEle).attr('id'));
        //$('#' + twmWIDGET_DIV_ID + 'Parent').focus();

        $('#' + twmWIDGET_DIV_ID).modal({
            backdrop: false,
            keyboard: true
        });
        positionWidget($(termEle).attr('id'));
        $('#' + twmWIDGET_DIV_ID).focus();

        $('#' + twmWIDGET_DIV_ID).on('hide', function () {
            TWM_Func_ClearGlobalVars();
        });
        $('#hdnWgtElement').val($(termEle).attr('id'));
        /* ============================ */
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_DisplayTermWidget", err);
    }
}

function TWM_Func_LoadHTML() {
    try {
        var twmHtml = "";

        twmHtml += "<style type=\"text/css\">               .twmDvTitle, .twmDvContent, .twmDvContentWrapper, .twmDvTop, .twmDvMiddle, .twmDvBottom {             width: 100%;         }                              .twmDvBottom {             height: 25px;             border: none;         }          .twmDvMiddle {             height: 103px;             margin: 5px 0px 7px 0px;             font-size: 16px;         }        .twmDvContentWrapper {           /* background-color: #d9d9d9;  */       }                                            .ItemSelected {             background-color: #777777;             color: #FFF;         }          .twmNavigate, .twmOptions {             width: 45%;             height: 100%;             float: left;             margin: 0px;             padding: 0px;         }          .twmNavigate {             text-align: center;         }                 .dvSpinViewFrame:hover, .twmNavigateMiddle:hover {                 background-color: #777777;                 color: white;             }          .dvSpinUpArrow, .dvSpinDownArrow {             text-align: center;             vertical-align: middle;             height: 28px;             width: 100%;         }          .dvSpinUpArrow {             background-image: url('" + config.clientUrl + "/content/images/site/Widget_UpDown1.png');             background-repeat: no-repeat;             background-position: center 2px;         }          .dvSpinDownArrow {             background-image: url('" + config.clientUrl + "/content/images/site/Widget_UpDown1.png');             background-repeat: no-repeat;             background-position: center -32px;         }          .dvSpinUpArrow:hover {             background-color: #777777;             color: white;             cursor: pointer;             background-image: url('" + config.clientUrl + "/content/images/site/Widget_UpDown1HoverBlack.png');             background-repeat: no-repeat;             background-position: center 2px;         }          .dvSpinDownArrow:hover {             background-color: #777777;             color: white;             cursor: pointer;             background-image: url('" + config.clientUrl + "/content/images/site/Widget_UpDown1HoverBlack.png');             background-repeat: no-repeat;             background-position: center -32px;         }              </style>";

        twmHtml += "<div id=\"dvTwmTitle\" class=\"twmDvTitle\">             Term Widget             <a class=\"twmBtnClose\" data-dismiss=\"modal\" aria-hidden=\"true\" onclick=\"TWM_Func_CloseTermWidget();\">&times;</a>         </div>         <div class=\"twmDvContent\">             <div class=\"twmDvContentWrapper\">                 <div class=\"twmDvTop\">                     <div class=\"twmDvValueText\" style=\"float: left;\">Value:</div>                     <div class=\"twmTxtValueDisplay\" style=\"float: left;\">                     </div>                     <div class=\"twmDvNegativeBtn ItemBox\" style=\"float: right; cursor: pointer;\" onclick=\"TWM_Func_ToggleNegative();\">Neg(-ve)</div>                 </div>                 <div class=\"twmDvMiddle\">                     <div class=\"twmNavigate\">                         <span class=\"twmSpnPriceSectionTitle\">Format</span><br />                         <div class=\"dvSpinUpArrow\" onclick=\"TWM_Func_OnTermFormatChange('back');\"></div>                         <div class=\"twmNavigateMiddle\" onclick=\"TWM_Func_OnTermFormatChange('fwrd');\">                         </div>                         <div class=\"dvSpinDownArrow\" onclick=\"TWM_Func_OnTermFormatChange('fwrd');\"></div>                     </div>                     <div class=\"twmOptions\">                     </div>                 </div>                 <div class=\"twmDvBottom\">                     <div style=\"text-align: center;\">                         <input type=\"button\" class=\"btn btn-small btn-inverse\" value=\"OK\" onclick=\"TWM_Func_SaveTermWidget();\" style=\"margin: 0px;color: #fff;padding:3px;width: 60px;font-size: 11px;\" data-dismiss=\"modal\" aria-hidden=\"true\" />                         <input type=\"button\" class=\"btn btn-small\" value=\"CANCEL\" onclick=\"TWM_Func_CloseTermWidget();\" style=\"margin:0px;padding:3px;font-size: 11px;width: 60px;\" data-dismiss=\"modal\" aria-hidden=\"true\" />            <input type=\"button\" class=\"btn btn-small btn-inverse\" value=\"CLEAR\" onclick=\"TWM_Func_Clear_TermWidget();\" style=\"margin:0px;color: #fff;padding:3px;width:60px;font-size: 11px;\" data-dismiss=\"modal\" aria-hidden=\"true\"  />              </div>                 </div>             </div>         </div>";

        $('#' + twmWIDGET_DIV_ID).html(twmHtml);

        twmIS_HTML_LOADED = true;

    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_LoadHTML", err);
    }
}

function TWM_Func_BindEvents() {
    try {
        if (twmIS_HTML_LOADED === true) {

            /*Table td*/
            $('#twmTblAllOptions td').click(function (index) {
                TWM_Func_OnTermValueChange(this);
            });

            $('#' + twmWIDGET_DIV_ID).on('hide', TWM_Func_CloseTermWidget());
        }
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_BindEvents", err);
    }
}

function TWM_Func_ParseBeastValue() {
    try {

        //Getting term format
        var lastchar = twmBEAST_VALUE.toString().charAt(twmBEAST_VALUE.toString().length - 1);

        twmTERM_FORMAT = parseInt(lastchar, 10);

        if (TWM_Func_GetTermNear(parseInt(twmBEAST_VALUE, 10))) {
            twmBEAST_VALUE = TWM_Func_GetCount(parseInt(twmBEAST_VALUE, 10)).toString() + lastchar.toString();
        }

        //excluding last char
        var _actValue = twmBEAST_VALUE.toString().substr(0, twmBEAST_VALUE.toString().length - 1);
        if (_actValue == "") {
            twmTERM_VALUE = 0;
        }
        else {
            twmTERM_VALUE = parseInt(_actValue, 10);
        }
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_ParseBeastValue", err);
    }
}

function TWM_Func_GetTermNear(m_nTerm) {
    return ((m_nTerm >= 0) ? m_nTerm / 1000000 : -((-m_nTerm) / 1000000)) != 0;
}

function TWM_Func_GetCount(m_nTerm) {
    return parseInt((m_nTerm >= 0) ? m_nTerm / 10 % 100000 : -((-m_nTerm) / 10 % 100000), 10);
}

function TWM_Func_SetView_YearMonths() {
    try {

        TWM_Func_ConvertTo_YearsMonths(twmTERM_VALUE, twmTERM_FORMAT);

        TWM_Func_SetDisplayValue();

        TWM_Func_GenerateSelectionTable(twm_ARR_YM_YEAR);

        //TWM_Func_SetSelectedCell();

        //TWM_Func_BindEvents();
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SetView_YearMonths", err);
    }
}

function TWM_Func_SetView_Months() {
    try {
        TWM_Func_ConvertTo_Months(twmTERM_VALUE, twmTERM_FORMAT);

        TWM_Func_SetDisplayValue();

        TWM_Func_GenerateSelectionTable(twm_ARR_MONTH);

        //TWM_Func_SetSelectedCell();

        //TWM_Func_BindEvents();
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SetView_Months", err);
    }
}

function TWM_Func_SetView_Weeks() {
    try {
        TWM_Func_ConvertTo_Weeks(twmTERM_VALUE, twmTERM_FORMAT);

        TWM_Func_SetDisplayValue();

        TWM_Func_GenerateSelectionTable(twm_ARR_WEEK);

        //TWM_Func_SetSelectedCell();

        //TWM_Func_BindEvents();
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SetView_Weeks", err);
    }
}

function TWM_Func_SetView_Days() {
    try {
        TWM_Func_ConvertTo_Days(twmTERM_VALUE, twmTERM_FORMAT);

        TWM_Func_SetDisplayValue();

        TWM_Func_GenerateSelectionTable(twm_ARR_DAY);

        //TWM_Func_SetSelectedCell();

        //TWM_Func_BindEvents();
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SetView_Days", err);
    }
}

function TWM_Func_SetView_BusinessDays() {
    try {
        TWM_Func_ConvertTo_BusinessDays(twmTERM_VALUE, twmTERM_FORMAT);

        TWM_Func_SetDisplayValue();

        TWM_Func_GenerateSelectionTable(twm_ARR_BUSINESSDAY);

        //TWM_Func_SetSelectedCell();

        //TWM_Func_BindEvents();
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SetView_BusinessDays", err);
    }
}

function TWM_Func_SetDisplayValue() {
    ///Sets widget final value in textbox
    try {
        switch (twmTERM_FORMAT) {

            case 0: //Days                
                $('.twmTxtValueDisplay').text(twmCURRENT_TERM_DISPLAY + ' D');
                $('.twmNavigateMiddle').text("DAYS");
                break;

            case 1: //Bus Days                
                $('.twmTxtValueDisplay').text(twmCURRENT_TERM_DISPLAY + ' BD');
                $('.twmNavigateMiddle').text("BUS. DAYS");
                break;

            case 2: //Weeks                
                $('.twmTxtValueDisplay').text(twmCURRENT_TERM_DISPLAY + ' W');
                $('.twmNavigateMiddle').text("WEEKS");
                break;

            case 3: //Year/Month
                var vTemp = twmCURRENT_TERM_DISPLAY.split('#');
                $('.twmTxtValueDisplay').text(vTemp[0] + 'Y ' + vTemp[1] + 'M');
                $('.twmNavigateMiddle').text("YY / MM");
                break;

            case 4: //Years                
                $('.twmTxtValueDisplay').text(twmCURRENT_TERM_DISPLAY + ' Y');
                $('.twmNavigateMiddle').text("YEARS");
                break;

            case 5: //Months only
                $('.twmTxtValueDisplay').text(twmCURRENT_TERM_DISPLAY + ' M');
                $('.twmNavigateMiddle').text("MONTHS");
                break;

            case 6: //None
                //Nothing
                break;
        }

        if (twmIS_NEGATIVE == true) {
            var _tmp = $('.twmTxtValueDisplay').text();
            _tmp = $.trim(_tmp);
            if (_tmp !== "" && _tmp !== null) {
                $('.twmTxtValueDisplay').text("(" + _tmp + ")");
                $('.twmDvNegativeBtn').addClass('ItemSelected');
            }
        }
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SetDisplayValue", err);
    }
}

function TWM_Func_SetSelectedCell() {
    try {

        if (twmTERM_FORMAT == twmTermFormats.Beast_YearMonths) {

            var vTemp = twmCURRENT_TERM_DISPLAY.split('#');
            vTemp[0] = $.trim(vTemp[0]);
            vTemp[1] = $.trim(vTemp[1]);

            twm_ARR_YM_YEAR_INDEX = $.inArray(vTemp[0], twm_ARR_YM_YEAR);
            twm_ARR_YM_MONTH_INDEX = $.inArray(vTemp[1], twm_ARR_YM_MONTH);

            $('#twmDvYearMonth_Year').text(vTemp[0]);
            $('#twmDvYearMonth_Month').text(vTemp[1]);
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Months) {

            var vTemp = $.trim(twmCURRENT_TERM_DISPLAY);
            twm_ARR_MONTH_INDEX = $.inArray(vTemp, twm_ARR_MONTH);
            $('#twmDvMonths').text(vTemp);

        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Weeks) {

            var vTemp = $.trim(twmCURRENT_TERM_DISPLAY);
            twm_ARR_WEEK_INDEX = $.inArray(vTemp, twm_ARR_WEEK);
            $('#twmDvWeeks').text(vTemp);

        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Days) {

            var vTemp = $.trim(twmCURRENT_TERM_DISPLAY);
            twm_ARR_DAY_INDEX = $.inArray(vTemp, twm_ARR_DAY_INDEX);
            $('#twmDvDays').text(vTemp);

        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_BusDays) {

            var vTemp = $.trim(twmCURRENT_TERM_DISPLAY);
            twm_ARR_BUSINESSDAY_INDEX = $.inArray(vTemp, twm_ARR_BUSINESSDAY);
            $('#twmDvBusinessDays').text(vTemp);

        }
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SetSelectedCell", err);
    }
}

function TWM_Func_ConvertTo_Days(PrevValue, PrevUnit) {
    try {
        var nReturn = 0;
        switch (PrevUnit) {
            case 3: //Years/Months               
            case 5: //Months
                nReturn = parseInt(((PrevValue * 30.42) + 0.5), 10);
                break;
            case 2: //Weeks
                //PrevValue = parseInt(twmGLOBAL_MONTHS, 10);
                //nReturn = parseInt(((PrevValue * 30.42) + 0.5), 10);
                nReturn = parseInt(PrevValue * 7, 10);
                break;
            case 0: //Days/Business Days
            case 1:
                nReturn = PrevValue;
                break;
            case 4: //Years
                nReturn = PrevValue * 365;
                break;
        }

        TWM_Func_SetKeyValues(nReturn, twmTermFormats.Beast_Days, nReturn.toString());
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_ConvertTo_Days", err);
    }
}

function TWM_Func_ConvertTo_BusinessDays(PrevValue, PrevUnit) {
    try {
        var nReturn = 0;
        switch (PrevUnit) {
            case 3: //Years/Months               
            case 5: //Months
                nReturn = parseInt(((PrevValue * 30.42) + 0.5), 10);
                break;
            case 2: //Weeks
                nReturn = parseInt(PrevValue * 7, 10);
                break;
            case 0: //Days/Business Days
            case 1:
                nReturn = PrevValue;
                break;
            case 4: //Years
                nReturn = PrevValue * 365;
                break;
        }

        TWM_Func_SetKeyValues(nReturn, twmTermFormats.Beast_BusDays, nReturn.toString());
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_ConvertTo_BusinessDays", err);
    }
}

function TWM_Func_ConvertTo_Weeks(PrevValue, PrevUnit) {
    try {
        var nReturn = 0;
        switch (PrevUnit) {
            case 3: //Years/Months
            case 5: //Months
                //nReturn = parseInt(((PrevValue * 4.33) + 0.5), 10);     //1 month = 4.34812141 weeks (says Google)
                nReturn = Math.round((PrevValue * 4.34) + 0.5);
                break;
            case 2: //Weeks
                nReturn = PrevValue;
                break;
            case 0: //Days/Business Days
            case 1:
                //PrevValue = twmGLOBAL_MONTHS;
                //nReturn = parseInt(((PrevValue * 4.33) + 0.5), 10);
                nReturn = parseInt(PrevValue / 7, 10);
                break;
            case 4: //Years
                nReturn = PrevValue * 52;
                break;
        }

        TWM_Func_SetKeyValues(nReturn, twmTermFormats.Beast_Weeks, nReturn.toString());
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_ConvertTo_Weeks", err);
    }
}

function TWM_Func_ConvertTo_Months(PrevValue, PrevUnit) {
    try {
        var nReturn = 0;
        switch (PrevUnit) {
            case 3: //Years/Months                
            case 5: //Months
                nReturn = PrevValue;
                //twmGLOBAL_MONTHS = PrevValue;
                break;
            case 2: //Weeks                
                nReturn = parseInt(((PrevValue / 4.33) + 0.5), 10);
                break;
            case 0: //Days/Business Days
            case 1:
                nReturn = parseInt(((PrevValue / 30.42) + 0.5), 10);
                break;
            case 4: //Years
                nReturn = PrevValue * 12;
                break;
        }

        TWM_Func_SetKeyValues(nReturn, twmTermFormats.Beast_Months, nReturn.toString());
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_ConvertTo_Months", err);
    }
}

function TWM_Func_ConvertTo_YearsMonths(PrevValue, PrevUnit) {
    try {
        var nReturn = "";
        var _vYear, _vMnth;

        switch (PrevUnit) {
            case 3: //Years/Months
            case 5: //Months
                _vYear = parseInt(PrevValue / 12, 10);
                _vMnth = parseInt(PrevValue % 12, 10);
                //twmGLOBAL_MONTHS = PrevValue;
                nReturn = PrevValue;
                break;
            case 2: //Weeks
                _vMnth = parseInt(((PrevValue / 4.33) + 0.5), 10);
                _vYear = parseInt(_vMnth / 12, 10);
                _vMnth = parseInt(_vMnth % 12, 10);
                nReturn = _vMnth;
                break;
            case 0: //Days/Business Days
            case 1:
                PrevValue = parseInt(((PrevValue / 30.42) + 0.5), 10);
                _vYear = parseInt(PrevValue / 12, 10);
                _vMnth = parseInt(PrevValue % 12, 10);
                nReturn = PrevValue;
                break;
            case 4: //Years
                _vYear = PrevValue;
                _vMnth = 0;
                nReturn = PrevValue * 12;
                break;
        }

        TWM_Func_SetKeyValues(nReturn, twmTermFormats.Beast_YearMonths, (_vYear + "#" + _vMnth));
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_ConvertTo_YearsMonths", err);
    }
}

function TWM_Func_GenerateSelectionTable(ArrDisplayArray) {

    try {

        var vListHtml = twm_LIST_HTML;

        $('.twmOptions').html('');

        if (twmTERM_FORMAT == twmTermFormats.Beast_YearMonths) {
            var vCombinedHtml = "";

            vListHtml = vListHtml.replace("[TITLE]", "Y");
            vListHtml = ReplaceAll(vListHtml, "[DIVID]", "twmDvYearMonth_Year");

            vCombinedHtml = vListHtml;

            vListHtml = twm_LIST_HTML;
            vListHtml = vListHtml.replace("[TITLE]", "M");
            vListHtml = ReplaceAll(vListHtml, "[DIVID]", "twmDvYearMonth_Month");

            vCombinedHtml += vListHtml;

            vListHtml = vCombinedHtml;
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Months) {
            vListHtml = vListHtml.replace("[TITLE]", "M");
            //vListHtml = vListHtml.replace("[TITLE]", "");
            vListHtml = ReplaceAll(vListHtml, "[DIVID]", "twmDvMonths");
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Weeks) {
            vListHtml = vListHtml.replace("[TITLE]", "W");
            //vListHtml = vListHtml.replace("[TITLE]", "");
            vListHtml = ReplaceAll(vListHtml, "[DIVID]", "twmDvWeeks");
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Days) {
            vListHtml = vListHtml.replace("[TITLE]", "D");
            //vListHtml = vListHtml.replace("[TITLE]", "");
            vListHtml = ReplaceAll(vListHtml, "[DIVID]", "twmDvDays");
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_BusDays) {
            vListHtml = vListHtml.replace("[TITLE]", "BD");
            //vListHtml = vListHtml.replace("[TITLE]", "");
            vListHtml = ReplaceAll(vListHtml, "[DIVID]", "twmDvBusinessDays");
        }

        $('.twmOptions').html(vListHtml);

    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_GenerateSelectionTable", err);
    }
}

function TWM_Func_Get_NextTermFormat(pDirection) {

    if (pDirection == "fwrd") {
        twmCycleCounter = (twmCycleCounter == (twmTERM_FORMAT_CYCLE.length - 1)) ? 0 : (twmCycleCounter + 1);
    }
    else if (pDirection == "back") {
        twmCycleCounter = (twmCycleCounter == 0) ? (twmTERM_FORMAT_CYCLE.length - 1) : (twmCycleCounter - 1);
    }
    else if (pDirection == "init") {
        twmCycleCounter = 0;  //Imp : Trial/Error and set final index
    }

    return twmTERM_FORMAT_CYCLE[twmCycleCounter];
}

function TWM_Func_GetNextOption(pDirection, pDivId) {
    try {

        var opratingArray, opratingIndex;
        var vElem;

        if (twmTERM_FORMAT == twmTermFormats.Beast_YearMonths) {
            if (pDivId == "twmDvYearMonth_Year") {
                twm_ARR_YM_YEAR_INDEX = TWM_Func_ArrayTraverse(twm_ARR_YM_YEAR, twm_ARR_YM_YEAR_INDEX, pDirection);
                vElem = twm_ARR_YM_YEAR[twm_ARR_YM_YEAR_INDEX];
            }
            else if (pDivId == "twmDvYearMonth_Month") {
                twm_ARR_YM_MONTH_INDEX = TWM_Func_ArrayTraverse(twm_ARR_YM_MONTH, twm_ARR_YM_MONTH_INDEX, pDirection);
                vElem = twm_ARR_YM_MONTH[twm_ARR_YM_MONTH_INDEX];
            }
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Months) {
            twm_ARR_MONTH_INDEX = TWM_Func_ArrayTraverse(twm_ARR_MONTH, twm_ARR_MONTH_INDEX, pDirection);
            vElem = twm_ARR_MONTH[twm_ARR_MONTH_INDEX];
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Weeks) {
            twm_ARR_WEEK_INDEX = TWM_Func_ArrayTraverse(twm_ARR_WEEK, twm_ARR_WEEK_INDEX, pDirection);
            vElem = twm_ARR_WEEK[twm_ARR_WEEK_INDEX];
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_Days) {
            twm_ARR_DAY_INDEX = TWM_Func_ArrayTraverse(twm_ARR_DAY, twm_ARR_DAY_INDEX, pDirection);
            vElem = twm_ARR_DAY[twm_ARR_DAY_INDEX];
        }
        else if (twmTERM_FORMAT == twmTermFormats.Beast_BusDays) {
            twm_ARR_BUSINESSDAY_INDEX = TWM_Func_ArrayTraverse(twm_ARR_BUSINESSDAY, twm_ARR_BUSINESSDAY_INDEX, pDirection);
            vElem = twm_ARR_BUSINESSDAY[twm_ARR_BUSINESSDAY_INDEX];
        }

        $('#' + pDivId).text(vElem);

        TWM_Func_OnTermValueChange(pDivId);

    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_GetNextOption", err);
    }
}

function TWM_Func_ArrayTraverse(pOpratingArray, pOpratingIndex, pDirection) {

    if (pDirection == "fwrd") {
        pOpratingIndex = (pOpratingIndex == (pOpratingArray.length - 1)) ? 0 : (pOpratingIndex + 1);
    }
    else if (pDirection == "back") {
        pOpratingIndex = (pOpratingIndex <= 0) ? (pOpratingArray.length - 1) : (pOpratingIndex - 1);
    }
    else if (pDirection == "init") {
        pOpratingIndex = 0;
    }

    return pOpratingIndex;

}

function TWM_Func_OnTermFormatChange(pDirection) {
    try {

        var newTermFormat = TWM_Func_Get_NextTermFormat(pDirection);

        switch (newTermFormat) {

            case 0: //Days
                TWM_Func_SetView_Days();
                break;

            case 1: //BusinessDays
                TWM_Func_SetView_BusinessDays();
                break;

            case 2: //Weeks
                TWM_Func_SetView_Weeks();
                break;

            case 3: //Year/Months
                TWM_Func_SetView_YearMonths();
                break;

            case 4:  //Years

                break;

            case 5: //Monthsonly
                TWM_Func_SetView_Months();
        }

        TWM_Func_SetSelectedCell();

    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_OnTermFormatChange", err);
    }
}

function TWM_Func_OnTermValueChange(pDivId) {
    try {

        if (twmTERM_FORMAT == twmTermFormats.Beast_YearMonths) {

            var vMonth, vYear;
            vYear = $('#twmDvYearMonth_Year').text();
            vMonth = $('#twmDvYearMonth_Month').text();

            var _termValue = parseInt(vYear, 10) * 12;
            _termValue = _termValue + parseInt(vMonth, 10);

            TWM_Func_SetKeyValues(_termValue, twmTERM_FORMAT, (vYear + "#" + vMonth));
        }
        else {

            var _termValue = parseInt($('#' + pDivId).text(), 10);

            TWM_Func_SetKeyValues(_termValue, twmTERM_FORMAT, _termValue.toString());
        }

        TWM_Func_SetDisplayValue();
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_OnTermValueChange", err);
    }
}

function TWM_Func_SetKeyValues(pTermValue, pTermFormat, pDisplayValue) {
    try {

        twmTERM_VALUE = pTermValue;
        twmTERM_FORMAT = pTermFormat;
        twmBEAST_VALUE = twmTERM_VALUE.toString() + twmTERM_FORMAT.toString();
        twmCURRENT_TERM_DISPLAY = pDisplayValue;
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SetKeyValues", err);
    }
}

function TWM_Func_ToggleNegative() {

    if (twmIS_NEGATIVE == true) {
        twmIS_NEGATIVE = false;
        $('.twmDvNegativeBtn').removeClass('ItemSelected');

        TWM_Func_SetDisplayValue();
    }
    else {
        twmIS_NEGATIVE = true;
        $('.twmDvNegativeBtn').addClass('ItemSelected');

        TWM_Func_SetDisplayValue();
    }
}

function TWM_Func_SaveTermWidget() {

    try {

        /* ============== */
        var eleAryInfo = twmTARGET_ELEMENT_INFO.split('^');

        var paraValues = eleAryInfo[1] + "^" + eleAryInfo[2] + "^" + eleAryInfo[3];

        if (twmIS_NEGATIVE == true) {
            twmBEAST_VALUE = "-" + twmBEAST_VALUE;
        }

        var idValPair = eleAryInfo[4] + "#" + twmBEAST_VALUE;

        /* ============== */
        var appParameter = new Object();
        appParameter.AppId = eleAryInfo[0];
        appParameter.AppName = "";
        appParameter.UserId = userInfo.UserId;
        appParameter.CustomerId = userInfo.CustomerId;
        appParameter.AppType = 1;
        appParameter.AuthToken = userInfo.Token;
        appParameter.ClientType = "Web";
        appParameter.ClientVersion = detectBrowser().toString();
        appParameter.EmailId = userInfo.EmailId;
        appParameter.ElementType = "DDList";
        appParameter.ElementId = eleAryInfo[4].substring(eleAryInfo[4].lastIndexOf('#') + 1);
        appParameter.ElementValue = twmBEAST_VALUE;
        appParameter.SignalRConnectionId = "";
        appParameter.AppInstanceId = userInfo.InstanceId;
        appParameter.SharedSignalRConnectionId = userInfo.SharedSignalrId;
        appParameter.AppKey = "";

        if (typeof signalrService != 'undefined' && signalrService != null) {
            signalrService.UpdateValueInApplication(appParameter);
        }
        else {
            isModalOpen = true;
            $('#reconnectModal').modal({ keyboard: false, backdrop: 'static' });
        }
       
        TWM_Func_CloseTermWidget();
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_SaveTermWidget", err);
    }
}

function TWM_Func_CloseTermWidget() {
    
    $('#' + twmWIDGET_DIV_ID + 'Parent').modal(false);
    TWM_Func_ClearGlobalVars();
}

function TWM_Func_Clear_TermWidget() {
    try {
        IsChange = '';

        PWM_GLOBAL_BEAST_VALUE_1 = $('#pwmDvTxtValue1').text();
        PWM_GLOBAL_BEAST_VALUE_2 = PWM_GLOBAL_TXTVAL_2;

        var eleAryInfo = twmTARGET_ELEMENT_INFO.split('^');
        //var instanceType = eleAryInfo[0];
        //var paraValues = eleAryInfo[1] + "^" + eleAryInfo[2] + "^" + eleAryInfo[3];
        //var idValPair = eleAryInfo[4] + "#clr";

        //SendToBeast(instanceType + "#" + paraValues, idValPair);
        var appParameter = new Object();
        appParameter.AppId = eleAryInfo[0];
        appParameter.AppName = "";
        appParameter.UserId = userInfo.UserId;
        appParameter.CustomerId = userInfo.CustomerId;
        appParameter.AppType = 1;
        appParameter.AuthToken = userInfo.Token;
        appParameter.ClientType = "Web";
        appParameter.ClientVersion = detectBrowser().toString();
        appParameter.EmailId = userInfo.EmailId;
        appParameter.ElementType = "DDList";
        appParameter.ElementId = eleAryInfo[4].substring(eleAryInfo[4].lastIndexOf('#') + 1);
        appParameter.ElementValue = "clr";;
        appParameter.SignalRConnectionId = "";
        appParameter.AppInstanceId = "";
        appParameter.SharedSignalRConnectionId = "";
        appParameter.AppKey = "";

        if (typeof signalrService != 'undefined' && signalrService != null) {
            signalrService.UpdateValueInApplication(appParameter);
        }
        else {
            isModalOpen = true;
            $('#reconnectModal').modal({ keyboard: false, backdrop: 'static' });
        }
        

        TWM_Func_CloseTermWidget();
    }
    catch (err) {
        PWM_Func_HandleJsError("TWM_Func_Clear_TermWidget", err);
    }
}

function TWM_Func_ScrollContent(pDirection) {
    try {
        var vScrollStep = 40;
        var vScroll = $('.twmDvViewFrame').scrollTop();

        if (pDirection == 'up') {
            $('.twmDvViewFrame').animate({ 'scrollTop': vScroll - vScrollStep }, 500);
        }
        else if (pDirection == 'down') {
            $('.twmDvViewFrame').animate({ 'scrollTop': vScroll + vScrollStep }, 500);
        }
    }
    catch (err) {
        TWM_Func_HandleJsError("TWM_Func_ScrollContent", err);
    }
}

function TWM_Func_ClearGlobalVars() {
    twmWidgetHtml = "";
    twmIS_HTML_LOADED = false;
    twmIS_NEGATIVE = false;
    twmBEAST_VALUE = twmTERM_FORMAT = twmTERM_VALUE = twmCycleCounter = 0;
    twmCURRENT_TERM_DISPLAY = twmTARGET_ELEMENT_INFO = twmWIDGET_DIV_ID = "";
    twmIS_HTML_LOADED = true;
    twmIS_NEGATIVE = false;
    twm_ARR_YM_YEAR_INDEX = twm_ARR_YM_MONTH_INDEX = twm_ARR_MONTH_INDEX = twm_ARR_WEEK_INDEX = twm_ARR_DAY_INDEX = twm_ARR_BUSINESSDAY_INDEX = twmGLOBAL_MONTHS = 0;
}

function TWM_Func_HandleJsError(pFuncName, pErrorObj) {
    var strerrordesc = "Function:" + pFuncName + "(); Error is : " + pErrorObj.description + "; Error number is " + pErrorObj.number + "; Message :" + pErrorObj.message;
    alert(strerrordesc);
}

function term_widget_Template_tablerow() {

    return "<tr id=\"[TR]\">" +
                    "<td id=\"[TD1]\" style=\"width:20%;text-align:center;\">" +
                    "</td>" +
                    "<td id=\"[TD2]\" style=\"width:20%;text-align:center;\">" +
                    "</td>" +
                    "<td id=\"[TD3]\" style=\"width:20%;text-align:center;\">" +
                    "</td>" +
                    "<td id=\"[TD4]\" style=\"width:20%;text-align:center;\">" +
                    "</td>" +
                    "</tr>";
}

function term_widget_Template_button() {
    return "<input id=\"btn[BUTTON]\" class=\"btn \" type=\"button\" value=\"\" style=\"width:95%;\" />";
}
