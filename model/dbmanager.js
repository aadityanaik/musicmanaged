var mysql = require('mysql')

var port = 5000;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'musicmanaged',
    password: 'amusicalpassword',
    database: 'musicmanaged'
})

connection.connect(function(err) {
    if(err) {
        throw err
    } else {
        console.log('Connected')

        var query = "CREATE TABLE IF NOT EXISTS USER_LOGIN(" +
                    "USERNAME VARCHAR(50) PRIMARY KEY," +
                    "PASSWORD VARCHAR(50)" +
                    ");"

        connection.query(query, function(error, res) {
            if(error) {
                throw error
            } else {
                console.log('Connection initialized');
            }
        })
    }
})

function DBHandler() {
    this.conn = connection
}

DBHandler.prototype.addUser = function(response, username, password) {
    var sqlQuery = "INSERT INTO USER_LOGIN VALUES(\'" + username + "\', \'" + password + "\');"
    this.conn.query(sqlQuery, function(error, res) {
        if(error) {
            response.end(JSON.stringify(error))
        } else {
            response.end(JSON.stringify(res))
        }
    })
}

DBHandler.prototype.getUser = function(response, username = "") {
    var sqlQuery
    if(username == "") {
        sqlQuery = "SELECT * FROM USER_LOGIN;"
    } else {
        sqlQuery = "SELECT * FROM USER_LOGIN WHERE USERNAME = '" + username + "';"
    }
    
    var x_1 = {res: "None yet"};

    this.conn.query(sqlQuery, function getRes(error, res) {
        if(error) {
            response.end(JSON.stringify(error))
        } else {
            response.end(JSON.stringify(res))
        }
    })
}

module.exports = {DBHandler}