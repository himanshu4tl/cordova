var chat={
    isActive:false,
    currentDialogId:'',
    dialogList:[],
    opponentId:'',
    opponentData:{},
    onMessage:function(userId, msg){
        console.log(msg.body);
        if(chat.isActive) {
            chat.messageTarget.append(app.translateHtml(chat.messageTemplate, msg));
        }else{
            alert(msg.body);
        }
    },
    showMessage:function(u_chat_id,msg){
        if(u_chat_id==app.udata.u_logo){
            msg.u_logo=app.udata.u_logo;
            msg.type='left'
        }else{
            msg.u_logo=chat.opponentData.u_logo
            msg.type='right'
        }
        chat.messageTarget.append(app.translateHtml(chat.messageTemplate,msg));
    },
    clickSendMessage:function(){
        var msg=chat.messageInput.val();
        chat.messageInput.val('').focus();
        console.log(msg);
        if(msg!=null){
            chat.sendMessage(msg);
        }
    },

    // send text or attachment
    sendMessage:function (text) {
        var msg = {
            type: 'chat',
            body: text,
            extension: {
                save_to_history: 1,
            },
            senderId: chat.userData.id,
            markable: 1
        };
        QB.chat.send(chat.opponentId+'-39782@chat.quickblox.com', msg);
        chat.showMessage(chat.userData.id, msg);
        //dialogsMessages.push(msg);
    }

};