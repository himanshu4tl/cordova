// Initialize collapse button
$(".button-collapse").sideNav();

String.prototype.replaceAll = function(search, replacement) {return this.replace(new RegExp(search, 'g'), replacement);};

var app={
    defaultPage:'profileTemplate',
    currentUrl:'',
    //baseUrl:'http://sateweb.com/gava/web/index.php/api/',
    baseUrl:'http://localhost/gava/web/api/',
    mainContainer:$('#contentView'),
    id:'',
    loader:$('#mLoader'),
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
        $('.auth').hide();
        $('.site-login').show();


    },
    setUserLogin:function(){
        $(".auth").show();
        $(".site-login").hide();
    },
    afterRout:function(){
        if(app.currentUrl){
            $('#slide-out .'+app.currentUrl.replace('/','-')).addClass('active').siblings().removeClass('active');
        }
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
            $('.nHeader').show();
            $('.brand-logo').html(title);
        }else{
            $('.dHeader').show();
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
        if(templateId=="distanceTemplate"){
            $('#distance').val(localStorage['distance']);
        }
    },
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
            start: [20, 80],
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

    },
    homeInit:function(){
        $(".owl-carousel").owlCarousel({
            items:1,
            loop:false,
            nav:false,
        });

    },
    restaurentInit:function(){
        $(".owl-carousel").owlCarousel({
            items:1,
            loop:true,
            nav:false,
        });

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

};
app.appInit();

document.addEventListener("backbutton", onBackKeyDown, false);
var i=1;
function onBackKeyDown(e) {
    // Handle the back button
    app.loadPage('homeTemplate');app.setSidebar($('#homeLink'));
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    app.device=device;
}