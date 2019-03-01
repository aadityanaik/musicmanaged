/*import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
*/
$.get('http://localhost:5000/api/getMusicFiles', function(data) {
    if(data.listFiles) {
        data.listFiles.forEach(file => {
            var element = document.createTextNode(file.file_name + " with id- " + file.file_id)
            element.name = "userfiles"
            document.getElementById("listFiles").append(element)
        });
    }
})