/*import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
*/

files = Array()

$(window).on('pageshow', function() {
    updateFiles()
})

function updateFiles(){
    $.ajax({url: 'http://localhost:5000/api/getMusicFiles', success: function (data) {
        document.getElementById("listFiles").innerHTML = ""
        if (data.listFiles) {
            for(var i = 0; i < data.listFiles.length; i++) {
                var element = document.createTextNode(data.listFiles[i].file_name + " with id- " + data.listFiles[i].file_id)
                files.push({name: data.listFiles[i].file_name, id: data.listFiles[i].file_id})
                element.id = "userfiles"
                var btn = document.createElement("button")
                btn.innerText = "Delete"
                btn.setAttribute("class", "btn btn-primary")
                btn.id = "deleteBtn"+i
                btn.onclick = deleteMusic
                document.getElementById("listFiles").append(element)
                document.getElementById("listFiles").append(btn)
                document.getElementById("listFiles").append(document.createElement("br"))
            }
        }
    }, cache: false})
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