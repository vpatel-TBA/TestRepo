var connectionId = null;
function SignalrService() {
    var updateProcessorService = null;
    var isModalOpen = false;
    this.InitSignalRConnection = function (appParameters) {
        try {
            if (TBASignalRHub == null) {
                updateProcessorService = new UpdateProcessorService();
                TBASignalRHub = $.connection.TBASignalRHub;
                $.connection.hub.qs = { 'token': userInfo.Token };
                $.connection.hub.url = config.signalrPath;

                /* Define servermethods before hub start */
                //Called from application alive of server
                TBASignalRHub.client.ApplicationStatusUpdates = function (responseParameters) {
                    updateProcessorService.ProcessApplicationStatusUpdates(responseParameters);
                };

                //Called while getting list update from server changeset
                TBASignalRHub.client.ListUpdates = function (responseParameters) {
                    updateProcessorService.ProcessListUpdates(responseParameters);
                };

                //Called while getting Properties update from server changeset
                TBASignalRHub.client.PropertiesUpdates = function (responseParameters) {
                    updateProcessorService.ProcessPropertiesUpdates(responseParameters);
                };

                //Called while getting ToolTip update from server changeset
                TBASignalRHub.client.ToolTipUpdates = function (responseParameters) {
                    updateProcessorService.ProcessTooltipUpdates(responseParameters);
                };
                //Called while getting CommanUpdate from server changeset
                TBASignalRHub.client.CommanUpdates = function (responseParameters) {
                    updateProcessorService.ProcessCommanUpdates(responseParameters);
                };

                //Called while InvalidToken found on server 
                TBASignalRHub.client.InvalidTokenUpdate = function (responseParameters) {
                    updateProcessorService.ProcessInvalidToken(responseParameters);
                };

                //Called while getting exception from server changeset
                TBASignalRHub.client.SendExceptionDetail = function (responseParameters) {
                    updateProcessorService.ProcessExceptionDetail(responseParameters);
                };

                //Called from application alive to store instance id
                TBASignalRHub.client.SendInstanceId = function (responseParameters) {
                    updateProcessorService.StoreInstanceId(responseParameters);
                };

                //Called from application alive to store instance id
                TBASignalRHub.client.SetImageTitle = function (responseParameters) {
                    updateProcessorService.SetImageTitle(responseParameters);
                };

                //Called from application to provide info related application data
                TBASignalRHub.client.SetImageDataAvailabilityInfo = function (responseParameters) {
                    updateProcessorService.SetImageDataAvailabilityInfo(responseParameters);
                };

                //Called from application to provide info related to audit trail.
                TBASignalRHub.client.SetAuditTrailInfo = function (responseParameters) {
                    updateProcessorService.SetAuditTrailInfo(responseParameters);
                };

                //Called from application to provide Swaptio.
                TBASignalRHub.client.GetSwaptionDataUpdates = function (responseParameters) {
                    updateProcessorService.ProcessSwaptionData(responseParameters);
                };

                //Called from application to provide Swaptio.
                TBASignalRHub.client.GetSwaptionTitleDataUpdates = function (responseParameters) {
                    updateProcessorService.ProcessSwaptionTitleDataUpdates(responseParameters);
                };

                /* Define client methods before hub start */
                //$.connection.hub.logging = true;
                $.connection.hub.start({ jsonp: true, transport: ['webSockets', 'longPolling'] })
                .done(function () {
                    console.log("Connection Done.");
                    isHubConnected = true;
                    connectionId = $.connection.hub.id;
                })
                .fail(function () {
                    console.log("Connection Fail.");
                    setTimeout(function () {
                        signalrService.InitSignalRConnection(appParameters);
                    }, 1500);
                });

                //handle connection state
                $.connection.hub.stateChanged(function (change) {
                    // connecting: 0, connected: 1, reconnecting: 2, disconnected: 4
                    switch (change.newState) {
                        case 0: // connecting
                            isHubConnected = false;
                            $("#ServerConnectionStatus").removeClass("connect").removeClass("disConnect").addClass("connecting");
                            break;
                        case 1: // connected
                            if (isModalOpen == true) {
                                isModalOpen = false;
                                $('#reconnectModal').modal('hide');
                            }
                            isHubConnected = true;
                            $("#ServerConnectionStatus").removeClass("disConnect").removeClass("connecting").addClass("connect");
                            break;
                        case 2: // reconnecting
                            if (isModalOpen == false) {
                                isModalOpen = true;
                                $('#reconnectModal').modal({ keyboard: false, backdrop: 'static' });
                            }
                            isHubConnected = false;
                            $("#ServerConnectionStatus").removeClass("connect").removeClass("disConnect").addClass("connecting");
                            break;
                        case 4: // disconnected
                            isHubConnected = false;
                            updateProcessorService = null;
                            $("#ServerConnectionStatus").removeClass("connect").removeClass("connecting").addClass("disConnect");
                            break;
                    }
                });

                /* Define server methods after hub start */
                $.connection.hub.error(function (error) {
                    console.log(error);
                });

                if (!isHubConnected) {
                    setTimeout(function () {
                        signalrService.InitSignalRConnection(appParameters);
                    }, 1500);
                }
            } else {
                signalrService.createApplication(appParameters);
            }
        }
        catch (err) {
            console.error(err);
            if (!isHubConnected) {
                setTimeout(function () {
                    signalrService.InitSignalRConnection(appParameters);
                }, 1500);
            }
        }
    }

    this.createApplication = function (appParameters) {
        if (isHubConnected)
            TBASignalRHub.server.createApplication(appParameters);
        //else
        //Todo : do somethings
    }

    this.UpdateValueInApplication = function (appParameters) {
        if (isHubConnected)
            TBASignalRHub.server.updateValueInApplication(appParameters);
        //else
        //Todo : do somethings
    }

    this.CloseApplication = function (appParameters) {
        if (isHubConnected)
            TBASignalRHub.server.closeApplication(appParameters);
        //else
        //Todo : do somethings
    }

    this.LogoutUser = function () {
        if (isHubConnected)
            TBASignalRHub.server.logoutUser();
        //else
        //Todo : do somethings
    }
}
