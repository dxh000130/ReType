fetch('https://api.dxh000130.top/api/GetVersion', {
        method: 'GET'
    })
    .then(function(response) {
        return response.text()
    })
    .then(function(myJson) {
        console.log('Version' + myJson);
    });
var user_id = "";
var pass = "";

let valid_log = false;
//登录界面
function Login() {
    document.getElementById("error_box").style.display = "block";
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;
    let headers1 = new Headers();
    var text = document.getElementById("error_text");
    if (username == "" && password != "") {
        text.innerText = "Please Enter Your Username !";
    } else if (username != "" && password == "") {
        text.innerText = "Please enter your password !";
    } else if (username == "" && password == "") {
        text.innerText = "Please enter your username and password !";
    } else {
        headers1.append('Authorization', 'Basic ' + btoa(username + ":" + password));
        fetch('https://api.dxh000130.top/api/Login', {
            credentials: 'include',
            method: 'GET',
            headers: headers1
        }).then(r => {
            if (r.status == 200) {
                user_id = username;
                pass = password;
                console.log("Log in Success");
                console.log(user_id);
                text.innerText = "You have successfully logged in!";
                valid_log = true;
                const button = document.getElementById("error_button");
                button.onclick = function() {
                    document.getElementById("error_box").style.display = "none";
                    document.getElementById("login_modal").style.display = "none";
                }
                document.getElementById("log_in_button_container").style.display = "none";
                document.getElementById("log_out_button_container").style.display = "block";

            } else {
                text.innerText = "Your username or password is wrong ! Please try it again !";
                valid_log = false;
                document.getElementById("login-username").value = "";
                document.getElementById("login-password").value = "";
            }
        });
    }
}

function log_out() {
    document.getElementById("log_in_button_container").style.display = "block";
    document.getElementById("log_out_button_container").style.display = "none";
    valid_log = false;
    document.getElementById("error_box").style.display = "none";
    document.getElementById("login_modal").style.display = "none";
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
}
// 退出登录


// 注册界面
function register() {
    document.getElementById("error_box").style.display = "block";
    var username = document.getElementById("register-username").value;
    var password = document.getElementById("register-password").value;
    var email = document.getElementById("register-email").value;
    var verification = document.getElementById("register-verification").value;
    var text = document.getElementById("error_text");
    if (username == "" && password != "" && email != "" && verification != "") {
        text.innerText = "Please Enter Your Username !";
    } else if (username != "" && password == "" && email != "" && verification != "") {
        text.innerText = "Please Enter Your Password !";
    } else if (username != "" && password != "" && email == "" && verification != "") {
        text.innerText = "Please Enter your Email !";
    } else if (username != "" && password != "" && email != "" && verification == "") {
        text.innerText = "Please Enter your Verification Code !";
    } else if (username != "" && password != "" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) && verification == "") {
        text.innerText = "Please Enter Correct Email !";
    } else if (username != "" && password != "" && email != "" && verification != "") {
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
            res.text().then(function(return_text) {
                text.innerText = return_text;
                if (return_text == "User successfully registered.") {
                    const button = document.getElementById("error_button");
                    button.onclick = function() {
                        document.getElementById("error_box").style.display = "none";
                        document.getElementById("register_modal").style.display = "none";
                    }
                } else {
                    const button = document.getElementById("error_button");
                    button.onclick = function() {
                        document.getElementById("error_box").style.display = "none";
                        document.getElementById("register_modal").style.display = "block";
                    }
                }
            });
        });
    } else {
        text.innerText = "Please Complete All Information !";
    }
}


// 邮箱验证
function verification() {
    var email = document.getElementById("register-email").value;
    var text = document.getElementById("error_text");
    document.getElementById("error_box").style.display = "block";
    if (email == "") {
        text.innerText = "Please Enter your Email !";
    } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
        text.innerText = "Please Enter your Correct Email !";
    } else {
        document.getElementById("error_box").style.display = "none";
        const url = fetch("https://api.dxh000130.top/api/Registrationverificationcode/" + email, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        }).then(res => {
            res.text().then(function(return_text) {
                console.log(return_text);
                if (return_text == '"This email has been registered by another user"') {
                    document.getElementById("error_box").style.display = "block";
                    text.innerText = "This Email Has Been Resgistered !";
                } else {
                    t = setInterval(function() {
                        countdown()
                    }, 1000)
                    countdown();
                }
            });
        })
    }
}
var time = 60;

function countdown() {
    if (time == 0) {
        //这里时设置当时间到0的时候重新设置点击事件，并且默认time修改为60
        document.getElementById("code").onclick = "verification()";
        document.getElementById("code").value = "Get Verification Code";
        time = 60;
        clearInterval(t);
    } else {
        //这里是显示时间倒计时的时候点击不生效
        document.getElementById("code").onclick = "";
        document.getElementById("code").value = "Resend in " + time + "s";
        time--;
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

    var text1 = document.getElementById("error_text");
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
        res.text().then(function(text) {
            console.log(text);
            if (text != "This email has been occupied, please log in first and then bind Google" && text != "no") {
                user = text.split(",");
                user_id = user[0];
                pass = user[1];
                console.log(user_id);
                console.log(pass);
                valid_log = true;
                const button = document.getElementById("error_button");
                document.getElementById("login_modal").style.display = "none";
                document.getElementById("log_in_button_container").style.display = "none";
                document.getElementById("log_out_button_container").style.display = "block";
            } else if (text == "This email has been occupied, please log in first and then bind Google") {
                document.getElementById("error_box").style.display = "block";
                text1.innerText = "This email has been occupied, please log in first and then bind Google!";
                valid_log = false;
                document.getElementById("login-username").value = "";
                document.getElementById("login-password").value = "";
                var auth2 = gapi.auth2.getAuthInstance();
                auth2.signOut()
            }
        });

    });
}

// 排行榜页面
function GetLeaderboard() {
    if (valid_log == false) {
        window.alert("Please Log in")
    } else {
        document.getElementById('leaderboard_page').style.display = 'block';
        var htmltable = document.getElementById("rank")
        let headers2 = new Headers();
        headers2.append('Authorization', 'Basic ' + btoa(user_id + ":" + pass));
        fetch("https://api.dxh000130.top/api/Leaderboard/" + user_id, {
            credentials: 'include',
            method: 'GET',
            headers: headers2
        }).then(r => {
            r.json().then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    var row = ` <tr>
                                <td>${data[i].index}</td>
                                <td>${data[i].username}</td>
                                <td>${data[i].score}</td>
                            </tr>`
                    htmltable.innerHTML += row
                }
            })
        })
    }
}



function ClearLeaderBoard() {
    var table = document.getElementById("rank");
    table.innerHTML = "";
}
// 排行榜页面结束
//
function display_game() {
    // if (valid_log == false) {
    //     window.alert("Please Log in")
    // } else {
    document.getElementById("first_page").style.display = "none";
    document.getElementById("difficult_page").style.display = "block";
    // }
}

function change_difficult1() {
    document.getElementById("cards_wrap").className = "cards_wrap_1";
    document.getElementById("difficult_button1").style.display = "none";
    document.getElementById("difficult_button3").style.display = "none";
    document.getElementById("difficult_button2").style.display = "block";
}

function change_difficult2() {
    document.getElementById("cards_wrap").className = "cards_wrap_2";
    document.getElementById("difficult_button2").style.display = "none";
    document.getElementById("difficult_button1").style.display = "none";
    document.getElementById("difficult_button3").style.display = "block";
}

function change_difficult3() {
    document.getElementById("cards_wrap").className = "cards_wrap_3";
    document.getElementById("difficult_button1").style.display = "block";
    document.getElementById("difficult_button2").style.display = "none";
    document.getElementById("difficult_button3").style.display = "none";
}

function BackToHome() {
    document.getElementById("first_page").style.display = "block";
    document.getElementById("difficult_page").style.display = "none";
}

// 游戏主界面开始
// 改变背景颜色
if (!localStorage.change_background) {
    localStorage.change_background = "#18222d";
    localStorage.content = "#adadad";
    document.body.style.backgroundColor = localStorage.change_background;
    document.getElementById("text").style.color = localStorage.content;
} else {
    document.body.style.backgroundColor = localStorage.change_background;
    document.getElementById("text").style.color = localStorage.content;
}

function change_background() {
    if (localStorage.change_background == "#ffffff")
        localStorage.change_background = "#f6f1e7";
    else if (localStorage.change_background == "#f6f1e7")
        localStorage.change_background = "#dadada";
    else if (localStorage.change_background == "#dadada")
        localStorage.change_background = "#dae9da";
    else if (localStorage.change_background == "#dae9da")
        localStorage.change_background = "#ebcece";
    else if (localStorage.change_background == "#ebcece") {
        localStorage.change_background = "#18222d";
        localStorage.content = "#adadad";
        document.getElementById("text").style.color = localStorage.content;
    } else if (localStorage.change_background == "#18222d") {
        localStorage.change_background = "#ebddae";
        localStorage.content = "";
        document.getElementById("text").style.color = localStorage.content;
    } else if (localStorage.change_background == "#ebddae")
        localStorage.change_background = "#dfecf0";
    else
        localStorage.change_background = "#ffffff";
    document.getElementById("text").style.backgroundColor = localStorage.change_background;
}

// // 改变字体
if (!localStorage.change_font_family) {
    localStorage.change_font_family = "SimSun";
    document.getElementById("text").style.fontFamily = localStorage.ziti;
} else {
    document.getElementById("text").style.fontFamily = localStorage.ziti;
}
function change_font_family() {
    if (localStorage.ziti == "SimSun") {
        localStorage.ziti = "SimHei";
    } else if (localStorage.ziti == "SimHei") {

        localStorage.ziti = "Times New Roman";
    } else {
        localStorage.ziti = "SimSun";
    }
    document.getElementById("text").style.fontFamily = localStorage.ziti;
}

// // 改变字体大小
// if (!localStorage.change_font_size_small) {
//     localStorage.change_font_size_small = '3';
//     document.getElementById("text").style.fontSize = localStorage.change_font_size_small + 'vw';
// } else
//     document.getElementById("text").style.fontSize = localStorage.change_font_size_small + 'vw';
//
// function change_font_size_big() {
//     localStorage.change_font_size_small++;
//     document.getElementById("text").style.fontSize = localStorage.change_font_size_small + 'vw';
// }
//
// function change_font_size_small(){
//     localStorage.change_font_size_small=localStorage.change_font_size_small-1;
//     document.getElementById("text").style.fontSize = localStorage.change_font_size_small + 'vw';
// }

// let font_value = document.getElementById("text").value;

// var font_value=3;
// function change_font_size_big(){
//     console.log(font_value);
//     document.getElementById("text").style.fontSize = font_value+"vw" ;
//     font_value+=1;
// }