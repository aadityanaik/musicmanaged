var express = require('express')
var app = express()
var busboy = require('connect-busboy')
var fs = require('fs')
var bodyParser = require('body-parser')
var mongoDB = require('./mongodbManager')
var path = require('path')
var session = require('express-session')
const nodeid3 = require('node-id3')
var portNo = 5000
// import * as ID3 from 'id3-parser'
// var ID3 = require('id3-parser')

var mongoDBManager = new mongoDB.MongoDBHandler()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));
app.use(busboy());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');
date = new Date();
app.use(session({ secret: String(date.getTime()) }));


// var sess = null;
app.get('/', function (req, res) {
    // sess = req.session

    mongoDBManager.createConnectionIfNotThere()

    if (req.session.username) {
        console.log('REDIRECTED TO HOME PAGE with ' + req.session.username)
        res.render('pages/home')
    } else {

        if (req.session.page_views) {
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

app.get('/signup', function (req, res) {
    res.render('pages/index');
});

app.get('/signin', function (req, res) {
    res.render('pages/index');
});

app.get('/upload', function (req, res) {
    if (req.session.username) {
        res.render('pages/upload')
    } else {
        res.redirect('/')
    }
})

app.get('/logout', function (req, res) {
    res.redirect('/api/logout')
})

app.get('/api/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err)
            res.redirect('/')
        } else {
            res.redirect('/')
        }
    })
})

app.post('/api/adduser', function (req, res) {
    mongoDBManager.createConnectionIfNotThere()
    var uname = req.body.username
    var pword = req.body.password
    mongoDBManager.addUser(uname, pword, function (resStat, resMsg, username) {
        if (username) {
            req.session.username = username
        }
        if (req.headers.host == "localhost:" + portNo) {
            res.redirect('/')
        } else {
            res.json({
                stat: resStat,
                msg: resMsg
            })

            res.end()
        }
    })
    // console.log(req)
})

app.post('/api/verifyuser', function (req, res) {
    mongoDBManager.createConnectionIfNotThere()
    // console.log(req.headers.host)
    var uname = req.body.username
    var pword = req.body.password
    mongoDBManager.checkCredentials(uname, pword, function (resStat, resMsg, username) {
        if (username) {
            req.session.username = username
        }

        console.log(req.connection.remoteAddress + " HELLO")

        // if (req.headers.host == "localhost:" + portNo) {
            res.redirect('/')
        // } else {
        //     res.json({
        //         stat: resStat,
        //         msg: resMsg
        //     })

        //     res.end()
        // }
    })

})

app.post('/api/deleteuser', function (req, res) {
    mongoDBManager.createConnectionIfNotThere()
    console.log('DELETE THEM USERS')
    console.log('WHAT ABOUT DEM LIAM NEESONS DOE?')
    console.log('NAW NAW NAW NOT HIM')
})

app.post('/api/addmusicfile', function (req, res) {
    mongoDBManager.createConnectionIfNotThere()
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

        temp_buffer = Buffer.concat(buffArr)

        

        file.on('end', function () {
            buffer = Buffer.concat(buffArr)
            fileName = filename
        })

    });

    var username = req.session.username

    //console.log("TAGS: " + nodeID3.read(String(buffer), function(err, tags){}))

    /*
    req.busboy.on('field', function (fieldname, val) {
        if (fieldname == 'username') {
            username = val
        }
    })
    */

    req.busboy.on('finish', function () {
        console.log(buffer.length)

        console.log("Testing node-id3")

        // let tags = nodeid3.read(buffer)
        // console.log(tags)
        // var ismp3 = require('is-mp3')
        // const tag = ID3.parse(buffer);
        // console.log(tag);

        // console.log(ismp3(buffer))

        var buffer2 = new Buffer(buffer)
        let tags = {
            title: "Tomorrow",
            artist: "Kevin Penkin",
            album: "TVアニメ「メイドインアビス」オリジナルサウンドトラック",
            APIC: "./example/mia_cover.jpg",
            TRCK: "27"
        }

        let ID3FrameBuffer = nodeid3.create(tags)
        let success = nodeid3.write(tags, buffer2)

        console.log(success)

        if(success) {
            let tag = nodeid3.read(success)
            console.log(tag)
        }


        // nodeid3.read(buffer, {}, function(err, tags) {
        //     console.log("tags")
        //     console.log(tags)
        // })

        mongoDBManager.addMusic(username, fileName, buffer, function (resStat, resMsg) {
            res.json({
                stat: resStat,
                msg: resMsg
            })

            res.end()
        })
    })
})

app.get('/api/getmusicfile', function (req, res) {
    mongoDBManager.createConnectionIfNotThere()
    // console.log(req.body)
    // res.attachment('./media/mudmud/audio/The Godfather Theme Song.wav')
    // res.download('./media/mudmud/audio/The Godfather Theme Song.wav')

    // res.json(req.query.filename)
    var username = req.session.username
    var filename = req.query.filename
    var fileid = req.query.fileid

    mongoDBManager.getMusic(username, filename, fileid, function (resStat, resMsg, writechunk, chunkToWrite, endResponse) {
        if (writechunk && writechunk == true) {
            res.write(chunkToWrite)
        } else if (endResponse && endResponse == true) {
            res.end()
        } else {
            res.json({
                stat: resStat,
                msg: resMsg
            })

            res.end()
        }
    })
})

app.post('/api/deletemusicfile', function (req, res) {
    mongoDBManager.createConnectionIfNotThere()
    
    mongoDBManager.deleteMusic(req.session.username, req.body.filename, req.body.fileid, function(resStat, resMsg) {
        res.json({
            stat: resStat,
            msg: resMsg
        })

        res.end()
    })
    
})

app.get('/404', function(req, res) {
    res.render("pages/404")
})

app.get('/api/getMusicFiles', function (req, res) {
    mongoDBManager.createConnectionIfNotThere()
    mongoDBManager.getMusicList(req.session.username, function (resStat, resMsg, list) {
        console.log(list)
        if (list) {
            res.json({
                stat: resStat,
                msg: resMsg,
                listFiles: list
            })

        } else {
            res.json({
                stat: resStat,
                msg: resMsg
            })
        }
    })
})

var server = app.listen(portNo, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
