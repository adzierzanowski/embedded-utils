import { useState } from "react";
import { HidDevice } from "./HidDevice";
import './Hid.scss'

export const HidApp = () => {
  const [device, setDevice] = useState<HIDDevice | null>(null);

  const connect = async () => {
    const device = await navigator.hid.requestDevice({
      filters: [{ vendorId: 0x0483 }],
    });
    console.log(device[0]);
    setDevice(device[0]);
  };

  return (
    <div id="hid-app">
      <button onClick={connect}>Connect</button>
      <div id="device">{device && <HidDevice device={device} />}</div>
    </div>
  );
};
