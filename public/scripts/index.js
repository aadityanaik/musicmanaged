function test() {
    alert("Hello!");
}

$(window).on('pageshow', function() {
    var usernamefield = document.getElementById('username')
    var passwordfield = document.getElementById('password')

    usernamefield.addEventListener('keyup', function(event) {
        console.log('OK')
        if(event.keyCode == 13) {
            event.preventDefault()
            document.getElementById('submit_button').click()
        }
    })

    passwordfield.addEventListener('keyup', function(event) {
        if(event.keyCode == 13) {
            event.preventDefault()
            document.getElementById('submit_button').click()
        }
    })
})

// function validateInput() {
//     let valid_flag = false;
//     let username = document.credentials_form.username.value;
//     let password = document.credentials_form.password.value;

//     if (username === null || username === "") {
//         document.getElementById("username").style.borderBottom = "2px solid red";
//         document.getElementById("error").innerHTML = "Please check the information you have entered!";
//         document.getElementById("error").style.visible = "visible";
//         valid_flag = false;
//     } else {
//         valid_flag = true;
//     }

//     if (password.length < 8) {
//         document.getElementById("password").style.borderBottom = "2px solid red";
//         document.getElementById("error").innerHTML = "Please check the information you have entered!";
//         document.getElementById("error").style.visibility = "visible";
//         valid_flag = false; 
//     } else {
//         valid_flag = true;
//     }

//     if (valid_flag === true) {
//         // alert("Yahoo! This user is okay.");
//         adduser(username, password);
//     }
// }

function getResponseOfAPI(endpoint) {
    fetch('http://http://musicmanaged-musicmanaged.1d35.starter-us-east-1.openshiftapps.com/api/' + endpoint).then(
        function(data) {
            return data.json()
        }
    ).then(function(myJson) {
        console.log(JSON.stringify(myJson))
    })
}

function signUpForm() {
    var username = document.login_form.username.value;
    var password = document.login_form.password.value;
    // alert("came here")

    // alert(username + ' = ' + password)

    //TODO: VERIFICATION LINK I GUESS...

    adduser(username,password);
}

function signInForm() {
    var username = document.login_form.username.value;
    var password = document.login_form.password.value;

    verifyUsr(username, password);
}

function adduser(username, password) {
    // TODO: Make the transfer secure over https by adding that one header everyone talks about
    var host = window.location.hostname
    var protocol = window.location.protocol
    var port = window.location.port

    var url = "http://" + host + ":" + port + "/api/adduser"
    
    var info = {
        "username": username,
        "password": password
    }
    
    $.post(url, info, function(data) {
        // console.log(data)
        if(data.stat == 200) {
            location.reload()
        } else {
            alert("Couldn't sign up- " + data.msg)
        }
    }, "json");
}

function adduserfromform() {
    username = document.getElementById('username').value
    password = document.getElementById('password').value

    adduser(username, password)
}

function verifyUsr(username, password) {
    var host = window.location.hostname
    var protocol = window.location.protocol
    var port = window.location.port

    // console.log(host, port)

    var url = "http://" + host + ":" + port + "/api/verifyuser"
    
    var info = {
        "username": username,
        "password": password
    }

    $.post(url, info, function(data) {
        if(data.stat == 200) {
            location.reload()
        } else {
            alert("Wrong credentials- " + data.msg)
        }
    }, "json")
}

function verifyUserCreds() {
    username = document.login_form.username.value
    password = document.login_form.password.value
    verifyUsr(username, password)
}

function uploadFile() {
    var files = document.getElementById('file').files
    console.log(files[0])

    if(files[0].type.lastIndexOf("audio/", 0) == 0) {
        var username = document.getElementById('uploadSongUName').value
        var file = files[0]
        var host = window.location.hostname
        var port = window.location.port
        var url = "http://" + host + ":" + port + "/api/addmusicfile"

        var formdata = new FormData()
        formdata.append('data', file)
        formdata.append('username', username)
        formdata.append('name', file.name)

        $.ajax({
            url: url,
            type: "POST",
            data: formdata,
            contentType: false,
            processData: false
        }).done(function(data) {
            console.log(data)
        })
    }
}

function downloadFile() {
    var username = document.getElementById('downloadSongUName').value
    var filename = document.getElementById('filename').value

    var host = window.location.hostname
    var port = window.location.port
    var url = "http://" + host + ":" + port + "/api/getmusicfile"

    var info = {
        "username": username,
        "filename": filename,
        "fileid": "5c30abe1cc2a423041d7db36"
    }
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open('POST', url, true)
    xmlhttp.setRequestHeader('Content-Type', 'application/json')
    xmlhttp.send(JSON.stringify(info))

    xmlhttp.onreadystatechange = function() {//Call a function when the state changes.
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            /*
            //alert(xmlhttp.response.length)
            var source = document.getElementById('source')
            var audio = document.getElementById('audio')

            source.type = 'audio/wav'
            var base64 = btoa(String.fromCharCode(...new Uint8Array(xmlhttp.response)))
            source.src = `data:${source.type};base64,${base64}`
            // audio.appendChild(source)
            audio.load()
            audio.play()
            */
        }
    }

    /*
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(info),
        contentType: 'application/json',
        responseType: 'blob',
        processData: true,

        success: function(data) {
            var buffer = new ArrayBuffer( data.length ), // res is this.response in your case
            view   = new Uint8Array( buffer ),
            len    = view.length,
            fromCharCode = String.fromCharCode,
            i, s, str;

            str = "";

            for ( i = 0; i < len; ++i ) {
            str += fromCharCode( data[i].charCodeAt(0) & 0xff );
            }

            console.log(typeof(data))
            
            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            var audioSrc = URL.createObjectURL(new Blob([str], {type: 'audio/x-wav'}))
            var audio = new Audio(audioSrc)
            audio.play()
        }
    })
    */
}