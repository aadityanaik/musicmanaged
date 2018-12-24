function getResponseOfAPI(endpoint) {
    fetch('http://localhost:5000/api/' + endpoint).then(
        function(data) {
            return data.json()
        }
    ).then(function(myJson) {
        console.log(JSON.stringify(myJson))
    })
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
        console.log(data)
    }, "json")
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

    var url = "http://" + host + ":" + port + "/api/verifyuser"
    
    var info = {
        "username": username,
        "password": password
    }

    $.post(url, info, function(data) {
        alert(data)
    }, "json")
}

function verifyUserCreds() {
    username = document.getElementById('username').value
    password = document.getElementById('password').value
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
        formdata.append('filetype', file.type)

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
        username: username,
        filename: filename
    }

    $.post(url, info, function(data) {
        console.log(data.length)
        var bytes=[]

        for(var i = 0; i < data.length; i++) {
            var code = data.charCodeAt(i)
            bytes.push(code)
        }

        console.log(bytes.length)

        var file = new File(bytes, filename)

        
        var a = document.createElement('a')
        document.body.appendChild(a)

        a.style = 'display: none'

        var objUrl = window.URL.createObjectURL(file)

        a.href = objUrl
        a.download = filename
        a.click()

        window.URL.revokeObjectURL(objUrl)
        
    })
}