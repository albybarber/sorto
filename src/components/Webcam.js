import React, {useState} from "react";
import axios from 'axios';

import Webcam from "react-webcam";


const WebcamCapture = () => {

    const [images, setImage] = useState([]);
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('');
    const [legoDataItems, setLegoDataItems] = useState([])


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

        axios.post('/api/hello-world', {image: imageSrc})
            .then(response => {
                setMessage(response.data.message);
                setLegoDataItems(response.data.items)
                console.log(response.data.items)
            })
            .catch(error => {
              console.log(error);
            });

    }


    return (
        <div>
            <Webcam 
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ deviceId: 'da1881c544191b89dfdebda5a52b3ea2f1b29f39efd3750fbead40a91e47cc2e' }} 
            />
            <button onClick={handleClick}>Capture photo - You pressed me {count} times</button>


            {images.map((src,key) => 
                <img width="100px" key={key} src={src} alt="ssd" />
            )}

            <p>{message}</p>

            {legoDataItems.map((item,key) =>
                <>
                    <h3>{item.name}</h3>
                    <img width="100px" key={key} src={item.img_url} alt="ssd" />
                </>
            )}

        </div>
    );
};

export default WebcamCapture;
