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
    loadPage:function(templateId,data){
        if(!data){data={}}
        console.log(templateId);
        this.renderHtml(this.creteHtml(templateId,data));
        app.stopLoader();
        this.pageInit();
        this.afterLoadPage(templateId);
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
