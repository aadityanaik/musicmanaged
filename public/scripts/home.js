/*import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
*/

// var list_of_files = Array()

$(window).on('pageshow', function() {
    updateFiles()
})

function updateFiles() {
    $.ajax({url: 'http://localhost:5000/api/getMusicFiles', success: function (data) {
        document.getElementById("list_files").innerHTML = ""
        files = Array()
        
        if (data.listFiles) {
            for(var i = 0; i < data.listFiles.length; i++) {
                var element = document.createTextNode(data.listFiles[i].file_name)
                element.id = "userfiles"

                var play = document.createElement("audio")
                play.controls = "controls"
                srcURL = encodeURI("http://localhost:5000/api/getmusicfile?filename=" + data.listFiles[i].file_name +"&fileid=" + data.listFiles[i].file_id)
                // list_of_files.push({source: srcURL})
                files.push({name: data.listFiles[i].file_name, id: data.listFiles[i].file_id})
                play.src = srcURL

                var downloadbtn = document.createElement("a")
                downloadbtn.innerText = "Download"
                downloadbtn.setAttribute("class", "btn btn-primary")
                downloadbtn.id = "downloadBtn"+i
                downloadbtn.href = encodeURI("http://localhost:5000/api/getmusicfile?filename=" + data.listFiles[i].file_name +"&fileid=" + data.listFiles[i].file_id)
                
                var btn = document.createElement("button")
                btn.innerText = "Delete"
                btn.setAttribute("class", "btn btn-primary")
                btn.id = "deleteBtn"+i
                btn.onclick = deleteMusic

                $('#list_files')
                .append("<div class=\" row song-title\">"
                    + "<div class=\"col-lg-8\">"
                        + element.nodeValue
                    + "</div>"
                    + "<div class=\"col-lg-2\">"
                        + "<a class='btn btn-primary' id='download_btn' href=" + encodeURI("http://localhost:5000/api/getmusicfile?filename='" + data.listFiles[i].file_name +"&fileid=" + data.listFiles[i].file_id) + "'>Download</a>"
                    + "</div>"                
                    + "<div class=\"col-lg-2\">"
                        + "<button class='btn btn-danger' id='delete_btn' onclick=deletemusic()>Delete</button>"
                    + "</div>"                
                + "</div>")
                // document.getElementById("list_files").append(element)
                // document.getElementById("list_files").append(play)
                // document.getElementById("list_files").append(downloadbtn)
                // document.getElementById("list_files").append(btn)
                // document.getElementById("list_files").append(document.createElement("br"))
            }
        }
        // list_of_files = Object.assign(list_of_files, files)
    }, cache: false, async: true}).then(function(data, err) {
        // TODO: Set audio paths
    })
}

function deleteMusic() {
    pos = this.id.slice(9)
    
    var file = files[pos].name
    var id = files[pos].id

    var host = window.location.hostname
    var port = window.location.port
    var url = "http://" + host + ":" + port + "/api/deletemusicfile"

    var info = {
        "filename": file,
        "fileid": id
    }

    $.post(url, info, function(data) {
        console.log(data)
        updateFiles()
    }, "json")
}