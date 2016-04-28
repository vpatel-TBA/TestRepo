function AuthenticationService() {
    this.ValidateUser = function (userName, password) {
        var loginParameters = {
            userName: userName,
            password: password
        };

        $.ajax({
            type: 'GET',
            url: config.webApiServerUrl + '/api/User/signin/',
            data: loginParameters,
            success: function (response) {
                if (response.IsSuccess) {
                    localStorage.setItem('ClientInfo', JSON.stringify(response));
                    window.location = config.clientUrl + '/AppStore.html';
                } else {
                    $('#userMessage').text(loginErrorCode.properties[response.MessageId].description);
                }
            },
            error: function (request, status, error) {
                alert("Error");
                $('#userMessage').text(error);
            }
        });

    }
}