const ID3Writer = require('browser-id3-writer')
var jsmediatags = require('jsmediatags')

global.picFile = null;

global.onChange = function () {
    picFile = null;
    var files = document.upload_file_form.file.files
    var file = files[0]
    if (files[0].type.lastIndexOf("audio/mpeg", 0) == 0 || files[0].type == "audio/mp3") {

        jsmediatags.read(file, {
            onSuccess: function (tag) {
                console.log(tag)
                document.upload_file_form.song_title.value = tag.tags.title
                document.upload_file_form.album.value = tag.tags.album
                document.upload_file_form.year.value = tag.tags.year
                document.upload_file_form.artist.value = tag.tags.artist
                if(tag.tags.picture) {
                    var picArray = new Uint8Array(tag.tags.picture.data)
                    var pic = new Blob([picArray], {type: tag.tags.picture.format})
                    picFile = new File([pic], 'coverimage', {type: tag.tags.picture.format})
                    picURL = URL.createObjectURL(pic)
                    console.log(picURL)
                    $('#cover_image').attr('src', picURL)
                } else {
                    picFile = null
                    console.log('stuff')
                    document.upload_file_form.cover_art.value = ""
                    $('#cover_image').attr('src', 'images/logo1.png')
                }
            },
            onError: function (error) {
                picFile = null
                console.log(error)
                document.upload_file_form.song_title.value = ""
                document.upload_file_form.album.value = ""
                document.upload_file_form.year.value = ""
                document.upload_file_form.artist.value = ""
                document.upload_file_form.cover_art.value = ""
                $('#cover_image').attr('src', 'images/logo1.png')
            }
        })
    };
}

global.onCoverArtChange = function() {
    var cover = document.upload_file_form.cover_art.files
    var file = cover[0]
    console.log(file)
    if(file && file.type.lastIndexOf("image/", 0) == 0) {
        picFile = file
        $('#cover_image').attr('src', URL.createObjectURL(file))
    } else {
        picFile = null;
        $('#cover_image').attr('src', 'images/logo1.png');
    }
}


global.uploadFile = function () {

    var files = document.upload_file_form.file.files
    console.log('In the function')
    console.log(files[0])

    var song_title = document.upload_file_form.song_title.value
    var artist = document.upload_file_form.artist.value
    artist = artist.split(",")
    var releaseYear = document.upload_file_form.year.value
    var album = document.upload_file_form.album.value
    var cover = document.upload_file_form.cover_art.files
    if (cover[0]) {
        cover = cover[0]
    } else {
        cover = ""
        if(picFile != null) {
            cover = picFile
        }
    }

    console.log(cover)

    var writer

    metadata = [song_title, artist, album, releaseYear]

    if (files[0].type.lastIndexOf("audio/mpeg", 0) == 0 || files[0].type == "audio/mp3") {
        var filereader = new FileReader()
        // var username = document.getElementById('uploadSongUName').value
        var file = files[0]
        var host = window.location.hostname
        var port = window.location.port
        var url = "http://" + host + ":" + port + "/api/addmusicfile"
        var formdata = new FormData()
        jsmediatags.read(file, {
            onSuccess: function (tag) {
                console.log(tag)
                formdata.append('data', file)

                filereader.readAsArrayBuffer(file);
                filereader.onload = function (evt) {
                    if (evt.target.readyState == FileReader.DONE) {
                        fileBuffer = evt.target.result
                        writer = new ID3Writer(fileBuffer)
                        writer.removeTag()

                        writer = new ID3Writer(writer.arrayBuffer)

                        if (song_title != "" || artist != "" || album != "" || releaseYear != "" || cover != "") {
                            writer.setFrame('TIT2', song_title)
                                .setFrame('TPE1', artist)
                                .setFrame('TALB', album)
                                .setFrame('TYER', releaseYear);

                            console.log("Cover is-")
                            console.log(cover)

                            if (cover != "") {
                                coverreader = new FileReader()
                                coverreader.readAsArrayBuffer(cover)
                                coverreader.onload = function (evt) {
                                    if (evt.target.readyState == FileReader.DONE) {
                                        coverBuffer = evt.target.result
                                        console.log(coverBuffer)
                                        writer.setFrame('APIC', {
                                            type: 3,
                                            data: coverBuffer,
                                            description: 'Cover Art'
                                        })

                                        writer.addTag()
                                        var taggedFile = new File([writer.arrayBuffer], file.name)


                                        console.log("Final Tags-")
                                        jsmediatags.read(writer.getBlob(), {
                                            onSuccess: function (tags) {
                                                for (var key in tags.tags) {
                                                    console.log(key)
                                                    console.log(tags.tags[key])
                                                }
                                            },
                                            onError: function (error) {
                                                console.log(error)
                                            }
                                        })

                                        formdata.append('data', taggedFile)
                                        //formdata.append('username', username)
                                        formdata.append('name', file.name)
                                        //formdata.append('metadata', )

                                        $.ajax({
                                            url: url,
                                            type: "POST",
                                            data: formdata,
                                            contentType: false,
                                            processData: false
                                        }).done(function (data) {
                                            if (data.stat) {
                                                if (data.stat == 200) {
                                                    alert('Uploaded successfully')
                                                } else {
                                                    alert('Error- ' + data.msg)
                                                }
                                            } else {
                                                console.log(data)
                                            }
                                        })
                                    }
                                }
                            } else {
                                writer.addTag();
                                var taggedFile = new File([writer.arrayBuffer], file.name)


                                console.log("Final Tags-")
                                jsmediatags.read(writer.getBlob(), {
                                    onSuccess: function (tags) {
                                        for (var key in tags.tags) {
                                            console.log(key)
                                            console.log(tags.tags[key])
                                        }
                                    },
                                    onError: function (error) {
                                        console.log(error)
                                    }
                                })

                                formdata.append('data', taggedFile)
                                //formdata.append('username', username)
                                formdata.append('name', file.name)
                                //formdata.append('metadata', )

                                $.ajax({
                                    url: url,
                                    type: "POST",
                                    data: formdata,
                                    contentType: false,
                                    processData: false
                                }).done(function (data) {
                                    if (data.stat) {
                                        if (data.stat == 200) {
                                            alert('Uploaded successfully')
                                        } else {
                                            alert('Error- ' + data.msg)
                                        }
                                    } else {
                                        console.log(data)
                                    }
                                })
                            }
                        } else {
                            formdata.append('data', file)
                            //formdata.append('username', username)
                            formdata.append('name', file.name)
                            //formdata.append('metadata', )

                            $.ajax({
                                url: url,
                                type: "POST",
                                data: formdata,
                                contentType: false,
                                processData: false
                            }).done(function (data) {
                                if (data.stat) {
                                    if (data.stat == 200) {
                                        alert('Uploaded successfully')
                                    } else {
                                        alert('Error- ' + data.msg)
                                    }
                                } else {
                                    console.log(data)
                                }
                            })
                        }
                    }
                }

            },
            onError: function (error) {
                console.log(error + " In the error place and shit")
                var fileBuffer;
                filereader.readAsArrayBuffer(file);
                filereader.onload = function (evt) {
                    if (evt.target.readyState == FileReader.DONE) {
                        fileBuffer = evt.target.result
                        console.log(fileBuffer)
                        writer = new ID3Writer(fileBuffer);
                        if (song_title != "" || artist != "" || album != "" || releaseYear != "" || cover != "") {
                            writer.setFrame('TIT2', song_title)
                                .setFrame('TPE1', artist)
                                .setFrame('TALB', album)
                                .setFrame('TYER', releaseYear);

                            console.log("Cover is-")
                            console.log(cover)

                            if (cover != "") {
                                coverreader = new FileReader()
                                coverreader.readAsArrayBuffer(cover)
                                coverreader.onload = function (evt) {
                                    if (evt.target.readyState == FileReader.DONE) {
                                        coverBuffer = evt.target.result
                                        writer.setFrame('APIC', {
                                            type: 3,
                                            data: coverBuffer,
                                            description: 'Cover Art'
                                        })

                                        writer.addTag()

                                        console.log("Final Tags-")
                                        jsmediatags.read(writer.getBlob(), {
                                            onSuccess: function (tags) {
                                                console.log(tags)
                                            },
                                            onError: function (error) {
                                                console.log(error)
                                            }
                                        })

                                        console.log(writer.arrayBuffer)
                                        var taggedFile = new File([writer.arrayBuffer], file.name)
                                        formdata.append('data', taggedFile)
                                        //formdata.append('username', username)
                                        formdata.append('name', file.name)
                                        //formdata.append('metadata', )

                                        $.ajax({
                                            url: url,
                                            type: "POST",
                                            data: formdata,
                                            contentType: false,
                                            processData: false
                                        }).done(function (data) {
                                            if (data.stat) {
                                                if (data.stat == 200) {
                                                    alert('Uploaded successfully')
                                                } else {
                                                    alert('Error- ' + data.msg)
                                                }
                                            } else {
                                                console.log(data)
                                            }
                                        })
                                    }
                                }
                            } else {
                                writer.addTag();
                                console.log("Final Tags-")
                                jsmediatags.read(writer.getBlob(), {
                                    onSuccess: function (tags) {
                                        console.log(tags)
                                    },
                                    onError: function (error) {
                                        console.log(error)
                                    }
                                })

                                console.log(writer.arrayBuffer)
                                var taggedFile = new File([writer.arrayBuffer], file.name)
                                formdata.append('data', taggedFile)
                                //formdata.append('username', username)
                                formdata.append('name', file.name)
                                //formdata.append('metadata', )

                                $.ajax({
                                    url: url,
                                    type: "POST",
                                    data: formdata,
                                    contentType: false,
                                    processData: false
                                }).done(function (data) {
                                    if (data.stat) {
                                        if (data.stat == 200) {
                                            alert('Uploaded successfully')
                                        } else {
                                            alert('Error- ' + data.msg)
                                        }
                                    } else {
                                        console.log(data)
                                    }
                                })
                            }
                        } else {
                            formdata.append('data', file)
                            //formdata.append('username', username)
                            formdata.append('name', file.name)
                            //formdata.append('metadata', )

                            $.ajax({
                                url: url,
                                type: "POST",
                                data: formdata,
                                contentType: false,
                                processData: false
                            }).done(function (data) {
                                if (data.stat) {
                                    if (data.stat == 200) {
                                        alert('Uploaded successfully')
                                    } else {
                                        alert('Error- ' + data.msg)
                                    }
                                } else {
                                    console.log(data)
                                }
                            })
                        }
                    }
                }
            }
        })

    } else {
        alert('Only mp3 files allowed: Format for this is ' + files[0].type)
    }

    metadata.forEach(element => {
        console.log(element)
    });

}