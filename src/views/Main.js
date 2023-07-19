import React, {useState} from "react";
import axios from 'axios';

import brinklink from '../bricklink.svg';


import Webcam from "react-webcam";


const usePrevious = (value) => {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value; //assign the value of ref to the argument
    },[value]); //this code will run when the value of 'value' changes
    return ref.current; //in the end, return the current ref value.
  }

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
            <img className="lego-part--image" src={part.img_url} alt="part" />
            <a target="_blank" rel="noreferrer" className={`lego-part--link lego-ex-${part.external_sites[0].name}`} href={part.external_sites[0].url}>
                <img src={brinklink} alt="bricklink" />
            </a>
        </>
        )

    }

    return component;
};

const Devices = ({devices, clickback}) => {

    return (
        <>
          {devices.map((device, key) => (
              <div className="lego-devices--camera" key={`device-${key}`} onClick={() => clickback(device)} title={device.label}>
                <Webcam width='100' audio={false} videoConstraints={{ deviceId: device.deviceId }} />
              </div>
    
            ))}
        </>
      );

}
 


const MainView = () => {

    const [images, setImage] = useState([]);
    const [count, setCount] = useState(0);
    const [parts, setParts] = useState([]);
    const [bounding_box, setBounding_box] = useState({
        upper: 0,
        left: 0,
        right: 0,
        lower: 0,
        width: 0
    });
    const prevBounding_box = usePrevious(bounding_box);


    const webcamRef = React.useRef(null);
    const getCapture = React.useCallback(() => {
        return webcamRef.current.getScreenshot();
    },
    [webcamRef]
    );

    const [activeCamera, setActiveCamera] = React.useState('');
    const [devices, setDevices] = React.useState([]);
  
    const handleDevices = React.useCallback(
      mediaDevices =>
        setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
      [setDevices]
    );
  
    React.useEffect(
      () => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      },
      [handleDevices]
    );

    const handleClickPredict = () => {
        let imageSrc = getCapture();

        setImage([...images, imageSrc]);
        setCount(count + 1);

        axios.post('/api/lego-predict', {image: imageSrc})
            .then(response => {
                setParts(response.data.items);
                setBounding_box(response.data.bounding_box);
                console.log(response.data)
            })
            .catch(error => {
              console.log(error);
            });

    }

    const handleClickCam = (device) => {
        setActiveCamera(device);
    }

    const TargetBox = () => {

        if (!prevBounding_box) {
            return null;
        }

        let targetClass = '';

        if (prevBounding_box.upper !== bounding_box.upper) {           
            targetClass = 'target-box fadeOut';
        }

        const makeBoundingBox = (rawbox) => {
            return {
                top: rawbox.upper,
                left:rawbox.left,
                right:rawbox.right,
                height: rawbox.lower - rawbox.upper,
                width: rawbox.right - rawbox.left,
            }
        }

        return (
            <span className={targetClass} style={makeBoundingBox(bounding_box)}></span>
        )

    }

    return (
        <div className="lego-main">
            <div className='lego-webcam'>
                <div className="target-box-container ">
                    <Webcam 
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ deviceId: activeCamera.deviceId }} 
                    />
                    <TargetBox />
                </div>
                <div className='lego-devices'>
                    <Devices devices={devices} clickback={handleClickCam}/>
                </div>
            </div>
            <div className='lego-baseplate'>

                <div className='lego-part'>
                    <Parts parts={parts}/>
                </div>
            </div>
            <div className='lego-button'>
                <button onClick={handleClickPredict}>Click here to detect lego</button>
            </div>
            <div className='lego-capture'>
                <Captures captures={images} />
            </div>
        </div>
    );
};

export default MainView;


