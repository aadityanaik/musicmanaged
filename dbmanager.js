var mysql = require('mysql')
var bcrypt = require('bcrypt')
var fs = require('fs')
saltRounds = 10;

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
                    "PASSWORD TEXT NOT NULL" +
                    ");"

        connection.query(query, function(error, res) {
            if(error) {
                throw error
            } else {
                console.log('Connection initialized 1/2');
            }
        })

        var query = "CREATE TABLE IF NOT EXISTS AUDIO_FILES(" +
                    "USERNAME VARCHAR(50) NOT NULL," +
                    "FILE_NAME TEXT NOT NULL," +
                    "MUSIC_FILE_PATH TEXT NOT NULL,"+
                    "FILE_TYPE TEXT NOT NULL," +
                    "FOREIGN KEY (USERNAME) REFERENCES USER_LOGIN(USERNAME)" +
                    ");"

        connection.query(query, function(error, res) {
            if(error) {
                throw error
            } else {
                console.log('Connection initialized 2/2');
            }
        })
    }
})

function DBHandler() {
    this.conn = connection
}

DBHandler.prototype.addUser = function(response, username, password) {

    var handlerConn = this.conn

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // first make the respective dir in the file system
            fs.mkdir(__dirname + '/media/' + username, function(error) {
                if(error) {
                    response.json(error)
                    response.end()
                } else {
                    var sqlQuery = "INSERT INTO USER_LOGIN VALUES(\'" + username + "\', \'" + hash + "\');"
                    handlerConn.query(sqlQuery, function(error2, res) {
                        if(error) {
                            response.json(error2)
                            response.end()
                        } else {
                            response.json(res)
                            response.end()
                        }
                    })
                }
            })
        })
    })
}

DBHandler.prototype.checkCredentials = function(response, username, enteredPass) {
    var sqlQuery = "SELECT PASSWORD FROM USER_LOGIN WHERE USERNAME='" + username + "';"
    this.conn.query(sqlQuery, function(error, res) {
        if(error) {
            response.json(error)
            response.end()
        }

        // since usrname is unique, only 1 password returned
        try {
            registeredPass = res[0].PASSWORD
            bcrypt.compare(enteredPass, registeredPass, function(err, res) {
                if(err) {
                    response.json(err)
                    response.end()
                } else {
                    response.json(res)
                    response.end()
                }
            })
        } catch (e) {
            response.json(false)
            response.end()
        }
    })
}

DBHandler.prototype.addMusic = function(response, username, fileName, filepath, filetype, fileBuffer) {
    // first check if the user exists

    var existQuery = "SELECT COUNT(USERNAME) AS NUMUSER FROM USER_LOGIN WHERE USERNAME='" + username + "';"

    var sqlQuery = "INSERT INTO AUDIO_FILES SET ?",
        values = {
            USERNAME: username,
            FILE_NAME: fileName,
            MUSIC_FILE_PATH: filepath,
            FILE_TYPE: filetype
        }

    var connHandler = this.conn

    this.conn.query(existQuery, function(err, res) {
        if(err) {
            response.json(err)
            response.end()
        } else {
            if(res[0].NUMUSER == 1) {
                // we first make the necessary directories
                fs.stat(filepath, function(err, stat) {
                    if(err) {
                        // directory does not exist
                        fs.mkdir(filepath, function(err2) {
                            if(err2) {
                                console.log('Can\'t make ' + filepath)
                                response.json({status: 200, code: "ERR_CANNOT_MAKE_DIR"})
                                response.end()
                            } else {
                                // dir made

                                // we first write to file system
                                console.log(fileBuffer)

                                fs.writeFile(filepath + fileName, fileBuffer, function(fwriteErr) {
                                    if(fwriteErr) {
                                        response.json({code: "GODDAMMIT"})
                                    } else {
                                        console.log('Done writing file')
                                        // now to insert data into db
        
                                        connHandler.query(sqlQuery, values, function(err3, res) {
                                            if(err3) {
                                                response.json(err3)
                                                response.end()
                                            } else {
                                                response.json(res)
                                                response.end()
                                            }
                                        })
                                    }
                                })

                                /*
                                var fstream = fs.createWriteStream(filepath + fileName)
                                fstream.on('close', function() {
                                    console.log('Done writing file')
                                    // now to insert data into db

                                    connHandler.query(sqlQuery, values, function(err3, res) {
                                        if(err3) {
                                            response.json(err3)
                                            response.end()
                                        } else {
                                            response.json(res)
                                            response.end()
                                        }
                                    })
                                })
                                */
                            }
                        })
                    } else {
                        // dir exists
                        // code repeated

                        console.log(fileBuffer)

                        fs.writeFile(filepath + fileName, fileBuffer, function(fwriteErr) {
                            if(fwriteErr) {
                                response.json({code: "GODDAMMIT"})
                            } else {
                                console.log('Done writing file')
                                // now to insert data into db

                                connHandler.query(sqlQuery, values, function(err3, res) {
                                    if(err3) {
                                        response.json(err3)
                                        response.end()
                                    } else {
                                        response.json(res)
                                        response.end()
                                    }
                                })
                            }
                        })

                        /*
                        var fstream = fs.createWriteStream(filepath + fileName)

                        fstream.on('close', function() {
                            
                        })
                        */
                    }
                })
            } else {
                var info = {
                    status: 200,
                    code: "ERR_NO_USER"
                }
                response.json(info)
                response.end()
            }
        }
    })
}

DBHandler.prototype.getMusic = function(response, username, filename) {
    var sqlQuery = "SELECT MUSIC_FILE_PATH, FILE_TYPE FROM AUDIO_FILES WHERE USERNAME='" + username + "' AND FILE_NAME='" + filename + "';"

    this.conn.query(sqlQuery, function(err, res) {
        if(err) {
            response.json(err)
            response.end()
        } else {
            var filePath = res[0].MUSIC_FILE_PATH + filename

            console.log(filePath)
            var stat = fs.statSync(filePath)
            console.log(stat.size)

            response.attachment(filePath)
            response.type(res[0].FILE_TYPE)

            response.download(filePath, filename, function(error) {
                if(err) {
                    console.log(error)
                }
            })

            /*
            response.header('Content-Type', res[0].FILE_TYPE)
            var stat = fs.statSync(filePath)
            response.header('Content-Length', stat.size)

            var readStream = fs.createReadStream(filePath)
            readStream.pipe(response)
            */

            //response.header('Content-Type', res[0].FILE_TYPE)
            //response.header('Content-Length', res[0].MUSIC_FILE.length)        
        }
    })
}

// TODO:
// REMOVE THIS FUNCTION IN PRODUCTION
// This is only meant for verifying files and saves the files to disk
DBHandler.prototype.saveMusic = function(username, fileName) {
    var nothersqlQuery = "SELECT MUSIC_FILE FROM AUDIO_FILES WHERE USERNAME='" + username + "' AND FILE_NAME='" + fileName + "';"

    this.conn.query(nothersqlQuery, function(err, res) {
        if(err) {
            console.log('SHITE')
        } else {
            console.log('NOT SHITE')
            console.log(res[0].MUSIC_FILE)
            fs.writeFile(fileName, res[0].MUSIC_FILE, function(err) {
                console.log(err)
            })
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

    this.conn.query(sqlQuery, function getRes(error, res) {
        if(error) {
            response.json(error)
            response.end()
        } else {
            response.json(res)
            response.end()
        }
    })
}

module.exports = {DBHandler}