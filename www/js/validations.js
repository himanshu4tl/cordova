app.signupFormValidate=function(){
    $("#signupForm").validate({
        rules: {
                u_name: {
                        required: true,
                        maxlength: 100,
                        minlength: 2
                },
                u_password: {
                        required: true,
                        maxlength: 100,
                        minlength: 5
                },
                u_email: {
                        required: true,
                        maxlength: 100,
                        email: true
                },
                u_contact: {
                        required: true,
                        maxlength: 20,
                        number: true
                },
                u_age: {
                        required: true,
                        number: true,
                        min:10,
                        max:100
                },
        },
        messages: {
                u_name: {
                        required: "Please enter your name",
                        maxlength: "Your name can contain max 100 characters",
                        minlength: "Your name must consist of at least 2 characters"
                },
                u_password: {
                        required: "Please provide a password",
                        minlength: "Your password must be at least 5 characters long",
                        maxlength: "Your password can contain max 100 characters"
                },
                u_email: {
                    email:"Please enter a valid email address",
                    required:"Please enter email address",
                    maxlength: "Your email can contain max 100 characters"
                },
                u_contact: {
                    number:"Please enter a valid contact number",
                    required:"Please enter contact number",
                    maxlength: "Your contact number can contain max 20 characters"
                },
                u_age: "Please enter a valid age",
        }
    });
};
app.loginFormValidate=function(){
    $("#loginForm").validate({
        rules: {
            u_password: {
                required: true,
                maxlength: 100,
                minlength: 5
            },
            u_email: {
                required: true,
                maxlength: 100,
                email: true
            }
        },
        messages: {
            u_password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long",
                maxlength: "Your password can contain max 100 characters"
            },
            u_email: {
                email:"Please enter a valid email address",
                required:"Please enter email address",
                maxlength: "email can contain max 100 characters"
            }
        }
    });
};