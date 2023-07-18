import React, {useState} from "react";
import axios from 'axios';

import brinklink from '../bricklink.svg';


import Webcam from "react-webcam";

import Devices from '../components/Devices';


const Captures = ({captures}) => (
    captures.map((src,key) => 
        <img width="100px" key={`img-${key}`} src={src} alt="ssd" />
    )
);



const Parts = ({parts}) => {


    let component = null;

    if (!!parts.length) {

        let part = parts[0];

        component = (
        <>
            <p className="lego-part--name">{part.name}</p>
            <p className="lego-part--id">#{part.id}</p>
            <img className="lego-part--image" src={part.img_url} alt="part image" />
            <a className={`lego-part--link lego-ex-${part.external_sites[0].name}`} href={part.external_sites[0].url}>
                <img src={brinklink} alt="part image" />
            </a>
        </>
        )

    }

    return component;
};

const MainView = () => {

    const [images, setImage] = useState([]);
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('');
    const [parts, setParts] = useState([])


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

        axios.post('/api/lego-predict', {image: imageSrc})
            .then(response => {
                setMessage(response.data.message);
                setParts(response.data.items)
                console.log(response.data.items)
            })
            .catch(error => {
              console.log(error);
            });

    }

    return (
        <div className="lego-main">
            <div className='lego-webcam'>
                <Webcam 
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ deviceId: 'da1881c544191b89dfdebda5a52b3ea2f1b29f39efd3750fbead40a91e47cc2e' }} 
                />

            </div>
            <div className='lego-baseplate'>
                <div className='lego-devices'>
                    <Devices />
                </div>
                <div className='lego-part'>
                    <Parts parts={parts}/>
                </div>
            </div>
            <div className='lego-button'>
                <button onClick={handleClick}>Click to detect lego</button>
            </div>
            <div className='lego-capture'>
                <Captures captures={images} />
            </div>
        </div>
    );
};

export default MainView;


