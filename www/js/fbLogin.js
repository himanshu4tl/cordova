function myFacebookLogin() {
    if(app.isApp){
        openFB.login(function(response) {
                if (response.status === 'connected') {
                    //alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
                    getFbInfo();
                } else {
                    alert('Facebook login failed: ' + response.error);
                }
            }, {
                scope: 'public_profile,email'
        });
    }else{
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                console.log('already login');
                getFbInfoWeb();
            } else {
                FB.login(function(response){
                    console.log(response);
                    if ( response.status=="connected"){
                        getFbInfoWeb();
                    } else {
                    alert("Login failed.");
                    }
                }, {scope: 'public_profile,email'});
            }
        });
    }
}

function getFbInfo() {
    openFB.api({
        path: '/me',
        params: {
            fields: "email,first_name,last_name"
        },
        success: function(response) {
            alert(JSON.stringify(response));
        },
        error: fbErrorHandler
    });
}
function getFbInfoWeb() {
    FB.api('/me?fields=email,name', function(response) {
        console.log(response);
        alert(JSON.stringify(response));
    });
}