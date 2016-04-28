chat.retrieveChatDialogs=function () {
    QB.chat.dialog.list(null, function(err, resDialogs) {
        if (err) {
            console.log(err);
        } else {
            console.log(resDialogs);
            $.each(resDialogs.items,function(index,item){
                chat.dialogList.push(item);
                var dialogId = item._id;
                // join room
                if (item.type != 3) {
                    QB.chat.muc.join(item.xmpp_room_jid, function() {
                        console.log("Joined dialog "+dialogId);
                    });
                }
                if(item.name!=chat.userData.id){
                    $('#'+item.name).attr('lang',dialogId);
                }
            });

        }
    });
};

chat.createDialog=function(u_chat_id){
    var params = {
        type: 3,
        occupants_ids: [parseInt(chat.opponentId),chat.userData.id],
        name: u_chat_id
    };
    // create a dialog
    console.log("Creating a dialog with params: " + JSON.stringify(params));
    QB.chat.dialog.create(params, function(err, createdDialog) {
        if (err) {
            console.log(err);
        } else {
            console.log("Dialog " + createdDialog._id + " created with ");
            // save dialog to local storage
            chat.dialogList.push(createdDialog);
            currentDialogId = createdDialog._id;
            chat.retrieveChatHistory(chat.currentDialogId,null);
            //chat.notifyOccupants(chat.opponentId, createdDialog._id, 1);
            //triggerDialog(createdDialog._id);
        }
    });

};

chat.notifyOccupants=function(dialogOccupants, dialogId, notificationType) {
    var msg = {
        type: 'chat',
        extension: {
            notification_type: notificationType,
            dialog_id: dialogId
        }
    };
    QB.chat.sendSystemMessage(dialogOccupants, msg);
};
