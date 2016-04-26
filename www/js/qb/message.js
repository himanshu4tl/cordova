var chat={
    onMessage:function(userId, msg){
        console.log(msg.body);
        alert(msg.body);
    }
};