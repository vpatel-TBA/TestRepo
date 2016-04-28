//Variable Declarations
var isSafari = false;
var applicationManager = null;
var renderMode = 0;
var isHubConnected = false;
var TBASignalRHub = null;
var userInfo = null;
var openCalcs = [];

//Document Ready Method
$(document).ready(function () {

    var usertoken = getUrlVars()["token"];

    $.ajax({
        method: 'GET',
        url: config.webApiServerUrl + '/api/ShareApplication',
        data: { token: usertoken },
        success: function (response) {

            userInfo = new Object();
            userInfo.MessageId = response.MessageId;

            if (response.IsValid) {
                userInfo.UserId = response.AutoURLUserId;
                userInfo.ClientId = 0;
                userInfo.CustomerId = 0;
                userInfo.EmailId = response.EmailId;
                userInfo.Token = usertoken;
                userInfo.SharedSignalrId = response.SharedSignalRId;
                userInfo.InitiatorEmailId = response.InitiatorEmailId;
                userInfo.calc = response.SifId;
                userInfo.InstanceId = response.InstanceId;

                $('#dvPriceWidgetMobile').draggable({ handle: "#dvPwmTitle" });
                $('#dvTermWidgetMobile').draggable({ handle: "#dvTwmTitle" });
                $('#dvEmailListPopup').draggable({ handle: "#dvShareCalcHeader" });
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
                    applicationManager.CloseApplication($(this).attr("imageId"));
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

                window.onbeforeunload = function (e) {
                    applicationManager.CloseApplication(userInfo.calc);
                }

                $('.imageDataInfo').click(function () {
                    $("#imageDataInfo").modal("show");
                    return false;
                });

                applicationManager.GetApplicationDetailAndCreateIt(userInfo.calc, userInfo.Token);
            }
            else {
                localStorage.setItem('errorMessage', shareErrorCode.properties[userInfo.MessageId].description);
                window.location = config.clientUrl + '/Views/Home/ErrorPage.html';
            }

        },
        error: function (request, status, error) {
            alert("Error");
        }
    });

});
///////////////////////////////////////////////////////

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
                            '<i class="fa fa-list-alt auditInfo" title="Audit data not available." id=' + app.appId + "_AuditInfo" + '></i><i class="fa fa-info-circle imageDataInfo disConnect" title="Information not available." id=' + app.appId + "_ImageStatus" + '></i>' +
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
