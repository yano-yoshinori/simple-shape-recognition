import assert from "assert";

interface Point {
  x: number;
  y: number;
}

export function normalize(path: number[][]) {
  return path.reduce((points: Point[], p: number[]) => {
    assert([3, 5].includes(p.length));

    if (p.length === 3) {
      const [x, y] = p.slice(1);
      return points.concat({ x, y });
    }

    const [x1, y1, x2, y2] = p.slice(1);
    return points.concat([
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ]);
  }, []);
}

export function comparePrevPoint(points: Point[], position: number) {
  const current = points[points.length - 1];
  const prev = points[points.length - position];

  const distanceX = current.x - prev.x;
  const distanceY = current.y - prev.y;

  // 角度
  const rad = Math.atan(distanceY / distanceX);
  const angle = (rad * 180) / Math.PI;

  console.log(
    `x: ${distanceX}, y:${distanceY}, angle: ${angle.toFixed()}, length: ${
      points.length
    }`
  );

  return angle;
}

export function analysisPath(points: Point[]) {
  // TODO
}
