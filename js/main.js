(function(window, $, undefined) {
    let bucleVideoScreen;
    let myModal;
    // Función para escanear
    $(function() {
        function handleFiles(f) {
            var img = $('img');
            img[0].src = URL.createObjectURL(f.target.files[0]);
        }

        function doScan(image) {
            var
                    canvas = document.createElement('canvas'),
                    canvas_context = canvas.getContext('2d'),
                    source,
                    binarizer,
                    bitmap;
            $('.decodedText').empty();
            if(image.id === "video"){
                videoScreen(image);
                function videoScreen(video){
                    video.pause();
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas_context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    let videoURL = canvas.toDataURL();
                    let foto = document.createElement('img');
                    foto.src = videoURL;
                    foto.width = canvas.width;
                    try {
                        if(foto.width === 0) {
                            miExcepcionUsuario = new Error("No tiene Width");
                            throw miExcepcionUsuario;
                        }
                        source = new ZXing.BitmapLuminanceSource(canvas_context, video);
                        binarizer = new ZXing.Common.HybridBinarizer(source);
                        bitmap = new ZXing.BinaryBitmap(binarizer);

                        let decode = ZXing.PDF417.PDF417Reader.decode(bitmap, null, false)[0].Text;
                        console.log(decode);
                        let split = decode.split('@');
                        $('.decodedTramite').text(split[0]);
                        $('.decodedSurname').text(split[1]);
                        $('.decodedName').text(split[2]);
                        $('.decodedSex').text(split[3]);
                        $('.decodedDNI').text(split[4]);
                        $('.decodedEjemplar').text(split[5]);
                        $('.decodedBirth').text(split[6]);
                        $('.decodedEmision').text(split[7]);
                        console.log("decoded: ", decode);
                        $('#modalScanner').modal('hide');
                        return
                    } catch (err) {
                        console.log("este es el error", err);
                        video.play();
                        bucleVideoScreen = setTimeout(() => {
                            videoScreen(image);  
                        }, 500);
                    }
                }
            } else {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                canvas_context.drawImage(image, 0, 0, canvas.width, canvas.height);

                try {
                    source = new ZXing.BitmapLuminanceSource(canvas_context, image);
                    binarizer = new ZXing.Common.HybridBinarizer(source);
                    bitmap = new ZXing.BinaryBitmap(binarizer);

                    let decode = ZXing.PDF417.PDF417Reader.decode(bitmap, null, false)[0].Text;
                    let split = decode.split('@');
                    $('.decodedTramite').text(split[0]);
                    $('.decodedSurname').text(split[1]);
                    $('.decodedName').text(split[2]);
                    $('.decodedSex').text(split[3]);
                    $('.decodedDNI').text(split[4]);
                    $('.decodedEjemplar').text(split[5]);
                    $('.decodedBirth').text(split[6]);
                    $('.decodedEmision').text(split[7]);
                    console.log("decoded: ", decode);
                } catch (err) {
                    $('.error').text(err);
                }
            }
        }

        $('#scannerButton').click(function() {
            selectCamera();
            myModal = document.getElementById('modalScanner')
            myModal.addEventListener('hidden.bs.modal', function (event) {
                stopCamera();
                setTimeout(() => {
                    clearTimeout(bucleVideoScreen);
                }, 5001);
            })
            doScan($('#video')[0]);
        });

        $('img').load(function() {
            doScan($('img')[0]);
        });

        $('#file').change(handleFiles);
    });
})(window, window.jQuery, window.selectCamera);