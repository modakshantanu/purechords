// Array of numbers, gain
let frequencies = [];
// Oscillators
let chordOsc = [];
let otpOsc = [];
let infOsc = []; 
let infstate = [];

let waveType = 'sine';
let masterGain = 0.01;
let isPlaying = false;
let eqtmode = false;

// create web audio api context
let audioCtx;

function disconnectAll() {
    for (let [a,b] of chordOsc) {
        a.disconnect();
        b.disconnect();
    }
    for (let [a,b] of otpOsc) {
        a.disconnect();
        b.disconnect();
    }
    for (let [a,b] of infOsc) {
        a.disconnect();
        b.disconnect();
    }
}

function connectAll() {
    for (let [a,b] of chordOsc) {
        a.start();
        b.connect(audioCtx.destination);
    }
    for (let [a,b] of otpOsc) {
        a.start();
        b.connect(audioCtx.destination);
    }
    for (let [a,b] of infOsc) {
        a.start();
        b.connect(audioCtx.destination);
    }
}

function updateAll() {
    for (let i = 0; i < frequencies.length; i++) {
        let [fre, gain] = frequencies[i];
        let freq = fre;
        if (eqtmode) {
            freq = nearestNote(freq)[0]
        }

        chordOsc[i][0].frequency.setValueAtTime(freq, audioCtx.currentTime);
        infOsc[i][0].frequency.setValueAtTime(freq, audioCtx.currentTime);
        otpOsc[i][0].frequency.setValueAtTime(freq, audioCtx.currentTime);
        chordOsc[i][0].type = waveType;
        infOsc[i][0].type = waveType;
        otpOsc[i][0].type = waveType;
        chordOsc[i][1].gain.value = gain*masterGain
        otpOsc[i][1].gain.value = gain * masterGain
        infOsc[i][1].gain.value = gain* masterGain
    }
}

function createAll() {
    chordOsc = []
    otpOsc  =[]
    infOsc = []
    infstate =[]
    for (let i = 0; i < frequencies.length; i++) {
        chordOsc[i] = [audioCtx.createOscillator(), audioCtx.createGain()];
        otpOsc[i] = [audioCtx.createOscillator(), audioCtx.createGain()];
        infOsc[i] = [audioCtx.createOscillator(), audioCtx.createGain()];
        infstate[i] = false;
    }
    connectAll();
    updateAll();
}

function startChord() {
    for (let [a,b] of chordOsc) {
        a.connect(b);
    }
}

let arpIdx = -1;

function startArpeggio() {
    if (chordOsc.length === 0) {
        return;
    }
    if (arpIdx >= 0 && arpIdx < chordOsc.length) {
        chordOsc[arpIdx][0].disconnect();
    }

    if (!isPlaying) {
        return;
    }
    arpIdx = (arpIdx + 1) % chordOsc.length;
    chordOsc[arpIdx][0].connect(chordOsc[arpIdx][1]);
    setTimeout(startArpeggio , 500);
}

function stopAll() {
    for (let [a,b] of chordOsc) {
        a.disconnect()
    }
}


function playotp(i) {
    otpOsc[i][0].connect(otpOsc[i][1]);
    setTimeout(() => {otpOsc[i][0].disconnect()} , 1000);
}


function startinf(i) {
    infOsc[i][0].connect(infOsc[i][1]);
}

function stopinf(i) {
    infOsc[i][0].disconnect();
}

