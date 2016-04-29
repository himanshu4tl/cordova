chat.notify=function(Msg) {
    cordova.plugins.notification.local.schedule({
        id: 1,
        text: Msg,
        /*icon: 'res://cordova'*/
    });
};


document.addEventListener('deviceready', function () {
    chat.getConnect();
}, false);

chat.getConnect=function(){
    console.log('getConnect ------------------------------------------>');
    console.log(app.token);
    console.log(app.isApp);
    if(app.token!=''){
        if(app.isApp){
            console.log('app is about to connect-------------------------------->');
            if(!cordova.plugins.backgroundMode.isEnabled()){
                // Android customization
                cordova.plugins.backgroundMode.setDefaults({ text:'Feel Online'});
                // Enable background mode
                cordova.plugins.backgroundMode.enable();
                // Called when background mode has been activated
                cordova.plugins.backgroundMode.onactivate = function () {
                    if(app.token!=''){
                        cordova.plugins.backgroundMode.configure({
                            text:'Feel Online'
                        });
                        console.log('connect in background------------------------------------------>');
                        chat.connectToChat();
                        //chat.notify('BG start');
                    }
                };

                cordova.plugins.backgroundMode.ondeactivate = function() {
                    //chat.notify('On deactivate');
                };

                cordova.plugins.backgroundMode.onfailure = function(errorCode) {
                    //chat.notify('On deactivate');
                };
            }
            if(!cordova.plugins.backgroundMode.isActive())
            {
                console.log('connect start ------------------------------------------>');
                console.log(QB.chat._isDisconnected);
                chat.connectToChat();
                //chat.notify('default start');
            }
        }else{
            console.log('web connect -------------------------------->');
            chat.connectToChat();
        }
    }
};