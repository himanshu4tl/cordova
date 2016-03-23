// Initialize collapse button
$(".button-collapse").sideNav();

String.prototype.replaceAll = function(search, replacement) {return this.replace(new RegExp(search, 'g'), replacement);};

var app={
    defaultPage:'profileTemplate',
    currentUrl:'',
    baseUrl:'http://sateweb.com/gava/web/index.php/api/',
    //baseUrl:'http://localhost/gava/web/api/',
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

        var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status) {
                var obj=$('#loginLink');
                app.loadPage('loginTemplate',obj);
                $(obj).parent().addClass('active').siblings().removeClass('active');
                localStorage['id']=app.id='';
            }

        };
        app.callAjax('site/logout','',func);

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
    loadPage:function(templateId,obj,data){
        $(obj).parent().addClass('active').siblings().removeClass('active');
        if(!data){data={}}
        console.log(templateId);
        this.renderHtml(this.creteHtml(templateId,data));
        app.stopLoader();
        this.pageInit();
        this.afterLoadPage(templateId);
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

    loadHome:function(obj){
        app.loadPage('homeTemplate',obj);
        $('#googleMap').css({height:window.screen.height,width:$('body').width()});
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            //x.innerHTML = "Geolocation is not supported by this browser.";
        }
    },
    loadVault:function(obj){
        var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status){
                app.loadPage('vaultTemplate',$('vaultLink'));
                $('#vaultData').html(app.creteHtmlData('vaultDataTemplate',response.data));
                $(obj).parent().addClass('active').siblings().removeClass('active');
            }

        };
        app.callAjax('site/vault','',func);
    },
    loadProfile:function(obj){
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
    },
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
        var func=function(response){

            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status){
                app.loadPage('loginTemplate',$('#loginLink'));
            }
        };
        this.postAjax(obj,func,'');
    },
    profileForm:function(obj){
        var func=function(response){
            app.stopLoader();
            if(response.message){app.alert(response.message);}
            if(response.status){app.loadProfile($('#profileLink'));}
        };
        this.postAjax(obj,func,'');
    },

};
app.appInit();
function showPosition(position) {
    console.log(position);
    var myCenter=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

    var map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: position.coords.latitude, lng: position.coords.longitude},
        zoom: 8
    });
    var marker=new google.maps.Marker({
        position:myCenter,
    });

    marker.setMap(map);

}
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1037460829623875',
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use graph api version 2.5
    });

    // Now that we've initialized the JavaScript SDK, we call
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
    });
}