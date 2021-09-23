var fileName = "";
var fileCRC = "";

$(document).ready(function() {
    
    $('#audio-player-play').removeClass('disabled').addClass('disabled');
    $('#audio-player-stop').removeClass('disabled').addClass('disabled');
    $('#audio-player-pause').removeClass('disabled').addClass('disabled');
    
  
//  listFiles();
    
    function listFiles() {
        $.ajax({
            type: "POST",
            url: "/actions/list",
            data: {},
            dataType: "json",
            success: function(data){
            
                if (data.Result == "OK") {
                    
                    $("#file-list").html('');
                    
                    var i = 1;
                    data.Data.forEach(f => { 
                        let t =
                        '<div class="input-group file-item unselectable mb-1" id="file-item-' + i + '" data-filename="' + f.name  + '">' +
                        '  <div class="file-item-select input-group-prepend input-group-text unselectable cursor-pointer text-light bg-success show-tooltip" data-html="true" title="Send this file to the booths.<br>It may take a while."><i class="far fa-hand-point-right"></i></div>' +
                        '  <div class="file-item-description form-control ellipsis "><b>' + f.name + '</b> (<i>' + (f.size).toLocaleString('en') + '</i> bytes)</div>' +
                        '  <div class="input-group-append">' +
                        '    <span class="file-item-delete input-group-text unselectable cursor-pointer bg-warning show-tooltip" title="delete this file">&times;</span>' +
                        '  </div>'+
                        '</div>';
                        i++;
                        $("#file-list").append(t);
                    });
                    $("#file-manager-log").html();
                } else {
                    $("#file-manager-log").html(data.Message);
                }
            },
            failure: function(errMsg) {
                // HTML ERRORS HERE
                $("#file-manager-log").html(errMsg);
            }
        });
    
    }
    
    $('#file-list-refresh-button').on('click', listFiles);
    
    $('#file-manager').on('show.bs.modal', listFiles);
    
    $('#file-manager').on('click', '.file-item-delete', function() {
        let id = $(this).closest('.file-item').attr('id');
        let fn = $(this).closest('.file-item').data('filename'); 
        
        var txt;
        var r = confirm("Do you really want to delete file " + fn + "?");
        if (r == true) {

            $.ajax({
                type: "POST",
                url: "/actions/delete",
                data: {'file': fn},
                cache: false,
                dataType: "json",
                success: function(data) {
                    if (data.Result == "OK") {
                        if (DebugLevel >= 2) console.log("File " + fn + " deleted.");
                        $("#file-manager-log").html('File deleted...');
                    } else {
                        $("#file-manager-log").html('<div class="bg-warning"><pre>' + data + '</pre></div>');
                    }
                    listFiles();
                },
                failure: function(errMsg) {
                    // HTML ERRORS HERE
                    $("#file-manager-log").html(errMsg);
                    listFiles();
                }
            });        
          
        }        
        
        if (DebugLevel >= 2) console.log('click on ' + id + " - " + txt);
    });


    $('#file-upload').on('change', function(){
        //get the file name
        let fn = baseName($(this).val());
        //replace the "Choose a file" label
        if (fn == "") fn = "Choose file (" + AllowedMediaFileExtensions.join(', ') + ")";
        $('label[for=file-upload]').text(fn);
    })
    
    $('#file-manager-close-button-1, #file-manager-close-button-2').on('click', function() {
        // Clear file input field
        $("#file-upload").val('');
        $('label[for=file-upload]').text("Choose file (" + AllowedMediaFileExtensions.join(', ') + ")");
        $("#file-manager-log").html('');
    });

    $("#file-upload-button").on('click', function(e) {
        e.preventDefault();
        
        var buttonTextBackup = $('#file-upload-button').html();
        $('#file-upload-button').html('<span class="spinner-border spinner-border-sm text-light"></span> Uploading&hellip;');
        
        var payload = new FormData();
        var files = $('#file-upload')[0].files[0];
        payload.append('file',files);
        
        
        $.ajax({
            type: "POST",
            url: "/actions/upload",
            data: payload,
            contentType: false,
            cache: false,
            processData: false,
            dataType: "json",
            success: function(data) {
                if (data.Result == "OK") {
                    if (DebugLevel >= 2) console.log("File uploaded", data);
                    $("#file-manager-log").html('file uploaded');
                } else {
                    $("#file-manager-log").html('<div class="bg-warning">' + data.Message + '</div>');
                }
                $('#file-upload-form')[0].reset();
                $('#file-upload').next('.custom-file-label').html("Choose file");
                $('#file-upload-button').html(buttonTextBackup);
                listFiles();
            },
            failure: function(errMsg) {
                // HTML ERRORS HERE
                
                $('#file-upload-button').html(buttonTextBackup);
                $("#file-manager-log").html(errMsg);
                
                $('#file-upload-form')[0].reset();
                $('#file-upload').next('.custom-file-label').html("Choose file");
                listFiles();
            }
        });
    });
    
    $('#file-manager').on('click', '.file-item-select', function() {
        

        // Creo un riferimento di comodo al player
        const audioPlayer = $('#audio-player').get(0);


        var id = $(this).closest('.file-item').attr('id');

        fileName = $(this).closest('.file-item').data('filename');  // Global
        
        
        if (DebugLevel >= 2) console.log("File selected, id:" +id + ", filename: " + fileName + ", userName: " + userName);
        
        loadAndPlay("sounds/click.wav");
        $(this).html("<div class='spinner-border spinner-border-sm text-light'></div>");

        //audioPlayer.src = noSrc; // clear player -> this fires a "can't play file" error
        
        // Quando il player può eseguire il suo contenuto
        $('#audio-player').off('canplaythrough');
        

        // JQuery does not allow reading binary data 
        // via  ajax call so we use the fetch API

        var formData = new FormData();
        formData.append("user", userName);
        formData.append("file", fileName);
        
        const request = new Request('/actions/read', {
            method: 'POST',
            body: formData,
        });

        fetch(request).then((res) => { 
            if (!res.ok) {
                throw Error(res.status);
            }

            //return res.blob(); 
            //return res.text(); 
            return res.arrayBuffer(); 
        }).then(buf => {
            
            fileCRC = crc32(buf);
            if (DebugLevel >= 2) console.log('CRC32 of file "' + fileName + '" is 0x' + fileCRC.toHex());

            var blob = new Blob([ buf ]);
            
            //blob.arrayBuffer().then(b => {
            //    fileCRC = crc32(b);
            //    console.log('CRC32 of file "' + fileName + " is 0x" + fileCRC.toHex());
            //});
          
            // Il blob è caricato
            if (DebugLevel >= 2) console.log("Blob loaded");
            
            $('.file-item-select').html('<i class="far fa-hand-point-right"></i>');
            
            
            // Creo un pseudolink per poter caricare il blob come source 
            let objectURL = URL.createObjectURL(blob);
            
            
            // Carico il blob nel player
            audioPlayer.src = objectURL;
            
            $('#audio-player').one('canplaythrough', canPlayThrough);
            
            
            
            $('#audio-player-text').html((baseName(fileName)).trunc(28));
            
            $('#audio-player-stop').trigger('click');

            $("#file-manager").modal("hide");   

            $(document).trigger('player-feedback', {
                date: Date.now(), 
                action: "ready",
                parameters: { file: fileName, crc: fileCRC }
            });                
                    
        }).catch( (e) => {
            
            // File read error
            
            let code = e.name != "Error" ? e.name : e.message;
            
            let message = (code in httpErrorCodes) ? httpErrorCodes[code] : "unknown error";
            
            console.warn("Error " + code + ": " + message);
            console.warn(e);
            
            switch (code) {
                case "400":
                case "412":
                    message = "Can't read that file: bad request";
                    break;
                case "401":
                    message = "Your booth is not unauthorized to read the requested file";
                    break;
                case "403":
                    message = "Access to that file is forbidden. Maybe your session has expired?";
                    break;
                case "404":
                    message = "The requested file has not been found";
                    break;
                default:
                    break;
            }
            toastr.warning(message, "File read error", {positionClass: "toast-middle", timeOut: 5000} );            
            
            $('.file-item-select').html('<i class="far fa-hand-point-right"></i>');
            
        });            

    });
    
    $('#booth-volume').on('input', function() {
        //boothsGain.gain.value = BoothsGainMax * $(this).val();
        boothsGain.gain.setValueAtTime(BoothsGainMax * $(this).val(), audioCtx.currentTime);
    });
    
    $('#audio-player-volume').on('input', function() {
        //$('#audio-player').get(0).volume = PlayerGainMax * $(this).val();
        playerGain.gain.setValueAtTime(PlayerGainMax * $(this).val(), audioCtx.currentTime);
    });

    $('#audio-player-play').on('click',  function() {
        if ($(this).hasClass('disabled')) return;
        
        if (DebugLevel >= 2) console.log("Player: play clicked");
        
        $(document).trigger('player-feedback', {
            date: Date.now(), 
            action: "play",
            parameters: { file: fileName }
        });    
        $('#audio-player')[0].play();
        
        $('#audio-player-play').removeClass('disabled').addClass('disabled');
        $('#audio-player-stop').removeClass('disabled');
        $('#audio-player-pause').removeClass('disabled');
        
        resumeBatch(); // Resume batch time counter if any
    });

    $('#audio-player-stop').on('click',  function() {
        if ($(this).hasClass('disabled')) return;
        
        if (DebugLevel >= 2) console.log("Player: stop clicked");


        
        clearBatch(); // Hide batch time counter if any
        
        
        
        $(document).trigger('player-feedback', {
            date: Date.now(), 
            action: "stop",
            parameters: { file: fileName }
        });    
        $('#audio-player')[0].pause();
        $('#audio-player')[0].currentTime = 0;
        
        $('#audio-player-play').removeClass('disabled');
        $('#audio-player-stop').removeClass('disabled').addClass('disabled');
        $('#audio-player-pause').removeClass('disabled').addClass('disabled');
        
    });
    $('#audio-player-pause').on('click', function() {
        if ($(this).hasClass('disabled')) return;
        
        if (DebugLevel >= 2) console.log("Player: pause clicked");
        
        $(document).trigger('player-feedback', {
            date: Date.now(), 
            action: "pause",
            parameters: { file: fileName }
        });    
        
        $('#audio-player')[0].pause();
        $('#audio-player-play').removeClass('disabled');
        $('#audio-player-stop').removeClass('disabled').addClass('disabled');
        $('#audio-player-pause').removeClass('disabled').addClass('disabled');
        
        pauseBatch(); // Pause batch time counter if any
    });


    var canPlayThrough = function() {
        var audioPlayer = $('#audio-player').get(0);

        if (DebugLevel >= 2) console.log("Player: audio file loaded and ready to play");
        
        // Il blob è caricato nel player e posso abilitare i bottoni
        $('#audio-player-play, #audio-player-stop, #audio-player-pause').attr('disabled', false);
        $('#audio-player-progress').css('width', "100%");
        let t = "" + Math.floor(audioPlayer.duration);
        $('#audio-player-display').html("00:00:00 / " + t.toHHMMSS());
        $('#audio-player-progress').css('width', "0%");
        
        $('#audio-player-play').removeClass('disabled');
        $('#audio-player-stop').removeClass('disabled').addClass('disabled');
        $('#audio-player-pause').removeClass('disabled').addClass('disabled');
        
        // Show the player
        
        var videoTrack = null;
        
        if (audioPlayer.captureStream) {
            [videoTrack] = audioPlayer.captureStream().getVideoTracks();
        } else if (audioPlayer.mozCaptureStream) {
            [videoTrack] = audioPlayer.mozCaptureStream().getVideoTracks();
        }        
        
        if (videoTrack) {
            let ar = videoTrack.getSettings().aspectRatio;
            
            if (ar == 0) ar = 16/9;
            
            $('#player-container')
                .addClass('hide')
                .width($('#player-container').height() * ar)
                .css('top', 'auto', 'bottom', '6px')
                .css('left', 'auto', 'right', '6px')
                .removeClass('hide');
            
        } else {
            $('#player-container').addClass('hide');
        }

    }


    
    // Irrobustiamo il tutto verificando eventuali errori
    $('#audio-player').on('error', (e) => {
        
        const audioPlayer = $('#audio-player').get(0);
        
        if (audioPlayer.src == noSrc) return;
        
        $('#audio-player-text').html("Can't play this file");
        console.warn("Player: error", e);
    });
    
    let pp = 0;
    $('#audio-player').on('timeupdate', function() {
        let audio_player = $(this)[0];
        
        let p = Math.round(1000 * audio_player.currentTime / audio_player.duration)/10;
        let t1 = Math.floor(audio_player.currentTime);
        let t2 = Math.floor(audio_player.duration);
        
        t1 = isNaN(t1) ? "--:--:--" : "" + t1;
        t2 = isNaN(t1) ? "--:--:--" : "" + t2;
        
        if (pp != p && !isNaN(t1)) {
            $('#audio-player-progress').css('width', p + "%");
            $('#audio-player-display').html(t1.toHHMMSS() + " / " + t2.toHHMMSS());
            pp = p;
        }
    });
    
    $('#audio-player').on('ended', function() {
        //clearInterval(audio_player_timer);
        
        if (DebugLevel >= 2) console.log("Player: audio file is ended");
        
        $('#audio-player-progress').css('width', "100%");
        

        $('#audio-player')[0].currentTime = 0;
        $('#audio-player-play').removeClass('disabled');
        $('#audio-player-stop').removeClass('disabled').addClass('disabled');
        $('#audio-player-pause').removeClass('disabled').addClass('disabled');
        
        
        
    });       

});
