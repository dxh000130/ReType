if (!localStorage.user_id || !localStorage.pass) {
    localStorage.user_id = "";
    localStorage.pass = "";
} else {
    document.getElementById("login-username").value = localStorage.user_id;
    document.getElementById("login-password").value = localStorage.pass;
    Login();
    document.getElementById("error_box").style.display = "none";
    document.getElementById("login_modal").style.display = "none";
}
fetch('https://api.dxh000130.top/api/GetVersion', {
        method: 'GET'
    })
    .then(function(response) {
        return response.text()
    })
    .then(function(myJson) {
        console.log('Version' + myJson);
    });

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
                localStorage.user_id = username;
                localStorage.pass = password;
                console.log("Log in Success");
                console.log(localStorage.user_id);
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
                localStorage.user_id = user[0];
                localStorage.pass = user[1];
                console.log(localStorage.user_id);
                console.log(localStorage.pass);
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
        headers2.append('Authorization', 'Basic ' + btoa(localStorage.user_id + ":" + localStorage.pass));
        fetch("https://api.dxh000130.top/api/Leaderboard/" + localStorage.user_id, {
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
    document.getElementById("play_homepage").style.display = "none";
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
    document.getElementById("play_homepage").style.display = "none";
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

// 改变字体大小

if (!localStorage.zitidaxiao) {
    localStorage.zitidaxiao = "20";
    document.getElementById("text").style.fontSize = localStorage.zitidaxiao + 'px';
} else {
    console.log(localStorage.zitidaxiao);
    document.getElementById("text").style.fontSize = localStorage.zitidaxiao + 'px';
}

function change_font_size_big() {
    localStorage.zitidaxiao++;
    document.getElementById("text").style.fontSize = localStorage.zitidaxiao + 'px';
}

function change_font_size_small() {
    localStorage.zitidaxiao--;
    document.getElementById("text").style.fontSize = localStorage.zitidaxiao + 'px';
}





var difficulties = "";
var theme = "";
document.getElementById('easy1').addEventListener("click", function() {
    difficulties = "L";
    theme = "Tech";

});
document.getElementById('easy2').addEventListener("click", function() {
    difficulties = "L";
    theme = "";

});
document.getElementById('easy3').addEventListener("click", function() {
    difficulties = "L";
    theme = "";

});
document.getElementById('normal1').addEventListener("click", function() {
    difficulties = "M";
    theme = "Tech";

});
document.getElementById('normal2').addEventListener("click", function() {
    difficulties = "M";
    theme = "";

});
document.getElementById('normal3').addEventListener("click", function() {
    difficulties = "M";
    theme = "";

});
document.getElementById('hard1').addEventListener("click", function() {
    difficulties = "H";
    theme = "Tech";

});
document.getElementById('hard2').addEventListener("click", function() {
    difficulties = "H";
    theme = "";

});
document.getElementById('hard3').addEventListener("click", function() {
    difficulties = "H";
    theme = "";

});
var articleid = 999;
var error_remain = 999;
var wholearticle = "";
var AlreadyCorrect = "";
var textinput = document.getElementById("user_input");

function display_play() {
    document.getElementById("first_page").style.display = "none";
    document.getElementById("difficult_page").style.display = "none";
    document.getElementById("play_homepage").style.display = "block";

    var ArticleChooseheader = new Headers();
    ArticleChooseheader.append('Authorization', 'Basic ' + btoa(localStorage.user_id + ":" + localStorage.pass));
    ArticleChooseheader.append('Content-Type', 'application/json')
    ArticleChooseheader.append('Accept', 'text/plain')
    const ArticleChoose = fetch("https://api.dxh000130.top/api/ArticleChoose", {
        method: "POST",
        credentials: 'include',
        headers: ArticleChooseheader,
        body: JSON.stringify({
            "Difficulty": "H", //需关联选择页面 需修改
            "Type": "Tech", //需关联选择页面 需修改
        })
    })
    ArticleChoose.then(res => {
        res.json().then(function(return_text) {
                console.log(difficulties, theme);
                console.log(return_text.article);
                document.querySelector('#text').innerHTML = return_text.article;
                error_remain = return_text.errorRemain;
                articleid = return_text.id;
                wholearticle = return_text.article;
            })
            //键盘监听
    });
}
document.getElementById('user_input').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        //console.log("回车");
        Enterbutton = 1;
        ArticleProcessMainFunction(Enterbutton)
    } else {
        Enterbutton = 0;
        ArticleProcessMainFunction(Enterbutton, 0)
            //console.log("没回车");
    }
});

//Hint
function Hint() {
    document.getElementById("user_input").value = "";
    ArticleProcessMainFunction(0, 1);
} //高亮 加减分 hint主程序
function ArticleProcessMainFunction(Enterbutton, hint) {
    let headers2 = new Headers();
    headers2.append('Authorization', 'Basic ' + btoa(localStorage.user_id + ":" + localStorage.pass)); //需修改
    headers2.append('Content-Type', 'application/json');
    headers2.append('Accept', 'text/plain');
    var textinput = document.getElementById("user_input");
    var username = textinput.value;

    if (username !== "" && username.search(" ") === -1) { //避免用户未输入或删除已输入内容报错
        //console.log(Enterbutton)
        const ArticleProcess = fetch("https://api.dxh000130.top/api/ArticleProcess", {
            method: "POST",
            credentials: 'include',
            headers: headers2,
            body: JSON.stringify({
                "ArticleID": articleid,
                "Article": wholearticle,
                "Input": username,
                "AlreadyCorrect": AlreadyCorrect,
                "Enter": Enterbutton,
                "hint": hint,
            })
        });
        ArticleProcess.then(res => {
            res.json().then(function(return_text1) {
                if (username !== "") {
                    //console.log(return_text1)
                    document.querySelector('#text').innerHTML = return_text1.articleDisp
                    if (return_text1.correct === "yes,add score") { //用户答题正确
                        document.querySelector("#user_input").value = "";
                        wholearticle = return_text1.article;
                        AlreadyCorrect = return_text1.alreadyCorrect;
                        console.log(return_text1.correct + " Score:" + return_text1.score); //可查看增加了多少分
                    } else if (return_text1.correct === "No, minus score") { //回答错误 减分
                        console.log(return_text1.correct + " Score:" + return_text1.score);
                    } else {
                        console.log(return_text1.correct) //不加分不减分， 用户输入文章中的错误单词：tryagain, No plus or minus score， 用户输入已经答对的单词：Already Input, No plus or minus score， 高亮单词： No, No plus or minus score
                    }
                } else {
                    document.querySelector('#text').innerHTML = wholearticle;
                }
                document.getElementById("score").innerHTML = return_text1.score;
            })

        })
    } else {
        if (hint === 1) {
            const ArticleProcess = fetch("https://api.dxh000130.top/api/ArticleProcess", {
                method: "POST",
                credentials: 'include',
                headers: headers2,
                body: JSON.stringify({
                    "ArticleID": articleid,
                    "Article": wholearticle,
                    "Input": "Hint",
                    "AlreadyCorrect": AlreadyCorrect,
                    "Enter": Enterbutton,
                    "hint": hint,
                })
            });
            ArticleProcess.then(res => {
                res.json().then(function(return_text1) {
                    console.log(return_text1.hint); //Hint内容
                    document.querySelector('#text').innerHTML = return_text1.articleDisp; //高亮hint内容
                })
            })
        }
        document.querySelector('#text').innerHTML = wholearticle;
    }
}