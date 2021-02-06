function parseText(text) {
    let textLines = text.split('\n');

    for (let line of textLines) {
        parseLine(line);
    }
    
}

function parseLine(line) {
    line = line.replaceAll(' ','');
    line = line.toLowerCase();
    if (line.endsWith('hz')) {
        line = line.substring(0, line.length - 2);
        let freq = parseFloat(line);
        if (isNaN(freq)) return;
        frequencies.push([freq, 1]);
    } else if (line.startsWith('(')) {
        let refindex = parseInt(line.substring(1)) - 1
        if (isNaN(refindex)) return;
        if (refindex < 0 || refindex >= frequencies.length) return;
        line = line.substring(line.lastIndexOf(')') + 2);
        let tokens = line.split('/');
        let freq , ratio;
        if (tokens.length === 1) {
            ratio = parseFloat(tokens[0]);
            if (isNaN(ratio)) return;
        } else if (tokens.length === 2) {
            let n = parseFloat(tokens[0])
            let d = parseFloat(tokens[1])
            if (isNaN(n) || isNaN(d)) return;
            ratio = n / d;
        } else {
            return
        }
        freq = frequencies[refindex][0] * ratio;
        frequencies.push([freq, 1])
    } else {
        let freq = stringToFreq(line);
        if (isNaN(freq)) return
        frequencies.push([freq, 1])
    }
}

