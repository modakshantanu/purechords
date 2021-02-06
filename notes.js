
freqmap = {
    "c" : 261.63,
    "c#": 277.18,
    "db": 277.18,
    "d": 293.66,
    "d#": 311.13,
    "eb": 311.13,
    "e": 329.63,
    "f": 349.23,
    "f#": 369.99,
    "gb": 369.99,
    "g": 392,
    "g#": 415.30,
    "ab": 415.30,
    "a": 440,
    "a#": 466.16,
    "bb": 466.16,
    "b": 493.88,
}

let TRT = 1.05946309436;

function stringToFreq(text) {
    if (text.length < 2) return NaN;
    let octave = parseInt(text[text.length - 1]);
    if (isNaN(octave)) return;
    let note = text.substring(0, text.length - 1);
    let basefreq = freqmap[note];
    if (basefreq === undefined) return;
    let octdiff = octave - 4;
    return basefreq * (2**octdiff)
}

function nearestNote(freq) {
    let octave = 4;
    while (freq > 508.3578) {
        freq /= 2;
        octave++;
    }
    while (freq < 254.1788) {
        freq *= 2;
        octave--;
    }

    let nearestFreq;
    let nearestNote;
    let minCents = 1e9;

    for (const key in freqmap) {
        let value = freqmap[key]
        let ratio = value / freq;
        if (ratio < 1) ratio = 1/ratio;
        let cents = Math.log(ratio) / Math.log(TRT) * 100
        cents = Math.round(cents)
        if (cents < minCents) {
            minCents = cents;
            nearestFreq = value
            nearestNote = key
        }        
    }
    if (nearestFreq > freq) minCents = -minCents;
    nearestNote += octave
    nearestFreq *= 2**(octave - 4) 

    return [nearestFreq, nearestNote, minCents]
}
