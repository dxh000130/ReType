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
    })
        .then(r => {
        if (r.status == 200) {
            user_id = username;
            pass = password;
            document.getElementById("closebtn").click();
            document.getElementById("button_login").style.visibility = "hidden";
            document.getElementById("button_logout").style.visibility = "visible";
            alert("You have successfully logged in!");
        } else {
            alert("Sorry, incorrect username or wrong password! Please try again!");
        }
        });
    }
