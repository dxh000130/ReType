// enter log_in not display other interface
function log_in_button() {
    document.getElementById('login_modal').style.display = 'block';
    document.getElementById('register_modal').style.display = 'none';
    document.getElementById('error_box').style.display = 'none';
    document.getElementById('leaderboard_page').style.display = 'none';
    document.getElementById('introduction_model').style.display = 'none';
    document.getElementById('user_modal').style.display = 'none';
}

// enter introduction button  not display other interface
function introduction_button() {
    document.getElementById('introduction_model').style.display = 'block';
    document.getElementById('login_modal').style.display = 'none';
    document.getElementById('register_modal').style.display = 'none';
    document.getElementById('error_box').style.display = 'none';
    document.getElementById('leaderboard_page').style.display = 'none';
    document.getElementById('user_modal').style.display = 'none';
}

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
fetch('https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/GetVersion', {
    
    method: 'GET'
})
    .then(function (response) {
        return response.text()
    })
    .then(function (myJson) {
        console.log('Version' + myJson);
    });

let valid_log = false;

// log in
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
        fetch('https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/Login', {
            
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
                button.onclick = function () {
                    document.getElementById("error_box").style.display = "none";
                    document.getElementById("login_modal").style.display = "none";
                }
                document.getElementById("log_in_button_container").style.display = "none";
                document.getElementById("log_out_button_container").style.display = "block";
                // document.querySelector(".error_button").style.display="none";

            } else {
                text.innerText = "Your username or password is wrong ! Please try it again !";
                valid_log = false;
                document.getElementById("login-username").value = "";
                document.getElementById("login-password").value = "";
            }
        });
    }
}

// log out
function log_out() {
    document.getElementById("log_in_button_container").style.display = "block";
    document.getElementById("log_out_button_container").style.display = "none";
    valid_log = false;
    document.getElementById("error_box").style.display = "none";
    document.getElementById("login_modal").style.display = "none";
    document.getElementById('introduction_model').style.display = 'none';
    document.getElementById('register_modal').style.display = 'none';
    document.getElementById('leaderboard_page').style.display = 'none';
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
    localStorage.user_id = "";
    localStorage.pass = "";
}



// register
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
        const signup = fetch("https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/Register", {
            
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
                text.innerText = return_text;
                if (return_text == "User successfully registered.") {
                    const button = document.getElementById("error_button");
                    button.onclick = function () {
                        document.getElementById("error_box").style.display = "none";
                        document.getElementById("register_modal").style.display = "none";
                    }
                } else {
                    const button = document.getElementById("error_button");
                    button.onclick = function () {
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


// mailbox verification in register interface
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
        const url = fetch("https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/Registrationverificationcode/" + email, {
            
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        }).then(res => {
            res.text().then(function (return_text) {
                console.log(return_text);
                if (return_text == '"This email has been registered by another user"') {
                    document.getElementById("error_box").style.display = "block";
                    text.innerText = "This Email Has Been Resgistered !";
                } else {
                    t = setInterval(function () {
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
        // Click the email verification button again when time is 0
        document.getElementById("code").onclick = "verification()";
        document.getElementById("code").value = "Get Verification Code";
        time = 60;
        clearInterval(t);
    } else {
        // cannot Click the email verification button again
        document.getElementById("code").onclick = "";
        document.getElementById("code").value = "Resend in " + time + "s";
        time--;
    }
}


///google log in
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
    const signup = fetch("https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/vaildgoogleAsync", {
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


// leaderboard
var score = 0;
function GetLeaderboard() {
    document.getElementById('login_modal').style.display = 'none';
    document.getElementById('register_modal').style.display = 'none';
    document.getElementById('error_box').style.display = 'none';
    document.getElementById('introduction_model').style.display = 'none';
    document.getElementById('user_modal').style.display = 'none';


    ClearLeaderBoard();
    if (valid_log == false) {
        document.getElementById("first_page").style.display = "block";
        document.getElementById("login_modal").style.display="block";
        document.getElementById("difficult_page").style.display = "none";
        document.getElementById("play_homepage").style.display = "none";
        document.getElementById("error_box").style.display = "block";
        document.getElementById("error_text").innerHTML="Please log in first";
    } else {
        document.getElementById('leaderboard_page').style.display = 'block';
        var htmltable = document.getElementById("rank");
        let headers2 = new Headers();
        headers2.append('Authorization', 'Basic ' + btoa(localStorage.user_id + ":" + localStorage.pass));
        fetch("https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/Leaderboard/" + localStorage.user_id, {
            credentials : 'include',
            method: 'GET',
            headers: headers2
        }).then(r => {
            r.json().then(function (data) {
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
function getscore(){
    let headers2 = new Headers();
    headers2.append('Authorization', 'Basic ' + btoa(localStorage.user_id + ":" + localStorage.pass));
    fetch("https://api.dxh000130.top/api/Leaderboard/" + localStorage.user_id, {
        credentials : 'include',
        method: 'GET',
        headers: headers2
    }).then(r => {
        r.json().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].username == localStorage.user_id) {
                    score = data[i].score;
                    console.log(score);
                }
            }
        })
    })
};
function ClearLeaderBoard() {
    var table = document.getElementById("rank");
    table.innerHTML = "";
}

// enter play button not display other interface
function display_game() {
    if(valid_log==false){
        document.getElementById("first_page").style.display = "block";
        document.getElementById("login_modal").style.display="block";
        document.getElementById("difficult_page").style.display = "none";
        document.getElementById("play_homepage").style.display = "none";
        document.getElementById("error_box").style.display = "block";
        document.getElementById("error_text").innerHTML="Please log in first";
        document.getElementById('register_modal').style.display = 'none';
        document.getElementById('leaderboard_page').style.display = 'none';
        document.getElementById('introduction_model').style.display = 'none';
        document.getElementById('user_modal').style.display = 'none';
    }else{
        document.getElementById("play_homepage").style.display = "none";
        document.getElementById("first_page").style.display = "none";
        // document.getElementById("login_modal").style.display="none";
        document.getElementById("difficult_page").style.display = "block";
    }
}


// enter change difficulty button in difficulty interface
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

// enter back home button which in top right for all interface
function BackToHome() {
    document.getElementById("first_page").style.display = "block";
    document.getElementById("difficult_page").style.display = "none";
    document.getElementById("play_homepage").style.display = "none";
    document.getElementById('login_modal').style.display = 'none';
    document.getElementById('register_modal').style.display = 'none';
    document.getElementById('error_box').style.display = 'none';
    document.getElementById('introduction_model').style.display = 'none';
    document.getElementById('leaderboard_page').style.display = 'none';
    document.getElementById("user_modal").style.display = "none";
    document.getElementById('i1').style.display = 'block';
    document.getElementById('i2').style.display = 'block';
    document.getElementById('i3').style.display = 'block';
    document.getElementById('b1').style.display = 'none';
    document.getElementById('b2').style.display = 'none';
    document.getElementById('b3').style.display = 'none';
    // Set the timer on the game interface to 0
    time_reset();
}




// Change the background button in the game interface
if (!localStorage.change_background) {
    localStorage.change_background = "#18222d";
    localStorage.content = "#adadad";
    document.getElementById("text").style.backgroundColor = localStorage.change_background;
    document.getElementById("text").style.color = localStorage.content;
} else {
    document.getElementById("text").style.backgroundColor = localStorage.change_background;
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

// Change the font button in the game interface
if (!localStorage.change_font_family) {
    localStorage.change_font_family = "Georgia";
    document.getElementById("text").style.fontFamily = localStorage.ziti;
} else {
    document.getElementById("text").style.fontFamily = localStorage.ziti;
}
function change_font_family() {
    if (localStorage.ziti == "Georgia") {
        localStorage.ziti = "Palatino Linotype";
    } else if (localStorage.ziti == "Palatino Linotype") {
        localStorage.ziti = "Times New Roman";
    } else if (localStorage.ziti == "Times New Roman") {
        localStorage.ziti = "Arial";
    } else if (localStorage.ziti == "Arial") {
        localStorage.ziti = "Monaco";
    } else if (localStorage.ziti == "Monaco") {
        localStorage.ziti = "Lucida Handwriting";
    } else if (localStorage.ziti == "Lucida Handwriting") {
        localStorage.ziti = "Lucida Console";
    } else {
        localStorage.ziti = "Georgia";
    }
    document.getElementById("text").style.fontFamily = localStorage.ziti;
}

// Change the font size button in the game interface
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




// Display articles based on the difficulty and topic of the user's click
var difficulties = "";
var theme = "";
var articleid = 999;
var error_remain = 999;
var wholearticle = "";
var AlreadyCorrect = "";
var textinput = document.getElementById("user_input");
var total_errors = 0;
function display_play(difficulties, theme) {
    document.getElementById("first_page").style.display = "none";
    document.getElementById("difficult_page").style.display = "none";
    document.getElementById("play_homepage").style.display = "block";
    var ArticleChooseheader = new Headers();
    getscore();
    ArticleChooseheader.append('Authorization', 'Basic ' + btoa(localStorage.user_id + ":" + localStorage.pass));
    ArticleChooseheader.append('Content-Type', 'application/json')
    ArticleChooseheader.append('Accept', 'text/plain')
    const ArticleChoose = fetch("https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/ArticleChoose", {
        
        method: "POST",
        headers: ArticleChooseheader,
        body: JSON.stringify({
            "Difficulty": difficulties, //需关联选择页面 需修改
            "Type": theme, //需关联选择页面 需修改
        })
    })
    ArticleChoose.then(res => {
        res.json().then(function (return_text) {
            document.querySelector('#text').innerHTML = return_text.article;
            total_errors = return_text.errorRemain;
            error_remain = total_errors;
            articleid = return_text.id;
            wholearticle = return_text.article;
            document.getElementById("total_error_div").innerHTML = total_errors;
            document.getElementById("remain_error_div").innerHTML = error_remain;
            document.getElementById("current_score_div").innerHTML = score;

        })
        //键盘监听
    });
}


// When the user enters a word in the input box of the game interface, press enter to determine whether it is correct
document.getElementById('user_input').addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        //console.log("回车");
        Enterbutton = 1;
        ArticleProcessMainFunction(Enterbutton);
        document.getElementById("prompt_box").style.display = "none";
    } else {
        Enterbutton = 0;
        ArticleProcessMainFunction(Enterbutton, 0);
        //console.log("没回车");
    }
});

// A prompt box is displayed after the user enters a word
function input_reminder() {
    if (document.getElementById("user_input").value.length != 0) {
        document.getElementById("prompt_box").style.display = "block";
    } else {
        document.getElementById("prompt_box").style.display = "none";
    }
}



//Hint
function Hint() {
    document.getElementById("user_input").value = "";
    ArticleProcessMainFunction(0, 1);
}

// hight light word, change score, hint
function ArticleProcessMainFunction(Enterbutton, hint) {
    let headers2 = new Headers();
    headers2.append('Authorization', 'Basic ' + btoa(localStorage.user_id + ":" + localStorage.pass)); //需修改
    headers2.append('Content-Type', 'application/json');
    headers2.append('Accept', 'text/plain');
    var textinput = document.getElementById("user_input");
    var username = textinput.value;

    if (username !== "" && username.search(" ") === -1) { //避免用户未输入或删除已输入内容报错
        //console.log(Enterbutton)
        const ArticleProcess = fetch("https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/ArticleProcess", {
            
            method: "POST",
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
            res.json().then(function (return_text1) {
                if (username !== "") {
                    //console.log(return_text1)
                    document.querySelector('#text').innerHTML = return_text1.articleDisp
                    if (return_text1.correct === "yes,add score") { //用户答题正确
                        document.querySelector("#user_input").value = "";
                        wholearticle = return_text1.article;
                        AlreadyCorrect = return_text1.alreadyCorrect;
                        error_remain -= 1;
                        console.log(return_text1.correct + " Score:" + return_text1.score); //可查看增加了多少分
                    } else if (return_text1.correct === "No, minus score") { //回答错误 减分
                        console.log(return_text1.correct + " Score:" + return_text1.score);
                    } else {
                        console.log(return_text1.correct) //不加分不减分， 用户输入文章中的错误单词：tryagain, No plus or minus score， 用户输入已经答对的单词：Already Input, No plus or minus score， 高亮单词： No, No plus or minus score
                    }
                } else {
                    document.querySelector('#text').innerHTML = wholearticle;
                }
                document.getElementById("total_error_div").innerHTML = total_errors;
                document.getElementById("remain_error_div").innerHTML = error_remain;
                document.getElementById("current_score_div").innerHTML = return_text1.score;
            })

        })
    } else {
        if (hint === 1) {
            const ArticleProcess = fetch("https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/ArticleProcess", {
                method: "POST",
                
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
                res.json().then(function (return_text1) {
                    console.log(return_text1.hint); //Hint内容
                    document.querySelector('#text').innerHTML = return_text1.articleDisp; //高亮hint内容
                })
            })
        }
        document.querySelector('#text').innerHTML = wholearticle;
    }
}


// dictionaries
function define_dictionaries() {
    const get_input = document.getElementById("dictionaries_input").value;
    const get_meaning = fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + get_input, {
        method: "GET",
        headers: {
            "Accept": "text/plain",
        },
    });
    get_meaning.then(res => res.text()).then(data => {
        if (data.indexOf('meanings') == -1) {
            document.getElementById("definition").innerHTML = "Sorry, we couldn't find definitions for the word you were looking for. Please enter again !";
        } else {
            var first = data.split('meanings')[1];
            console.log(first);
            // 找到example开始
            // if (first.indexOf("example") == -1) {
            //     document.getElementById("example").innerText = "There is no examples";
            // } else {
            //     var example_index = first.split("example")[1];
            //     console.log(example_index);
            //     var example_index1 = example_index.indexOf(":");
            //     var example_index2 = example_index.indexOf("}");
            //     var example_final = example_index.substr(example_index1 + 2, example_index2 - 4);
            //     document.getElementById("example").innerText = example_final;
            // }

            // 找到example结束
            // 找到definitiaon开始
            var definition_index = first.split("definition")[2];
            var definition_index1 = definition_index.split('definition":"')[0];
            var definition_index2 = definition_index1.split(',"synonyms"')[0];
            var definition_index3 = definition_index2.substr(3,);
            var definition_final = definition_index3.replace('"', "");
            console.log(definition_final);
            // document.getElementById("definition").innerText = definition_final;
            document.getElementById("definition").innerHTML = definition_final;
        }
    });
}

// audio the words
function audio_dictionaries() {
    const get_input = document.getElementById("dictionaries_input").value;
    // console.log(get_input);
    var audio = document.getElementById("voice");
    // var url = audio.src;
    // console.log(url);
    // audio.src = "http://dict.youdao.com/dictvoice?type=0&audio=" + get_input;
    // audio.src='http://ssl.gstatic.com/dictionary/static/sounds/20200429/'+get_input+'--_gb_1.mp3';
    const get_voice = fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + get_input, {
        method: "GET",
        headers: {
            "Accept": "text/plain",
        },
    });
    get_voice.then(res => res.text()).then(data => {
        if (data.indexOf('.mp3') == -1) {
            audio.src = "http://dict.youdao.com/dictvoice?type=0&audio=" + get_input;
            audio.play();
            audio;
        } else {
            var voice_first = data.indexOf('.mp3","sourceUrl"');
            var voice_first1 = data.indexOf('"audio":"https:');
            var voice_1 = data.substr(voice_first1, voice_first);
            var voice_2 = voice_1.split("sourceUrl")[0];
            var voice_3 = voice_2.split('"audio":"')[1];
            var voice_4 = voice_3.split('","')[0];
            console.log(voice_4);
            // var voice1=voice_first.indexOf(',"sourceUrl"');
            // var voice2=voice_first.indexOf('http');
            // var voice_final=voice_first.substr(voice2-1,voice1-2);
            // console.log(voice_final);

            if (voice_4 == 'https://api.dictionaryapi.dev/media/pronunciations/en/' + get_input + '-uk.mp3') {
                console.log('不一样');
                audio.src = 'https://api.dictionaryapi.dev/media/pronunciations/en/' + get_input + '-uk.mp3';
                console.log(audio.src);
                audio.play();
                audio;
            } else if (voice_4 == 'https://api.dictionaryapi.dev/media/pronunciations/en/' + get_input + '-us.mp3') {
                console.log('一样');
                audio.src = 'https://api.dictionaryapi.dev/media/pronunciations/en/' + get_input + '-us.mp3';
                console.log(audio.src);
                audio.play();
                audio;
            } else {
                audio.src = "http://dict.youdao.com/dictvoice?type=0&audio=" + get_input;
                audio.play();
                audio;
            }
        }
    });
}


// time in game main interface
var i = 0;
var timer1 = null;
var isRunning = false;
function doubleLing(i) {
    if (i < 10) {
        return "0" + i
    } else {
        return i
    }
}
function startBtn() {
    timer1 = setInterval(function () {
        i++
        document.getElementById("second").innerHTML = doubleLing(parseInt(i / 100) % 60);
        document.getElementById("minute").innerHTML = doubleLing(parseInt(i / 6000) % 60);
        document.getElementById("hour").innerHTML = doubleLing(parseInt(i / 360000));
    }, 10)
}
function pasueBtn() {
    clearInterval(timer1)
}
function time_start() {
    if (!isRunning) {
        document.getElementById("btn1").innerHTML = "Stop";
        isRunning = true;
        startBtn();
    } else {
        document.getElementById("btn1").innerHTML = "Start";
        isRunning = false;
        pasueBtn();
    }
}
function time_reset() {
    clearInterval(timer1)
    i = 0;
    isRunning = false;
    document.getElementById("btn1").innerHTML = "Start";
    document.getElementById("second").innerHTML = "00";
    document.getElementById("minute").innerHTML = "00";
    document.getElementById("hour").innerHTML = "00";
}







function edit_profile() {
    let head = new Headers();
    head.append('Authorization', 'Basic ' + btoa(localStorage.user_id + ":" + localStorage.pass));
    head.append('Content-Type', 'application/json');
    head.append('Accept', 'text/plain');
    const edit_profile = fetch('https://cors-anywhere.herokuapp.com/https://api.dxh000130.top/api/UpdateUserDetail', {
        
        method: "POST",
        headers: head,
        body: JSON.stringify({
            "UserName": localStorage.user_id,
            "Name": document.getElementById("name").value,
            "DataofBirth": document.getElementById("DOB").value,
            "Gerder": document.getElementById("gender").value        
        }),
    })
    edit_profile.then(res =>{
        console.log(res.status)
        if (res.status == 200) {
            alert("修改成功");

        } else {
            alert("修改失败");
        }
    })
}
function display_user(){
    if(valid_log==false){
        document.getElementById("first_page").style.display = "block";
        document.getElementById("login_modal").style.display="block";
        document.getElementById("difficult_page").style.display = "none";
        document.getElementById("play_homepage").style.display = "none";
        document.getElementById("error_box").style.display = "block";
        document.getElementById("error_text").innerHTML="Please log in first";
        document.getElementById('register_modal').style.display = 'none';
        document.getElementById('leaderboard_page').style.display = 'none';
        document.getElementById('introduction_model').style.display = 'none';
        document.getElementById('user_modal').style.display = 'none';
    }else{
        document.getElementById("user_modal").style.display = "block";
        document.getElementById("username").value= localStorage.user_id;
        document.getElementById('introduction_model').style.display = 'none';
        document.getElementById('login_modal').style.display = 'none';
        document.getElementById('register_modal').style.display = 'none';
        document.getElementById('error_box').style.display = 'none';
        document.getElementById('leaderboard_page').style.display = 'none';
    }
}
