import { useBEM } from "../../utils";

export type SegmentDisplayProps = {
  leds?: boolean
  onClick: (seg: number) => void
  state: number
}

export const SegmentDisplay = ({leds, onClick,  state}: SegmentDisplayProps) => {
  const bem = useBEM("segdisp");


  return (
    <div className={bem([], [undefined, 'leds', leds ?? false])}>
      <div
        onClick={() => onClick(0x40)}
        className={bem(["segment"], [undefined, "on", !!(state & 0x40)], ["a"])}
      />
      <div
        onClick={() => onClick(0x20)}
        className={bem(["segment"], [undefined, "on", !!(state & 0x20)], ["b"])}
      />
      <div
        onClick={() => onClick(0x10)}
        className={bem(["segment"], [undefined, "on", !!(state & 0x10)], ["c"])}
      />
      <div
        onClick={() => onClick(0x08)}
        className={bem(["segment"], [undefined, "on", !!(state & 0x08)], ["d"])}
      />
      <div
        onClick={() => onClick(0x04)}
        className={bem(["segment"], [undefined, "on", !!(state & 0x04)], ["e"])}
      />
      <div
        onClick={() => onClick(0x02)}
        className={bem(["segment"], [undefined, "on", !!(state & 0x02)], ["f"])}
      />
      <div
        onClick={() => onClick(0x01)}
        className={bem(["segment"], [undefined, "on", !!(state & 0x01)], ["g"])}
      />
      <div
        onClick={() => onClick(0x80)}
        className={bem(
          ["segment"],
          [undefined, "on", !!(state & 0x80)],
          ["dp"]
        )}
      />
    </div>
  );
};
