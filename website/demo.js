function getResponseOfAPI(endpoint) {
    fetch('http://localhost:5000/api/' + endpoint).then(
        function(data) {
            return data.json()
        }
    ).then(function(myJson) {
        console.log(JSON.stringify(myJson))
    })
}