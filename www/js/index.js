
String.prototype.replaceAll = function(search, replacement) {return this.replace(new RegExp(search, 'g'), replacement);};

var app={
    defaultPage:'profileTemplate',
    currentUrl:'',
    //baseUrl:'http://sateweb.com/gava/web/index.php/api/',
    baseUrl:'http://localhost/gava/web/api/',
    mainContainer:$('#contentView'),
    id:'',
    loader:$('#mLoader'),

    /*Core function start ###################################################################################################*/

    translateHtml:function(html,object){
        $.each(object,function(index,value){html=html.replaceAll('_'+index+'_',value);});return html;
    },
    creteHtml:function(templateID,data){
        return this.translateHtml($('#'+templateID).html(),data);
    },
    creteHtmlData:function(templateID,data){
        var html="";
        var htnlData=$('#'+templateID).html();
        $.each(data,function(index,value){html+=app.translateHtml(htnlData,value);});return html;
    },
    loadDefaultPage:function(){
        if(this.id){app.loadProfile($('#profileLink'));}else{app.loadPage('loginTemplate',$('#loginLink'));}
    },
    appInit:function(){
        $('#slide-out a').on('click',function(e){
            e.preventDefault();
            $('.button-collapse').sideNav('hide');
        });
        if(localStorage['id']){this.id=localStorage['id']}
        this.loadDefaultPage();
        if(this.id){this.setUserLogin();}
    },
    renderHtml:function(html){
        this.mainContainer.html(html);
        this.pageInit();
    },
    alert:function(msg){Materialize.toast(msg,5000);},
    callAjax:function(url,params,func){
        app.startLoader();
        $.ajax({
            url:this.baseUrl+url+'?token='+app.id+params,
            type:'get',
            success:func,
            error:function(e){console.log(e);app.stopLoader();}
        });
    },
    postAjax:function(obj,func,params){
        var $this=$(obj);
        $this.find('[type="submit"]').attr('disabled','true');
        setTimeout(function(){$this.find('[type="submit"]').removeAttr('disabled');},5000);
        app.startLoader();
        var formData = new FormData($this[0]);
        formData.append('token',app.id);
        var url=$this.prop('action');
        url=url.split('/');
        this.currentUrl=url[url.length-2]+'/'+url[url.length-1];
        console.log(this.currentUrl);
        $.ajax({
            url:this.baseUrl+this.currentUrl+'?token='+app.id+params,
            data:formData,
            type:'post',
            datatype:'json',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success:func,
            error:function(e){console.log(e);app.stopLoader();}
        })
    },
    pageInit:function(){
        this.mainContainer.find('a').on('click',function(e){e.preventDefault();});
        this.mainContainer.find('form').on('submit',function(e){e.preventDefault();});
    },
    setUserLogout:function(){
        $('.site-login').show();
        $('.auth').hide();
    },
    setUserLogin:function(){
        $(".auth").show();
        $(".site-login").hide();

    },
    startLoader:function(){
      app.loader.show();
    },
    stopLoader:function(){
        app.loader.hide();
    },
    loadPage:function(templateId,data){
        if(!data){data={}}
        console.log('--->'+templateId);
        this.renderHtml(this.creteHtml(templateId,data));
        app.stopLoader();
        this.pageInit();
        this.afterLoadPage(templateId);
    },
    setTitle:function(title){
        if(title){
            $('.dHeader').hide();
            $('.dHeader2').hide();
            $('.nHeader').show();
            $('.brand-logo').html(title);
        }else{
            $('.dHeader').show();
            $('.dHeader2').css('display','inline');
            $('.nHeader').hide();
            $('.brand-logo').html('<img src="img/logo.jpg" class="logo">');
        }
    },
    setSidebar:function(obj){
        $(obj).parent().addClass('active').siblings().removeClass('active');
    },

    afterLoadPage:function(templateId){
        if(templateId=="loginTemplate"){

        }
    },
    /*Core function end ###################################################################################################*/

    setProfileData:function(data){
        $('#userLogo').html(app.creteHtml('userProfileTemplate',data));
    },
    loadProfile2:function(){
        var response={"status":1,"data":{"s_id":"13","s_email":"hhh@gmail.com","s_name":"hhh","s_zip":"9999","s_contact":" 789879855","s_password":"$2y$13$BcLqRwSAsIy0gvjOafvKBO3j82yYepHiubk4R7GOeDOgZirKfdZqq","s_auth_key":"","s_password_reset_token":"","s_logo":"profile_pic_03.png","s_address":"fgdfhgfh","s_lat":"","s_long":"","s_created":"1458267296","s_modified":"1458678726","img":"img/profile_pic_03.png"}};
        app.stopLoader();
        if(response.message){app.alert(response.message);}
        if(response.status) {
            app.loadPage('profileTemplate', response.data);
            app.setSidebar($('#profileLink'));
            app.setProfileData(response.data);
            app.setUserLogin();
        }

    },
    loadSetting:function(){
        var slider = document.getElementById('test5');
        noUiSlider.create(slider, {
            start: [20, 30],
            connect: true,
            step: 1,
            range: {
                'min': 0,
                'max': 100
            },
            format: wNumb({
                decimals: 0
            })
        });
        slider.noUiSlider.on('change.one', function(values, handle, unencoded, tap, positions){
            console.log(values);
            $('#ageText').html(values[0]+' - '+values[1]);
        });
        $('.switchBox').on('click','button',function(){
                var $this=$(this);
                if($this.hasClass('offSwitch')){
                    $this.removeClass('offSwitch').addClass('onSwitch')
                        .siblings().removeClass('onSwitch').addClass('offSwitch');
                }
        });
        $('#distanceInput').on('change',function(){
           $('#distanceText').html(this.value);
            console.log(this.value);
        });
        $('#couponInput').on('change',function(){
            $('#couponText').html(this.value);
            console.log(this.value);
        });
    },
    loadlogin:function(){
        var response={"status":1,"data":{"s_id":"13","s_email":"hhh@gmail.com","s_name":"hhh","s_zip":"9999","s_contact":" 789879855","s_password":"$2y$13$BcLqRwSAsIy0gvjOafvKBO3j82yYepHiubk4R7GOeDOgZirKfdZqq","s_auth_key":"","s_password_reset_token":"","s_logo":"profile_pic_03.png","s_address":"fgdfhgfh","s_lat":"","s_long":"","s_created":"1458267296","s_modified":"1458678726","img":"img/profile_pic_03.png"}};
        app.stopLoader();
        if(response.message){app.alert(response.message);}
        if(response.status) {
            app.setProfileData(response.data);
            app.setUserLogin();
        }

    },
    userInit:function(){
        $(".owl-carousel").owlCarousel({
            items:1,
            loop:false,
            nav:false,
        });
       this.setTitle('PROFILE<div class="closeBtnTitle"><img class="inlineblock likeBtnTitle" src="img/close.png"><img class="inlineblock likeBtnTitle" src="img/like.png"><div>')
    },
    homeInit:function(){
        /*$(".owl-carousel").owlCarousel({
            items:1,
            loop:false,
            nav:false,
        });*/
        /**
         * jTinder initialization
         */
        $("#tinderslide").jTinder({
            // dislike callback
            onDislike: function (item) {
                // set the status text
                $('#status').html('Dislike image ' + (item.index()+1));
                $('.actions .dislike').removeClass('btn_up');
                $('.actions .like').removeClass('btn_up');

            },
            // like callback
            onLike: function (item) {
                // set the status text
                $('#status').html('Like image ' + (item.index()+1));
                $('.actions .dislike').removeClass('btn_up');
                $('.actions .like').removeClass('btn_up');

            },
            animationRevertSpeed: 200,
            animationSpeed: 400,
            threshold: 1,
            likeSelector: '.like',
            dislikeSelector: '.dislike'
        });

        /**
         * Set button action to trigger jTinder like & dislike.
         */
        $('.actions .like, .actions .dislike').click(function(e){
            e.preventDefault();
            $("#tinderslide").jTinder($(this).attr('class'));
        });
    },
    restaurentInit:function(){
        $(".owl-carousel").owlCarousel({
            items:1,
            loop:true,
            nav:false,
        });
        this.setTitle('RESTAURANT');
        $('.goBack').attr('onclick',"app.restaurentLink();app.reserBack();");
    },
    reserBack:function(){
        $('.goBack').attr('onclick',"app.homeLink();");
    },
    restaurentListInit:function(){
        $('.restaurentImg').on('click',function(){app.loadPage('restaurentTemplate');app.setSidebar($('#restaurentLink'));app.restaurentInit();});

        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
                alignment: 'left' // Displays dropdown with edge aligned to the left of button
            }
        );

    },
    /*loadProfile:function(obj){
        var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status) {
                app.loadPage('profileTemplate', $('profileLink'), response.data);
                $(obj).parent().addClass('active').siblings().removeClass('active');
                app.setProfileData(response.data);
                $('#rateit6').rateit({ max: 5, step: 0.5, backingfld: '#backing6' });
            }

        };
        app.callAjax('site/profile','',func);
    },*/
    loginForm:function(obj){
        var func=function(response){

            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status){
                if(response.token){localStorage['id']=app.id=response.token;app.setUserLogin();}
                app.loadProfile($('#profileLink'));
            }

        };
        this.postAjax(obj,func,'');
    },
    signupForm:function(obj){
        /*var func=function(response){

            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status){
                app.loadPage('loginTemplate',$('#loginLink'));
            }
        };
        this.postAjax(obj,func,'');*/
        app.loadPage('loginTemplate',$('#loginLink'));
        app.alert('Signup successfully.');
    },
    profileForm:function(obj){
        /*var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status){app.loadProfile($('#profileLink'));}
        };
        this.postAjax(obj,func,'');*/
        app.loadProfile2();app.setSidebar($('profileLink'));app.setUserLogin();
        app.alert('Profile updated successsfully');
    },

    sideMenuStop:function(){
        $('.drag-target').remove();
        $('#slide-out').remove();
        $('#sidenav-overlay').remove();
    },
    sideMenuStart:function(){

        if(!$('#slide-out').length){
            $('#navBar').append($('#sidemenu').html());
            $(".button-collapse").sideNav();

            $('#slide-out a').on('click',function(e){
                e.preventDefault();
                $('.button-collapse').sideNav('hide');
            });

        }
    },
    /*new Route core functions start ########################################################################################*/
    loginLink:function(){
        app.loadPage('loginTemplate');app.setSidebar($('#loginLink'));
    },
    logoutBtn:function(){
        app.setTitle();app.setUserLogout();app.loadPage('loginTemplate');app.setSidebar($('#loginLink'));
        app.sideMenuStop();
    },
    loginBtn:function(){
        // Initialize collapse button
        app.sideMenuStart();
        app.homeLink();app.loadlogin();
    },
    homeLink:function(){
        app.loadPage('homeTemplate');app.setSidebar($('#homeLink'));app.homeInit();app.setTitle();
    },
    restaurentLink:function(){
        app.loadPage('restaurentListTemplate');app.setSidebar($('#restaurentLink'));app.restaurentListInit();app.setTitle('RESTAURANTS');
    },
    couponLink:function(){
        app.loadPage('couponTemplate');app.setSidebar($('#couponLink'));app.setTitle('COUPONS');
    },
    chatLink:function(){
        app.loadPage('chatListTemplate');app.setSidebar($('#chatLink'));app.setTitle('CHAT');
    },
    settingLink:function(){
        app.loadPage('settingTemplate');app.setSidebar($('#settingLink'));app.loadSetting();app.setTitle('<i class=\'fa fa-cog\'></i>');
    },
    userLink:function(){
        app.loadPage('userTemplate');app.userInit();
    },
    profileLink:function(){
        app.loadProfile2();
    },
    messageLink:function(){
        app.loadPage('chatMsgTemplate');
        $('.goBack').attr('onclick',"app.chatLink();app.reserBack();");
    },
    notificationLink:function(){
        app.loadPage('notificationTemplate');app.setSidebar($('#notificationLink'));
        $('.goBack').attr('onclick',"app.settingLink();app.reserBack();");
    },
    signupLink:function(){
        app.loadPage('signupTemplate');app.setSidebar($('#loginLink'));
        app.setTitle('Signup');
        $('.goBack').attr('onclick',"app.loginLink();app.reserBack();app.setTitle();");
    },
    /*new Route core functions end  ##########################################################################################*/

};
app.appInit();

document.addEventListener("backbutton", onBackKeyDown, false);
var i=1;
function onBackKeyDown(e) {
    // Handle the back button
    if(!$('.goBack').is(':visible')){
        navigator.app.exitApp();
    }else{
        $('.goBack').click();
    }


}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    app.device=device;
}