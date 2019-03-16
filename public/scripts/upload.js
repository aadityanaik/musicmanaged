const ID3Writer = require('browser-id3-writer')

function uploadFile() {

    var files = document.upload_file_form.file.files
    console.log('In the function')
    console.log(files[0])

    var song_title = document.upload_file_form.song_title.value
    var artist = document.upload_file_form.artist.value
    var release = document.upload_file_form.year.value
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
        writer.setFrame('TIT2', 'Home')
            .setFrame('TPE1', ['Eminem', '50 Cent'])
            .setFrame('TALB', 'Friday Night Lights')
            .setFrame('TYER', 2004);
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