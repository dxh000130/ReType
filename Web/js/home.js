var user_id = "";
var pass = "";
function Login() {
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;
    const login = fetch("http://www.dxh000130.top:3351/api/Login", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": "Basic " + btoa(username + ":" + password)
        }
    });
    login.then(r => {
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
