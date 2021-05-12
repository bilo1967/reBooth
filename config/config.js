const DebugMode = false;
const DebugLevel = 2; // 0=errors, 1=warnings, 2=info, 3=details
const BetaFeatures = false;


const PinLength = 6;

const SimultaneousBatchDefaultDelay = 15;
const ConsecutiveBatchDefaultDelay  = 0;

// Maximum gain values (1=100%)
// WARNING: overboosting audio volume may cause damage to your hearing
const BoothsGainMax  = 2.25; // Boost booths volume (instructor only)
const PlayerGainMax  = 2.25; // Boost player volume (both instructor and booth)
const TeacherGainMax = 1.00; // Boost teacher volume (unused)

// Booth check interval
const BoothPollingInterval = 3210;


// Teacher PC has to handle several upstream and downstream connections
// Tipically downstream band is larger than upstream so it make sense to
// limit upstream bandwidth 
// Student PC has to handle just one upstream and one downstream. We can
// allow a little more upstream bandwidth than the Teacher since the 
// Teacher downstream width is larger than upstream
const BandwidthProfiles = {
    max: { 
        // Teacher: 256kbps upload @240p
        TeacherVideoBW:   192000,
        TeacherAudioBW:   64000,
        TeacherVRes:      240,
        // Student: 332kbps upload @360p
        StudentVideoBW:   236000,
        StudentAudioBW:   96000,
        StudentVRes:      480
    },    
    high: {
        // Teacher: 224kbps upload @160p
        TeacherVideoBW:   160000,
        TeacherAudioBW:   64000,
        TeacherVRes:      160,
        // Student: 288kbps upload @240p
        StudentVideoBW:   192000,
        StudentAudioBW:   96000,
        StudentVRes:      240
    },
    medium: {
        // Teacher: 192kbps upload @120p
        TeacherVideoBW:   136000,
        TeacherAudioBW:   56000,
        TeacherVRes:      120,
        // Student: 256kbps upload @160p
        StudentVideoBW:   162000,
        StudentAudioBW:   94000,
        StudentVRes:      160
    },
    low: {
        // Teacher: 150kbps upload @120p
        TeacherVideoBW:   96000,
        TeacherAudioBW:   54000,
        TeacherVRes:      120,
        // Teacher: 200kbps upload @120p
        StudentVideoBW:   110000,
        StudentAudioBW:   90000,
        StudentVRes:      120
    },
    default: null
};
BandwidthProfiles.default = BandwidthProfiles.low;

const LocalCameraConstraints = {
/*    
    video: {
        frameRate: {ideal: 15, max: 30},
//      width: {ideal: 160 },
        height: {ideal: 120, max: 480 }
    },
*/    
    video: {
        frameRate: {ideal: 15, max: 30},
    },
    audio: true,
/*    
    audio: {
        echoCancellation: false,
        noiseSuppression: false,
    }
*/
};


const ScreenShareConstraints = {
    video: {
//      cursor: 'always',
//      frameRate: 15,
        height: { ideal: 480, max: 720 },
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleSize: 8,
        sampleRate: 22050,
        channelCount: 1    
    }
};

const PeerJSConfig = {
//  host: 'intrain.ditlab.it',
//  port: 9443, // <= TCP

    host: 'peerjs.ditlab.it',
    port: 443, // <= TCP

    debug: 2,
    path: '/',
    secure: true,
    config: {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
//          { urls: 'turn:numb.viagenie.ca', username: 'webrtc@live.com', credential: 'muazkh'},
//          { urls: 'turn:0.peerjs.com:3478', username: 'peerjs', credential: 'peerjsp' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' }
        ]
    },
};
