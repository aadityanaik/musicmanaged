var MongoClient = require('mongodb').MongoClient
var mongo = require('mongodb')

const ObjectID = require('mongodb').ObjectID;
const { Readable } = require('stream')

const url = 'mongodb://localhost:27017'
const dbname = 'musicmanaged'

const client = new MongoClient(url)

var bcrypt = require('bcrypt')

const saltRounds = 10

/*
client.connect(function(err) {
    if(err) {
        // console.log('Shitty luck')
    } else {
        // console.log('Cool')
        var db = client.db(dbname)
        db.collection('user_login').find({"name" : "dumdum"}).toArray(function(err, res) {
            if(err) {
                // console.log('Again, shite')
            } else {
                // console.log('No docs found')
            }
        })
        client.close()
    }
})
*/

function MongoDBHandler() {}

MongoDBHandler.prototype.addUser = function(response, username, password) {
    // console.log('Trying to add user ' + username)
    bcrypt.genSalt(saltRounds, function(error, salt) {
        if(error) {
            // console.log(error)
            response.json(error)
            response.end()
        } else {
            bcrypt.hash(password, salt, function(hashErr, hash) {
                if(hashErr) {
                    // console.log(hashErr)
                    response.json(hashErr)
                    response.end()
                } else {
                    if(client.isConnected()) {
                        var db = client.db(dbname)

                        db.collection('user_login').createIndex(
                            {"user_id": 1},
                            {unique: true},
                            function(err, res) {
                                if(err) {
                                    throw(err)
                                }
                            }
                        )

                        db.collection('user_files').createIndex(
                            {"user_id": 1},
                            {unique: true},
                            function(err, res) {
                                if(err) {
                                    throw(err)
                                }
                            }
                        )

                        db.collection('user_login').insertOne({"user_id" : username, "pass" : hash}, function(insertErr, res) {
                            if(insertErr) {
                                // console.log(insertErr)
                                message = ''
                                if(insertErr['code'] == 11000) {
                                    message = 'username already taken'
                                } else {
                                    message = 'reason unknown'
                                }
                                response.json({
                                    stat: 66600,
                                    msg: "Could not insert user-" + message
                                })
                                response.end()
                            } else {
                                db.collection('user_files').insertOne({"user_id": username, "files": []}, function(anotherInsertErr, otherRes) {
                                    if(anotherInsertErr) {
                                        // console.log(anotherInsertErr)
                                        response.json(anotherInsertErr)
                                        response.end()
                                    } else {
                                        // console.log(otherRes)
                                        response.json(otherRes)
                                        response.end()
                                    }
                                })
                            }
                        })
                    } else {
                        client.connect(function(connectErr, res) {
                            if(connectErr) {
                                // console.log('Could not connect to the server')
                                response.json('Could not connect to the server')
                                response.end()
                            } else {
                                // console.log('Initiated connection to mongodb server')
                                var db = client.db(dbname)
                                db.collection('user_login').insertOne({"user_id" : username, "pass" : hash}, function(insertErr, res) {
                                    if(insertErr) {
                                        // console.log(insertErr)
                                        // response.json(insertErr)
                                        message = ''
                                        if(insertErr['code'] == 11000) {
                                            message = 'username already taken'
                                        } else {
                                            message = 'reason unknown'
                                        }
                                        response.json({
                                            stat: 66600,
                                            msg: "Could not insert user-" + message
                                        })
                                        response.end()
                                    } else {
                                        db.collection('user_files').insertOne({"user_id": username, "files": []}, function(anotherInsertErr, otherRes) {
                                            if(anotherInsertErr) {
                                                // console.log(anotherInsertErr)message = ''
                                                if(anotherInsertErr['code'] == 11000) {
                                                    message = 'username already taken'
                                                } else {
                                                    message = 'reason unknown'
                                                }
                                                response.json({
                                                    stat: 66600,
                                                    msg: "Could not insert user-" + message
                                                })
                                                response.end()
                                            } else {
                                                // console.log(otherRes)
                                                response.json({
                                                    stat: 200,
                                                    msg: "Successfully added user"
                                                })
                                                response.end()
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    })
}

MongoDBHandler.prototype.checkCredentials = function(response, username, enteredPass) {
    if(client.isConnected()) {
        var db = client.db(dbname)
        db.collection('user_login').find({"user_id": username}).toArray(function(err, res) {
            if(err) {
                // console.log(err)
                response.status(500).json({
                    stat: 500,
                    msg: "something diabolical happened"
                })
                response.end()
            } else {
                if(res[0]) {
                    // console.log(res[0].pass)
                    var password = res[0].pass
                    bcrypt.compare(enteredPass, password, function(bcryptErr, bcryptRes) {
                        if(bcryptErr) {
                            // console.log(bcryptErr)
                            response.status(500).json({
                                stat: 500,
                                msg: "something diabolical happened"
                            })
                            response.end()
                        } else {
                            // console.log(bcryptRes)

                            stat = 200
                            if(bcryptRes == false) {
                                stat = 696
                            }

                            response.json({
                                stat: stat,
                                msg: "authenticated- " + bcryptRes
                            })

                            response.end()
                        }
                    })
                } else {
                    // console.log('No user ' + username + ' found')
                    response.json({
                        stat: 66601,
                        msg: 'No user ' + username + ' found'
                    })
                    response.end()
                }
            }
        })
    } else {
        client.connect(function(err) {
            if(err) {
                // console.log('Could not connect to the server')
                response.status(500).json({
                    stat: 500,
                    msg: 'something diabolical happened'
                })
                response.end()
            } else {
                // console.log('Initiated connection to mongodb server')
                var db = client.db(dbname)
                db.collection('user_login').createIndex(
                    {"user_id": 1},
                    {unique: true},
                    function(err, res) {
                        if(err) {
                            throw(err)
                        }
                    }
                )

                db.collection('user_files').createIndex(
                    {"user_id": 1},
                    {unique: true},
                    function(err, res) {
                        if(err) {
                            throw(err)
                        }
                    }
                )

                var db = client.db(dbname)
                db.collection('user_login').find({"user_id": username}).toArray(function(error, res) {
                    if(error) {
                        // console.log(error)
                        response.status(500).json({
                            stat: 500,
                            msg: "something diabolical happened"
                        })
                        response.end()
                    } else {
                        if(res[0]) {
                            // console.log(res[0].pass)
                            var password = res[0].pass
                            bcrypt.compare(enteredPass, password, function(bcryptErr, bcryptRes) {
                                if(bcryptErr) {
                                    // console.log(bcryptErr)
                                    response.status(500).json({
                                        stat: 500,
                                        msg: "something diabolical happened"
                                    })
                                    response.end()
                                } else {
                                    // console.log(bcryptRes)
                                    stat = 200
                                    if(bcryptRes == false) {
                                        stat = 696
                                    }

                                    response.json({
                                        stat: stat,
                                        msg: "authenticated- " + bcryptRes
                                    })

                                    response.end()
                                }
                            })
                        } else {
                            // console.log('No user ' + username + ' found')
                            response.json({
                                stat: 66601,
                                msg: 'No user ' + username + ' found'
                            })
                            response.end()
                        }
                    }
                })
            }
        })
    }
}

MongoDBHandler.prototype.addMusic = function(response, username, fileName, fileBuffer) {
    if(client.isConnected()) {
        var db = client.db(dbname)
        const readableTrackStream = new Readable()
        readableTrackStream.push(fileBuffer)
        readableTrackStream.push(null)

        let bucket = new mongo.GridFSBucket(db, {
            bucketName: 'music_files'
        })

        let uploadStream = bucket.openUploadStream(fileName)
        let id = uploadStream.id
        readableTrackStream.pipe(uploadStream)

        uploadStream.on('error', function() {
            // console.log('YIKES')
            response.status(400).json({
                stat: 66604,
                msg: "Failed to upload file"
            }).end()
        })

        uploadStream.on('finish', function() {
            // console.log(id)
            db.collection('user_files').updateOne({"user_id": username}, {$push: {
                "files": {
                    "file_name": fileName,
                    "file_id": id.toString()
                }
            }}, function(err, res) {
                if(err) {
                    // console.log('OOPS')
                    // console.log(res)
                    response.json({
                        stat: 66604,
                        msg: "Failed to upload file"
                    }).end()
                } else {
                    // console.log('DONE')
                    if(res.matchedCount == 1) {
                        response.json({
                            stat: 200,
                            msg: "uploaded file successfully"
                        }).end()
                    } else {
                        bucket.delete(id, function(err) {
                            if(err) {
                                throw err
                            } else {
                                // console.log('Deleted')
                            }
                        })
                        response.json({
                            stat: 66601,
                            msg: "user not found"
                        }).end()
                    }
                }
            })
            // console.log('DONE')
        })
    } else {
        client.connect(function(err) {
            if(err) {
                // console.log(err)
            } else {
                // console.log('Initiated connection to mongodb server')
                var db = client.db(dbname)
                db.collection('user_login').createIndex(
                    {"user_id": 1},
                    {unique: true},
                    function(err, res) {
                        if(err) {
                            throw(err)
                        }
                    }
                )
                db.collection('user_files').createIndex(
                    {"user_id": 1},
                    {unique: true},
                    function(err, res) {
                        if(err) {
                            throw(err)
                        }
                    }
                )

                const readableTrackStream = new Readable()
                readableTrackStream.push(fileBuffer)
                readableTrackStream.push(null)

                let bucket = new mongo.GridFSBucket(db, {
                    bucketName: 'music_files'
                })

                let uploadStream = bucket.openUploadStream(fileName)
                let id = uploadStream.id
                readableTrackStream.pipe(uploadStream)

                uploadStream.on('error', function() {
                    // console.log('YIKES')
                    response.status(400).json({
                        stat: 66604,
                        msg: "Failed to upload file"
                    }).end()
                })
        
                uploadStream.on('finish', function() {
                    // console.log(id)
                    db.collection('user_files').updateOne({"user_id": username}, {$push: {
                        "files": {
                            "file_name": fileName,
                            "file_id": id.toString()
                        }
                    }}, function(err, res) {
                        if(err) {
                            // console.log('OOPS')
                            response.json({
                                stat: 66604,
                                msg: "Failed to upload file"
                            }).end()
                        } else {
                            // console.log('DONE')
                            if(res.matchedCount == 1) {
                                response.json({
                                    stat: 200,
                                    msg: "uploaded file successfully"
                                }).end()
                            } else {
                                bucket.delete(id, function(err) {
                                    if(err) {
                                        throw err
                                    } else {
                                        // console.log('Deleted')
                                    }
                                })
                                response.json({
                                    stat: 66601,
                                    msg: "user not found"
                                }).end()
                            }
                        }
                    })
                    // console.log('DONE')
                })
            }
        })
    }
}

MongoDBHandler.prototype.getMusic = function(response, username, filename, fileid) {
    if(client.isConnected()) {
        var db = client.db(dbname)
        
        // first to check if the user has the file needed
        db.collection('user_files').find({"user_id": username}).toArray(function(error, resArr) {
            if(error) {
                // console.log(error)
                response.json({
                    stat: 66601,
                    msg: "Failed to find user"
                }).end()
            } else {
                if(resArr[0]) {
                    var userFiles = resArr[0].files
                        // console.log(userFiles)
                        var file, i, len = userFiles.length
                        for(i = 0; i < len; i++) {
                            // console.log(userFiles[i])
                            file = userFiles[i]
                            if(file.file_name == filename && file.file_id == fileid) {
                                // file found
                                // console.log('Hurrah!!!!')
                                break
                            }
                        }

                        if(i < len) {
                            // file found
                            // console.log('found')
                            // console.log(userFiles[i])
                            let bucket = new mongo.GridFSBucket(db, {
                                bucketName: 'music_files'
                            })

                            let downloadStream = bucket.openDownloadStream(new ObjectID(userFiles[i].file_id))

                            downloadStream.on('data', function(chunk) {
                                response.write(chunk)
                            })

                            downloadStream.on('error', function() {
                                response.status(400).json({"msg": "Failed to send file over download"})
                            })

                            downloadStream.on('end', function() {
                                response.end()
                            })
                        } else {
                            response.json({
                                stat: 66603,
                                "msg": "Could not get requested file"
                            }).end()
                        }
                } else {
                    // console.log('User ' + username + ' not found')
                    response.json({
                        stat: 66601,
                        "msg": "user name not found"
                    }).end()
                }
            }
        })
    } else {
        client.connect(function(err) {
            if(err) {
                // console.log(err)
            } else {
                // console.log('Initiated connection to mongodb server')
                var db = client.db(dbname)
                db.collection('user_login').createIndex(
                    {"user_id": 1},
                    {unique: true},
                    function(err, res) {
                        if(err) {
                            throw(err)
                        }
                    }
                )
                db.collection('user_files').createIndex(
                    {"user_id": 1},
                    {unique: true},
                    function(err, res) {
                        if(err) {
                            throw(err)
                        }
                    }
                )

                db.collection('user_files').find({"user_id": username}).toArray(function(error, resArr) {
                    if(error) {
                        // console.log(error)
                        response.json({
                            stat: 66601,
                            msg: "Failed to find user"
                        }).end()
                    } else {
                        if(resArr[0]) {
                            var userFiles = resArr[0].files
                            // console.log(userFiles)
                            var file, i, len = userFiles.length
                            for(i = 0; i < len; i++) {
                                // console.log(userFiles[i])
                                file = userFiles[i]
                                if(file.file_name == filename && file.file_id == fileid) {
                                    // file found
                                    // console.log('Hurrah!!!!')
                                    break
                                }
                            }

                            if(i < len) {
                                // file found
                                // console.log('found')
                                // console.log(userFiles[i])
                                let bucket = new mongo.GridFSBucket(db, {
                                    bucketName: 'music_files'
                                })
    
                                let downloadStream = bucket.openDownloadStream(new ObjectID(userFiles[i].file_id))
    
                                downloadStream.on('data', function(chunk) {
                                    response.write(chunk)
                                })
    
                                downloadStream.on('error', function() {
                                    response.status(400).json({"msg": "Failed to send file over download"})
                                })
    
                                downloadStream.on('end', function() {
                                    response.end()
                                })
                            } else {
                                response.json({
                                    stat: 66603,
                                    "msg": "Could not get requested file"
                                }).end()
                            }
                        } else {
                            // console.log('User ' + username + ' not found')
                            response.json({
                                stat: 66601,
                                "msg": "user name not found"
                            }).end()
                        }
                    }
                })
            }
        })
    }
}

module.exports = {MongoDBHandler}