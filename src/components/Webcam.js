import React, {useState} from "react";
import axios from 'axios';

import Webcam from "react-webcam";


const WebcamCapture = () => {

    const [images, setImage] = useState([]);
    const [count, setCount] = useState(0);


    const webcamRef = React.useRef(null);
    const getCapture = React.useCallback(() => {
        return webcamRef.current.getScreenshot();
    },
    [webcamRef]
    );


    const handleClick = () => {
        let imageSrc = getCapture();

        setImage([...images, imageSrc]);
        setCount(count + 1);

        console.log(imageSrc)

              var data=(imageSrc).split(',')[1];
               var binaryBlob = atob(data);
            //    console.log(binaryBlob);

            //    var file = new Blob([binaryBlob], {type: 'image/jpeg'});
               var file = new File([binaryBlob], 'lego.jpg');
       
            console.log(file)

               var formData = new FormData();
               formData.append('query_image', file);

            
        axios.post('https://api.brickognize.com/predict/', formData, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(function (response) {
        console.log(response);
        })
        .catch(function (error) {
        console.log(error);
        });



    }


    return (
        <div>
            <Webcam 
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ deviceId: '9575bbe07b0728800fb68fb57e283e094db1af7981829a3f6ffe17d46ee395e3' }} 
            />
            <button onClick={handleClick}>Capture photo - You pressed me {count} times</button>


            {images.map((src,key) => 
                <img width="100px" key={key} src={src} />
            )}

        </div>
    );
};

export default WebcamCapture;
