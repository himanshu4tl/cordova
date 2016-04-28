chat.connectToChat=function() {
    chat.userData={
        id: app.udata.u_chat_id,
        login: 'login'+app.udata.u_id,
        pass: '11111111'
    };
    console.log('connect to chat server ------------------------------------------->');
    console.log(chat.userData.id);
    // Create session and connect to chat
    //
    QB.createSession({login: chat.userData.login, password: chat.userData.pass}, function(err, res) {
        if (res) {
            // save session token
            token = res.token;

            chat.userData.id = res.user_id;

            QB.chat.connect({userId: chat.userData.id, password: chat.userData.pass}, function(err, roster) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(roster);

                    setupAllListeners();
                }
            });
        }
    });

};

function setupAllListeners() {
    QB.chat.onDisconnectedListener    = onDisconnectedListener;
    QB.chat.onReconnectListener       = onReconnectListener;
    QB.chat.onMessageListener         = onMessage;
    QB.chat.onSystemMessageListener   = onSystemMessageListener;
    /*QB.chat.onDeliveredStatusListener = onDeliveredStatusListener;
    QB.chat.onReadStatusListener      = onReadStatusListener;
    setupIsTypingHandler();*/
}

// reconnection listeners
function onDisconnectedListener(){
    console.log("onDisconnectedListener");
}

function onReconnectListener(){
    console.log("onReconnectListener");
}


// on message listener
//
function onMessage(userId, msg) {
console.log('message receiced------------->'+userId+' '+msg.body);
    if(app.isApp && cordova.plugins.backgroundMode.isActive())
    {
        chat.notify(msg.body);
    }else{
        chat.onMessage(userId, msg);
    }
    //chat.onMessage(userId, msg);

    console.log(msg);
}

function onSystemMessageListener(message) {
    if (!message.delay) {
        console.log('System Message--------------->'+message);
        switch (message.extension.notification_type) {
            case "1":
                // This is a notification about dialog creation
                //getAndShowNewDialog(message.extension.dialog_id);
                break;
            case "2":
                // This is a notification about dialog update
                //getAndUpdateDialog(message.extension.dialog_id);
                break;
            default:
                break;
        }
    }
}