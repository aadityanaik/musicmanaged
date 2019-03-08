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

        var formdata = new FormData()
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
            console.log(data)
        })
    }

    metadata.forEach(element => {
        console.log(element)
    });

}