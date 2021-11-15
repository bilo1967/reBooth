/*
** utils.js
**
** A collection of constants, functions and classes that 
** the author of https://github.com/bilo1967/rebooth uses
** for his projects.
**
** Some are pieces of code found around the web and revised,
** some are original. A few of them require JQuery to work.
*/


// Just to note this somewhere: &#xA; is the newline sequence for TITLE attribute

// HTTP response codes
const httpErrorCodes = {
    // 1xx Informational
    '100': 'Continue', 
    '101': 'Switching Protocols', 

    // 2xx Success
    '200': 'OK', 
    '201': 'Created', 
    '202': 'Accepted', 
    '203': 'Non-Authoritative Information', 
    '204': 'No Content', 
    '205': 'Reset Content', 
    '206': 'Partial Content', 
    '207': 'Multi-Status (WebDAV)',
    '208': 'Already Reported (WebDAV)',
    '226': 'IM Used',

    // 3xx Redirection
    '300': 'Multiple Choices', 
    '301': 'Moved Permanently', 
    '302': 'Moved Temporarily', 
    '303': 'See Other', 
    '304': 'Not Modified', 
    '305': 'Use Proxy', 

    // 4xx Client error
    '400': 'Bad Request',                     // The server did not understand the request.  
    '401': 'Unauthorized',                    // The requested page needs a username and a password
    '402': 'Payment Required',                // Currently unimplemented 
    '403': 'Forbidden',                       // Access is forbidden to the requested page.  
    '404': 'Not Found',                       // Page not found  
    '405': 'Method Not Allowed',              // The method specified in the request is not allowed. 
    '406': 'Not Acceptable',                  // The server can only generate a response that is not accepted by the client.   
    '407': 'Proxy Authentication Required',   // You must authenticate with a proxy server before this request can be served.
    '408': 'Request Time-out',                // The request took longer than the server was prepared to wait.
    '409': 'Conflict',                        // The request could not be completed because of a conflict. 
    '410': 'Gone',                            // No longer available  
    '411': 'Length Required',                 // Need a "Content-Length" to fulfill the request
    '412': 'Precondition Failed',             // The pre condition given in the request evaluated to false by the server. 
    '413': 'Request Entity Too Large',        // The request entity is too large. 
    '414': 'Request-URI Too Large',           // The url is too long.
    '415': 'Unsupported Media Type',          // The mediatype is not supported
    '416': 'Requested Range Not Satisfiable', // The requested byte range is not available and is out of bounds.
    '417': 'Expectation Failed',              // The expectation given in an Expect request-header field could not be met
    
    '418': "I'm a teapot (RFC 2324)",
    '420': "Enhance Your Calm (Twitter)",
    '421': "Mismatched request",
    '422': "Unprocessable Entity (WebDAV)",
    '423': "Locked (WebDAV)",
    '424': "Failed Dependency (WebDAV)",
    '425': "Reserved for WebDAV",
    '426': "Upgrade Required",
    '428': "Precondition Required",
    '429': "Too Many Requests",
    '431': "Request Header Fields Too Large",
    '444': "No Response (Nginx)",
    '449': "Retry With (Microsoft)",
    '450': "Blocked by Windows Parental Controls (Microsoft)",
    '451': "Unavailable For Legal Reasons",
    '499': "Client Closed Request (Nginx)",
    
    // 5xx Server error
    '500': 'Internal Server Error',           
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Time-out',
    '505': 'HTTP Version not supported',
};

// Simple prototype to convert number of seconds to format HH:MM:SS
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); 
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return "--:--:--";

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

// Convert number to an Hex of a specified length (default=8)
Number.prototype.toMMSS = function() {
    
    var sec_num = parseInt(this, 10); 
    var minutes = Math.floor(sec_num / 60);
    var seconds = Math.floor(sec_num % 60);
    
    if (isNaN(minutes) || isNaN(seconds)) return "--:--";

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;    
    
}

// Convert number to an Hex of a specified length (default=8)
Number.prototype.toHex = function(len) {
    if (typeof(len) === 'undefined') len = 8;
    var num = this < 0 ? (0xFFFFFFFF + this + 1) : this;
    var hex = num.toString(16).toUpperCase();
    var pad = hex.length < len ? len - hex.length : 0;
    return "0".repeat(pad) + hex;
}



// JQuery extension to convert an HTML table to CSV
// sep is CSV separator
jQuery.fn.extend({
    table2CSV: function (sep = ",") {
        var csv = [];
        var rows = $(this).find("thead tr,tbody tr");
        rows.each(function(r) {
            let row = [];
            $(this).find('td,th').each(function(c)  {
                row.push($(this).text());
            });
            csv.push(row.join(sep));
        });
        return csv.join("\n");
    }  
});



// JQuery extension to scroll element to end when
// its content exceeds height
$.fn.scrollToEnd = function() {
    this.scrollTop(this.prop('scrollHeight'));
};

// event function to avoid event processing and propagation
function stopProcessingEvent(e) {
    e.preventDefault();
    e.stopPropagation();
}

/*
 * Estensione di String
 *
 * Esegue il padding a sinistra di digits caratteri della 
 * stringa corrente, riempiendo la parte mancante color
 * carattere fill
 *
 * Esempio:
 *
 *     var numero = "201";
 *     console.log(numero.lpad(5, 0))
 *     
 *     Scrive: "00201"
 *
 */ 
String.prototype.lpad =
    function(digits, fill)
    {
        var str, pad;
        
        fill = fill == null ? '0' : fill;
        str  = '' + this;
        pad = fill.repeat(digits);

        return pad.substring(0, pad.length - str.length) + str;
    }

/*
 * Estensione di String
 *
 * Tronca la stringa corrente usando i puntini di sospensione
 * Vengono lasciati i primi n caratteri
 *
 * Se useWordBoundary è true allora il troncamento avviene
 * prima dell'ultima parola
 *
 */
String.prototype.trunc = function( n, useWordBoundary ){
    var isTooLong = this.length > n,
        s_ = isTooLong ? this.substr(0, n-1) : this;
    s_ = (useWordBoundary && isTooLong) ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
    return  isTooLong ? s_ + '&hellip;' : s_;
};

/*
 * Estensione di String
 * Produce un hash numerico NON crittografico
 * a 64 bit della stringa
 */
String.prototype.hash64 = function() {
  var i = this.length
  var hash1 = 5381
  var hash2 = 52711

  while (i--) {
    const char = this.charCodeAt(i)
    hash1 = (hash1 * 33) ^ char
    hash2 = (hash2 * 33) ^ char
  }

  return "0x" + ((hash1 >>> 0) * 4096 + (hash2 >>> 0)).toString(16);
}

Date.prototype.toTimeStamp = function() {
    return String(this.getDate()).lpad(2)
    + '/' + String(this.getMonth() + 1).lpad(2) 
    + '/' + this.getFullYear() 
    + ' ' + String(this.getHours()).lpad(2)
    + ':' + String(this.getMinutes()).lpad(2)
    + ':' + String(this.getSeconds()).lpad(2)
    ;
};

Date.prototype.toLogTimeStamp = function() {
    return this.getFullYear() +
           String(this.getMonth() + 1).lpad(2) +
           String(this.getDate()).lpad(2) +
           '-' +
           String(this.getHours()).lpad(2) +
           String(this.getMinutes()).lpad(2) +
           String(this.getSeconds()).lpad(2)
    ;
};




/*
 * Copy text to clipboard
 *
 * copyTextToClipboard(msg, asHTML)
 *
 *   msg is any text you wish to copy to the clipboard
 *   asHTML tells if msg has to be copied both as HTML rich text and plain text
 * 
 * a user gesture on the page is required before this could work
 *
 *    copyTextToClipboard($('#id-qualsiasi').html(), true);
 *    copyTextToClipboard('This <i>rich text</i> will be copied to the clipoard ' +
 *                        'both as formatted <code>text/html</code> ' +
 *                        'and as <code>text/plain</code>', true);
 *    copyTextToClipboard('This is just plain text'); 
 *
 */
function copyTextToClipboard(msg, asHTML = false) {

    function listener(e) {
        if (asHTML) {
            e.clipboardData.setData("text/html", msg);
            e.clipboardData.setData("text/plain", jQuery(msg).text()); // strip html tags
        } else {
            e.clipboardData.setData("text/plain", msg);
        }
        e.preventDefault();
    }

    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
};


function getDateTime(date = null) {
    
    const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    const days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    
    
    if (date === null) {
        date = new Date();
    }
    
    var dt = {};
    
    dt.hours = date.getHours();
    
    dt.minutes = date.getMinutes() < 10 
               ? '0' + date.getMinutes() 
               : date.getMinutes();
    
    dt.seconds = date.getSeconds() < 10 
               ? '0' + date.getSeconds() 
               : date.getSeconds();
               
    dt.dd      = date.getDate() < 10 
               ? '0' + date.getDate() 
               : date.getDate();
               
    dt.mm      = date.getMonth() < 10 
               ? '0' + date.getMonth() 
               : date.getMonth();
               
    
    dt.dayOfWeek = days[date.getDay()];
    dt.month = months[date.getMonth()];
    dt.day = date.getDate();
    dt.year = date.getFullYear();
    
    dt.date = dt.dayOfWeek + ', ' + dt.month + ' ' + dt.day + ', ' + dt.year;
    dt.ddmmyyyy = dt.dd + "/" + dt.mm + "/" + dt.year;
    dt.hms = dt.hours + ":" + dt.minutes + ":" + dt.seconds;
    dt.ms = dt.minutes + ":" + dt.seconds;
    dt.yyyymmdd = '' + dt.year + dt.mm + dt.dd;
    dt.hhmmss = '' + dt.hours + dt.minutes + dt.seconds;
    
    return dt;
}



function loadAndPlay(tunePath, loop = false) {
    var ctx = new AudioContext(),
        req = new XMLHttpRequest();
    
    req.responseType = "arraybuffer";
    
    req.onload = function() {
        ctx.decodeAudioData(req.response, onDecoded);
    }
    req.onerror = function() {
        console.log("Error while loading sound effect " + tunePath);
    }
    
    req.open("GET", tunePath, true);
    
    function onDecoded(buffer) {
        var node = ctx.createBufferSource();
        node.buffer = buffer;
        node.connect(ctx.destination);
        node.loop = loop;
        node.start();
    }
    // console.log("Play", tunePath);
    req.send();
};



/*
 * This function is asynchronous and returns its result as a
 * promise. Usage:
 * 
 *   takeSnapshotFromMediaStream(anyMediaStream, 3).then(r => {
 *       loadAndPlay("sounds/shutter.wav");
 *       $('#an-image').attr('href', r.url);
 *       $('#an-image').attr('download', 'mysnapshot.png');          
 *   });
 */

async function takeSnapshotFromMediaStream(stream, resize = 1) {
    if (!stream instanceof MediaStream) return false;
    if (isNaN(resize) || resize <= 0 || resize > 10) return false;
    
/*    
    // we don't want audio tracks to 
    var stream = new MediaStream();
    stream.addTrack(s.getVideoTracks()[0]);
*/    
    
    let width  = resize * stream.getVideoTracks()[0].getSettings().width;
    let height = resize * stream.getVideoTracks()[0].getSettings().height;

    var video = document.createElement("video"); 
	video.width  = width;
	video.height = height;
    video.style.display = "none";
	video.style.position = "absolute";
    video.style.left = "-9999px";
	video.id = "an_anonymous_hidden_video_" + 
	          Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
	document.body.appendChild(video);
    video.srcObject = stream;
    video.muted = true;
    
    var canvas = document.createElement("canvas"); 
	canvas.width  = width;
	canvas.height = height;
    canvas.style.display = "none";
	canvas.style.position = "absolute";
    canvas.style.left = "-9999px";
	canvas.id = "an_anonymous_hidden_canvas_" + 
	          Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
	document.body.appendChild(canvas);

    return video.play().then(() => {
        video.muted = true;
        
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);
        
        var snapshotURL = canvas.toDataURL('image/png');
        
        video.srcObject = null;
    
        video.parentNode.removeChild(video);
        canvas.parentNode.removeChild(canvas);
        
        return new Promise(resolve => {
            resolve( { url: snapshotURL });
        });        
    });    
}



function downloadDataURL(dataURL, fileName)
{
	var a;

	a = document.createElement('a');
	a.style.display = 'none';
    a.href = dataURL;
    a.download = fileName;
    
	document.body.appendChild(a);
    
    a.click();
	
	// distruggo l'elemento temporaneo
	a.parentNode.removeChild(a);
	

}

// Strip path from a complete file path
function baseName(str) {
   var base = new String(str).substring(str.lastIndexOf('/') + 1);
   base = base.substring(str.lastIndexOf('\\') + 1);
   
   return base;
}



/*
 * Generates an unique ID with timestamp, counter and fixed prefix
 * You first create an instance of the class. You'll get an id the
 * 1st time you access the id property. You'll keep getting the 
 * same id until you call the next() method. After that a new id
 * is generated when you access the id property
 * 
 * g = new SessionIdGenerator('my');
 * console.log(g.id); // ->  my-20200720-152043-1
 * ...
 * console.log(g.id); // ->  my-20200720-152043-1
 * ...
 * g.next();
 * ...
 * console.log(g.id); // ->  my-20200720-152403-2
*/

class SessionIdGenerator {
    _id           = null;
    _prefix       = 'id';
    _generateNext = false;
    _counter      = 0;
    
    constructor (p = null) {
        if (p) this._prefix = p;
    }

    _newId() {
        let now = new Date();
        
        this._generateNext = false;
        this._counter++;
        this._id = this._prefix + "-" + now.toLogTimeStamp() + "-" + this._counter;
    }
    
    next() {
        this._generateNext = true;
    }
    
    get id() {
        if (this._generateNext || this._id === null) this._newId();
        return this._id;
    }
    
    get counter() {
        return this._counter;
    }
}

function getPins(n, l = PinLength) {
    
    var array = new Uint32Array(n);
    var pins = [];

    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < array.length; i++) {
        
        let p = array[i] + "";
        
        if (p.length < 10) {
            p = ("0").repeat(10 - p.length) + p;
        }
        
        if (p.length > 10) {
            p = p.substr(0, 10);
        }
        
        pins.push(p.substr(Math.floor(Math.random() * (11 - l)), l));
    }
    
    return pins;

}


function openFullscreen(elem) {

    if (!document.fullscreenEnabled || document.fullscreen) return;

    if (elem) {
        elem.requestFullscreen();
    } else {
        document.requestFullscreen();
    }

}

/* Close fullscreen */
function closeFullscreen() {
    if (!document.fullscreenEnabled || !document.fullscreen) return;

    document.exitFullscreen();
}

function openPictureInPicture(elem) {

    if (!document.pictureInPictureEnabled || document.pictureInPicture) return;

    if (elem) {
        elem.requestPictureInPicture();
    } else {
        document.requestPictureInPicture();
    }

}

/* Close Picture In Picture */
function closePictureInPicture() {
    if (!document.pictureInPictureEnabled || !document.pictureInPicture) return;

    document.exitPictureInPicture();
}




/*
** MediaFetcher Class
**
** MediaFetcher is a wrapper class for XMLHttpRequest
** It has been written because the Fetch API at the moment does not
** allow to have stats about the download in progress (and show, for
** example, a progress bar). It is useful for downloading a large 
** media file
**
** CONSTRUCTOR
**
**   var downloader = new MediaFetcher(script, options};
**
**   script
**     the script to be called on the server. If there is no such a script
**     on the server, a 404 error is returned via onError (see options)
**
**   options 
**     is... well... optional. See next section for the complete list of these options
** 
** OPTIONS
** 
** method: string (default: POST)
**   specifies which HTTP method has to be used to call the script.
**   Can be POST or GET. The default is POST.
**
** cancel: boolean (default: true)
**   true to abort a download when a new one is issued, false otherwise.
**   When cancel is set to false, the fetch method will return false if
**   a download is in progress.
**
** timeOut: number (default: null)
**   time out in milliseconds. Default is null (= no time out).
**   In case of timeout the current download is aborted and the onTimeOut 
**   callback is called.
**
** onProgress(obj): callback
**   returns an obj with transfer stats for every fetched chunk of data.
**   obj has these fields:
**   - progress: progress percentage (0.0 to 1.0),
**   - total: total transfer size in bytes,
**   - loaded: downloaded data size in bytes (progress=loaded/total),
**   - elapsed: elapsed time in ms,
**   - downloadSpeed: download speed in kb/sec (not rounded),
**   If the server script does not return the "Content-lenght" header
**   then progress and total won't be available.
**
** onLoad(buf, siz): callback
**    called when the transfer is complete. Returns file contents in an 
**    arrayBuffer buf, along with the file size siz.
**    You can convert the arrayBuffer to Blob (and possibly use it as 
**    source for an <audio> or <video> element) like this:
**
**      player.src = URL.createObjectURL(new Blob([ buf ]));
**
** onError(msg, err): callback 
**    returns an error message msg and an error code err (a standard HTTP status code)
**
** onAbort(): callback
**    is called when a download is aborted
**
** onTimeOut(): callback
**    gets called in case of time-out (the timeOut option must be set)
**
** METHODS
**
** fetch(flds)
**    Requests the download, passing to the script the fields specified in flds.
**    Returns true if the request has sent, false if it has been canceled
**    because another one is in progress and the "cancel" property is set to
**    true. If it is false, the current download is aborted and a the new one
**    is launched.
**
*/
class MediaFetcher {

    loader        = null;
    startTime     = null;
    loading       = false;
    
    // properties
    script        = null;          // mandatory 
    method        = 'POST';        // option: POST or GET
    cancel        = true;          // option
    timeOut       = null;          // option
    responseType  = 'arraybuffer'; // option: arraybuffer or blob

    // callbacks
    onProgress    = (obj) => {};
    onLoad        = (buf, len, crc) => {};
    onError       = (msg, cod) => {};
    onAbort       = () => {};
    onTimeOut     = () => {};
    
    constructor(script, options = {}) {
    
        this.script = script;
        
        if (['POST', 'GET'].includes(options.method)) this.method = options.method;
        if (['arraybuffer', 'blob'].includes(options.responseType)) this.responseType = options.responseType;
        if (typeof options.cancel === 'boolean') this.cancel = options.cancel;
        if (typeof options.timeOut === 'number' && options.timeOut > 0) this.timeOut = options.timeOut;
        if (typeof options.onProgress === 'function') this.onProgress = options.onProgress;
        if (typeof options.onLoad     === 'function') this.onLoad     = options.onLoad    ;
        if (typeof options.onAbort    === 'function') this.onAbort    = options.onAbort   ;
        if (typeof options.onTimeOut  === 'function') this.onTimeOut  = options.onTimeOut ;
        if (typeof options.onError    === 'function') this.onError    = options.onError   ;
        
    }
    
    abort() {
        this.loading = false;
        if (typeof(this.loader) === 'object') this.loader.abort();    
    };
    
    initLoader() {
    
        this.loader = new XMLHttpRequest();
        
        this.loader.open(this.method, this.script);
        this.loader.responseType = this.responseType;
        if (this.timeOut) this.loader.timeout = this.timeOut;
        
        this.loader.onload = (e) => { // better to use onreadystatechange instead?

            var res   = this.loader.response, // Note: not this.loader.responseText
                ready = this.loader.readyState === 4,
                code  =  this.loader.status;
            
            if (!ready) return;
            
            // if we are here, either we have the file or an error but
            // in any case the request has been processed
            this.loading = false;
            
            // We expect an arraybuffer
            if (code != '200' || typeof res !== 'object') {
                // Guess we would never get this case...
                if (typeof res !== 'object') {
                    code = "406"; // means that the server has generated a non acceptable response
                }
                let message = httpErrorCodes[code] !== undefined ? httpErrorCodes[code] : "Unknown error";
                console.warn("Error " + code + ": " + message);
                this.onError(message, code);
            } else {

                try {
                    if (this.responseType == 'arraybuffer') {
                        // player.src = URL.createObjectURL(new Blob([ res ]));    
                        this.onLoad(res, res.byteLength);
                    } else {
                        this.onLoad(res, res.size);
                    }
                } catch(err) {
                    this.onError(err, null);
                }
                
            }

            return;
        };
        
        this.loader.onprogress = ( e ) => {
            let elapsed = performance.now() - this.startTime;
            let stats = null;

            if (e.lengthComputable) {
                if (!stats) stats = {};
                stats.progress = (e.loaded / e.total);
                stats.total = e.total;
            }
            if (e.loaded) {
                if (!stats) stats = {};
                stats.loaded = e.loaded;
                stats.elapsed = elapsed;
                stats.downloadSpeed = e.loaded/elapsed; // bytes/ms = kb/s
            }
            this.onProgress(stats);
        };
        this.loader.onabort = (e) => {
            this.loading = false;
            this.onAbort();
            console.log("Transfer aborted");
        }
        this.loader.ontimeout = (e) => {
            this.loading = false;
            this.onTimeOut();
            console.log("Transfer timed out");
        }
    }

    fetch(vars) {

        var formData = new FormData();

        for (const key in vars) {
            formData.append(key, vars[key]);
        }

        // New transfer: abort previous if cancel=true
        if (this.loading) {
            if (this.cancel) {
                this.abort();
            } else {
                // 429 is actually "Too many requests"
                this.onError("Fetcher is busy (another download is in progress)", "429");
                return false;
            }
        }

        this.initLoader();
        this.loading = true;
        this.startTime = performance.now(); 
        this.loader.send(formData);

        return true;
    }
}
