let MediaStreamHelper = {
    // Propiedad del objeto para almacenar el flujo actual
    _stream: null,
    // Este método devolverá la promesa de enumerar los dispositivos reales
    getDevices: function() {
        return navigator.mediaDevices.enumerateDevices();
    },
    // Solicita permisos de usuario para acceder a la cámara y al video
    requestStream: function() {
        if (this._stream) {
            this._stream.getTracks().forEach(track => {
            track.stop();
            });
        }

        let videoSourcesSelect = document.querySelector('#video-source');

        const videoSource = videoSourcesSelect.value;
        const constraints = {
            video: {
                deviceId: videoSource ? {exact: videoSource} : undefined
            }
        };

        return navigator.mediaDevices.getUserMedia(constraints);
    },
    stopCamera: function() {
        if (this._stream) {
            this._stream.getTracks().forEach(track => {
                track.stop();
            });
        }
    }
};
  
// Solicito los permisos y agrego los dispositivos disponibles
function selectCamera(){
    MediaStreamHelper.requestStream().then(function(stream){
        let videoSourcesSelect = document.querySelector('#video-source');
        let videoPlayer = document.querySelector('video');
        MediaStreamHelper._stream = stream;
        videoSourcesSelect.selectedIndex = [...videoSourcesSelect.options].findIndex(option => option.text === stream.getVideoTracks()[0].label);
        videoPlayer.srcObject = stream;

        MediaStreamHelper.getDevices().then((devices) => {
        devices.forEach((device) => {
            if(device.deviceId !== ''){
            let option = new Option();
            option.value = device.deviceId;
            option.text = device.label || `Cámara ${videoSourcesSelect.length + 1}`;
            videoSourcesSelect.appendChild(option)
            }
        });
        // Cambiar entre cámaras
        videoSourcesSelect.onchange = function(){
            MediaStreamHelper.requestStream().then(function(stream){
            MediaStreamHelper._stream = stream;
            videoPlayer.srcObject = stream;
            });
        };
        }).catch(function (e) {
            console.log(e.name + ": " + e.message);
        });
    }).catch(function(err){
        console.error(err);
    });
}

function stopCamera(){
    MediaStreamHelper.stopCamera();
}