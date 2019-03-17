const ID3Writer = require('browser-id3-writer')
var jsmediatags = require('jsmediatags')

global.onChange = function(){
    var files = document.upload_file_form.file.files
    var file = files[0]
    if (files[0].type.lastIndexOf("audio/mpeg", 0) == 0 || files[0].type == "audio/mp3") {
        // var filereader = new FileReader()
        // var fileBuffer

        // filereader.readAsArrayBuffer(file)

        // filereader.onload = function(evt) {
        //     if(evt.target.readyState == FileReader.DONE) {
        //         fileBuffer = evt.target.result
        //         console.log(fileBuffer)
        //         const tags = ID3Parser.parse(fileBuffer) 
        //         console.log('tags are : ' + tags)
        //     }
        // }

        jsmediatags.read(file, {
            onSuccess: function(tag) {
                console.log(tag)
                document.upload_file_form.song_title.value = tag.tags.title
                document.upload_file_form.album.value = tag.tags.album
                document.upload_file_form.year.value = tag.tags.year
                document.upload_file_form.artist.value = tag.tags.artist
            },
            onError: function(error) {
                console.log(error)
            }
        })
    };
}


global.uploadFile = function() {

    var files = document.upload_file_form.file.files
    console.log('In the function')
    console.log(files[0])

    var song_title = document.upload_file_form.song_title.value
    var artist = document.upload_file_form.artist.value
    artist = artist.split(",")
    var releaseYear = document.upload_file_form.year.value
    var album = document.upload_file_form.album.value

    metadata = [song_title, artist, album, releaseYear]

    if (files[0].type.lastIndexOf("audio/mpeg", 0) == 0 || files[0].type == "audio/mp3") {
        var filereader = new FileReader()
        // var username = document.getElementById('uploadSongUName').value
        var file = files[0]
        var host = window.location.hostname
        var port = window.location.port
        var url = "http://" + host + ":" + port + "/api/addmusicfile"
        var fileBuffer;
        filereader.readAsArrayBuffer(file);
        filereader.onload = function(evt) {
            if (evt.target.readyState == FileReader.DONE) {
                fileBuffer = evt.target.result
                console.log(fileBuffer)
                const writer = new ID3Writer(fileBuffer);
                writer.setFrame('TIT2', song_title)
                    .setFrame('TPE1', artist)
                    .setFrame('TALB', album)
                    .setFrame('TYER', releaseYear);
                writer.addTag();

                console.log(writer.arrayBuffer)
                var taggedFile = new File([writer.arrayBuffer], file.name)
                var formdata = new FormData()
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
                    if(data.stat){ 
                        if(data.stat == 200) {
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
        alert('Only mp3 files allowed: Format for this is ' + files[0].type)
    }

    metadata.forEach(element => {
        console.log(element)
    });

}