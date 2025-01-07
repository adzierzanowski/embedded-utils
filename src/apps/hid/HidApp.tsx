import { useState } from "react";
import { HidDevice } from "./HidDevice";
import "./Hid.scss";
import { Toggle } from "../../components/Toggle/Toggle";

export const HidApp = () => {
  const [device, setDevice] = useState<HIDDevice | null>(null);
  const [vid, setVid] = useState<string>("0x0483");
  const [pid, setPid] = useState<string>("");
  const [applyFilter, setApplyFilter] = useState<boolean>(false);

  const connect = async () => {
    const vendorId = parseInt(vid, 0);
    const productId = parseInt(pid, 0);

    const device = await navigator.hid.requestDevice({
      filters: applyFilter
        ? [
            {
              vendorId: isNaN(vendorId) ? undefined : vendorId,
              productId: isNaN(productId) ? undefined : productId,
            },
          ]
        : [],
    });
    console.log(device[0]);
    setDevice(device[0]);
  };

  return (
    <div id="hid-app">
      <nav id="hid-app-nav">
        <fieldset id="hid-app-filter">
          <legend>Filter Devices</legend>
          <fieldset>
            <legend>VID</legend>
            <input
              type="text"
              value={vid}
              onChange={(e) => setVid(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>PID</legend>
            <input
              type="text"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
            />
          </fieldset>
          <Toggle value={applyFilter} onClick={setApplyFilter}>
            Apply
          </Toggle>
        </fieldset>
      </nav>
      <button onClick={connect}>Connect</button>
      <div id="device">{device && <HidDevice device={device} />}</div>
    </div>
  );
};
