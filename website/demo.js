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
    
    var url = "http://localhost:5000/api/adduser"
    
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