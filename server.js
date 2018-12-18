
var express = require('express')
var app = express()
var fs = require('fs')
var db = require('./model/dbmanager')

var dbManager = new db.DBHandler()

app.get('/api/listuser', function(req, res) {
    dbManager.getUser(res)
})

app.get('/api/adduser/:username/:password', function(req, res) {
    uname = req.params.username
    pword = req.params.password

    dbManager.addUser(res, uname, pword)
})

var server = app.listen(5000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

app.use(express.static('website'))