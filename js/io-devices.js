/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/


var videoSelect       = null; // select box for video source devices
var audioInputSelect  = null; // select box for audio source devices
var audioOutputSelect = null; // select box for audio output devices


function setDeviceSelector(selector, type) {
    if (typeof selector !== 'object') return false;
    
    switch(type) {
    case 'videoinput':
        videoSelect = selector;
        break;
    case 'audioinput':
        audioInputSelect = selector;
        break;
    case 'audiooutput':
        audioOutputSelect = selector;
        break;
    default:
        return false;
        break;
    }
    
    return true;
}


async function getDevices(deviceInfos = null) {
    
    if (deviceInfos === null) {
        deviceInfos = await navigator.mediaDevices.enumerateDevices();
    }
    if (videoSelect)       updateDeviceList(deviceInfos, videoSelect, 'videoinput');
    if (audioInputSelect)  updateDeviceList(deviceInfos, audioInputSelect, 'audioinput');
    if (audioOutputSelect) updateDeviceList(deviceInfos, audioOutputSelect, 'audiooutput');
    
    return deviceInfos;
}


//
// Update a select element with the list of desired kind of devices
// from those retrieved by mediaDevices.enumerateDevices()
// 
// deviceList:      array returned by mediaDevices.enumerateDevices(); if set to null, the 
//                  function gets the list by itself. Since this function is meant to update
//                  the select box of a single kind of devices while enumerateDevices gets 
//                  all of them, if we have more select boxes it may be a good idea to get
//                  the device list just once and pass it as an argument.
// deviceSelector:  select element
// type:            audioinput|videoinput|audiooutput
// onError:         callback function to handle possible enumerateDevices errors...
// 
// Returns the device list on success, null on error
//
async function updateDeviceList(deviceList = null, deviceSelector, type = 'videoinput', onError = null) {

    if (typeof onError !== 'function') onError = (error) => { console.error('Cannot get device list:', error.message, error.name); };

    try {
        if (deviceList === null) deviceList = await navigator.mediaDevices.enumerateDevices();

        // Get current selected camera id from device selector, if any
        const selected = deviceSelector.value;
        
        // Delete all options from device selector
        while (deviceSelector.firstChild) {
            deviceSelector.removeChild(deviceSelector.firstChild);
        }
        
        // For each device, if it's of the desired type, add a select option to the deviceSelector
        var deviceCount = 0;
        deviceList.forEach((e, i) => {
            if (e.kind === type) {
                deviceCount++;
                const option = document.createElement('option');
                
                option.value = e.deviceId;
                option.text = e.label || `${type} dev. n. ${deviceCount}`;
                
                deviceSelector.appendChild(option)
            } else {
                // Other kind of device
                //console.log(e.kind);
            }
        });
        
        // Set previously selected option, if found
        if (Array.prototype.slice.call(deviceSelector.childNodes).some(n => n.value === selected)) {
            deviceSelector.value = selected;
        }
        
        return deviceList;
        
    } catch (error) {
        
        onError(error);
        
        return null;
    }
}



// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
        element.setSinkId(sinkId)
            .then(() => {
                if (DebugLevel >= 3) console.log(`Success, audio output device attached: ${sinkId}`);
            })
            .catch(error => {
                let errorMessage = error;
                if (error.name === 'SecurityError') {
                    errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                }
                console.error(errorMessage + ` (sinkId: ${sinkId})`);
                
                // Jump back to first output device in the list as it's the default.
                //audioOutputSelect.selectedIndex = 0;
            });
    } else {
        console.warn('Browser does not support output device selection.');
    }
}

// Change audio destination of selected <video> or <audio> element
function changeAudioDestination(elem) {
  
  if (!elem) return;
    
  const audioDestination = audioOutputSelect.value;
  attachSinkId(elem, audioDestination);
}
