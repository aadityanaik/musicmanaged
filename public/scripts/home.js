/*import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
*/

// var list_of_files = Array()


currentSong = {
    id : 0,
    playStatus : false,
    currentTime : 0
}

playIconUrl = "url('../assets/jplayer_icons/play-circle-solid.svg') !important"
pauseIconUrl = "url('../assets/jplayer_icons/pause-circle-solid.svg') !important"
console.log(pauseIconUrl  + '\n' + playIconUrl)
var files_global = Array()
var tags_global = Array()
var html_to_append = ""
counter = 0
var dataJSON = Array()
var status = false

$(window).on('pageshow', function () {
    updateFiles()
})


function updateFiles() {
    files_global = Array()
    tags_global = Array()
    dataJSON = Array()
    var host = window.location.hostname
    var protocol = window.location.protocol
    var port = window.location.port

    document.getElementById("list_files").innerHTML = ""

    // // console.log(host, port)

    var url = "http://" + host + ":" + port//  + "/api/getMusicFiles"

    $.ajax({

        url: url + "/api/getMusicFiles", success: function (data) {

            if (data.listFiles) {
                for (var i = 0; i < data.listFiles.length; i++) {
                    counter = i
                    // console.log("COUNTER IS " + counter)
                    var element = document.createTextNode(data.listFiles[i].file_name)
                    element.id = "userfiles"

                    // var play = document.createElement("audio")
                    // play.controls = "controls"
                    srcURL = encodeURI(url + "/api/getmusicfile?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id)
                    // // list_of_files.push({source: srcURL})
                    files_global.push({ name: data.listFiles[i].file_name, id: data.listFiles[i].file_id, source: srcURL })
                    // play.src = srcURL

                    // var downloadbtn = document.createElement("a")
                    // downloadbtn.innerText = "Download"
                    // downloadbtn.setAttribute("class", "btn btn-primary")
                    // downloadbtn.id = "downloadBtn"+i
                    // downloadbtn.href = encodeURI("http://localhost:8080/api/getmusicfile?filename=" + data.listFiles[i].file_name +"&fileid=" + data.listFiles[i].file_id)

                    // var btn = document.createElement("button")
                    // btn.innerText = "Delete"
                    // btn.setAttribute("class", "btn btn-primary")
                    // btn.id = "deleteBtn"+i
                    // btn.onclick = deleteMusic

                    // (url + "/api/getTags?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id)
                    details = Array()
                    tagsURL = encodeURI(url + "/api/getTags?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id)
                    $.ajax({
                        url: tagsURL,
                        dataType: 'json',
                        success: function (data) {
                            // // console.log("The Data Object is: \n" + JSON.stringify(data))
                            // // console.log("The title is:\t" + data.tags.title)  
                            //details.push({title: data.tags.title, artist: data.tags.artist, album :  data.tags.album,year: data.tags.year})
                            dataJSON.push(data.tags)
                            // console.log(dataJSON)
                            // songdetails.push({
                            //     title: JSON.stringify(data.tags.title),
                            //     artist: JSON.stringify(data.tags.artist),
                            //     album: JSON.stringify(data.tags.album),
                            //     year: JSON.stringify(data.tags.year)
                            // })

                        }, async: false

                    }).fail(function () {
                        var data = {
                            title: "Unknown",
                            artist: "Unknown",
                            album: "Unknown",
                            year: 3000
                        }

                        dataJSON.push(data.tags)

                    }).done(function () {
                        // console.log("META-TAGS:" + JSON.stringify(dataJSON))
                        status = true
                    })

                    //Scenes below
                    // console.log("tags are: " + JSON.stringify(dataJSON) + "\nStatus is " + status)

                    var title = "", artist = "", album = "", year = "", pic = "", picArray = null;

                    if (dataJSON[i].title) {
                        title = (JSON.stringify(dataJSON[i].title)).split("\"").join("")
                    } else {
                        title = data.listFiles[i].file_name
                    }
                    if (dataJSON[i].artist) {
                        artist = "<span class = artist>Artist: " + (JSON.stringify(dataJSON[i].artist)).split("\"").join("") + "</span><br>"
                    } else {
                        artist = ""
                    }
                    if (dataJSON[i].album) {
                        album = "<span class = album>Album: " + (JSON.stringify(dataJSON[i].album)).split("\"").join("") + "</span><br>"
                    } else {
                        album = ""
                    }
                    if (dataJSON[i].year && dataJSON[i].year != "NaN") {
                        year = "<span class = year>Year: " + (JSON.stringify(dataJSON[i].year)).split("\"").join("") + "</span>"
                    } else {
                        year = ""
                    }
                    if (dataJSON[i].raw && dataJSON[i].raw.APIC) {
                        console.log(dataJSON[i].raw.APIC)
                        picArray = new Uint8Array(dataJSON[i].raw.APIC.imageBuffer.data)
                        // picBuffer = new ArrayBuffer(picArray, 'binary')
                        pic = new Blob([picArray], { type: 'image/jpeg' })
                        console.log(picArray, pic)
                    } else {
                        pic = new Blob([])
                    }

                    tags_global.push({
                        title: title,
                        artist: artist,
                        album: album,
                        year: year,
                        pic: pic
                    })

                    // console.log("tags are: " + JSON.stringify(dataJSON) + "\nStatus is " + status)
                    html_to_append = "<div class=\"row song-title\">"
                        + "<div class='col-sm-1'>"
                        + "<img class='cover_image img-circle' id='cover_image_" + i + "'></img>"
                        + "</div>"
                        + "<div class=\"col-xs-8 col-sm-8\"><span class = 'title'>"
                        + title + "<br>"
                        + artist
                        + album
                        + year
                        + "</div>"
                        + "<div class=\" col-xs-1 col-sm-1\">"
                        + "<a class='btn-play' id=\"play_btn" + i + "\"><i class='fas fa-play-circle fa-2x'></i></a>"
                        + "</div>"
                        + "<div class=\"col-xs-1 col-sm-1\">"
                        + "<a class=\"btn-download\" id='download_btn" + i + "' href='" + encodeURI(url + "/api/getmusicfile?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id) + "'><i class='fas fa-arrow-circle-down fa-2x'></i></a>"
                        + "</div>"
                        + "<div class=\"col-xs-1 col-sm-1\">"
                        + "<a class='btn-delete' id=\"delete_btn" + i + "\"><i class='fas fa-trash-alt fa-2x'></i></a>"
                        + "</div>"

                    //// console.log("object data is " + JSON.stringify(dataJSON))
                    $.when($(html_to_append).hide().appendTo("#list_files").fadeIn(500))


                    if (picArray) {
                        var imageUrl = URL.createObjectURL(pic)
                        $("#cover_image_" + i).attr("src", imageUrl)
                    } else {
                        console.log(i)
                        console.log()
                        $("#cover_image_" + i).attr("src", "../images/logo1.png")
                    }

                    // $('#list_files')
                    //     .append("<div class=\" row song-title\">"
                    //         + "<div class=\"col-sm-8\">"
                    //         + element.nodeValue
                    //         + "</div>"
                    //         + "<div class=\"col-sm-2\">"
                    //         + "<a class='btn btn-primary' id='download_btn" + i + "' href='" + encodeURI(url + "/api/getmusicfile?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id) + "'>Download</a>"
                    //         + "</div>"
                    //         + "<div class=\"col-sm-2\">"
                    //         + "<button type=\"button\" class='btn btn-danger btn-delete' id=\"delete_btn" + i + "\">Delete</button>"
                    //         + "</div>"
                    //         + "<div class=\"col-sm-2\">"
                    //         + "<a class='btn btn-danger btn-tags' id=\"tags_btn" + i + "\" href='" + encodeURI(url + "/api/getTags?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id) + "'>Get Tags</button>"
                    //         + "</div>"
                    //         + "</div>").fadeIn(500, function () {
                    //             alert("Done")
                    //         })
                    // document.getElementById("list_files").append(element)
                    // document.getElementById("list_files").append(play)
                    // document.getElementById("list_files").append(downloadbtn)
                    // document.getElementById("list_files").append(btn)
                    // document.getElementById("list_files").append(document.createElement("br"))
                }

                if (files_global[0]) {
                    // console.log(files_global[0].source)
                    // console.log(encodeURI(url + "/api/getmusicfile?filename=" + data.listFiles[0].file_name + "&fileid=" + data.listFiles[0].file_id))
                    $("#jquery_jplayer_1").jPlayer({
                        size: {
                            width: "100%"
                        },
                        backgroundColor: "#E50914",
                        ready: function (event) {
                            $(this).jPlayer("setMedia", {
                                title: tags_global[0].title,
                                mp3: encodeURI(url + "/api/getmusicfile?filename=" + data.listFiles[0].file_name + "&fileid=" + data.listFiles[0].file_id), // files_global[0].source
                                mp4: encodeURI(url + "/api/getmusicfile?filename=" + data.listFiles[0].file_name + "&fileid=" + data.listFiles[0].file_id)  // files_global[0].source
                            });
                        },
                        swfPath: "scripts/dist/jplayer",
                        supplied: "mp3,mp4",
                        wmode: "window",
                        useStateClassSkin: true,
                        autoBlur: false,
                        smoothPlayBar: true,
                        keyEnabled: true,
                        remainingDuration: true,
                        toggleDuration: true
                    });
                }


                // .jp-play {
                //     background: url('../assets/jplayer_icons/play-circle-solid.svg') !important;
                // }
                
                // .jp-play-bar {
                //     background: url('../assets/jplayer_icons/progressbar\ 200X15.png') repeat-x !important;
                // }
                
                //PLAY-PAUSE FUNCTIONALITY
                
                $('.jp-play').click(function(){
                    if (currentSong.playStatus == false){
                        //SAME SONG, BUT RESUME
                        console.log('REACHED HERE' + currentSong.playStatus)
                        buttonCorrector(currentSong.id)    
                        document.getElementById('play_btn'+currentSong.id).innerHTML= "<i class='fas fa-pause-circle fa-2x'>"
                        $("#jquery_jplayer_1").jPlayer('play', currentSong.currentTime)
                        currentSong.playStatus = true   
                        $('.jp-play').css("background", String(pauseIconUrl)); 
                    }else {
                        //SAME SONG, BUT PAUSE
                        console.log('REACHED HERE' + currentSong.playStatus)
                        $('#jquery_jplayer_1').jPlayer('pause');
                        document.getElementById('play_btn'+currentSong.id).innerHTML= "<i class='fas fa-play-circle fa-2x'>"
                        currentSong.playStatus = false
                        currentSong.currentTime = $("#jquery_jplayer_1").data('jPlayer').status.currentTime
                        $('.jp-play').css("background", String(pauseIconUrl));
                    }

                })

                $('.btn-play').click(function () {
                    var id = this.id.slice(8)

                    //NEW SONG
                    if(currentSong.id != id){

                        url = "http://" + host + ":" + port
                        buttonCorrector(id)
                        document.getElementById(this.id).innerHTML= "<i class='fas fa-pause-circle fa-2x'>"
                        currentSong.id = id
                        currentSong.playStatus = true
                        currentSong.currentTime = 0
                        $("#jquery_jplayer_1").jPlayer("setMedia", {
                            title: tags_global[id].title,
                            mp3: files_global[id].source, // files_global[0].source
                            mp4: files_global[id].source  // files_global[0].source
                        }).jPlayer('play',currentSong.currentTime)

                        $('.jp-play').css("background", String(pauseIconUrl));

                    }else if (currentSong.playStatus == false){
                        //SAME SONG, BUT RESUME
                        
                        buttonCorrector(id)    
                        document.getElementById(this.id).innerHTML= "<i class='fas fa-pause-circle fa-2x'>"
                        $("#jquery_jplayer_1").jPlayer('play', currentSong.currentTime)
                        currentSong.playStatus = true   
                        $('.jp-play').css("background", String(pauseIconUrl)); 
                    }else {
                        //SAME SONG, BUT PAUSE
                        
                        $('#jquery_jplayer_1').jPlayer('pause');
                        document.getElementById(this.id).innerHTML= "<i class='fas fa-play-circle fa-2x'>"
                        currentSong.playStatus = false
                        currentSong.currentTime = $("#jquery_jplayer_1").data('jPlayer').status.currentTime
                        $('.jp-play').css("background", String(playIconUrl));
                    
                    }
                })

                function buttonCorrector(id){
                    console.log("ID is" + id)
                    console.log("len is " + files_global.length)
                    for (let i=0; i < files_global.length;i++){
                        if( i != id ){
                            document.getElementById('play_btn' + i).innerHTML = "<i class='fas fa-play-circle fa-2x'>"
                        }
                    }
                }

                //Deletion function
                $('.btn-delete').click(function () {
                    // console.log("In delete function")
                    pos = this.id.slice(10)

                    // // console.log(files[pos], pos)

                    var file = files_global[pos].name
                    var id = files_global[pos].id

                    var host = window.location.hostname
                    var port = window.location.port
                    var url = "http://" + host + ":" + port + "/api/deletemusicfile"

                    var info = {
                        "filename": file,
                        "fileid": id
                    }

                    $.post(url, info, function (data) {
                        // console.log(data)
                        updateFiles()
                    }, "json")
                })


            }
            // list_of_files = Object.assign(list_of_files, files)
        }, cache: false, async: true
    }).then(function (data, err) {
        // TODO: Set audio paths
    })



}








// $('song-row')

// function deleteMusic() {
//     // console.log("fds")
//     pos = this.id.slice(10)

//     var file = files[pos].name
//     var id = files[pos].id

//     var host = window.location.hostname
//     var port = window.location.port
//     var url = "http://" + host + ":" + port + "/api/deletemusicfile"

//     var info = {
//         "filename": file,
//         "fileid": id
//     }

//     $.post(url, info, function(data) {
//         // console.log(data)
//         updateFiles()
//     }, "json")
// }