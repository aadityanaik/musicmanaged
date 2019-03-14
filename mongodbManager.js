var MongoClient = require('mongodb').MongoClient
var mongo = require('mongodb')

const ObjectID = require('mongodb').ObjectID;
const { Readable } = require('stream')

var url = null; // = 'mongodb://' + (process.env.MONGODB_SERVICE_HOST || "localhost") + ":27017" || process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL
if(process.env.MONGODB_SERVICE_HOST) {
    url = 'mongodb://userM50:W1HXofCorwaGfWGV@' + process.env.MONGODB_SERVICE_HOST + ":27017"
} else {
    url = 'mongodb://localhost:27017'
}

const dbname = 'musicmanaged'

const client = new MongoClient(url)

var bcrypt = require('bcrypt-nodejs')

const saltRounds = 10

function MongoDBHandler() { }

MongoDBHandler.prototype.createConnectionIfNotThere = function () {
    if (!client.isConnected()) {
        console.log('Connecting at ' + url)
        console.log(process.env)
        client.connect(function (connectErr, res) {
            if (connectErr) {
                throw (connectErr)
            } else {
                console.log('Initiated connection to mongodb server')
                var db = client.db(dbname)
                
                db.collection('user_login').createIndex(
                    { "user_id": 1 },
                    { unique: true },
                    function (err, res) {
                        if (err) {
                            console.log(err)
                            throw (err)
                        }
                    }
                )

                db.collection('user_files').createIndex(
                    { "user_id": 1 },
                    { unique: true },
                    function (err, res) {
                        if (err) {
                            throw (err)
                        }
                    }
                )        
            }
        })
    }
}


MongoDBHandler.prototype.addUser = function (username, password, callback) {
    console.log('Trying to add user ' + username)
    // alert("Trying to add user" + username)

    let success = false

    if (password == "") {
        message = "No password entered"
        callback(66600, message)
    }

    bcrypt.genSalt(saltRounds, function (error, salt) {
        if (error) {
            // console.log(error)
            callback(66600, error)
        } else {
            bcrypt.hash(password, salt, null, function (hashErr, hash) {
                if (hashErr) {
                    callback(66600, hashErr)
                } else {
                    var db = client.db(dbname)

                    db.collection('user_login').insertOne({ "user_id": username, "pass": hash }, function (insertErr, res) {
                        if (insertErr) {
                            console.log(insertErr + "Here")
                            message = ''
                            if (insertErr['code'] == 11000) {
                                message = 'username already taken'
                            } else {
                                message = 'reason unknown'
                            }
                            callback(66600, message)
                        } else {
                            db.collection('user_files').insertOne({ "user_id": username, "files": [] }, function (anotherInsertErr, otherRes) {
                                if (anotherInsertErr) {
                                    // console.log(anotherInsertErr)
                                    if (anotherInsertErr['code'] == 11000) {
                                        message = 'username already taken'
                                    } else {
                                        message = 'reason unknown'
                                    }

                                    callback(66600, "Could not insert user-" + message)
                                } else {
                                    callback(200, "Successfully added user", username)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

MongoDBHandler.prototype.checkCredentials = function (username, enteredPass, callback) {
    // if(client.isConnected()) {
    var db = client.db(dbname)
    db.collection('user_login').find({ "user_id": username }).toArray(function (err, res) {
        if (err) {
            callback(500, "something diabolical happened")
        } else {
            if (res[0]) {
                var password = res[0].pass
                bcrypt.compare(enteredPass, password, function (bcryptErr, bcryptRes) {
                    if (bcryptErr) {
                        callback(500, "something diabolical happened")
                    } else {
                        // console.log(bcryptRes)

                        stat = 200
                        if (bcryptRes == false) {
                            stat = 696
                            callback(696, "authenticated- " + bcryptRes)
                        } else {
                            callback(200, "authenticated- " + bcryptRes, username)
                        }
                    }
                })
            } else {

                callback(66601, "No user " + username + " found")
            }
        }
    })
    // } else {

    // }
}

MongoDBHandler.prototype.addMusic = function (username, fileName, fileBuffer, callback) {
    //if(client.isConnected()) {
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

    uploadStream.on('error', function () {
        // console.log('YIKES')
        callback(66604, "Failed to upload file")
    })

    uploadStream.on('finish', function () {
        // console.log(id)
        db.collection('user_files').updateOne({ "user_id": username }, {
            $push: {
                "files": {
                    "file_name": fileName,
                    "file_id": id.toString()
                }
            }
        }, function (err, res) {
            if (err) {

                callback(66604, "Failed to upload file")

            } else {
                // console.log('DONE')
                if (res.matchedCount == 1) {

                    callback(200, "uploaded file successfully")
                } else {
                    bucket.delete(id, function (err) {
                        if (err) {
                            throw err
                        } else {
                            // console.log('Deleted')
                        }
                    })
                    callback(66601, "No user " + username + " found")
                }
            }
        })
        // console.log('DONE')
    })
}

MongoDBHandler.prototype.getMusic = function (username, filename, fileid, callback) {
    // if(client.isConnected()) {
    var db = client.db(dbname)

    // first to check if the user has the file needed
    db.collection('user_files').find({ "user_id": username }).toArray(function (error, resArr) {
        if (error) {
            callback(66601, "No user " + username + " found")
        } else {
            if (resArr[0]) {
                var userFiles = resArr[0].files
                // console.log(userFiles)
                var file, i, len = userFiles.length
                for (i = 0; i < len; i++) {
                    // console.log(userFiles[i])
                    file = userFiles[i]
                    if (file.file_name == filename && file.file_id == fileid) {
                        // file found
                        // console.log('Hurrah!!!!')
                        break
                    }
                }

                if (i < len) {
                    // file found
                    // console.log('found')
                    // console.log(userFiles[i])
                    let bucket = new mongo.GridFSBucket(db, {
                        bucketName: 'music_files'
                    })

                    let downloadStream = bucket.openDownloadStream(new ObjectID(userFiles[i].file_id))

                    downloadStream.on('data', function (chunk) {
                        callback(0, 0, true, chunk, false)
                    })

                    downloadStream.on('error', function () {
                        callback(400, "Failed to send file over download")
                    })

                    downloadStream.on('end', function () {
                        callback(0, 0, false, 0, true)
                    })
                } else {
                    callback(66603, "Could not get requested file")
                }
            } else {

                callback(66601, "No user " + username + " found")
            }
        }
    })
    // } else {
}

MongoDBHandler.prototype.getMusicList = function (username, callback) {
    var db = client.db(dbname)

    db.collection('user_files').find({ "user_id": username }).toArray(function (err, resArr) {
        if (err) {
            callback(66601, "No user " + username + " found")
        } else if (resArr[0]) {
            callback(200, "All ok", resArr[0].files)
        }
    })
}

MongoDBHandler.prototype.deleteMusic = function (username, filename, fileid, callback) {
    var db = client.db(dbname)

    db.collection('user_files').find({"user_id": username}).toArray(function(err, resArr) {
        if(err) {
            callback(66601, "No user " + username + " found")
        } else {
            if(resArr[0]) {
                var userFiles = resArr[0].files
                var file, i, len = userFiles.length
                for (i = 0; i < len; i++) {
                    // console.log(userFiles[i])
                    file = userFiles[i]
                    if (file.file_name == filename && file.file_id == fileid) {
                        // file found
                        // console.log('Hurrah!!!!')
                        break
                    }
                }

                if (i < len) {
                    // file found
                    // console.log('found')
                    // console.log(userFiles[i])
                    let bucket = new mongo.GridFSBucket(db, {
                        bucketName: 'music_files'
                    })

                    bucket.delete(new ObjectID(userFiles[i].file_id), function(err) {
                        if(err) {
                            db.collection('user_files').updateOne({ "user_id": username }, {
                                $pull: {
                                    "files": {
                                        "file_name": filename,
                                        "file_id": fileid.toString()
                                    }
                                }
                            }, function(err, res) {
                                if(err) {
                                    callback(66605, "Could not delete file")
                                } else {
                                    callback(200, "Deleted file successfully")
                                }
                            })
                        } else {
                            db.collection('user_files').updateOne({ "user_id": username }, {
                                $pull: {
                                    "files": {
                                        "file_name": filename,
                                        "file_id": fileid.toString()
                                    }
                                }
                            }, function(err, res) {
                                if(err) {
                                    callback(66605, "Could not delete file")
                                } else {
                                    callback(200, "Deleted file successfully")
                                }
                            })
                        }
                    })
                } else {
                    callback(66603, "Could not get requested file")
                }
            }
        }
    })
}

module.exports = { MongoDBHandler }