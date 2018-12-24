var express = require('express')
var app = express()
var busboy = require('connect-busboy')
var fs = require('fs')
var bodyParser = require('body-parser')
var db = require('./dbmanager')
var path = require('path')

fs.stat(__dirname + '/media/', function(err, stat) {
    if(err) {
        fs.mkdir(__dirname + '/media/', function(err) {
            if(err) {
                throw err
            } else {
                console.log('Media directory made')
            }
        })
    } else {
        console.log('Media directory exists')
    }
})

var dbManager = new db.DBHandler()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(busboy())

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
    var uname = req.body.username
    var pword = req.body.password
    dbManager.addUser(res, uname, pword)
})

app.post('/api/verifyuser', function(req, res) {
    var uname = req.body.username
    var pword = req.body.password
    dbManager.checkCredentials(res, uname, pword)
})

app.post('/api/addmusicfile', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    let formdata = new Map()
    
    var fileName
    var buffer

    req.busboy.on('file', function (fieldname, file, filename) {
        var buffArr = []

        file.on('data', function(data) {
            buffArr.push(data)
        })

        file.on('end', function() {
            buffer = Buffer.concat(buffArr)
            fileName = filename
        })
    });

    var username, filetype

    req.busboy.on('field', function(fieldname, val) {
        if(fieldname == 'username') {
            username = val
        } else if(fieldname == 'filetype') {
            filetype = val
        }
    })

    req.busboy.on('finish', function() {
        var filePath = path.join(__dirname, '/media/', username, '/audio/')
        console.log(buffer.length)
        dbManager.addMusic(res, username, fileName, filePath, filetype, buffer)
    })
})

app.post('/api/getmusicfile', function(req, res) {
    console.log(req.body)
    res.attachment('/home/aaditya/musicmanaged/media/mudmud/audio/The Godfather Theme Song.wav')
    res.download('/home/aaditya/musicmanaged/media/mudmud/audio/The Godfather Theme Song.wav')
    // dbManager.getMusic(res, req.body.username, req.body.filename)
})

var server = app.listen(5000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

app.use(express.static('website'))