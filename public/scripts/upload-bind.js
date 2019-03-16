(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.ID3Writer=t()}(this,function(){"use strict";function r(e){return String(e).split("").map(function(e){return e.charCodeAt(0)})}function u(e){return new Uint8Array(r(e))}function h(e){var t=new Uint8Array(2*e.length);return new Uint16Array(t.buffer).set(r(e)),t}return function(){var e=t.prototype;function t(e){if(!(e&&"object"==typeof e&&"byteLength"in e))throw new Error("First argument should be an instance of ArrayBuffer or Buffer");this.arrayBuffer=e,this.padding=4096,this.frames=[],this.url=""}return e._setIntegerFrame=function(e,t){var r,n=parseInt(t,10);this.frames.push({name:e,value:n,size:(r=n.toString().length,11+r)})},e._setStringFrame=function(e,t){var r,n=t.toString();this.frames.push({name:e,value:n,size:(r=n.length,13+2*r)})},e._setPictureFrame=function(e,t,r,n){var a,s,i,c,o=function(e){if(!e||!e.length)return null;if(255===e[0]&&216===e[1]&&255===e[2])return"image/jpeg";if(137===e[0]&&80===e[1]&&78===e[2]&&71===e[3])return"image/png";if(71===e[0]&&73===e[1]&&70===e[2])return"image/gif";if(87===e[8]&&69===e[9]&&66===e[10]&&80===e[11])return"image/webp";var t=73===e[0]&&73===e[1]&&42===e[2]&&0===e[3],r=77===e[0]&&77===e[1]&&0===e[2]&&42===e[3];return t||r?"image/tiff":66===e[0]&&77===e[1]?"image/bmp":0===e[0]&&0===e[1]&&1===e[2]&&0===e[3]?"image/x-icon":null}(new Uint8Array(t)),u=r.toString();if(!o)throw new Error("Unknown picture MIME type");r||(n=!1),this.frames.push({name:"APIC",value:t,pictureType:e,mimeType:o,useUnicodeEncoding:n,description:u,size:(a=t.byteLength,s=o.length,i=u.length,c=n,11+s+1+1+(c?2+2*(i+1):i+1)+a)})},e._setLyricsFrame=function(e,t){var r,n,a=e.toString(),s=t.toString();this.frames.push({name:"USLT",value:s,description:a,size:(r=a.length,n=s.length,16+2*r+2+2+2*n)})},e._setCommentFrame=function(e,t){var r,n,a=e.toString(),s=t.toString();this.frames.push({name:"COMM",value:s,description:a,size:(r=a.length,n=s.length,16+2*r+2+2+2*n)})},e._setUserStringFrame=function(e,t){var r,n,a=e.toString(),s=t.toString();this.frames.push({name:"TXXX",description:a,value:s,size:(r=a.length,n=s.length,13+2*r+2+2+2*n)})},e._setUrlLinkFrame=function(e,t){var r,n=t.toString();this.frames.push({name:e,value:n,size:(r=n.length,10+r)})},e.setFrame=function(e,t){switch(e){case"TPE1":case"TCOM":case"TCON":if(!Array.isArray(t))throw new Error(e+" frame value should be an array of strings");var r="TCON"===e?";":"/",n=t.join(r);this._setStringFrame(e,n);break;case"TIT2":case"TALB":case"TPE2":case"TPE3":case"TPE4":case"TRCK":case"TPOS":case"TMED":case"TPUB":case"TCOP":case"TSRC":this._setStringFrame(e,t);break;case"TBPM":case"TLEN":case"TDAT":case"TYER":this._setIntegerFrame(e,t);break;case"USLT":if(!("object"==typeof t&&"description"in t&&"lyrics"in t))throw new Error("USLT frame value should be an object with keys description and lyrics");this._setLyricsFrame(t.description,t.lyrics);break;case"APIC":if(!("object"==typeof t&&"type"in t&&"data"in t&&"description"in t))throw new Error("APIC frame value should be an object with keys type, data and description");if(t.type<0||20<t.type)throw new Error("Incorrect APIC frame picture type");this._setPictureFrame(t.type,t.data,t.description,!!t.useUnicodeEncoding);break;case"TXXX":if(!("object"==typeof t&&"description"in t&&"value"in t))throw new Error("TXXX frame value should be an object with keys description and value");this._setUserStringFrame(t.description,t.value);break;case"TKEY":if(!/^([A-G][#b]?m?|o)$/.test(t))throw new Error(e+" frame value should be like Dbm, C#, B or o");this._setStringFrame(e,t);break;case"WCOM":case"WCOP":case"WOAF":case"WOAR":case"WOAS":case"WORS":case"WPAY":case"WPUB":this._setUrlLinkFrame(e,t);break;case"COMM":if(!("object"==typeof t&&"description"in t&&"text"in t))throw new Error("COMM frame value should be an object with keys description and text");this._setCommentFrame(t.description,t.text);break;default:throw new Error("Unsupported frame "+e)}return this},e.removeTag=function(){if(!(this.arrayBuffer.byteLength<10)){var e,t,r=new Uint8Array(this.arrayBuffer),n=r[3],a=((e=[r[6],r[7],r[8],r[9]])[0]<<21)+(e[1]<<14)+(e[2]<<7)+e[3]+10;if(!(73!==(t=r)[0]||68!==t[1]||51!==t[2]||n<2||4<n))this.arrayBuffer=new Uint8Array(r.subarray(a)).buffer}},e.addTag=function(){this.removeTag();var e,t,n=[255,254],a=[101,110,103],r=10+this.frames.reduce(function(e,t){return e+t.size},0)+this.padding,s=new ArrayBuffer(this.arrayBuffer.byteLength+r),i=new Uint8Array(s),c=0,o=[];return o=[73,68,51,3],i.set(o,c),c+=o.length,c++,c++,o=[(e=r-10)>>>21&(t=127),e>>>14&t,e>>>7&t,e&t],i.set(o,c),c+=o.length,this.frames.forEach(function(e){var t,r;switch(o=u(e.name),i.set(o,c),c+=o.length,t=e.size-10,o=[t>>>24&(r=255),t>>>16&r,t>>>8&r,t&r],i.set(o,c),c+=o.length,c+=2,e.name){case"WCOM":case"WCOP":case"WOAF":case"WOAR":case"WOAS":case"WORS":case"WPAY":case"WPUB":o=u(e.value),i.set(o,c),c+=o.length;break;case"TPE1":case"TCOM":case"TCON":case"TIT2":case"TALB":case"TPE2":case"TPE3":case"TPE4":case"TRCK":case"TPOS":case"TKEY":case"TMED":case"TPUB":case"TCOP":case"TSRC":o=[1].concat(n),i.set(o,c),c+=o.length,o=h(e.value),i.set(o,c),c+=o.length;break;case"TXXX":case"USLT":case"COMM":o=[1],"USLT"!==e.name&&"COMM"!==e.name||(o=o.concat(a)),o=o.concat(n),i.set(o,c),c+=o.length,o=h(e.description),i.set(o,c),c+=o.length,o=[0,0].concat(n),i.set(o,c),c+=o.length,o=h(e.value),i.set(o,c),c+=o.length;break;case"TBPM":case"TLEN":case"TDAT":case"TYER":c++,o=u(e.value),i.set(o,c),c+=o.length;break;case"APIC":o=[e.useUnicodeEncoding?1:0],i.set(o,c),c+=o.length,o=u(e.mimeType),i.set(o,c),c+=o.length,o=[0,e.pictureType],i.set(o,c),c+=o.length,e.useUnicodeEncoding?(o=[].concat(n),i.set(o,c),c+=o.length,o=h(e.description),i.set(o,c),c+=o.length,c+=2):(o=u(e.description),i.set(o,c),c+=o.length,c++),i.set(new Uint8Array(e.value),c),c+=e.value.byteLength}}),c+=this.padding,i.set(new Uint8Array(this.arrayBuffer),c),this.arrayBuffer=s},e.getBlob=function(){return new Blob([this.arrayBuffer],{type:"audio/mpeg"})},e.getURL=function(){return this.url||(this.url=URL.createObjectURL(this.getBlob())),this.url},e.revokeURL=function(){URL.revokeObjectURL(this.url)},t}()});
},{}],2:[function(require,module,exports){
(function (global){
const ID3Writer = require('browser-id3-writer')

global.uploadFile = function() {

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"browser-id3-writer":1}]},{},[2]);