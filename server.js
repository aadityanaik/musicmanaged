var express = require('express')
var app = express()
var busboy = require('connect-busboy')
var fs = require('fs')
var bodyParser = require('body-parser')
var mongoDB = require('./mongodbManager')
var path = require('path')
var session = require('express-session');

var mongoDBManager = new mongoDB.MongoDBHandler()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));
app.use(busboy());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');
date = new Date();
app.use(session({secret: String (date.getTime())}));


// var sess = null;
app.get('/', function(req, res) {
    // sess = req.session

    if (req.session.username){
        console.log('REDIRECTED TO HOME PAGE with '+ req.session.username)
        res.render('pages/home')
    } else {

        if(req.session.page_views) {
            req.session.page_views++
            console.log(req.session.page_views)
        } else {
            req.session.page_views = 1;
            console.log(req.session.page_views)
        }
        
        console.log(req.session)
        res.render('pages/index');
    }
});

app.get('/signup', function(req, res) {
    res.render('pages/index');
});

app.get('/signin', function(req, res) {
    res.render('pages/index');
});

app.get('/upload', function(req, res) {
    if(req.session.username) {
        res.render('pages/upload')
    } else {
        res.render('pages/index')
    }
})

app.post('/api/adduser', function (req, res) {
    var uname = req.body.username
    var pword = req.body.password
    mongoDBManager.addUser(res, uname, pword, function(val) {
        if(val) {
            req.session.username = val
        }
    })
    // console.log(req)
})

app.post('/api/verifyuser', function (req, res) {
    var uname = req.body.username
    var pword = req.body.password
    mongoDBManager.checkCredentials(res, uname, pword, function(param) {
        if(param) {
            req.session.username = param
        }
    })

})

app.post('/api/deleteuser', function(req, res) {
    console.log('DELETE THEM USERS')
    console.log('WHAT ABOUT DEM LIAM NEESONS DOE?')
    console.log('NAW NAW NAW NOT HIM')
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

app.post('/api/deletemusicfile', function(req, res) {
    console.log('DELETE THEM MUSICS')
})

var server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
