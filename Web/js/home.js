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
function Login() {
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;
    let headers1 = new Headers();
    headers1.append('Authorization', 'Basic '+ btoa(username+ ":" + password));
    fetch('https://api.dxh000130.top/api/Login', {
        credentials: 'include',
        method: 'GET',
        headers:headers1
    }).then(r => {
        if (r.status == 200) {
            user_id = username;
            pass = password;
            console.log("Log in Success")
            document.getElementById("closebtn").click();
            document.getElementById("button_login").style.visibility = "hidden";
            document.getElementById("button_logout").style.visibility = "visible";
            alert("You have successfully logged in!");
        } else {
            alert("Sorry, incorrect username or wrong password! Please try again!");
        }
        });
    }
function register(){
    var username = document.getElementById("register-username").value;
    var password = document.getElementById("register-password").value;
    var email = document.getElementById("register-email").value;
    var verification = document.getElementById("register-verification").value;
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

    })
    signup.then(res => {
        res.text().then(function (text) {
            window.alert(text);
        });

    });
};
function verification(){
    var email = document.getElementById("register-email").value;
    const url = fetch("https://api.dxh000130.top/api/Registrationverificationcode/" + email,{
        method:"GET",
        headers:{
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    }).then(res => {
        res.text().then(function (text) {
            window.alert(text);
        });
    })
}


