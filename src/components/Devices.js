import React, {useState} from "react";

import Webcam from "react-webcam";

const Devices = () => {
    const [deviceId, setDeviceId] = React.useState({});
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
  
    return (
      <>
        {devices.map((device, key) => (
            <div>
              <Webcam key={key} width='100' audio={false} videoConstraints={{ deviceId: device.deviceId }} />
              {device.label || `Device ${key + 1}`}
              {device.deviceId}
            </div>
  
          ))}
      </>
    );
  };

export default Devices;
