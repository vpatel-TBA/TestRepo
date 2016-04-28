function checkWindowResize() {
    try {
        //Reposition opened widget
        var _wgtElem = $.trim($('#hdnWgtElement').val());

        if (_wgtElem !== null && _wgtElem !== '') {
            positionWidget(_wgtElem);
        }

        //
        // .. any other operation on windowresize/scroll
        //
    }
    catch (err) {
        alert(err.Message);
    }
}

function positionWidget(pElementId) {
    try {
        var _vElement = $('#' + pElementId);
        var _vElemHeight = $(_vElement).outerHeight(true);

        var eleOffSet = $(_vElement).offset();
        eleOffSet.top += _vElemHeight;

        var _wgtId = "";

        if ($(_vElement).hasClass("priceWidget")) {
            _wgtId = "dvPriceWidgetMobile";
        }
        else if ($(_vElement).hasClass("termWidget")) {
            _wgtId = "dvTermWidgetMobile";
        }
        else if ($(_vElement).hasClass("basisWidget")) {
            _wgtId = "tblBasis";
        }

        var winHeight = $(window).height();
        var wgtHeight = $('#' + _wgtId).outerHeight(true);

        $('#' + _wgtId).offset(eleOffSet);

        $('#' + _wgtId).css({
            'margin-left': '0px !important'
        });
    }
    catch (err) {
        //alert(err.Message);
        $('#hdnWgtElement').val('');
    }
}

//$('#modalPriceWidget').on('hide', function () {
//    $('#hdnWgtElement').val('');
//})

$('#divTermWidget').on('hide', function () {
    $('#hdnWgtElement').val('');
})

$('#basisWidget').on('hide', function () {
    $('#hdnWgtElement').val('');
})

$.keyCode = {
    BACKSPACE: 8, TAB: 9, ENTER: 13, SHIFT: 16, CONTROL: 17, ALTER: 18, PAUSE_BREAK: 19, CAPS_LOCK: 20, ESCAPE: 27, SPACE: 32,
    PAGE_UP: 33, PAGE_DOWN: 34, END: 35, HOME: 36, LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, INSERT: 45, DELETE: 46,
    ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
    a: 58, b: 59, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78,
    o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90,
    LEFTWINDOW_KEY: 91, RIGHTWINDOW_KEY: 92, SELECT_KEY: 93,
    NUMPAD_ZERO: 96, NUMPAD_ONE: 97, NUMPAD_TWO: 98, NUMPAD_THREE: 99, NUMPAD_FOUR: 100, NUMPAD_FIVE: 101,
    NUMPAD_SIX: 102, NUMPAD_SEVEN: 103, NUMPAD_EIGHT: 104, NUMPAD_NINE: 105,
    NUMPAD_MULTIPLY: 106, NUMPAD_ADD: 107, NUMPAD_ENTER: 108, NUMPAD_SUBTRACT: 109, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111,
    F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123,
    NUM_LOCK: 144, SCROLL_LOCK: 145, SEMI_COLON: 186, EQUAL_SIGN: 187, COMMA: 188, DASH: 189, PERIOD: 190, FORWARD_SLASH: 191, GRAVE_ACCENT: 192,
    OPEN_BRACKET: 219, BACK_SLASH: 220, CLOSE_BRACKET: 221, SINGLE_QUOTE: 222
};

function GEN_Func_IsNumberKey(_key) {
    if ((_key >= $.keyCode.ZERO && _key <= $.keyCode.NINE) || (_key >= $.keyCode.NUMPAD_ZERO && _key <= $.keyCode.NUMPAD_NINE)) {
        return true;
    }
    else { return false; }
}

function GEN_Func_IsNumberOrHyphenKey(_key) {
    if (GEN_Func_IsNumberAndHyphenKey(_key) || $.keyCode.DASH || $.keyCode.NUMPAD_SUBTRACT) {
        return true;
    }
    else { return false; }
}

function GEN_Func_IsDefaultAllowedKeys(_key) {
    if (_key == $.keyCode.TAB || _key == $.keyCode.BACKSPACE || _key == $.keyCode.ALTER || _key == $.keyCode.LEFTWINDOW_KEY || _key == $.keyCode.RIGHTWINDOW_KEY || _key == $.keyCode.CONTROL || _key == $.keyCode.CAPS_LOCK || _key == $.keyCode.DELETE || _key == $.keyCode.RIGHT || _key == $.keyCode.LEFT) {
        return true;
    }
    else { return false; }
}

function ReplaceAll(Source, stringToFind, stringToReplace) {
    var temp = Source;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
}

function ValidateEmailId(pString) {
    var obj;

    pString = $.trim(pString);

    if (pString != "") {
        var strmail = pString;

        var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/i);

        //var pattern = new RegExp(/^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$);
        //var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

        if (!strmail.match(pattern)) {
            return false;
        }
        return true;
    }
    return false;
}

function ValidatePhoneId(phoneNumber) {
    var obj;

    phoneNumber = $.trim(phoneNumber);

    if (phoneNumber != "") {
        var number = phoneNumber;

        //var pattern = new RegExp(/^[+0-9()-/]{4,20}$/);
        //var pattern = new RegExp(/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
        //(^(\+?\-? *[0-9]+)([,0-9 ]*)([0-9 ])*$)|(^ *$)
        var pattern = new RegExp(/^\+(?:[0-9] ?){6,14}[0-9]$/);             // Compulsory + and country code
        
        if (!number.match(pattern)) {
            return false;
        }
        return true;
    }
    return false;
}

var curntSpanIndex = 1;

function getCurrentRowName() {
    return "rowNum" + curntSpanIndex;
}

function getRelativeRowName(spnIndx) {
    return "rowNum" + spnIndx;
}

function getCurrentRowIndex() {
    return curntSpanIndex;
}

function IncrCurrentRowIndex() {
    curntSpanIndex++;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function detectBrowser() {
    var N = navigator.appName;
    var UA = navigator.userAgent;
    var temp;
    var browserVersion = UA.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (browserVersion && (temp = UA.match(/version\/([\.\d]+)/i)) != null)
        browserVersion[2] = temp[1];
    browserVersion = browserVersion ? [browserVersion[1], browserVersion[2]] : [N, navigator.appVersion, '-?'];
    return browserVersion;
}

var shareErrorCode = {
    SuccessfullLogin: 0,
    UserNotRegisteredOrBlocked: -1,
    FailedAutoUrl: -2,
    FailedWithAutoUrl: -3,
    UnauthorizedIp: -5,
    NoSessionRights: -6,
    UrlExpired: -9,
    CalculatorClosed: -10,
    properties: {
        '0': { name: "SuccessfullLogin", value: 0, description: "Shared Beast Calc - Successful login" },
        '-1': { name: "UserNotRegisteredOrBlocked", value: -1, description: "Shared Beast Calc - Failed to login with the AutoURL as User is either not registered or blocked" },
        '-2': { name: "FailedAutoUrl", value: -2, description: "Shared Beast Calc - Failed to login for AutoURL" },
        '-3': { name: "FailedWithAutoUrl", value: -3, description: "Shared Beast Calc - Failed to login with the AutoURL" },
        '-5': { name: "UnauthorizedIp", value: -5, description: "Shared Beast Calc - Failed to login because of Unauthorized IP Address" },
        '-6': { name: "NoSessionRights", value: -6, description: "Shared Beast Calc - Failed to login because of no rights for the Session" },
        '-9': { name: "UrlExpired", value: -9, description: "Shared Beast Calc - Failed to login with the AutoURL as URL Expired" },
        '-10': { name: "CalculatorClosed", value: -10, description: "Shared Beast Calc - Failed to login with the AutoURL as the initiator has closed the calculator" },
    }
};

var loginErrorCode = {
    UserNotRegistered: -100,
    AccountDisabled: -200,
    InvalidPassword: -300,
    AccountLocked: -900,
    properties: {
        '-100': { name: "UserNotRegistered", value: 0, description: "User is not registered." },
        '-200': { name: "AccountDisabled", value: -1, description: "Account has been disabled." },
        '-300': { name: "InvalidPassword", value: -2, description: "Invalid Password." },
        '-900': { name: "AccountLocked", value: -3, description: "Your Account has been locked." },
    }
};

// Called when an exception is occured during Token Authentication
function ShowExceptionPopUp(exceptionMessage) {
    try {
        $('#exceptionMessage').html(exceptionMessage);
        $('#exceptionModal').modal({ keyboard: false, backdrop: 'static' });
    }
    catch (err) {
        console.log("popup error.");
    }
}

Array.prototype.remove = function (element, array) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] === element) {
            this.splice(i, 1);
            if (!array)
                break;
        }
    }
    return this;
};