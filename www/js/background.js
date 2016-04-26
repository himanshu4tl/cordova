chat.notify=function(Msg) {
    cordova.plugins.notification.local.schedule({
        id: 1,
        text: Msg,
        icon: 'res://cordova'
    });
};


document.addEventListener('deviceready', function () {
    // Android customization
    cordova.plugins.backgroundMode.setDefaults({ text:'Feel Online'});
    // Enable background mode
    cordova.plugins.backgroundMode.enable();

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
        cordova.plugins.backgroundMode.configure({
            text:'Feel Online'
        });
        chat.connectToChat(QBUser1);
        //chat.notify('BG start');
    };

    cordova.plugins.backgroundMode.ondeactivate = function() {
        //chat.notify('On deactivate');
    };

    cordova.plugins.backgroundMode.onfailure = function(errorCode) {
        //chat.notify('On deactivate');
    };

    if(!cordova.plugins.backgroundMode.isActive())
    {
        chat.connectToChat(QBUser1);
        //chat.notify('default start');
    }
}, false);