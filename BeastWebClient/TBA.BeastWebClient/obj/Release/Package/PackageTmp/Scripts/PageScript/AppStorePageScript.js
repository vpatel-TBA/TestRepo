//Variable Declarations
var isSafari = false;
var applicationManager = null;
var renderMode = "0";
var openCalcs = [];
var isHubConnected = false;
var TBASignalRHub = null;

//Document Ready Method
$(document).ready(function () {
    if (typeof userInfo != 'undefined' && userInfo != null && userInfo.Token) {
        $('#btnAppShared').click(function () {
            $('#SharedApp').modal('hide');
            return false;
        });

        if (userInfo.FirstName && userInfo.LastName)
            $("#userName").text("Hi, " + userInfo.FirstName + " " + userInfo.LastName);
        else if (userInfo.FirstName)
            $("#userName").text("Hi, " + userInfo.FirstName);
        else if (userInfo.LastName)
            $("#userName").text("Hi, " + userInfo.LastName);
        else if (userInfo.EmailId)
            $("#userName").text("Hi, " + userInfo.EmailId);
        else
            $("#userName").text("Hi, User");

        $('#dvPriceWidgetMobile').draggable({ handle: "#dvPwmTitle" });
        $('#dvTermWidgetMobile').draggable({ handle: "#dvTwmTitle" });
        $('#dvEmailListPopup').draggable({ handle: "#dvShareCalcHeader" });
        $('#SharedApp').draggable({ handle: "#sharedapphdr" });
        $('#imageDataInfo').draggable({ handle: "#imageDataapphdr" });
        $('#auditDataInfo').draggable({ handle: "#auditDataapphdr" });


        applicationManager = new ApplicationManager();

        F2.init({
            beforeAppRender: function (app) {
                return BeforeApplicationRender(app);
            },
            afterAppRender: function (app, html) {
                return AfterApplicationRender(app, html);
            },
            UI: {
                Mask: {
                    loadingIcon: 'images/ajax-loader.gif'
                }
            },
        });

        //CloseImageCall
        $('.mainContainer').on('click', '.close-box', function () {
            openCalcs.remove($(this).attr("imageId"));
            applicationManager.CloseApplication($(this).attr("imageId"));
            return false;
        });

        $('.calcMenuLinkHldr').on('click', '.openApplication', function () {
            if ($(this).hasClass('disabled')) return;
            if (renderMode == "1") {
                //Creating new url to open in new tab by replacing current calc query string variable.
                var imageId = $(this).attr("imageId");
                var newUrl = null;
                if (typeof imageId != 'undefined' && imageId != null) {
                    if (getUrlVars()["calc"]) {
                        newUrl = location.href.replace("calc=" + getUrlVars()["calc"], "calc=" + imageId);
                    } else {
                        newUrl = location.href + "?calc=" + imageId;
                    }
                }
                if (typeof newUrl != 'undefined' && newUrl != null) {
                    OpenInNewTab(newUrl);
                }
            }
            else {
                $("#application_" + imageId).addClass("disabled");

                applicationManager.SetUserLastOpenApplication($(this).attr("imageId"), userInfo.Token)
                if (renderMode == "0")
                    applicationManager.CloseApplication(openCalcs.pop());
                applicationManager.CreateApplication($(this).attr("imageId"), $(this).attr("imageName"), $(this).attr("imageType"), $(this).attr("imageMode"));
            }

            return false;
        });

        $('#userDropdownMenu, #userInfo').mouseover(function () {
            $("#userInfo").css("display", "block");
        });

        $('#userDropdownMenu, #userInfo').mouseout(function () {
            $("#userInfo").css("display", "none");
        });

        $('.renderMode').click(function () {
            $('.renderMode').removeClass("active");
            $(this).addClass("active");
            renderMode = $(this).attr("mode");
            return false;
        });

        $('.mainContainer').on('click', '.imageDataInfo', function () {
            $("#imageDataInfoText").html($(this).attr('title'));
            $("#imageDataInfo").modal("show");
            return false;
        });

        $('.mainContainer').on('click', '.auditInfo', function () {
            $("#auditDataInfoText").html($(this).attr('title').replace(/\n/gi, "<br><hr>"));
            $("#auditDataInfo").modal("show");
            return false;
        });

        //OpenImageCall
        if (typeof userInfo.Token != 'undefined' && userInfo.Token != null) {
            applicationManager.GetApplicationCategories(userInfo.Token);
        }

        var urlCalc = getUrlVars()["calc"];

        if (urlCalc) {
            if (typeof applicationManager != 'undefined' && applicationManager != null) {
                applicationManager.GetApplicationDetailAndCreateIt(urlCalc, userInfo.Token);
            }
        }
        else {
            if (typeof applicationManager != 'undefined' && applicationManager != null) {
                applicationManager.GetUserLastOpenApplication(userInfo.Token);
            }
        }

        //Logout call
        $('.logout').click(function () {
            if (typeof signalrService != 'undefined' && signalrService != null) {
                signalrService.LogoutUser();
            }
            localStorage.setItem('ClientInfo', null);
            window.location = config.clientUrl;
        });
    } else {
        window.location = config.clientUrl;
    }
});
///////////////////////////////////////////////////////

function OpenInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function BeforeApplicationRender(app) {
    var appRoot = '<div id="mainProductSection" class="cf"><div class="wprow" id="' + getCurrentRowName() + '"></div></div>';
    if ($("#mainProductSection").length == 0) {
        $(appRoot).appendTo('div.appDiv');
    }

    return appRoot;
}
function AfterApplicationRender(app, html) {
    var spanInt;
    var closeBtnHtml = '<div class="shareButtonPosition">' +
                            '<i class="fa fa-list-alt auditInfo" title="Audit data not available." id=' + app.appId + "_AuditInfo" + '></i><i class="fa fa-info-circle imageDataInfo disConnect" title="Information not available." id=' + app.appId + "_ImageStatus" + '></i><a class="imgShareButton" disabled="disabled" onclick="ShowEmailBox(\'' + userInfo.UserId + '\', \'' + userInfo.CustomerId + '\', \'' + app.context.appId + '\', \'con\')">' +
                                '<i class="fa fa-share-alt-square"></i>' +
                            '</a>' +
                            '<a class="close-box" imageId=' + app.appId + '>' +
                                '<i class="fa fa-close"></i>' +
                            '</a>' +
    '<div class="calcStatusFont" style="float:right"></div></div>';

    var ele;
    var tmpCrntRowIndx = getCurrentRowIndex();
    var tmpRowIndx = 1;
    var isCalcPlaced = false;
    for (tmpRowIndx; tmpRowIndx <= tmpCrntRowIndx; tmpRowIndx++) {
        var rowNameCrnt = getRelativeRowName(tmpRowIndx);
        var totSpan = 0;
        var isRowExists = false;
        if ($("#mainProductSection div#" + rowNameCrnt + "").length > 0) {
            isRowExists = true;
            $("#mainProductSection div#" + rowNameCrnt + " > div").each(function () {
                var divclasses = $(this).attr("class").split(' ');

                for (var icc = 0; icc < divclasses.length; icc++) {
                    var spancls = divclasses[icc];
                    if (spancls.indexOf("span") === 0) {
                        totSpan = parseInt(totSpan) + parseInt(spancls.substring(4));
                    }
                }
            });
        }
        var sumOfSpan = parseInt(totSpan) + parseInt(spanInt);
        if (sumOfSpan <= 12 && isRowExists == true) {
            ele = $("#mainProductSection div#" + rowNameCrnt + "");
            isCalcPlaced = true;
            break;
        }
    }
    if (isCalcPlaced == false) {
        IncrCurrentRowIndex();
        $("#mainProductSection").append("<div style='margin-left:0px;' class='wprow' id='" + getCurrentRowName() + "'></div>");
        ele = $("#mainProductSection #" + getCurrentRowName() + "");
    }

    //$(ele).append(html).find("#" + app.appId + " > thead > tr:first-child > td:last-child").append(closeBtnHtml);
    $(ele).append(html);
    //$(ele).find("#" + app.appId + " .ServerName").append(statusimg);
    $(ele).find("#" + app.appId + " .ServerName").append(closeBtnHtml);

    if (isSafari) {
        $("#" + app.appId).find(".imgCalculatorStatus").hide();
        $("#" + app.appId).find(".calcStatusFont").append("<strong id='textConnectStatusImage' style='color:Red;font-size:12px;'>D</strong>");
    }
    return ele;
}

