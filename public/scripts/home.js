/*import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
*/

// var list_of_files = Array()

var files_global = Array()

$(window).on('pageshow', function () {
    updateFiles()
})

function updateFiles() {

    var host = window.location.hostname
    var protocol = window.location.protocol
    var port = window.location.port

    // console.log(host, port)

    var url = "http://" + host + ":" + port//  + "/api/getMusicFiles"

    $.ajax({
        url: url + "/api/getMusicFiles", success: function (data) {
            document.getElementById("list_files").innerHTML = ""
            files = Array()
            song_array = Array()
            if (data.listFiles) {
                for (var i = 0; i < data.listFiles.length; i++) {
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
                    var details = Array()
                    // (url + "/api/getTags?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id)
                    tagsURL = encodeURI(url + "/api/getTags?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id)
                    $.ajax({
                        url: tagsURL, 
                        dataType: 'json',
                        success: function(data){
                            console.log("The Data Object is: \n" + JSON.stringify(data))
                            console.log("The title is:\t" + data.tags.title)  
                            //details.push({title: data.tags.title, artist: data.tags.artist, album :  data.tags.album,year: data.tags.year})
                        }
                        
                    })

                    var html_to_append = "<div class=\" row song-title\">"
                        + "<div class=\"col-sm-9\"><br><span class = 'title'>"
                        +details
                        +"</span><br><span class = artist>"
                        +details
                        + "</span>"
                        + "</div>"
                        + "<div class=\"col-sm-1\">"
                        + "<a class='btn btn-primary' id='download_btn" + i + "' href='" + encodeURI(url + "/api/getmusicfile?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id) + "'>Download</a>"
                        + "</div>"
                        + "<div class=\"col-sm-1\">"
                        + "<button type=\"button\" class='btn btn-danger btn-delete' id=\"delete_btn" + i + "\">Delete</button>"
                        + "</div>"
                        + "<div class=\"col-sm-1\">"
                        + "<a class='btn btn-danger btn-tags' id=\"tags_btn" + i + "\" href='" + encodeURI(url + "/api/getTags?filename=" + data.listFiles[i].file_name + "&fileid=" + data.listFiles[i].file_id) + "'>Get Tags</button>"
                        + "</div>"
                        + "</div>"

                    $(html_to_append).hide().appendTo("#list_files").fadeIn(500)
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

                $('#player').attr("src", files_global[0].source)

                //Deletion function
                $('.btn-delete').click(function () {
                    pos = this.id.slice(10)

                    // console.log(files[pos], pos)

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
                        console.log(data)
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
//     console.log("fds")
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
//         console.log(data)
//         updateFiles()
//     }, "json")
// }