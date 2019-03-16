const ID3Writer = require('browser-id3-writer')
const ID3Parser = require('id3-parser')
global.onChange = function(){
    var files = document.upload_file_form.file.files
    var file = files[0]
    if (files[0].type.lastIndexOf("audio/", 0) == 0) {
        var fileBuffer = new ArrayBuffer(file)
        const tags = ID3Parser.parse(fileBuffer) 
        console.log('tags are : ' + tags)
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

    metadata = [song_title, artist, album, release]

    if (files[0].type.lastIndexOf("audio/", 0) == 0) {
        // var username = document.getElementById('uploadSongUName').value
        var file = files[0]
        var host = window.location.hostname
        var port = window.location.port
        var url = "http://" + host + ":" + port + "/api/addmusicfile"
        var fileBuffer = new ArrayBuffer(file)
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

    metadata.forEach(element => {
        console.log(element)
    });

}