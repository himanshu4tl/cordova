chat.connectToChat=function(user) {

    // Create session and connect to chat
    //
    QB.createSession({login: user.login, password: user.pass}, function(err, res) {
        if (res) {
            // save session token
            token = res.token;

            user.id = res.user_id;

            QB.chat.connect({userId: user.id, password: user.pass}, function(err, roster) {
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
    /*QB.chat.onSystemMessageListener   = onSystemMessageListener;
    QB.chat.onDeliveredStatusListener = onDeliveredStatusListener;
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

    if(cordova.plugins.backgroundMode.isActive())
    {
        chat.notify(msg.body);
    }else{
        chat.onMessage(userId, msg);
    }
    console.log(msg);
}

var QBUser1 = {
        id: 12049752,
        name: 'Quick',
        login: 'quick',
        pass: '11111111'
    },
    QBUser2 = {
        id: 12049785,
        name: 'Blox',
        login: 'blox',
        pass: '11111111'
    };
