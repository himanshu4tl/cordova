var chat={
    isActive:false,
    currentDialogId:'',
    dialogList:[],
    dialogsMessages:[],
    opponentId:'',
    opponentData:{},
    messageTemplate:$('#chatMsgSingleTemplate').html(),
    onMessage:function(userId, msg){
        console.log('Message received--------------------------------');
        console.log(msg);
        if(chat.isActive) {
            if(chat.opponentId==userId){
                msg.sender_id=userId;
                chat.showMessage(msg);
            }else{
                alert(msg.body);
            }
        }else{
            alert(msg.body);
        }
    },
    chatScrollBottom:function(){
        chat.messageTarget.scrollTop(chat.messageTarget.prop("scrollHeight"));
    },
    translateMessage:function(message){
        var msg={};
        if(message.sender_id==chat.userData.id){
            msg.u_logo=app.udata.u_logo;
            msg.class='msg-right';
        }else{
            msg.u_logo=chat.opponentData.u_logo;
            msg.class='msg-left';
        }
        if(message.message){
            msg.body=message.message;
        }else if(message.body){
            msg.body=message.body;
        }
        return msg;
    },
    showMessageList:function(data){
        var html='';
        $.each(data,function(index,val){
            html+=app.translateHtml(chat.messageTemplate,chat.translateMessage(val));
        });
        chat.messageTarget.append(html);
        chat.chatScrollBottom();
    },
    showMessage:function(msg){
        chat.messageTarget.append(app.translateHtml(chat.messageTemplate,chat.translateMessage(msg)));
        chat.chatScrollBottom();
    },
    clickSendMessage:function(){
        var msg=chat.messageInput.val();
        chat.messageInput.val('').focus();
        console.log(msg);
        if(msg!=''){
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
        QB.chat.send(helper.getUserJID(chat.opponentId), msg);
        msg.sender_id=chat.userData.id;
        console.log('Send --------------------------------');
        console.log(msg);
        chat.showMessage(msg);
        //dialogsMessages.push(msg);
    },

    retrieveChatHistory:function (dialog, beforeDateSent){
        // Load messages history
        var params = {chat_dialog_id: dialog,
            sort_desc: 'date_sent',
            limit: 10};
        // if we would like to load the previous history
        if(beforeDateSent !== null){
            params.date_sent = {lt: beforeDateSent};
        }else{
            chat.currentDialogId= dialog;
            chat.dialogsMessages = [];
        }

        QB.chat.message.list(params, function(err, messages) {
            if (messages) {
                console.log(messages);
                    messages.items.forEach(function(item, i, arr) {
                        item.body=item.message;
                        chat.dialogsMessages.splice(0, 0, item);
                    });
                chat.showMessageList(chat.dialogsMessages);
            }else{
                console.log(err);
            }
        });
    }
};