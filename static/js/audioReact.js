var socket = io.connect('http://127.0.0.1:5000');

socket.emit('my event', {data: 'I\'m connected!'});

/* socket.on('message', function(data) {
    console.log('Received message from server:', data);
}); */

socket.on('show_content', function(data) {
    console.log('Received content data from server:', data);

    if(data.type === 'image') {
        showContent(data.url, data.duration, 'image');
    } else if(data.type === 'video') {
        showContent(data.url, data.duration, 'video');
    }
});

function showContent(url, duration, contentType) {
    var contentElement;

    if (contentType == 'image') {
        contentElement = new Image();
        contentElement.src = url;
    } else if (contentType == 'video') {
        contentElement = document.createElement('video');
        contentElement.src = url;
        contentElement.autoplay = true;
    }

    document.body.appendChild(contentElement);

    setTimeout(function() {
        document.body.removeChild(contentElement);
    }, duration);
}

// Load the base URL from the <base> tag
const base = document.querySelector('base').getAttribute('href');

// Load the image
const imageSources = [
    base + 'static/images/robotClosed.png',
    base + 'static/images/robotOpen.png',
    base + 'static/images/robotOpenBig.png',
    base + 'static/images/robotOpenSmall.png'
]


// Check if the browser supports the Web Audio API
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support the Web Audio API. Please use a different browser.");
    throw new Error("Web Audio API not supported");
} 

// Request access to the microphone
navigator.mediaDevices.getUserMedia({audio:true, video:false})
    .then(stream => {
        const audioContext = new AudioContext();
        const audioInput = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        //analyser.fftSize = 512;
        audioInput.connect(analyser)

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const imageElement = document.getElementById('Robot');
        let currentImageIndex = 0;

        let isSilent = false;

        function switchImage() {
            analyser.getByteFrequencyData(dataArray);
            let sum = dataArray.reduce((a,b) => a + b, 0);
            let average = sum / dataArray.length;

            if (average > 20) {
                if (isSilent) {
                    isSilent = false; // Reset the flag when sound is detected
                    currentImageIndex = 0; // Start from the first image again
                }
                imageElement.src = imageSources[currentImageIndex];
                currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            } else {
                if (!isSilent) {
                    isSilent = true; // Set the flag when it becomes silent
                    currentImageIndex = 0; // Reset to the first image                    
                    imageElement.src = imageSources[currentImageIndex];
                }
            }
        }

        setInterval(switchImage, 75)
    })
    .catch(error => {
        console.error('Access to audio input was denied or an error occurred:', error);
    });