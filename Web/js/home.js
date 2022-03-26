
fetch('https://api.dxh000130.top/api/GetVersion', {
    method: 'GET'
})
    .then(function(response){
        return response.text()
    })
    .then(function(myJson){
        console.log('Version' + myJson);
    });
var user_id = "";
var pass = "";

let valid_log=false;
function Login() {
    document.getElementById("error_box").style.display="block";
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;
    let headers1 = new Headers();
    var text=document.getElementById("error_text");
    if(username =="" && password!=""){
       text.innerText="Please Enter Your Username !";
    }else if(username !="" && password ==""){
        text.innerText="Please enter your password !";
    }else if(username =="" && password ==""){
        text.innerText="Please enter your username and password !";
    }else{
        headers1.append('Authorization', 'Basic '+ btoa(username+ ":" + password));
        fetch('https://api.dxh000130.top/api/Login',{
            credentials: 'include',
            method: 'GET',
            headers:headers1
        }).then(r => {
            if (r.status == 200) {
                user_id = username;
                pass = password;
                console.log("Log in Success");
                text.innerText="You have successfully logged in!";
                valid_log=true;
                const button=document.getElementById("error_button");
                button.onclick=function(){
                    document.getElementById("error_box").style.display="none";
                    document.getElementById("login_modal").style.display="none";
                }
                document.getElementById("log_in_button_container").style.display="none";
                document.getElementById("log_out_button_container").style.display="block";

            } else {
                text.innerText="Your username or password is wrong ! Please try it again !";
                valid_log=false;
                document.getElementById("login-username").value="";
                document.getElementById("login-password").value="";
            }
        });
    }
}

function log_out(){
    document.getElementById("log_in_button_container").style.display="block";
    document.getElementById("log_out_button_container").style.display="none";
    valid_log=false;
    document.getElementById("error_box").style.display="none";
    document.getElementById("login_modal").style.display="none";
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
}


function register(){
    document.getElementById("error_box").style.display="block";
    var username = document.getElementById("register-username").value;
    var password = document.getElementById("register-password").value;
    var email = document.getElementById("register-email").value;
    var verification = document.getElementById("register-verification").value;
    var text=document.getElementById("error_text");
    if(username =="" && password!="" && email !="" &&  verification!=""){
        text.innerText="Please Enter Your Username !";
    }else if(username !="" && password=="" && email !="" &&  verification!=""){
        text.innerText="Please Enter Your Password !";
    }else if(username !="" && password!="" && email =="" &&  verification!=""){
        text.innerText="Please Enter your Email !";
    }else if(username !="" && password!="" && email !="" &&  verification=="") {
        text.innerText = "Please Enter your Verification Code !";
    }else if(username !="" && password!="" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) &&  verification=="") {
        text.innerText = "Please Enter Correct Email !";
    }else if(username !="" && password!="" && email !="" &&  verification!=""){
        const signup = fetch("https://api.dxh000130.top/api/Register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/plain",
            },
            body: JSON.stringify({
                "UserName": username,
                "Password": password,
                "Email": email,
                "Code": verification,
            })
        });
        signup.then(res => {
        res.text().then(function (return_text) {
            text.innerText =return_text;
            if(return_text=="User successfully registered."){
                const button=document.getElementById("error_button");
                button.onclick=function(){
                    document.getElementById("error_box").style.display="none";
                    document.getElementById("register_modal").style.display="none";
                }
            }else{
                const button=document.getElementById("error_button");
                button.onclick=function(){
                    document.getElementById("error_box").style.display="none";
                    document.getElementById("register_modal").style.display="block";
                }
            }
        });
    });
    }else{
        text.innerText = "Please Complete All Information !";
    }
}



function verification(){
    var email = document.getElementById("register-email").value;
    var text=document.getElementById("error_text");
    document.getElementById("error_box").style.display="block";
    if(email==""){
        text.innerText="Please Enter your Email !";
    }else if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)){
        text.innerText="Please Enter your Correct Email !";
    }
    else{
        document.getElementById("error_box").style.display="none";
        const url = fetch("https://api.dxh000130.top/api/Registrationverificationcode/" + email,{
            method:"GET",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        }).then(res => {
            res.text().then(function (return_text) {
                console.log(return_text);
                if(return_text=='"This email has been registered by another user"'){
                    document.getElementById("error_box").style.display="block";
                    text.innerText = "This Email Has Been Resgistered !";
                }
            });
        })
    }
}


///bug
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());
    document.getElementById("error_box").style.display="block";
    var text1=document.getElementById("error_text");
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    const signup = fetch("https://api.dxh000130.top/api/vaildgoogleAsync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/plain",
        },
        body: JSON.stringify({
            "Email": profile.getEmail(),
            "ID": id_token,
            "Name": profile.getName(),
        })

    })
    signup.then(res => {
        res.text().then(function (text) {
            console.log(text);
            if (text != "This email has been occupied, please log in first and then bind Google" && text != "no"){
                user = text.split(",");
                user_id = user[0];
                pass = user[1];
                console.log(user_id);
                console.log(pass);
                valid_log=true;
                const button=document.getElementById("error_button");
                document.getElementById("login_modal").style.display="none";
                document.getElementById("log_in_button_container").style.display="none";
                document.getElementById("log_out_button_container").style.display="block";
            } else if(text == "This email has been occupied, please log in first and then bind Google"){

                text1.innerText="This email has been occupied, please log in first and then bind Google!";
                valid_log=false;
                document.getElementById("login-username").value="";
                document.getElementById("login-password").value="";
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut()
            }
        });

    });
}