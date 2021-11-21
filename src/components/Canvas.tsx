import { useEffect, useRef } from "react";
import assert from "assert";
import { FabricCanvasInitializer } from "../canvas/FabricCanvasInitializer";

export function Canvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    assert(ref.current);

    const canvasEl = document.createElement("canvas");
    ref.current.append(canvasEl);

    new FabricCanvasInitializer(canvasEl);
  }, []);

  return <div ref={ref} />;
}
