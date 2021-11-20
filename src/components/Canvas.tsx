import { useEffect, useRef } from "react";
import assert from "assert";
import { FabricCanvas } from "../canvas/FabricCanvas";

export function Canvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    assert(ref.current);

    const canvasEl = document.createElement("canvas");
    ref.current.append(canvasEl);

    new FabricCanvas(canvasEl);
  }, []);

  return <div ref={ref} />;
}
