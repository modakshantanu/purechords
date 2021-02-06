let first = true;
let createAudio = () => {
    if (!first) return
    first = false;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
let updateButton, textarea
window.onload = () => {
    
    textarea = document.getElementById('textarea');

    updateButton = document.getElementById('update-button')
    let playPauseButton  = document.getElementById('playpause-button')
    let eqtCheck = document.getElementById('eqt-input')
    let volumeInput = document.getElementById('volume-input')
    let sineRadio = document.getElementById('sine-input')
    let sawtoothRadio = document.getElementById('sawtooth-input')
    let squareRadio = document.getElementById('square-input')
    let triangleRadio = document.getElementById('triangle-input')
    let chordRadio = document.getElementById('chord-input')
    let arpeggioRadio = document.getElementById('arpeggio-input')

    let freqList = document.getElementById('freq-list');

    updateButton.onclick = () => {

        
        for (let i  =0; i < frequencies.length; i++) {
            chordOsc[i][0].disconnect();
        }
        arpIdx = -1;
        createAudio();
        let text = textarea.value;
        frequencies = []
        parseText(text);
        disconnectAll();
        createAll();
        updateUI();
        

        if (isPlaying) {
            if (chordRadio.checked) startChord()
        }
    }

    playPauseButton.onclick = () => {
        createAudio()
        if (isPlaying) {
            isPlaying = false;
            stopAll()

        } else {
            isPlaying = true;
            if (chordRadio.checked) startChord()
            else startArpeggio()

        }
        playPauseButton.innerHTML = !isPlaying ? '▶':'⏸'
    }
    
    var updateUI = () => {

        let innerHtml = '';
        let i =0
        for (let [freq, gain] of frequencies) {
            let [nF, nN, nC] = nearestNote(freq)
            innerHtml += `<li>
                ${freq.toFixed(2)}Hz (${nN} ${nC >= 0? '+':''}${nC} cents)
                <label for="vol${i}">Vol</label>
			    <input type="range" id = "vol${i}" min = "-1" max = "1" step = "0.1" value = "0" onchange="changeVol(${i})">
                <button id="otp${i}" onclick="otpClick(${i})">▶</button>
                <button id="inf${i}" onclick="infClick(${i})">∞</button>
            </li>`
            i++
        }

        freqList.innerHTML = innerHtml;

        playPauseButton.innerHTML = !isPlaying ? '▶':'⏸'

        for (let i = 0; i < frequencies.length; i++) {
            let button = document.getElementById(`inf${i}`);
            if (infstate[i]) {
                button.classList.add('orange')
            } else {
                button.classList.remove('orange')
            }
        }

    }

    sawtoothRadio.onclick = () => setWaveType('sawtooth')
    sineRadio.onclick = () => setWaveType('sine')
    squareRadio.onclick = () => setWaveType('square')
    triangleRadio.onclick = () => setWaveType('triangle')

    let setWaveType = (type) => {
        waveType = type
        updateAll();
    }


    // chordRadio.onclick = arpeggioRadio.onclick = () => {
    //     updateButton.click();
    //     updateButton.click();
    // } 
    volumeInput.onchange = () => {

        let value = volumeInput.value;
        masterGain = 10**value * 0.01
        updateAll()
    }

    eqtCheck.onclick = () => {
        eqtmode = !eqtmode;
        updateAll()
    }


}

function changeVol(idx) {
    let value = document.getElementById(`vol${idx}`).value
    frequencies[idx][1] = 10**value;
    updateAll()
}

function otpClick(idx) {
    playotp(idx);
}

function infClick(idx) {
    if (infstate[idx]) {
        stopinf(idx);
    } else {
        startinf(idx);
    }
    infstate[idx] = !infstate[idx];

    for (let i = 0; i < frequencies.length; i++) {
        let button = document.getElementById(`inf${i}`);
        if (infstate[i]) {
            button.classList.add('orange')
        } else {
            button.classList.remove('orange')
        }
    }
}

function applyPreset(preset) {
    textarea.value = presets[preset];
    updateButton.click();
}