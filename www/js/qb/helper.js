var helper={
    getNameByChatId:function(u_chat_id){
        var name='';
        $.each(chat.userList,function(index,val){
            if(val.u_chat_id==u_chat_id){name=val.u_name;}
        });
        return name;
    },
    getUserByChatId:function(u_chat_id){
        $.each(chat.userList,function(index,val){
            chat.opponentData=val;
        });
    },
    getDialogByChatId:function(u_chat_id){
        var dialogId='';
        $.each(chat.dialogList,function(index,val){
            if(val.occupants_ids[0]==u_chat_id){dialogId= val._id;}
            if(val.occupants_ids[1]==u_chat_id){dialogId= val._id;}
        });
        return dialogId;
    },
    getDialogJIDByChatId:function(u_chat_id){
        var dialogId='';
        $.each(chat.dialogList,function(index,val){
            if(val.name==u_chat_id){dialogId= val.xmpp_room_jid;}
        });
        return dialogId;
    },
    getUserJID:function(id){
        return id+'-'+QBApp.appId+'@chat.quickblox.com';
    }
};