/*==== Multiple Emails ======*/
var ListEmailPhone = null;
var emailEntries = "";
var sharePlaceHolder = '<div class="modal" id="dvEmailListPopup" border="1" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" style="width: 450px"'
        + 'role="dialog">'
        + '</div>'
        + '<input type="hidden" id="hdnShareCalcInfo" runat="server" />';
var shareHtmlBox = '<div class="modal-content"><div class="modal-header" id="dvShareCalcHeader" style="cursor: move;">'
            + '<button type="button" class="close" data-dismiss="modal">&times;</button>'
            + '<strong>Enter email addresses to share this App with</strong>'
        + '</div>'
        + '<div class="modal-body">'
            + '<div id="dvMultiEmails">'
                + '<ul>'
                    + '<input type="text" style="text-align:left" id="txtEmailId" class="email-input-box" autofocus="" placeholder="Email Address"/>'
                    + '<input type="text" style="text-align:right" id="txtPhoneNo" class="phone-input-box" autofocus="" placeholder="(+Country Code)Phone No"/>'
                + '</ul>'
            + '</div>'
        + '</div>'
        + '<div class="modal-footer"><label>eg. person@example.com, +919384756283</label>'
            + '<a class="btn" data-dismiss="modal" aria-hidden="true">Cancel</a> <a class="btn btn-primary" onclick="ShareCalculator();">Share</a>'
        + '</div>';

var counterListTag = 0;
var newEmailBox = '<span class="email"><div class="[ITEMCLASS]">[EMAIL]</div><div class="email-delete">x</div></span>';
var editEmailBox = '<input type="text" value="[RAWEMAIL]" id="[TXTBXID]" class="email-edit-box" [STYLE] /> ';

var newPhoneBox = '<span class="phone"><div class="[ITEMCLASSPHONE]">[PHONE]</div><div class="phone-delete">x</div></span>';
var editPhoneBox = '<input type="text" value="[RAWPHONE]" id="[TXTBXID]" class="phone-edit-box" [STYLE] /> ';

function ShowEmailBox(userId, customerId, instanceType, shareInstanceMode) {
    try {
        CheckPlaceHolder();
        $("#hdnShareCalcInfo").val(userId + "^" + customerId + "^" + instanceType + "^" + shareInstanceMode);
        $('#dvEmailListPopup').html(shareHtmlBox);
        //LoadPreviousEntry();

        $('#dvEmailListPopup').modal('show');
        $("#txtEmailId").focus();

        //Bind event after control load-for FireFox
        $('#txtEmailId').bind('keypress', function (event) {
            CheckKey(event, this.id);
        });
        $('#txtPhoneNo').bind('keypress', function (event) {
            CheckPhoneKey(event, this.id);
        });
        ;
        $('#dvEmailListPopup').draggable({ handle: "#dvShareCalcHeader" });
    }
    catch (err) {
        var strerrordesc = "Function:ShowEmailBox(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        console.error("AppList.aspx: " + strerrordesc);
    }
}

function CheckPlaceHolder() {
    $('#container').append(sharePlaceHolder);
}

function LoadPreviousEntry() {
    try {
        if (emailEntries.length && emailEntries.indexOf('#') > 0) {
            if (emailEntries[emailEntries.length - 1] == '#') {
                emailEntries = emailEntries.substring(0, emailEntries.length - 1);
            }

            var arrEmails = emailEntries.split('#');
            for (var i = 0; i < arrEmails.length; i++) {
                ShareAddListTag(arrEmails[i], true);
            }
        }
    }
    catch (err) {
        var strerrordesc = "Function:LoadPreviousEntry(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        console.error("AppList.aspx: " + strerrordesc);
    }
}

function ShareCalculator() {
    try {
        var concatedEmailId = GetAllEmail();
        var concatedPhoneNo = GetAllPhoneNo();
        if (concatedEmailId == "" && concatedPhoneNo == "") {
            alert("Invalid Input.");
        }
        else {
            var hdnShareInfo = $("#hdnShareCalcInfo").val().split('^');
            var userId = null;
            var customerId = null;
            var shareAppId = null;
            var shareInstanceMode = null;
            if (typeof hdnShareInfo != 'undefined' && hdnShareInfo != null) {
                userId = hdnShareInfo[0];
                customerId = hdnShareInfo[1];
                shareAppId = hdnShareInfo[2];
                shareInstanceMode = hdnShareInfo[3];
            }
            var shareInstanceId = $("#" + shareAppId + "_instanceId").text();
            var varShareMessage = "";
            var allEmail = concatedEmailId.split("#");
            allEmail.pop();
            var phone = concatedPhoneNo.split("#");
            ListEmailPhone = allEmail.concat(phone);
            $('#dvEmailListPopup').modal('hide');
            if (typeof applicationManager != 'undefined' && applicationManager != null) {
                applicationManager.SendShareImageRequest(shareAppId, concatedEmailId, concatedPhoneNo, userInfo.Token, connectionId, shareInstanceId);
            }
        }
    }
    catch (err) {
        var strerrordesc = "Function:ShareCalculator(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        console.error("AppList.aspx: " + strerrordesc);
    }
}

function ShareAddListTag(text, isValid) {
    var classAttached = (isValid === true) ? 'email-item' : 'email-item-invalid';
    $('#txtEmailId').val('');
    counterListTag++;
    $("#dvMultiEmails ul").append('<li id="li' + counterListTag + '">' + newEmailBox.replace('[EMAIL]', text).replace('[ITEMCLASS]', classAttached) + '</li>');

}

function ShareAddPhoneListTag(text, isValid) {
    var classAttached = (isValid === true) ? 'phone-item' : 'phone-item-invalid';
    $('#txtPhoneNo').val('');
    counterListTag++;
    $("#dvMultiEmails ul").append('<li id="li' + counterListTag + '">' + newPhoneBox.replace('[PHONE]', text).replace('[ITEMCLASSPHONE]', classAttached) + '</li>');
    //counterListTag++;
}


function EditListTag(currentListTag) {
    try {
        var rawEmailId = $(currentListTag).text();
        var parentListId = $(currentListTag).closest('li')[0].id;
        var textBoxId = parentListId.toString().replace('li', 'txt');
        var fieldWidth = 'style="width:' + parseInt($(currentListTag).parent()[0].scrollWidth - 10, 10) + 'px;"';
        var textBoxHtml = editEmailBox.replace('[RAWEMAIL]', rawEmailId).replace('[TXTBXID]', textBoxId).replace('[STYLE]', fieldWidth);

        $(currentListTag).closest('li').html(textBoxHtml);
        $('#' + textBoxId).focus();
    }
    catch (err) {
        var strerrordesc = "Function:EditListTag(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        console.error("AppList.aspx: " + strerrordesc);
    }
}

function EditPhoneListTag(currentListTag) {
    try {
        var rawPhoneId = $(currentListTag).text();
        var parentListId = $(currentListTag).closest('li')[0].id;
        var textBoxId = parentListId.toString().replace('li', 'txt');
        var fieldWidth = 'style="width:' + parseInt($(currentListTag).parent()[0].scrollWidth - 10, 10) + 'px;"';
        var textBoxHtml = editPhoneBox.replace('[RAWPHONE]', rawPhoneId).replace('[TXTBXID]', textBoxId).replace('[STYLE]', fieldWidth);

        $(currentListTag).closest('li').html(textBoxHtml);
        $('#' + textBoxId).focus();
    }
    catch (err) {
        var strerrordesc = "Function:EditPhoneListTag(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        console.error("AppList.aspx: " + strerrordesc);
    }
}


function RestoreListTag(currentListTag, isValid) {

    var listTag = $('#' + currentListTag);

    var listTagText = $.trim($(listTag)[0].value);
    var classAttached = (isValid === true) ? 'email-item' : 'email-item-invalid';
    var listHtmlText = newEmailBox.replace('[EMAIL]', listTagText).replace('[ITEMCLASS]', classAttached);
    $(listTag).closest('li')[0].innerHTML = listHtmlText;
}

function RestorePhoneListTag(currentListTag, isValid) {

    var listTag = $('#' + currentListTag);

    var listTagText = $.trim($(listTag)[0].value);
    var classAttached = (isValid === true) ? 'phone-item' : 'phone-item-invalid';
    var listHtmlText = newPhoneBox.replace('[PHONE]', listTagText).replace('[ITEMCLASSPHONE]', classAttached);
    $(listTag).closest('li')[0].innerHTML = listHtmlText;


}

$(document).on('click', '.email-item', function () {
    EditListTag(this);
});

$(document).on('click', '.email-item-invalid', function () {
    EditListTag(this);
});

$(document).on('click', '.email-delete', function () {
    $(this).closest('li').remove();
});

$(document).on('blur', '.email-edit-box', function () {
    var isValid = ValidateEmailId(this.value);
    RestoreListTag(this.id, isValid);
});

$(document).on('keypress', '.email-edit-box', function (event) {
    CheckKey(event, this.id);
});


$(document).on('click', '.phone-item', function () {
    EditPhoneListTag(this);
});

$(document).on('click', '.phone-item-invalid', function () {
    EditPhoneListTag(this);
});

$(document).on('click', '.phone-delete', function () {
    $(this).closest('li').remove();
});

$(document).on('blur', '.phone-edit-box', function () {
    var isValid = ValidatePhoneId(this.value);
    RestorePhoneListTag(this.id, isValid);
});

$(document).on('keypress', '.phone-edit-box', function (event) {
    CheckPhoneKey(event, this.id);
});

function GetAllEmail() {

    try {
        var validEmailId = "";
        var tempEmailId = "";

        emailEntries = ""; // Clear previous values

        $('#dvMultiEmails div.email-item').each(function () {
            tempEmailId = $.trim($(this).text());
            if (validEmailId.indexOf(tempEmailId) == -1) {
                validEmailId += tempEmailId + '#';
                emailEntries += tempEmailId + '#';
            }
        });

        var email = $.trim($('#txtEmailId').val());
        if (ValidateEmailId(email)) {
            if (validEmailId.indexOf(email) == -1) {
                validEmailId = validEmailId + email + '#';
                emailEntries = validEmailId;
            }
        }

        return validEmailId;
    }
    catch (err) {
        var strerrordesc = "Function:GetAllEmail(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        console.error("AppList.aspx: " + strerrordesc);
    }
}

function GetAllPhoneNo() {

    try {
        var validPhone = "";
        var tempPhone = "";

        phoneEntries = ""; // Clear previous values

        $('#dvMultiEmails div.phone-item').each(function () {
            tempPhone = $.trim($(this).text());
            if (validPhone.indexOf(tempPhone) == -1) {
                validPhone += tempPhone + '#';
                phoneEntries += tempPhone + '#';
            }
        });

        var phone = $.trim($('#txtPhoneNo').val());
        if (ValidatePhoneId(phone)) {
            if (validPhone.indexOf(phone) == -1) {
                validPhone = validPhone + phone + '#';
                phoneEntries = validPhone;
            }
        }

        return validPhone;
    }
    catch (err) {
        var strerrordesc = "Function:GetAllEmail(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        console.error("AppList.aspx: " + strerrordesc);
    }
}

function CheckKey(event, tagId) {

    try {
        var key;
        if (window.event)       //Required to check for FireFox
            key = event.keyCode;
        else
            key = event.which;

        key = key.toString();
        if (key == "13") {
            event.preventDefault();
        }

        if (key == "32" || key == "188" || key == "186" || key == "13") {

            var text = $.trim($('#' + tagId).val());

            if (text.toString().length > 5) {

                var isValid = ValidateEmailId(text);

                if (tagId.toString().indexOf('txtEmailId') > -1) {
                    ShareAddListTag(text, isValid);
                }
                else {
                    RestoreListTag(tagId, isValid);
                }
            }

            event.returnValue = false;
        }
    }
    catch (err) {
        var strerrordesc = "Function:CheckKey(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        alert(strerrordesc);
        console.error("AppList.aspx: " + strerrordesc);
        event.returnValue = false;
    }
}

function CheckPhoneKey(event, tagId) {

    try {
        var key;
        if (window.event)       //Required to check for FireFox
            key = event.keyCode;
        else
            key = event.which;

        key = key.toString();
       
        if (key == "32" || key == "188" || key == "186" || key == "13") {

            var text = $.trim($('#' + tagId).val());

            var isValid = ValidatePhoneId(text);

            if (tagId.toString().indexOf('txtPhoneNo') > -1) {
                ShareAddPhoneListTag(text, isValid);
            }
            else {
                RestorePhoneListTag(tagId, isValid);
            }

            event.returnValue = false;
        }
    }
    catch (err) {
        var strerrordesc = "Function:CheckKey(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
        alert(strerrordesc);
        console.error("AppList.aspx: " + strerrordesc);
        event.returnValue = false;
    }
}

function CreateSharePopup(tokenArray) {
    try {
        var htmlText = "";
        for (var i = 0; i < tokenArray.length - 1; i++) {
            if (typeof tokenArray[i] != 'undefined' && tokenArray[i] != null)
                htmlText += "<div style='margin-bottom:5px;' class='myModalLabelrow-centered'><div><a target='_blank'  href=\"" + config.defaultLandingPageForSharedApps + "?token=" + tokenArray[i] + "\">" + ListEmailPhone[i] + "</a> " + "</div></div>";
        }
        $("#shareddata").html(htmlText);
        $('#SharedApp').modal('show');
    }
    catch (err) {
        var strerrordesc = "Function:CreateAutoURlPopup();  Message :" + err.message;
        console.error("AppList.aspx: " + strerrordesc);
    }
}