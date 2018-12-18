
var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser')
var db = require('./model/dbmanager')

var dbManager = new db.DBHandler()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/listuser', function(req, res) {
    dbManager.getUser(res)
})

/*
app.get('/api/adduser/:username/:password', function(req, res) {
    uname = req.params.username
    pword = req.params.password

    dbManager.addUser(res, uname, pword)
})
*/

app.post('/api/adduser', function(req, res) {
    console.log('Getting dat data')
    console.log('Body is ', req.body)
    var uname = req.body.username
    var pword = req.body.password
    dbManager.addUser(res, uname, pword)
})

var server = app.listen(5000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

app.use(express.static('website'))