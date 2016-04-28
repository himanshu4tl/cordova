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
    if(app.token!=''){
        if(app.isApp){
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

                        if(QB.chat._isDisconnected){
                            chat.connectToChat();
                        }
                        //chat.notify('BG start');
                    }
                };

                cordova.plugins.backgroundMode.ondeactivate = function() {
                    //chat.notify('On deactivate');
                };

                cordova.plugins.backgroundMode.onfailure = function(errorCode) {
                    //chat.notify('On deactivate');
                };
            }else
            if(!cordova.plugins.backgroundMode.isActive())
            {
                console.log('connect start ------------------------------------------>');
                if(QB.chat._isDisconnected){
                    chat.connectToChat();
                //chat.notify('default start');
                }
            }
        }else{
            chat.connectToChat();
        }
    }
};