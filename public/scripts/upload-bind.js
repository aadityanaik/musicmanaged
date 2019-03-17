(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.ID3Writer=t()}(this,function(){"use strict";function r(e){return String(e).split("").map(function(e){return e.charCodeAt(0)})}function u(e){return new Uint8Array(r(e))}function h(e){var t=new Uint8Array(2*e.length);return new Uint16Array(t.buffer).set(r(e)),t}return function(){var e=t.prototype;function t(e){if(!(e&&"object"==typeof e&&"byteLength"in e))throw new Error("First argument should be an instance of ArrayBuffer or Buffer");this.arrayBuffer=e,this.padding=4096,this.frames=[],this.url=""}return e._setIntegerFrame=function(e,t){var r,n=parseInt(t,10);this.frames.push({name:e,value:n,size:(r=n.toString().length,11+r)})},e._setStringFrame=function(e,t){var r,n=t.toString();this.frames.push({name:e,value:n,size:(r=n.length,13+2*r)})},e._setPictureFrame=function(e,t,r,n){var a,s,i,c,o=function(e){if(!e||!e.length)return null;if(255===e[0]&&216===e[1]&&255===e[2])return"image/jpeg";if(137===e[0]&&80===e[1]&&78===e[2]&&71===e[3])return"image/png";if(71===e[0]&&73===e[1]&&70===e[2])return"image/gif";if(87===e[8]&&69===e[9]&&66===e[10]&&80===e[11])return"image/webp";var t=73===e[0]&&73===e[1]&&42===e[2]&&0===e[3],r=77===e[0]&&77===e[1]&&0===e[2]&&42===e[3];return t||r?"image/tiff":66===e[0]&&77===e[1]?"image/bmp":0===e[0]&&0===e[1]&&1===e[2]&&0===e[3]?"image/x-icon":null}(new Uint8Array(t)),u=r.toString();if(!o)throw new Error("Unknown picture MIME type");r||(n=!1),this.frames.push({name:"APIC",value:t,pictureType:e,mimeType:o,useUnicodeEncoding:n,description:u,size:(a=t.byteLength,s=o.length,i=u.length,c=n,11+s+1+1+(c?2+2*(i+1):i+1)+a)})},e._setLyricsFrame=function(e,t){var r,n,a=e.toString(),s=t.toString();this.frames.push({name:"USLT",value:s,description:a,size:(r=a.length,n=s.length,16+2*r+2+2+2*n)})},e._setCommentFrame=function(e,t){var r,n,a=e.toString(),s=t.toString();this.frames.push({name:"COMM",value:s,description:a,size:(r=a.length,n=s.length,16+2*r+2+2+2*n)})},e._setUserStringFrame=function(e,t){var r,n,a=e.toString(),s=t.toString();this.frames.push({name:"TXXX",description:a,value:s,size:(r=a.length,n=s.length,13+2*r+2+2+2*n)})},e._setUrlLinkFrame=function(e,t){var r,n=t.toString();this.frames.push({name:e,value:n,size:(r=n.length,10+r)})},e.setFrame=function(e,t){switch(e){case"TPE1":case"TCOM":case"TCON":if(!Array.isArray(t))throw new Error(e+" frame value should be an array of strings");var r="TCON"===e?";":"/",n=t.join(r);this._setStringFrame(e,n);break;case"TIT2":case"TALB":case"TPE2":case"TPE3":case"TPE4":case"TRCK":case"TPOS":case"TMED":case"TPUB":case"TCOP":case"TSRC":this._setStringFrame(e,t);break;case"TBPM":case"TLEN":case"TDAT":case"TYER":this._setIntegerFrame(e,t);break;case"USLT":if(!("object"==typeof t&&"description"in t&&"lyrics"in t))throw new Error("USLT frame value should be an object with keys description and lyrics");this._setLyricsFrame(t.description,t.lyrics);break;case"APIC":if(!("object"==typeof t&&"type"in t&&"data"in t&&"description"in t))throw new Error("APIC frame value should be an object with keys type, data and description");if(t.type<0||20<t.type)throw new Error("Incorrect APIC frame picture type");this._setPictureFrame(t.type,t.data,t.description,!!t.useUnicodeEncoding);break;case"TXXX":if(!("object"==typeof t&&"description"in t&&"value"in t))throw new Error("TXXX frame value should be an object with keys description and value");this._setUserStringFrame(t.description,t.value);break;case"TKEY":if(!/^([A-G][#b]?m?|o)$/.test(t))throw new Error(e+" frame value should be like Dbm, C#, B or o");this._setStringFrame(e,t);break;case"WCOM":case"WCOP":case"WOAF":case"WOAR":case"WOAS":case"WORS":case"WPAY":case"WPUB":this._setUrlLinkFrame(e,t);break;case"COMM":if(!("object"==typeof t&&"description"in t&&"text"in t))throw new Error("COMM frame value should be an object with keys description and text");this._setCommentFrame(t.description,t.text);break;default:throw new Error("Unsupported frame "+e)}return this},e.removeTag=function(){if(!(this.arrayBuffer.byteLength<10)){var e,t,r=new Uint8Array(this.arrayBuffer),n=r[3],a=((e=[r[6],r[7],r[8],r[9]])[0]<<21)+(e[1]<<14)+(e[2]<<7)+e[3]+10;if(!(73!==(t=r)[0]||68!==t[1]||51!==t[2]||n<2||4<n))this.arrayBuffer=new Uint8Array(r.subarray(a)).buffer}},e.addTag=function(){this.removeTag();var e,t,n=[255,254],a=[101,110,103],r=10+this.frames.reduce(function(e,t){return e+t.size},0)+this.padding,s=new ArrayBuffer(this.arrayBuffer.byteLength+r),i=new Uint8Array(s),c=0,o=[];return o=[73,68,51,3],i.set(o,c),c+=o.length,c++,c++,o=[(e=r-10)>>>21&(t=127),e>>>14&t,e>>>7&t,e&t],i.set(o,c),c+=o.length,this.frames.forEach(function(e){var t,r;switch(o=u(e.name),i.set(o,c),c+=o.length,t=e.size-10,o=[t>>>24&(r=255),t>>>16&r,t>>>8&r,t&r],i.set(o,c),c+=o.length,c+=2,e.name){case"WCOM":case"WCOP":case"WOAF":case"WOAR":case"WOAS":case"WORS":case"WPAY":case"WPUB":o=u(e.value),i.set(o,c),c+=o.length;break;case"TPE1":case"TCOM":case"TCON":case"TIT2":case"TALB":case"TPE2":case"TPE3":case"TPE4":case"TRCK":case"TPOS":case"TKEY":case"TMED":case"TPUB":case"TCOP":case"TSRC":o=[1].concat(n),i.set(o,c),c+=o.length,o=h(e.value),i.set(o,c),c+=o.length;break;case"TXXX":case"USLT":case"COMM":o=[1],"USLT"!==e.name&&"COMM"!==e.name||(o=o.concat(a)),o=o.concat(n),i.set(o,c),c+=o.length,o=h(e.description),i.set(o,c),c+=o.length,o=[0,0].concat(n),i.set(o,c),c+=o.length,o=h(e.value),i.set(o,c),c+=o.length;break;case"TBPM":case"TLEN":case"TDAT":case"TYER":c++,o=u(e.value),i.set(o,c),c+=o.length;break;case"APIC":o=[e.useUnicodeEncoding?1:0],i.set(o,c),c+=o.length,o=u(e.mimeType),i.set(o,c),c+=o.length,o=[0,e.pictureType],i.set(o,c),c+=o.length,e.useUnicodeEncoding?(o=[].concat(n),i.set(o,c),c+=o.length,o=h(e.description),i.set(o,c),c+=o.length,c+=2):(o=u(e.description),i.set(o,c),c+=o.length,c++),i.set(new Uint8Array(e.value),c),c+=e.value.byteLength}}),c+=this.padding,i.set(new Uint8Array(this.arrayBuffer),c),this.arrayBuffer=s},e.getBlob=function(){return new Blob([this.arrayBuffer],{type:"audio/mpeg"})},e.getURL=function(){return this.url||(this.url=URL.createObjectURL(this.getBlob())),this.url},e.revokeURL=function(){URL.revokeObjectURL(this.url)},t}()});
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FRAME_TYPES = {
    /*
     * Textual frames
     */
    TALB: 'album',
    TBPM: 'bpm',
    TCOM: 'composer',
    TCON: 'genre',
    TCOP: 'copyright',
    TDEN: 'encoding-time',
    TDLY: 'playlist-delay',
    TDOR: 'original-release-time',
    TDRC: 'recording-time',
    TDRL: 'release-time',
    TDTG: 'tagging-time',
    TENC: 'encoder',
    TEXT: 'writer',
    TFLT: 'file-type',
    TIPL: 'involved-people',
    TIT1: 'content-group',
    TIT2: 'title',
    TIT3: 'subtitle',
    TKEY: 'initial-key',
    TLAN: 'language',
    TLEN: 'length',
    TMCL: 'credits',
    TMED: 'media-type',
    TMOO: 'mood',
    TOAL: 'original-album',
    TOFN: 'original-filename',
    TOLY: 'original-writer',
    TOPE: 'original-artist',
    TOWN: 'owner',
    TPE1: 'artist',
    TPE2: 'band',
    TPE3: 'conductor',
    TPE4: 'remixer',
    TPOS: 'set-part',
    TPRO: 'produced-notice',
    TPUB: 'publisher',
    TRCK: 'track',
    TRSN: 'radio-name',
    TRSO: 'radio-owner',
    TSOA: 'album-sort',
    TSOP: 'performer-sort',
    TSOT: 'title-sort',
    TSRC: 'isrc',
    TSSE: 'encoder-settings',
    TSST: 'set-subtitle',
    TXXX: 'user-defined-text-information',
    TYER: 'year',
    /*
     * URL frames
     */
    WCOM: 'url-commercial',
    WCOP: 'url-legal',
    WOAF: 'url-file',
    WOAR: 'url-artist',
    WOAS: 'url-source',
    WORS: 'url-radio',
    WPAY: 'url-payment',
    WPUB: 'url-publisher',
    /*
     * URL frames (<=2.2)
     */
    WAF: 'url-file',
    WAR: 'url-artist',
    WAS: 'url-source',
    WCM: 'url-commercial',
    WCP: 'url-copyright',
    WPB: 'url-publisher',
    /*
     * Comment frame
     */
    COMM: 'comments',
    USLT: 'lyrics',
    /*
     * Image frame
     */
    APIC: 'image',
    PIC: 'image',
    /**
     * User/owner/involved people frame
     */
    IPLS: 'involved-people-list',
    OWNE: 'ownership',
};
exports.default = FRAME_TYPES;
// Frame type to value map.
exports.FrameTypeValueMap = {
    TXXX: 'array',
    COMM: 'array',
    USLT: 'array',
};

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    'Blues',
    'Classic Rock',
    'Country',
    'Dance',
    'Disco',
    'Funk',
    'Grunge',
    'Hip-Hop',
    'Jazz',
    'Metal',
    'New Age',
    'Oldies',
    'Other',
    'Pop',
    'R&B',
    'Rap',
    'Reggae',
    'Rock',
    'Techno',
    'Industrial',
    'Alternative',
    'Ska',
    'Death Metal',
    'Pranks',
    'Soundtrack',
    'Euro-Techno',
    'Ambient',
    'Trip-Hop',
    'Vocal',
    'Jazz+Funk',
    'Fusion',
    'Trance',
    'Classical',
    'Instrumental',
    'Acid',
    'House',
    'Game',
    'Sound Clip',
    'Gospel',
    'Noise',
    'AlternRock',
    'Bass',
    'Soul',
    'Punk',
    'Space',
    'Meditative',
    'Instrumental Pop',
    'Instrumental Rock',
    'Ethnic',
    'Gothic',
    'Darkwave',
    'Techno-Industrial',
    'Electronic',
    'Pop-Folk',
    'Eurodance',
    'Dream',
    'Southern Rock',
    'Comedy',
    'Cult',
    'Gangsta Rap',
    'Top 40',
    'Christian Rap',
    'Pop / Funk',
    'Jungle',
    'Native American',
    'Cabaret',
    'New Wave',
    'Psychedelic',
    'Rave',
    'Showtunes',
    'Trailer',
    'Lo-Fi',
    'Tribal',
    'Acid Punk',
    'Acid Jazz',
    'Polka',
    'Retro',
    'Musical',
    'Rock & Roll',
    'Hard Rock',
    'Folk',
    'Folk-Rock',
    'National Folk',
    'Swing',
    'Fast  Fusion',
    'Bebob',
    'Latin',
    'Revival',
    'Celtic',
    'Bluegrass',
    'Avantgarde',
    'Gothic Rock',
    'Progressive Rock',
    'Psychedelic Rock',
    'Symphonic Rock',
    'Slow Rock',
    'Big Band',
    'Chorus',
    'Easy Listening',
    'Acoustic',
    'Humour',
    'Speech',
    'Chanson',
    'Opera',
    'Chamber Music',
    'Sonata',
    'Symphony',
    'Booty Bass',
    'Primus',
    'Porn Groove',
    'Satire',
    'Slow Jam',
    'Club',
    'Tango',
    'Samba',
    'Folklore',
    'Ballad',
    'Power Ballad',
    'Rhythmic Soul',
    'Freestyle',
    'Duet',
    'Punk Rock',
    'Drum Solo',
    'A Cappella',
    'Euro-House',
    'Dance Hall',
    'Goa',
    'Drum & Bass',
    'Club-House',
    'Hardcore',
    'Terror',
    'Indie',
    'BritPop',
    'Negerpunk',
    'Polsk Punk',
    'Beat',
    'Christian Gangsta Rap',
    'Heavy Metal',
    'Black Metal',
    'Crossover',
    'Contemporary Christian',
    'Christian Rock',
    'Merengue',
    'Salsa',
    'Thrash Metal',
    'Anime',
    'JPop',
    'Synthpop',
    'Rock/Pop',
];

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    'other',
    'file-icon',
    'icon',
    'cover-front',
    'cover-back',
    'leaflet',
    'media',
    'artist-lead',
    'artist',
    'conductor',
    'band',
    'composer',
    'lyricist-writer',
    'recording-location',
    'during-recording',
    'during-performance',
    'screen',
    'fish',
    'illustration',
    'logo-band',
    'logo-publisher',
];

},{}],5:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var v1parser_1 = require("./parsers/v1parser");
exports.parseV1Tag = v1parser_1.default;
var v2parser_1 = require("./parsers/v2parser");
exports.parseV2Tag = v2parser_1.default;
var polyfill_1 = require("./polyfill");
polyfill_1.default(); // do polyfill.
function parse(bytes) {
    var v1data = v1parser_1.default(bytes);
    var v2data = v2parser_1.default(bytes);
    if (!v2data && !v1data) {
        return false;
    }
    var defaultValue = { version: false };
    var _a = v2data || defaultValue, v2 = _a.version, v2meta = __rest(_a, ["version"]);
    var _b = v1data || defaultValue, v1 = _b.version, v1meta = __rest(_b, ["version"]);
    var result = __assign({ version: {
            v1: v1,
            v2: v2,
        } }, v1meta, v2meta);
    /* tslint:disable:no-any */
    if (v1meta.comments) {
        result.comments = [{
                value: v1meta.comments,
            }].concat((v2meta && v2meta.comments) ? v2meta.comments : []);
    }
    /* tslint:enable:no-any */
    return result;
}
exports.parse = parse;

},{"./parsers/v1parser":6,"./parsers/v2parser":7,"./polyfill":8}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var genres_1 = require("../constants/genres");
var utils_1 = require("../utils");
var V1_MIN_LENGTH = 128;
/**
 * Parse ID3v1 metadata from binary bytes.
 * @description
 * ID3v1 tag occupies 128 bytes, beginning with the string TAG 128 bytes
 * from the end of the file.
 *
 * And the format is like: header(3) + title(30) + artist(30) +
 * album(30) + year(4) + comment(30) + genre(1).
 *
 * And extended tag is only supported by few programs, so we ignore it.
 * @param bytes binary bytes.
 */
function parseV1Data(bytes) {
    if (!bytes || bytes.length < V1_MIN_LENGTH) {
        return false;
    }
    bytes = bytes.slice(bytes.length - V1_MIN_LENGTH);
    var tags = {
        version: {
            major: 1,
            minor: 0,
        },
    };
    var flag = utils_1.readBytesToUTF8(bytes, 3);
    if (flag !== 'TAG') {
        return false;
    }
    // Strings are either space- or zero-padded. So remove them.
    var reWhiteSpace = /(^[\s0]+|[\s0]+$)/;
    tags.title = utils_1.readBytesToUTF8(bytes.slice(3), 30).replace(reWhiteSpace, '');
    tags.artist = utils_1.readBytesToUTF8(bytes.slice(33), 30).replace(reWhiteSpace, '');
    tags.album = utils_1.readBytesToUTF8(bytes.slice(63), 30).replace(reWhiteSpace, '');
    tags.year = utils_1.readBytesToUTF8(bytes.slice(93), 4).replace(reWhiteSpace, '');
    // If there is a zero byte at [125], the comment is 28 bytes and the remaining 2 are [0, trackno]
    if (bytes[125] === 0) {
        tags.comments = utils_1.readBytesToUTF8(bytes.slice(97), 28).replace(reWhiteSpace, '');
        tags.version.minor = 1;
        tags.track = bytes[126];
    }
    else {
        tags.comments = utils_1.readBytesToUTF8(bytes.slice(97), 30).replace(reWhiteSpace, '');
    }
    tags.genre = genres_1.default[bytes[127]] || '';
    return tags;
}
exports.default = parseV1Data;

},{"../constants/genres":3,"../utils":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frameTypes_1 = require("../constants/frameTypes");
var genres_1 = require("../constants/genres");
var imageTypes_1 = require("../constants/imageTypes");
var utils_1 = require("../utils");
var V2_MIN_LENGTH = 20; // TAG HEADER(10) + ONE FRAME HEADER(10)
function parseV2Data(bytes) {
    if (!bytes || bytes.length < V2_MIN_LENGTH) {
        return false;
    }
    var tags = parseV2Header(bytes.slice(0, 10));
    if (!tags) {
        return false;
    }
    var flags = tags.version.flags;
    // Currently do not support unsynchronisation
    if (flags.unsync) {
        throw new Error('no support for unsynchronisation');
    }
    var headerSize = 10;
    // Increment the header size if an extended header exists.
    if (flags.xheader) {
        // Usually extended header size is 6 or 10 bytes
        headerSize += calcTagSize(bytes.slice(10, 14));
    }
    var tagSize = calcTagSize(bytes.slice(6, 10));
    parseV2Frames(bytes.slice(headerSize, tagSize + headerSize), tags);
    return tags;
}
exports.default = parseV2Data;
/**
 * Parse ID3v2 tag header.
 * @description
 * A typical ID3v2 tag (header) is like:
 * $49 44 33 yy yy xx zz zz zz zz
 *
 * Where yy is less than $FF, xx is the 'flags' byte and zz is less than $80.
 * @param bytes binary bytes.
 */
function parseV2Header(bytes) {
    if (!bytes || bytes.length < 10) {
        return false;
    }
    var identity = utils_1.readBytesToUTF8(bytes, 3);
    if (identity !== 'ID3') {
        return false;
    }
    var flagByte = bytes[5];
    var version = {
        major: 2,
        minor: bytes[3],
        revision: bytes[4],
        flags: {
            unsync: (flagByte & 0x80) !== 0,
            xheader: (flagByte & 0x40) !== 0,
            experimental: (flagByte & 0x20) !== 0,
        },
    };
    return { version: version };
}
/**
 * Calculate the total tag size, but excluding the header size(10 bytes).
 * @param bytes binary bytes.
 */
function calcTagSize(bytes) {
    return (bytes[0] & 0x7f) * 0x200000 +
        (bytes[1] & 0x7f) * 0x4000 +
        (bytes[2] & 0x7f) * 0x80 +
        (bytes[3] & 0x7f);
}
exports.calcTagSize = calcTagSize;
/**
 * Calculate frame size (just content size, exclude 10 bytes header size).
 * @param bytes binary bytes.
 */
function calcFrameSize(bytes) {
    return bytes.length < 4 ? 0 : bytes[0] * 0x1000000 +
        bytes[1] * 0x10000 +
        bytes[2] * 0x100 +
        bytes[3];
}
exports.calcFrameSize = calcFrameSize;
function parseV2Frames(bytes, tags) {
    var position = 0;
    var version = tags.version;
    while (position < bytes.length) {
        var size = calcFrameSize(bytes.slice(position + 4));
        // the left data would be '\u0000\u0000...', just a padding
        if (size === 0) {
            break;
        }
        // * < v2.3, frame ID is 3 chars, size is 3 bytes making a total size of 6 bytes
        // * >= v2.3, frame ID is 4 chars, size is 4 bytes, flags are 2 bytes, total 10 bytes
        var slice = bytes.slice(position, position + 10 + size);
        if (!slice.length) {
            break;
        }
        var frame = parseFrame(slice, version.minor, size);
        if (frame.tag) {
            if (frameTypes_1.FrameTypeValueMap[frame.id] === 'array') {
                if (tags[frame.tag]) {
                    tags[frame.tag].push(frame.value);
                }
                else {
                    tags[frame.tag] = [frame.value];
                }
            }
            else {
                tags[frame.tag] = frame.value;
            }
        }
        position += slice.length;
    }
}
/**
 * Parse id3 frame.
 * @description
 * Declared ID3v2 frames are of different types:
 * 1. Unique file identifier
 * 2. Text information frames
 * 3. ...
 *
 * For frames that allow different types of text encoding, the first byte after header (bytes[10])
 * represents encoding. Its value is of:
 * 1. 00 <---> ISO-8859-1 (ASCII), default encoding, represented as <text string>/<full text string>
 * 2. 01 <---> UCS-2 encoded Unicode with BOM.
 * 3. 02 <---> UTF-16BE encoded Unicode without BOM.
 * 4. 03 <---> UTF-8 encoded Unicode.
 *
 * And 2-4 represented as <text string according to encoding>/<full text string according to encoding>
 * @param bytes Binary bytes.
 * @param minor Minor version, 2/3/4
 * @param size Frame size.
 */
function parseFrame(bytes, minor, size) {
    var result = {
        id: null,
        tag: null,
        value: null,
    };
    var header = {
        id: utils_1.readBytesToUTF8(bytes, 4),
        type: null,
        size: size,
        flags: [
            bytes[8],
            bytes[9],
        ],
    };
    header.type = header.id[0];
    result.id = header.id;
    if (minor === 4) {
        // TODO: parse v2.4 frame
    }
    // No support for compressed, unsychronised, etc frames
    if (header.flags[1] !== 0) {
        return result;
    }
    if (!(header.id in frameTypes_1.default)) {
        return result;
    }
    result.tag = frameTypes_1.default[header.id];
    var encoding = 0;
    var variableStart = 0;
    var variableLength = 0;
    var i = 0;
    /**
     * Text information frames, structure is:
     * <Header for 'Text information frame', ID: "T000" - "TZZZ", excluding "TXXX">
     * Text encoding    $xx
     * Information    <text string according to encoding>
     */
    if (header.type === 'T') {
        encoding = bytes[10];
        // If is User defined text information frame (TXXX), then we should handle specially.
        // <Header for 'User defined text information frame', ID: "TXXX" >
        // Text encoding    $xx
        // Description < text string according to encoding > $00(00)
        // Value < text string according to encoding >
        if (header.id === 'TXXX') {
            variableStart = 11;
            variableLength = utils_1.getEndpointOfBytes(bytes, encoding, variableStart) - variableStart;
            var value = {
                description: utils_1.readBytesToString(bytes.slice(variableStart), encoding, variableLength),
                value: '',
            };
            variableStart += variableLength + 1;
            variableStart = utils_1.skipPaddingZeros(bytes, variableStart);
            value.value = utils_1.readBytesToString(bytes.slice(variableStart), encoding);
            result.value = value;
        }
        else {
            result.value = utils_1.readBytesToString(bytes.slice(11), encoding);
            // Specially handle the 'Content type'.
            if (header.id === 'TCON' && result.value !== null) {
                if (result.value[0] === '(') {
                    var handledTCON = result.value.match(/\(\d+\)/g);
                    if (handledTCON) {
                        result.value = handledTCON.map(function (v) { return genres_1.default[+v.slice(1, -1)]; }).join(',');
                    }
                }
                else {
                    var genre = parseInt(result.value, 10);
                    if (!isNaN(genre)) {
                        result.value = genres_1.default[genre];
                    }
                }
            }
        }
    }
    else if (header.type === 'W') {
        // User defined URL link frame
        if (header.id === 'WXXX' && bytes[10] === 0) {
            result.value = utils_1.readBytesToISO8859(bytes.slice(11));
        }
        else {
            result.value = utils_1.readBytesToISO8859(bytes.slice(10));
        }
    }
    else if (header.id === 'COMM' || header.id === 'USLT') {
        encoding = bytes[10];
        variableStart = 14;
        variableLength = 0;
        var language = utils_1.readBytesToISO8859(bytes.slice(11), 3);
        variableLength = utils_1.getEndpointOfBytes(bytes, encoding, variableStart) - variableStart;
        var description = utils_1.readBytesToString(bytes.slice(variableStart), encoding, variableLength);
        variableStart = utils_1.skipPaddingZeros(bytes, variableStart + variableLength + 1);
        result.value = {
            language: language,
            description: description,
            value: utils_1.readBytesToString(bytes.slice(variableStart), encoding),
        };
    }
    else if (header.id === 'APIC') {
        encoding = bytes[10];
        var image = {
            type: null,
            mime: null,
            description: null,
            data: null,
        };
        variableStart = 11;
        // MIME is always encoded as ISO-8859, So always pass 0 to encoding argument.
        variableLength = utils_1.getEndpointOfBytes(bytes, 0, variableStart) - variableStart;
        image.mime = utils_1.readBytesToString(bytes.slice(variableStart), 0, variableLength);
        image.type = imageTypes_1.default[bytes[variableStart + variableLength + 1]] || 'other';
        // Skip $00 and $xx(Picture type).
        variableStart += variableLength + 2;
        variableLength = 0;
        for (i = variableStart;; i++) {
            if (bytes[i] === 0) {
                variableLength = i - variableStart;
                break;
            }
        }
        image.description = variableLength === 0
            ? null
            : utils_1.readBytesToString(bytes.slice(variableStart), encoding, variableLength);
        // check $00 at start of the image binary data
        variableStart = utils_1.skipPaddingZeros(bytes, variableStart + variableLength + 1);
        image.data = bytes.slice(variableStart);
        result.value = image;
    }
    else if (header.id === 'IPLS') {
        encoding = bytes[10];
        result.value = utils_1.readBytesToString(bytes.slice(11), encoding);
    }
    else if (header.id === 'OWNE') {
        encoding = bytes[10];
        variableStart = 11;
        variableLength = utils_1.getEndpointOfBytes(bytes, encoding, variableStart);
        var pricePayed = utils_1.readBytesToISO8859(bytes.slice(variableStart), variableLength);
        variableStart += variableLength + 1;
        var dateOfPurch = utils_1.readBytesToISO8859(bytes.slice(variableStart), 8);
        variableStart += 8;
        result.value = {
            pricePayed: pricePayed,
            dateOfPurch: dateOfPurch,
            seller: utils_1.readBytesToString(bytes.slice(variableStart), encoding),
        };
    }
    else {
        // Do nothing to other frames.
    }
    return result;
}

},{"../constants/frameTypes":2,"../constants/genres":3,"../constants/imageTypes":4,"../utils":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function polyfill() {
    // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
    if (typeof Uint8Array === 'function' && !Uint8Array.prototype.slice) {
        Object.defineProperty(Uint8Array.prototype, 'slice', {
            value: Array.prototype.slice,
        });
    }
}
exports.default = polyfill;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toStr = String.fromCharCode;
/**
 * Convert utf8 bytes to string.
 * @description
 * According to utf8 spec, char is encoded to [1,4] byte.
 * 1. 1 byte, 0 - 0x7f, the same as Ascii chars.
 * 2. 2 bytes, 110xxxxx 10xxxxxx.
 * 3. 3 bytes, 1110xxxx 10xxxxxx 10xxxxxx.
 * 4. 4 bytes, 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx.
 * For 2-4 bytes, remove leading 10/110/1110/11110 and get final codepoint.
 * @param bytes Utf8 binary bytes, usually array of numbers.
 * @param maxToRead Max number of bytes to read.
 */
function readBytesToUTF8(bytes, maxToRead) {
    if (maxToRead == null || maxToRead < 0) {
        maxToRead = bytes.length;
    }
    else {
        maxToRead = Math.min(maxToRead, bytes.length);
    }
    var index = 0;
    // Process BOM(Byte order mark).
    if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
        index = 3;
    }
    var arr = [];
    // Continue to insert string to arr until processed bytes' length reach max.
    for (var i = 0; index < maxToRead; i++) {
        var byte1 = bytes[index++];
        var byte2 = void 0;
        var byte3 = void 0;
        var byte4 = void 0;
        var codepoint = void 0;
        // End flag.
        if (byte1 === 0x00) {
            break;
        }
        else if (byte1 < 0x80) {
            arr[i] = toStr(byte1);
        }
        else if (byte1 >= 0xC2 && byte1 < 0xE0) {
            byte2 = bytes[index++];
            arr[i] = toStr(((byte1 & 0x1F) << 6) + (byte2 & 0x3F));
        }
        else if (byte1 >= 0xE0 && byte1 < 0xF0) {
            byte2 = bytes[index++];
            byte3 = bytes[index++];
            arr[i] = toStr(((byte1 & 0x0F) << 12) + ((byte2 & 0x3F) << 6) + (byte3 & 0x3F));
        }
        else if (byte1 >= 0xF0 && byte1 < 0xF5) {
            byte2 = bytes[index++];
            byte3 = bytes[index++];
            byte4 = bytes[index++];
            // See <https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae>
            codepoint = ((byte1 & 0x07) << 18) +
                ((byte2 & 0x3F) << 12) +
                ((byte3 & 0x3F) << 6) +
                (byte4 & 0x3F) - 0x10000;
            // Invoke String.fromCharCode(H, L) to get correct char.
            arr[i] = toStr((codepoint >> 10) + 0xD800, (codepoint & 0x3FF) + 0xDC00);
        }
    }
    return arr.join('');
}
exports.readBytesToUTF8 = readBytesToUTF8;
/**
 * Convert utf16 bytes to string.
 * @description
 * Utf16 represents char with one or two 16-bit code units per code point.
 * 1. Range 0 - 0xFFFF (i.e. the BMP), can be represented with one 16-bit.
 * 2. Range 0x10000 - 0x10FFFF (i.e. outside the BMP), can only be encoded using two 16-bit code units.
 *
 * The two 16-bit is called a surrogate pair.
 * - The first code unit of a surrogate pair is always in the range from 0xD800 to 0xDBFF,
 *   and is called a high surrogate or a lead surrogate.
 * - The second code unit of a surrogate pair is always in the range from 0xDC00 to 0xDFFF,
 *   and is called a low surrogate or a trail surrogate.
 *
 * A codepoint `C` greater than 0xFFFF corresponds to a surrogate pair <H, L>:
 * H = Math.floor((C - 0x10000) / 0x400) + 0xD800
 * L = (C - 0x10000) % 0x400 + 0xDC00
 * C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
 * @param bytes Utf16 binary bytes, usually array of numbers.
 * @param isBigEndian Specify whether utf16 bytes big-endian or little-endian.
 * @param maxToRead Max number of bytes to read.
 */
function readBytesToUTF16(bytes, isBigEndian, maxToRead) {
    if (maxToRead == null || maxToRead < 0) {
        maxToRead = bytes.length;
    }
    else {
        maxToRead = Math.min(maxToRead, bytes.length);
    }
    var index = 0;
    var offset1 = 1;
    var offset2 = 0;
    // Check BOM and set isBigEndian.
    if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
        isBigEndian = true;
        index = 2;
    }
    else if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
        isBigEndian = false;
        index = 2;
    }
    if (isBigEndian) {
        offset1 = 0;
        offset2 = 1;
    }
    var arr = [];
    var byte1;
    var byte2;
    var word1;
    var word2;
    var byte3;
    var byte4;
    for (var i = 0; index < maxToRead; i++) {
        // Set high/low 8 bit corresponding to LE/BE.
        byte1 = bytes[index + offset1];
        byte2 = bytes[index + offset2];
        // Get first 16 bits' value.
        word1 = (byte1 << 8) + byte2;
        index += 2;
        // If 16 bits are all 0, means end.
        if (word1 === 0x0000) {
            break;
        }
        else if (byte1 < 0xD8 || byte1 >= 0xE0) {
            arr[i] = toStr(word1);
        }
        else {
            // Get next 16 bits.
            byte3 = bytes[index + offset1];
            byte4 = bytes[index + offset2];
            word2 = (byte3 << 8) + byte4;
            index += 2;
            // Then invoke String.fromCharCode(H, L) to get correct char.
            arr[i] = toStr(word1, word2);
        }
    }
    return arr.join('');
}
exports.readBytesToUTF16 = readBytesToUTF16;
function readBytesToISO8859(bytes, maxToRead) {
    if (maxToRead == null || maxToRead < 0) {
        maxToRead = bytes.length;
    }
    else {
        maxToRead = Math.min(maxToRead, bytes.length);
    }
    var arr = [];
    for (var i = 0; i < maxToRead; i++) {
        arr.push(toStr(bytes[i]));
    }
    return arr.join('');
}
exports.readBytesToISO8859 = readBytesToISO8859;
/**
 * Convert bytes to string according to encoding.
 * @param bytes Binary bytes.
 * @param encoding id3v2 tag encoding, always 0/1/2/3.
 * @param maxToRead Max number of bytes to read.
 */
function readBytesToString(bytes, encoding, maxToRead) {
    if (encoding === 0) {
        return readBytesToISO8859(bytes, maxToRead);
    }
    else if (encoding === 3) {
        return readBytesToUTF8(bytes, maxToRead);
    }
    else if (encoding === 1 || encoding === 2) {
        return readBytesToUTF16(bytes, undefined, maxToRead);
    }
    else {
        return null;
    }
}
exports.readBytesToString = readBytesToString;
function getEndpointOfBytes(bytes, encoding, start) {
    if (start === void 0) { start = 0; }
    // ISO-8859 use $00 as end flag, and
    // unicode use $00 00 as end flag.
    var checker = encoding === 0
        ? function (index) { return bytes[index] === 0; }
        : function (index) { return (bytes[index] === 0 && bytes[index + 1] === 0); };
    var i = start;
    for (; i < bytes.length; i++) {
        if (checker(i)) {
            break;
        }
    }
    return i;
}
exports.getEndpointOfBytes = getEndpointOfBytes;
function skipPaddingZeros(bytes, start) {
    for (var i = start;; i++) {
        if (bytes[i] === 0) {
            start++;
        }
        else {
            break;
        }
    }
    return start;
}
exports.skipPaddingZeros = skipPaddingZeros;

},{}],10:[function(require,module,exports){
(function (global){
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
    var images = document.upload_file_form.cover_art.files
    var image = images[0]
    //metadata = [song_title, artist, album, release]

    if (files[0].type.lastIndexOf("audio/", 0) == 0) {
        // var username = document.getElementById('uploadSongUName').value
        var file = files[0]
        var host = window.location.hostname
        var port = window.location.port
        var url = "http://" + host + ":" + port + "/api/addmusicfile"
        var fileBuffer = new ArrayBuffer(file)
        var imageBuffer = new ArrayBuffer(image)
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"browser-id3-writer":1,"id3-parser":5}]},{},[10]);
