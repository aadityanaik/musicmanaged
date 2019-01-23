var express = require('express')
var app = express()
var busboy = require('connect-busboy')
var fs = require('fs')
var bodyParser = require('body-parser')
var mongoDB = require('./mongodbManager')
var path = require('path')

var mongoDBManager = new mongoDB.MongoDBHandler()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));
app.use(busboy());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');

app.get('/', function(req, res) {
    res.render('/pages/index');
});

app.get('/signup', function(req, res) {
    res.render('pages/index');
});

app.get('/signin', function(req, res) {
    res.render('pages/signin');
});

app.get('/api/listuser', function (req, res) {
    dbManager.getUser(res)
})

/*
app.get('/api/adduser/:username/:password', function(req, res) {
    uname = req.params.username
    pword = req.params.password

    dbManager.addUser(res, uname, pword)
})
*/

app.post('/api/adduser', function (req, res) {
    var uname = req.body.username
    var pword = req.body.password
    console.log(uname, pword)
    mongoDBManager.addUser(res, uname, pword)
})

app.post('/api/verifyuser', function (req, res) {
    var uname = req.body.username
    var pword = req.body.password
    mongoDBManager.checkCredentials(res, uname, pword)
})

app.post('/api/addmusicfile', function (req, res) {
    var fstream;
    req.pipe(req.busboy);
    let formdata = new Map()

    var fileName
    var buffer

    req.busboy.on('file', function (fieldname, file, filename) {
        var buffArr = []

        file.on('data', function (data) {
            buffArr.push(data)
        })

        file.on('end', function () {
            buffer = Buffer.concat(buffArr)
            fileName = filename
        })
    });

    var username

    req.busboy.on('field', function (fieldname, val) {
        if (fieldname == 'username') {
            username = val
        }
    })

    req.busboy.on('finish', function () {
        console.log(buffer.length)
        mongoDBManager.addMusic(res, username, fileName, buffer)
    })
})

app.post('/api/getmusicfile', function (req, res) {
    console.log(req.body)
    // res.attachment('./media/mudmud/audio/The Godfather Theme Song.wav')
    // res.download('./media/mudmud/audio/The Godfather Theme Song.wav')
    mongoDBManager.getMusic(res, req.body.username, req.body.filename, req.body.fileid)
})

var server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
