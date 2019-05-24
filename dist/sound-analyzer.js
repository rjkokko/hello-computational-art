// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    };
}
let analyser;
let source;
let bufferLengthAlt;
function init() {
    let audioConstructor = AudioContext || window.webkitAudioContext;
    let audioCtx = new audioConstructor();
    analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    analyser.fftSize = 32;
    bufferLengthAlt = analyser.frequencyBinCount;
    if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');
        var constraints = { audio: true };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (stream) {
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
        })
            .catch(function (err) {
            console.log('The following gUM error occured: ' + err);
        });
    }
    else {
        console.log('getUserMedia not supported on your browser!');
    }
}
// });
function getCurrentIntensity() {
    let dataArrayAlt = new Uint8Array(bufferLengthAlt);
    if (analyser) {
        analyser.getByteFrequencyData(dataArrayAlt);
    }
    return dataArrayAlt;
}
export { init, getCurrentIntensity };
//# sourceMappingURL=sound-analyzer.js.map