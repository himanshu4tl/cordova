
String.prototype.replaceAll = function(search, replacement) {return this.replace(new RegExp(search, 'g'), replacement);};
$(".button-collapse").sideNav(
    {
        menuWidth: 290, // Default is 240
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
);
$('#slide-out a').on('click',function(e){
    e.preventDefault();
    $('.button-collapse').sideNav('hide');
});

var app={
    // Config start -------------------------------->    

    baseUrl:'http://sateweb.com/dating/users/index.php/api/',
    //baseUrl:'http://localhost/dating/users/api/',
    mainContainer:$('#contentView'),
    token:'',
    udata:{},
    notificationSound:'1',
    notificationVibrate:'0',
    loader:$('#mLoader'),

    // Config End-------------------------------->
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
        app.setProfileData(app.udata);
        app.setUserLogin();
        app.homeLink();
    },
    appInit:function(){
        if(localStorage['token']){
            this.token=localStorage['token'];
            this.udata= $.parseJSON(localStorage['udata']);
            this.loadDefaultPage();
        }else{
            app.loginLink();
        }
        app.notificationSound=localStorage['notificationSound']=(localStorage['notificationSound'])?localStorage['notificationSound']:'1';
        app.notificationVibrate=localStorage['notificationVibrate']=(localStorage['notificationVibrate'])?localStorage['notificationVibrate']:'0';
    },
    renderHtml:function(html){
        this.mainContainer.html(html);
        this.pageInit();
    },
    alert:function(msg){Materialize.toast(msg,5000);},
    callAjax:function(url,func){
        $.ajax({
            url:this.baseUrl+url,
            type:'get',
            datatype:'json',
            success:func,
            error:function(e){console.log(e);app.stopLoader();app.alert('Nerwork error.');}
        });
    },
    postAjax:function(url,obj,func){
        var $this=$(obj);
        $this.find('[type="submit"]').attr('disabled','true');
        setTimeout(function(){$this.find('[type="submit"]').removeAttr('disabled');},5000);
        app.startLoader();
        var formData = new FormData($this[0]);
        $.ajax({
            url:this.baseUrl+url,
            data:formData,
            type:'post',
            datatype:'json',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success:func,
            error:function(e){console.log(e);app.alert('Network error.');app.stopLoader();}
        })
    },
    postAjaxData:function(url,data,func){
        app.startLoader();
        $.ajax({
            url:this.baseUrl+url,
            data:data,
            type:'post',
            datatype:'json',
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
        console.log('start Loader......');
        app.loader.show();
    },
    stopLoader:function(){
        setTimeout(function(){
            console.log('stop l......');
            app.loader.hide();
        },500);
    },
    loadPage:function(templateId,data){
        if(!data){data={}}
        console.log('--->'+templateId);
        this.renderHtml(this.creteHtml(templateId,data));
        app.stopLoader();
        this.pageInit();
        this.mainContainer.css('opacity','0').animate({'opacity':'1'},1000);
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
            if(app.token){
                $('.dHeader2').css('display','inline');
            }
            $('.nHeader').hide();
            $('.brand-logo').html('<img src="img/logo.jpg" class="logo">');
        }
    },
    setSidebar:function(obj){
        $(obj).parent().addClass('active').siblings().removeClass('active');
    },

    afterLoadPage:function(templateId){
        if(templateId=="loginTemplate" || templateId=="signupTemplate"){
            app.sideMenuStop();
        }else{
            app.sideMenuStart();
        }
    },
    readURL:function(input,fun) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = fun;
            reader.readAsDataURL(input.files[0]);
        }
    },
    /*Core function end ###################################################################################################*/

    //side menu user profile data function
    setProfileData:function(data){
        $('#userLogo').html(app.creteHtml('userProfileTemplate',data));
    },
    //setting page function
    loadSetting:function(){
        var u_interest_age=[20,30];
        if(app.udata.u_interest_age){
            u_interest_age=app.udata.u_interest_age.split(',');
            $('#ageText').html(u_interest_age[0]+' - '+u_interest_age[1]);
        }
        var slider = document.getElementById('test5');
        noUiSlider.create(slider, {
            start: u_interest_age,
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
            app.updateUser({u_interest_age:values.join(',')});
        });
        $('.switchBox').on('click','button',function(){
                var $this=$(this);
                if($this.hasClass('offSwitch')){
                    $this.removeClass('offSwitch').addClass('onSwitch')
                        .siblings().removeClass('onSwitch').addClass('offSwitch');
                }
        });
        if(app.udata.u_interest_in=='1'){
            var $this=$($('.switchBox button')[0]);
            if($this.hasClass('offSwitch')){
                $this.removeClass('offSwitch').addClass('onSwitch')
                    .siblings().removeClass('onSwitch').addClass('offSwitch');
            }
        }else{console.log(121);
            var $this=$($('.switchBox button')[1]);
            if($this.hasClass('offSwitch')){
                $this.removeClass('offSwitch').addClass('onSwitch')
                    .siblings().removeClass('onSwitch').addClass('offSwitch');
            }
        }
        $('#distanceInput').on('change',function(){
           $('#distanceText').html(this.value);
            app.updateUser({u_interest_distance:this.value});
        });
        $('#couponInput').on('change',function(){
            $('#couponText').html(this.value);
            app.updateUser({u_coupon_like:this.value});
        });
    },
    //user profile page function
    userInit:function(){
        var func=function(response){
            if(response.message){app.alert(response.message);}
            app.loadPage('userTemplate',response.data);
            $(".owl-carousel")
                    .html(app.creteHtmlData('userDetailImageTemplate',response.data.images))
                    .owlCarousel({
                        items:1,
                        loop:false,
                        nav:false,
                        lazyLoad:true
                    });
            app.setTitle('PROFILE<div class="closeBtnTitle"><img onclick="app.startLoader();app.likeUser(\''+response.data.u_id+'\',\'0\',function(){app.homeLink();});" class="inlineblock likeBtnTitle" src="img/close.png"><img onclick="app.startLoader();app.likeUser(\''+response.data.u_id+'\',\'1\',function(){app.homeLink();});" class="inlineblock likeBtnTitle" src="img/like.png"><div>')
        };
        app.startLoader();
        //app.callAjax('site/getusersdetail?u_id=2&token='+app.token,func);
        app.callAjax('site/getusersdetail?u_id='+tinder.id+'&token='+app.token,func);
    },
    //Home page function
    homeInit:function(){
     var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
                if(response.status && response.data.length){
                    $('.actions').show();
                    $('#userList').html(app.creteHtmlData('homeUserListTemplate',response.data));
                    var userIds=[];
                    $.each(response.data,function(index,val){
                        userIds.push(val.u_id);
                    });
                    /**
                    * jTinder initialization
                    */
                   $("#tinderslide").jTinder({
                       // dislike callback
                       onDislike: function (item) {
                           $('.actions .dislike img').attr('src','img/closeoff.png');
                           $('.actions .like img').attr('src','img/like.png');
                           var currentId=item[0].lang;
                           if(userIds.indexOf(currentId)==0){
                               $('.actions').hide();
                               app.likeUser(currentId,'0',function(){app.homeLink();});
                           }else{
                               app.likeUser(currentId,'0');
                           }

                       },
                       // like callback
                       onLike: function (item) {
                           $('.actions .dislike img').attr('src','img/closeoff.png');
                           $('.actions .like img').attr('src','img/like.png');
                           var currentId=item[0].lang;
                           if(userIds.indexOf(currentId)==0){
                               $('.actions').hide();
                               app.likeUser(currentId,'1',function(){app.homeLink();});
                           }else{
                               app.likeUser(currentId,'1');
                           }
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
                }else{
                    $('.actions').hide();
                }
            };
        app.startLoader();
        app.callAjax('site/getusers?token='+app.token,func);
        
    },
    likeUser:function(u_id,status,func){
        app.callAjax('site/likeuser?u_id='+u_id+'&status='+status+'&token='+app.token,func);
    },
    //restaurant detail page function
    restaurentInit:function(obj){
        var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            app.loadPage('restaurentTemplate',response);app.setSidebar($('#restaurentLink'));
            $(".owl-carousel")
                .html(app.creteHtmlData('restaurentDetailImgTemplate',response.images))
                .owlCarousel({
                items:1,
                loop:true,
                nav:false,
                lazyLoad:true
            });

            app.setTitle('RESTAURANT');
            $('.goBack').attr('onclick',"app.restaurentLink();app.reserBack();");
        };
        app.startLoader();
        app.callAjax('site/restaurantdetail?id='+$(obj).data('id'),func);
    },
    reserBack:function(){
        $('.goBack').attr('onclick',"app.homeLink();");
    },
    //Restaurant List page function
    restaurentListInit:function(){

        var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            var html='';
            if(response.length){
                html=app.creteHtmlData('restaurentImgTemplate',response);
            }else{
                html='no data found.';
            }
            $('#restaurentImgContainer').html(html);

            $('.restaurentImg').on('click',function(){app.restaurentInit(this);});

        };
        app.startLoader();
        app.callAjax('site/restaurantlist',func);

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
    //editprofile page function start ##################################################
    loadProfile:function(){
        var data={};
        for (i = 0; i < 5; i++) { 
            data['ui_image'+i]='img/edit_profile_plus.jpg';
        };
        $.each(app.udata.images,function(index,val){
            data['ui_image'+val['ui_position']]=val['ui_image'];
        });
        data.u_logo=app.udata.u_logo;
        data.u_about=app.udata.u_about;
        data.u_aboutcount=app.udata.u_about.length;
        app.userImages=data;
        console.log(data)
        app.loadPage('profileTemplate', data);
        $('.modal-trigger').leanModal();
        app.croper=$('.image-editor').cropit({smallImage:'allow',allowDragNDrop:false,onImageError:function(obj){console.log(obj);}});
        app.setSidebar($('#profileLink'));
        app.setProfileData(app.udata);
        app.setUserLogin();

    },
    readImage:function(obj){
        var fun=function(e){
            app.croper.cropit('imageSrc', e.target.result);
            app.stopLoader();
            $('.editImg').show();
        }
        app.startLoader();
        app.readURL(obj,fun);
    },
    setCropImage:function(name){
        $('#modal').openModal();
        $('.editImg').hide();
        console.log(name);
        app.croperName=name;
        var image=app.userImages[name];
        //image=image.replace('thumb_','');
        app.croper.cropit('imageSrc', image);
        
    },
    cropImage:function(){
        app.croper.cropit('exportZoom', 2);
        var imageData = app.croper.cropit('export');
        $('[name="'+app.croperName+'"]').val(imageData).next().attr('src',imageData);
        $('#modal').closeModal();
    },
    editProfileForm:function(obj){

        var func=function(response){
            app.stopLoader();
            console.log(response);
            if(response.message){app.alert(response.message);}
            if(response.status==1){
                app.udata=response.data;
                localStorage['udata']= JSON.stringify(response.data);
                app.profileLink();
            }

        };
        setTimeout(function(){
            
        app.postAjax('site/profile?token='+app.token,obj,func,'');
            
        },100);
    },
    //editprofile page function end ##################################################
    //login form submit function
    loginForm:function(obj){
        if($('#loginForm').valid()) {
            app.startLoader();
            var func = function (response) {
                app.stopLoader();
                if (response.message) {app.alert(response.message);}
                if (response.status) {
                    if (response.token) {
                        localStorage['token'] = app.token = response.token;
                        app.udata = response.data;
                        localStorage['udata'] = JSON.stringify(response.data);
                        app.setProfileData(response.data);
                        app.setUserLogin();
                        app.homeLink();
                    }
                }

            };
            if(app.device && app.device.uuid){
                $(obj).find('[name=d_device_id]').val(app.device.uuid);
            }
            setTimeout(function(){
                app.postAjax('site/login', obj, func, '');
            },100);
        }
    },
    //signup form submit function 
    
    signupForm:function(obj){
        if($(obj).valid()){
        app.startLoader();

        var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status){
                app.loginLink();
            }
        };
        this.postAjax('site/signup',obj,func,'');
    }
    },

    //sidemenu start stop start functions ----------------------->
    sideMenuStop:function(){
        $('.drag-target').hide();
    },
    sideMenuStart:function(){
        $('.drag-target').show();
    },
    //sidemenu start stop end functions ----------------------->
   
    /*new Route core functions start ########################################################################################*/
    loginLink:function(){
        app.loadPage('loginTemplate');app.setSidebar($('#loginLink'));
        app.loginFormValidate();
    },
    logoutBtn:function(){
        var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            localStorage['token']='';
            localStorage['udata']='';
            app.setTitle();
            app.setUserLogout();
            app.loginLink();
        };
        app.startLoader();
        app.callAjax('site/logout?token=',func);

    },
    homeLink:function(){
        app.loadPage('homeTemplate');app.setTitle();app.setSidebar($('#homeLink'));app.homeInit();
        console.log('sidebar close');
    },
    updateUser:function(data){
        app.lastUserUpdateData=data;
        if(app.lastUserUpdateTime<new Date().getTime()-1000 || !app.lastUserUpdateTime){
            app.lastUserUpdateTime=new Date().getTime();
            clearTimeout(app.t);
            app.t=setTimeout(function(){
                var func=function(response){
                    app.stopLoader();
                    //if(response.message){app.alert(response.message);}
                    if(response.status){
                        app.udata[Object.keys(app.lastUserUpdateData)[0]]=app.lastUserUpdateData[Object.keys(app.lastUserUpdateData)[0]];
                        localStorage['udata']= JSON.stringify(app.udata);
                    }
                };
                console.log(app.lastUserUpdateData[Object.keys(app.lastUserUpdateData)[0]]);
                app.postAjaxData('site/updateuser?token='+app.token,app.lastUserUpdateData,func);
            },1000);
        }
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
        app.loadPage('settingTemplate',app.udata);app.setSidebar($('#settingLink'));app.loadSetting();app.setTitle('<i class=\'fa fa-cog\'></i>');
    },
    userLink:function(){
        app.userInit();
    },
    profileLink:function(){
        app.loadProfile();app.setTitle('PROFILE');
    },
    messageLink:function(){
        app.loadPage('chatMsgTemplate');
        $('.goBack').attr('onclick',"app.chatLink();app.reserBack();");
    },
    notificationLink:function(){
        var data={
            u_notification_match:(app.udata.u_notification_match=='1')?'checked':'',
            u_notification_message:(app.udata.u_notification_message=='1')?'checked':'',
            u_notification_coupon:(app.udata.u_notification_coupon=='1')?'checked':'',
            notificationVibrate:(app.notificationVibrate=='1')?'checked':'',
            notificationSound:(app.notificationSound=='1')?'checked':'',
        }
        console.log(data);
        app.loadPage('notificationTemplate',data);app.setSidebar($('#notificationLink'));
        $('.goBack').attr('onclick',"app.settingLink();app.reserBack();");
    },
    signupLink:function(){
        app.loadPage('signupTemplate');app.setSidebar($('#loginLink'));
        app.signupFormValidate();
        app.setTitle('Signup');
        $('.goBack').attr('onclick',"app.loginLink();app.reserBack();app.setTitle();");
    },
    /*new Route core functions end  ##########################################################################################*/

};

$(document).ready(function(){
    app.appInit();
});

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
    app.baseUrl='http://sateweb.com/dating/users/index.php/api/';
    //console.log('udid->');
    //console.log(device.uuid);
    //alert(device.uuid);
    //console.log('<-udid');
    if(device.platform=='iOS'){
        $('head').append('<link rel="stylesheet" type="text/css" href="css/ios.css">');
    };

}
