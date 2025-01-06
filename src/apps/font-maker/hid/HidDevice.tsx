import { useEffect, useState } from "react";
import { leftPad, useBEM } from "../../../utils";

export const collectionTypeStr = (collection: number) => {
  switch (collection) {
    case 0:
      return "Physical";
    case 1:
      return "Application";
    case 2:
      return "Logical";
    case 3:
      return "Report";
    case 4:
      return "NamedArray";
    case 5:
      return "UsageSwitch";
    case 6:
      return "UsageModified";
    default:
      if (collection < 0x80) {
        return "Reserved";
      }
      return "VendorDefined";
  }
};

export type HidDeviceProps = {
  device: HIDDevice;
};

export const HidDevice = ({ device }: HidDeviceProps) => {
  const bem = useBEM("hid-device");
  const [report, setReport] = useState<Uint8Array>();
  const [outRep, setOutRep] = useState<string>("");

  const onInputReport = (e: HIDInputReportEvent) => {
    setReport(new Uint8Array([e.reportId, ...new Uint8Array(e.data.buffer)]));
  };

  useEffect(() => {
    (async () => {
      if (!device.opened) {
        await device.open();
        device.addEventListener("inputreport", onInputReport);
      }
    })();

    return () => {
      device.removeEventListener("inputreport", onInputReport);
    };
  }, [device]);

  let repStr = "";
  if (report) {
    for (const v of report) {
      repStr += leftPad(v.toString(16), 2) + " ";
    }
  }

  const sendReport = async () => {
    try {
      const rep = new Uint8Array(outRep.split(' ').map(x => parseInt(x)))
      await device?.sendReport(1, new Uint8Array(rep));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={bem([])}>
      <div className={bem(["name"])}>{device.productName}</div>
      <div className={bem(["vidpid"])}>
        {leftPad(device.vendorId.toString(16), 4)}:
        {leftPad(device.productId.toString(16), 4)}
      </div>
      <div>
        <input
          value={outRep}
          onChange={(e) => setOutRep(e.target.value)}
        />

        <div>
        {outRep.split(' ').map(x=>leftPad(parseInt(x).toString(16), 2)).join(' ')}
        </div>

        <button onClick={sendReport}>Send Report</button>
      </div>
      <div className={bem(["current-report"])}>{repStr}</div>
      <div className={bem(["collections"])}>
        {device?.collections.map((col) => (
          <HidCollection
            key={`hiddev-${device.vendorId}-${device.productId}`}
            collection={col}
          />
        ))}
      </div>
    </div>
  );
};

export type HidCollectionProps = {
  collection: HIDCollectionInfo;
};

export const HidCollection = ({ collection }: HidCollectionProps) => {
  const bem = useBEM("hid-device");

  return (
    <div className={bem(["collection"])}>
      Collection
      <div>{collectionTypeStr(collection.type ?? 0x7f)}</div>
      <div className={bem(["collection-input-reports"])}>
        {collection.inputReports?.map((rep) => (
          <div key={`input-${rep.reportId}`} className={bem(["input-report"])}>
            Input Report #{rep.reportId}
          </div>
        ))}
      </div>
      <div className={bem(["collection-output-reports"])}>
        {collection.inputReports?.map((rep) => (
          <div
            key={`output-${rep.reportId}`}
            className={bem(["output-report"])}
          >
            Output Report #{rep.reportId}
          </div>
        ))}
      </div>
    </div>
  );
};
