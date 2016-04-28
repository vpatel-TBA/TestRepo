function ApplicationManager() {

    this.GetApplicationCategories = function (token) {
        $.ajax({
            method: 'GET',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Basic ' + token);
            },
            url: config.webApiServerUrl + "/api/ApplicationCategory/",
            success: function (categoryList) {
                if (typeof categoryList != 'undefined' && categoryList != null && categoryList != "") {
                    var length = categoryList.length;
                    var sideMenu = $("#side-menu");
                    var categoryHtml = "";
                    for (var i = 0; i < length; i++) {
                        categoryHtml = categoryHtml +
                            "<div class='panel panel-default'>" +
                            "<div class='panel-heading'>" +
                            "<h4 class='panel-title'>" +
                            "<a class='accordion-toggle' data-toggle='collapse' data-parent='#side-menu' href=#category_" + categoryList[i].Id + "><i class='fa fa-angle-double-right'></i>" + categoryList[i].Name + "</a>" +
                            "</h4>" +
                            "</div>" +
                            "<div id=category_" + categoryList[i].Id + " class='panel-collapse collapse'></div></div>";
                    }
                    sideMenu.html(categoryHtml);
                    categoryHtml = null;
                    length = null;
                    GetAllApplications(token);
                }
            },
            error: function (request, status, error) {
                if (typeof ($("#exceptionModal").data('bs.modal') || {}).isShown == "undefined")
                    ShowExceptionPopUp(JSON.parse(request.responseText).Message);
            }
        });
    }

    function GetAllApplications(token) {
        $.ajax({
            method: 'GET',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Basic ' + token);
            },
            url: config.webApiServerUrl + "/api/Application/",
            success: function (applicationList) {
                if (typeof applicationList != 'undefined' && applicationList != null && applicationList != "") {
                    var length = applicationList.length;
                    for (var i = 0; i < length; i++) {
                        var category = $("#category_" + applicationList[i].CategoryId);
                        var applicationHtml = "<div class='panel-body subMenuHldr'><ul>";
                        applicationHtml = applicationHtml + "<li><a class='openApplication' imageType='" + applicationList[i].Type + "' imageMode='" + applicationList[i].Mode + "' imageId='" + applicationList[i].Id + "' Id='application_" + applicationList[i].Id + "' imageName='" + applicationList[i].Name + "' categoryId=" + applicationList[i].CategoryId + ">" + applicationList[i].Name + "</a></li>";
                        applicationHtml = applicationHtml + "</ul></div>";
                        category.append(applicationHtml);
                    }
                    applicationHtml = null;
                    length = null;
                    //As its async call it will finishing even after loading last open image so again adding disable class for last open.
                    $("#application_" + openCalcs[openCalcs.length - 1]).addClass("disabled");
                }
            },
            error: function (request, status, error) {
                if (typeof ($("#exceptionModal").data('bs.modal') || {}).isShown == "undefined")
                    ShowExceptionPopUp(JSON.parse(request.responseText).Message);
            }
        });
    }

    this.GetUserLastOpenApplication = function (token) {
        //Todo : Set default image here incase last open image not found.
        var image = {
            Id: 152,
            Name: 'BYC',
            Type: 0,
            Mode: 0
        };
        $.ajax({
            method: 'GET',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Basic ' + token);
            },
            data: { token: token },
            url: config.webApiServerUrl + "/api/Application/user/",
            success: function (responseImage) {
                if (typeof responseImage != 'undefined' && responseImage != null && responseImage != "") {
                    applicationManager.CreateApplication(responseImage.Id, responseImage.Name, responseImage.Type, responseImage.Mode);
                } else {
                    applicationManager.CreateApplication(image.Id, image.Name, image.Type, image.Mode);
                }
            },
            error: function (request, status, error) {
                applicationManager.CreateApplication(image.Id, image.Name, image.Type, image.Mode);
            }
        });
    }

    this.SetUserLastOpenApplication = function (imageId, token) {
        //var imageInfo = userInfo.UserId + "#" + userInfo.CustomerId + "#0";
        $.ajax({
            method: 'POST',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Basic ' + token);
            },
            data: '=' + imageId,
            url: config.webApiServerUrl + "/api/Application/user/",
            success: function () {
                console.log("Submited " + imageId + " as Last open Calc...");
            },
            error: function (request, status, error) {
                if (typeof ($("#exceptionModal").data('bs.modal') || {}).isShown == "undefined")
                    ShowExceptionPopUp(JSON.parse(request.responseText).Message);
            }
        });
    }

    this.GetApplicationDetailAndCreateIt = function (sifId, token) {
        $.ajax({
            method: 'GET',
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Basic ' + token);
            },
            data: { sifId: sifId },
            url: config.webApiServerUrl + "/api/Application/",
            success: function (imageDetail) {
                applicationManager.CreateApplication(sifId, imageDetail.Name, imageDetail.Type, imageDetail.Mode);
            },
            error: function (request, status, error) {

            }
        });
    }

    this.CreateApplication = function (imageId, imageName, imageType, imageMode) {
        var ApplicationConfiguration = [{
            appId: imageId,
            description: imageName,
            name: imageName,
            manifestUrl: config.clientUrl + '/Products/VCM/' + imageId + '/manifest.js',
            context: {
                //Todo : add any thing that used in appclass.js like old appstore mechanism.
                appId: imageId,
                appType: imageType,
                appMode: imageMode,
                appName: imageName
            }
        }];
        openCalcs.push(imageId);
        //It will not add disable on first call as category is still not loaded.
        $("#application_" + imageId).addClass("disabled");
        F2.registerApps(ApplicationConfiguration);
    }

    this.CloseApplication = function (imageId) {
        $("#application_" + imageId).removeClass("disabled");
        removeAppFromContainer(imageId);
        removeAppDiv(imageId);

        //Close app parameter class
        var applicationDetails = {
            AppSifId: imageId,
            AppMode: $("#application_" + imageId).attr("imagemode"),
            SignalRConnectionId: "",
            UserId: userInfo.UserId,
            EmailId: userInfo.EmailId,
            CustomerId: 0,
            SpecialAppId: 1,
            ClientType: "Web",
            AuthToken: userInfo.Token,
            SharedSignalRConnectionId: userInfo.SharedSignalrId,
        };

        if (typeof signalrService != 'undefined' && signalrService != null) {
            signalrService.CloseApplication(applicationDetails);
        }
        else {
            isModalOpen = true;
            $('#reconnectModal').modal({ keyboard: false, backdrop: 'static' });
        }

    }

    function removeAppDiv(imageId) {
        try {
            if (typeof imageId != 'undefined' && imageId != null) {
                $("div#mainProductSection div." + imageId).remove();

                var tmpIndx = 1;

                for (tmpIndx; tmpIndx <= getCurrentRowIndex() ; tmpIndx++) {

                    if ($("#mainProductSection div#" + getRelativeRowName(tmpIndx) + " > div").length > 0) {

                    }
                    else {
                        $("#mainProductSection div#" + getRelativeRowName(tmpIndx) + "").remove();
                    }
                }
            }
        }
        catch (err) {
            var strerrordesc = "Function:removeAppDiv(); Error is : " + err.description + "; Error number is " + err.number + "; Message :" + err.message;
            onJavascriptLog("IcapCme.aspx", strerrordesc);
        }
    }

    function removeAppFromContainer(imageId) {
        F2.removeApp(imageId);
    }

    this.SendShareImageRequest = function (appId, emailIds, phoneNos, token, connectionId, instanceId) {
        var shareAppDetails = {
            appId: appId,
            recieverEmails: emailIds,
            recieverPhoneNos: phoneNos,
            sharedSignalRId: connectionId,
            instanceId: instanceId,
        };
        $.ajax({
            type: "POST",
            cache: false,
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', 'Basic ' + token);
            },
            data: shareAppDetails,
            url: config.webApiServerUrl + "/api/ShareApplication/",
            success: function (tokenArray) {
                if (typeof tokenArray != 'undefined' && tokenArray != null) {
                    CreateSharePopup(tokenArray);
                }
                else {
                    alert("There is error in sending mail related to share application.");
                }
            },
            error: function (request, status, error) {
                if (typeof ($("#exceptionModal").data('bs.modal') || {}).isShown == "undefined")
                    ShowExceptionPopUp(JSON.parse(request.responseText).Message);
            }
        });
    }
}

