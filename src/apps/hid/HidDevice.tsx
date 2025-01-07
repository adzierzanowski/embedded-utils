import { useEffect, useState } from "react";
import { leftPad, useBEM } from "../../utils";

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

const hidUsagePage = {
  0x01: "Generic Desktop Controls",
  0x02: "Simulation Controls",
  0x03: "VR Controls",
  0x04: "Sport Controls",
  0x05: "Game Controls",
  0x06: "Generic Device Controls",
  0x07: "Keyboard/Keypad",
  0x08: "LEDs",
  0x09: "Button",
  0x0a: "Ordinal",
  0x0b: "Telephony",
  0x0c: "Consumer",
  0x0d: "Digitizer",
  0x0e: "Haptics",
  0x0f: "Physical Interface Device (PID)",
  0x10: "Unicode",
  0x12: "Eye and Head Trackers",
  0x14: "Auxiliary Display",
  0x20: "Sensors",
  0x40: "Medical Instruments",
  0x41: "Braille Display",
  0x59: "Lighting and Illumination",
  0x80: "Monitor (VESA-defined)",
  0x81: "Monitor (VESA-defined)",
  0x82: "Monitor (VESA-defined)",
  0x83: "Monitor (VESA-defined)",
  0x84: "Power Device",
  0x85: "Battery System",
  0x8c: "Barcode Scanner",
  0x8d: "Scale",
  0x8e: "Magnetic Stripe Reader",
  0x90: "Camera Control",
  0x91: "Arcade",
};

export type HidDeviceProps = {
  device: HIDDevice;
};

export const HidDevice = ({ device }: HidDeviceProps) => {
  const bem = useBEM("hid-device")

  const [reports, setReports] = useState<{ [reportId: number]: Uint8Array }>(
    {}
  )

  const onInputReport = (e: HIDInputReportEvent) => {
    setReports((prev) => {
      const updated = { ...prev }
      updated[e.reportId] = new Uint8Array(e.data.buffer)
      return updated
    })
  }

  useEffect(() => {
    device.open().then(() => {
      device.addEventListener("inputreport", onInputReport);
    })

    return () => {
      device.removeEventListener("inputreport", onInputReport)
    }
  }, [device])

  return (
    <div className={bem([])}>
      <div className={bem(["label"])}>
        <div className={bem(["name"])}>{device.productName}</div>
        <div className={bem(["vidpid"])}>
          {leftPad(device.vendorId.toString(16), 4)}:
          {leftPad(device.productId.toString(16), 4)}
        </div>
      </div>

      <div className={bem(["collections"])}>
        {device?.collections.map((col: HIDCollectionInfo, i) => (
          <HidCollection
            key={`hiddev-${device.vendorId}-${device.productId}`}
            index={i}
            collection={col}
            reports={reports}
          />
        ))}
      </div>
    </div>
  );
};

export type HidCollectionProps = {
  collection: HIDCollectionInfo;
  index: number;
  reports: { [reportId: number]: Uint8Array };
};

export const HidCollection = ({
  collection,
  index,
  reports,
}: HidCollectionProps) => {
  const bem = useBEM("hid-device");

  return (
    <fieldset className={bem(["collection"])}>
      <legend>
        Collection #{index} ({collectionTypeStr(collection.type ?? 0x7f)})
      </legend>
      <div className={bem(["collection-reports"])}>
        {collection.inputReports?.map((rep) => (
          <HidReport
            key={`'in-${rep.reportId}`}
            report={rep}
            type="in"
            reportData={reports[rep.reportId!]}
          />
        ))}
        {collection.outputReports?.map((rep) => (
          <HidReport key={`out-${rep.reportId}`} report={rep} type="out" />
        ))}
      </div>
    </fieldset>
  );
};

export type HidReportProps = {
  report: HIDReportInfo;
  type: "in" | "out";
  reportData?: Uint8Array;
};

export const HidReport = ({ report, type, reportData }: HidReportProps) => {
  const bem = useBEM("hid-device");

  let repStr = "";
  if (reportData) {
    for (const val of reportData) {
      repStr += `${leftPad(val.toString(16), 2)} `;
    }
  }

  return (
    <fieldset className={bem(["report"], ["report", type])}>
      <legend>
        {type.toUpperCase()} Report #{report.reportId}
      </legend>
      {reportData === undefined ? null : (
        <div className={bem(["report-data"])}>{repStr}</div>
      )}
      <div className={bem(["report-items"])}>
        {report.items?.map((item, i) => (
          <HidReportItem key={i} item={item} />
        ))}
      </div>
    </fieldset>
  );
};

export type HidReportItemProps = {
  item: HIDReportItem;
};

const Attr = ({
  value,
  children,
}: {
  value?: any;
  children: React.ReactNode;
}) => {
  if (value === undefined || value === false) {
    return null;
  }
  return <div className="hid-device__report-item-attr">{children}</div>;
};

export const HidReportItem = ({ item }: HidReportItemProps) => {
  const bem = useBEM("hid-device");

  return (
    <fieldset className={bem(["report-item"])}>
      <legend>
        {item.reportCount} &times; {item.reportSize} bit
        {item.reportSize! > 1 ? "s" : ""}
      </legend>

      <div className={bem(["report-item-attrs"])}>
        <Attr value={item.logicalMinimum}>min {item.logicalMinimum}</Attr>
        <Attr value={item.logicalMaximum}>max {item.logicalMaximum}</Attr>
      </div>

      <div className={bem(["report-item-attrs"])}>
        <Attr value={item.isAbsolute}>{item.isAbsolute ? "abs" : "rel"}</Attr>
        <Attr value={item.isArray}>arr</Attr>
        <Attr value={item.isBufferedBytes}>buf bytes</Attr>
        <Attr value={item.isConstant}>const</Attr>
        <Attr value={item.isLinear}> linear</Attr>
        <Attr value={item.isRange}> range</Attr>
        <Attr value={item.isVolatile}> volatile</Attr>
        <Attr value={item.hasNull}> has null</Attr>
        <Attr value={item.hasPreferredState}>has preferred</Attr>
        <Attr value={item.wrap}>wrap</Attr>
      </div>

      <div className={bem(["report-item-attrs"])}>
        {item.usages?.map((usage, i) => (
          <Attr key={i} value={usage}>
            {hidUsagePage[usage >> 16 as keyof typeof hidUsagePage]}:{usage & 0xffff}
          </Attr>
        ))}
      </div>
    </fieldset>
  );
};
