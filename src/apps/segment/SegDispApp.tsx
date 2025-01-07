import { SegmentDisplay } from "./SegmentDisplay";
import "./Segment.scss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { leftPad } from "../../utils";

export const SegDispApp = () => {
  const [leds, setLeds] = useState<number>(0);
  const [seg0, setSeg0] = useState<number>(0);
  const [seg1, setSeg1] = useState<number>(0);
  const [seg2, setSeg2] = useState<number>(0);
  const [seg3, setSeg3] = useState<number>(0);
  const [seg4, setSeg4] = useState<number>(0);
  const [seg5, setSeg5] = useState<number>(0);
  const [seg6, setSeg6] = useState<number>(0);

  const [current, setCurrent] = useState<string>("");
  const [snaps, setSnaps] = useState<number[][]>([]);

  const addSnap = () => {
    setSnaps((prev) =>
      prev.concat([[seg0, seg1, seg2, seg3, seg4, seg5, seg6, leds]])
    );
  };

  const removeSnap = (i: number) => {
    setSnaps((prev) => prev.filter((_, x) => x !== i));
  };

  const onClickFactory = (
    state: number,
    setter: Dispatch<SetStateAction<number>>
  ) => {
    const onClick = (seg: number) => {
      setter(state & seg ? state & ~seg : state | seg);
    };
    return onClick;
  };

  const toPyArray = (snap: number[]) => {
    return `[0x00, ${snap
      .map((s) => `0x${leftPad(s.toString(16), 2)}`)
      .join(", ")}]`;
  };

  useEffect(() => {
    setCurrent(toPyArray([seg0, seg1, seg2, seg3, seg4, seg5, seg6, leds]));
  }, [leds, seg0, seg1, seg2, seg3, seg4, seg5, seg6]);

  return (
    <div id="segdispapp">
      <div id="leds">
        <SegmentDisplay
          leds
          state={leds}
          onClick={onClickFactory(leds, setLeds)}
        />
      </div>
      <div id="segdisp">
        <div className="dispgroup">
          <SegmentDisplay
            state={seg0}
            onClick={onClickFactory(seg0, setSeg0)}
          />
          <SegmentDisplay
            state={seg1}
            onClick={onClickFactory(seg1, setSeg1)}
          />
          <SegmentDisplay
            state={seg2}
            onClick={onClickFactory(seg2, setSeg2)}
          />
        </div>
        <div className="dispgroup">
          <SegmentDisplay
            state={seg3}
            onClick={onClickFactory(seg3, setSeg3)}
          />
          <SegmentDisplay
            state={seg4}
            onClick={onClickFactory(seg4, setSeg4)}
          />
          <SegmentDisplay
            state={seg5}
            onClick={onClickFactory(seg5, setSeg5)}
          />
          <SegmentDisplay
            state={seg6}
            onClick={onClickFactory(seg6, setSeg6)}
          />
        </div>
      </div>
      <div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: '10px'
        }}
      >
        {current}
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={addSnap}>Snap</button>
          <button onClick={() =>  {
            setLeds(0)
            setSeg0(0)
            setSeg1(0)
            setSeg2(0)
            setSeg3(0)
            setSeg4(0)
            setSeg5(0)
            setSeg6(0)
          }}>Clear</button>
        </div>
      </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: '10px'
        }}
      >
        <button onClick={() => {
          navigator.clipboard.writeText(snaps.map(snap => toPyArray(snap)).join(',\n'))
        }}>Copy</button>
        <button onClick={() => setSnaps([])}>Clear</button>
      </div>
      <div id="snaps">
        {snaps.map((snap, i) => (
          <div
            onClick={(e) => {
              if (e.metaKey) {
                removeSnap(i);
              } else {
                setSeg0(snap[0]);
                setSeg1(snap[1]);
                setSeg2(snap[2]);
                setSeg3(snap[3]);
                setSeg4(snap[4]);
                setSeg5(snap[5]);
                setSeg6(snap[6]);
                setLeds(snap[7]);
              }
            }}
            key={snap.join("")}
          >
            {toPyArray(snap)}
          </div>
        ))}
      </div>
    </div>
  );
};
