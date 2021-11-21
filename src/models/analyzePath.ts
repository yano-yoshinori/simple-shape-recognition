import assert from 'assert'
import _ from 'lodash'

const NOIZE_THRESHOLD = 1

interface Point {
  x: number
  y: number
}

interface ExtendedPoint extends Point {
  xLength: number
  yLength: number
  angle: number
}

export function normalize(path: number[][]) {
  return path.reduce((points: Point[], p: number[]) => {
    assert([3, 5].includes(p.length))

    if (p.length === 3) {
      const [x, y] = p.slice(1)
      return points.concat({ x, y })
    }

    const [x1, y1, x2, y2] = p.slice(1)
    return points.concat([
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ])
  }, [])
}

export function comparePrevPoint(points: Point[], position: number) {
  const current = points[points.length - 1]
  const prev = points[points.length - position]

  const distanceX = current.x - prev.x
  const distanceY = current.y - prev.y

  // 角度
  const rad = Math.atan(distanceY / distanceX)
  const deg = (rad * 180) / Math.PI

  console.log(`x: ${distanceX}, y:${distanceY}, angle: ${deg.toFixed()}, length: ${points.length}`)

  return deg
}

// 座標から必要なデータを作る
function buildData(startPoint: Point, endPoint: Point) {
  const xLength = endPoint.x - startPoint.x
  const yLength = endPoint.y - startPoint.y

  const rad = Math.atan(yLength / xLength)
  const deg = (rad * 180) / Math.PI

  let angle = 0

  if (yLength >= 0) {
    if (xLength >= 0) {
      angle = deg
    } else {
      angle = 180 + deg
    }
  } else {
    if (xLength >= 0) {
      angle = 360 + deg
    } else {
      angle = 180 + deg
    }
  }

  return {
    xLength,
    yLength,
    angle,
  }
}

// const Y_LENGTH_THRESHOLD = 5

export function analyzePath(points: Point[]) {
  console.log(points.length)

  // 座標から必要なデータを作る。angle, 長さの算出
  const extendedPoints = _.chain(points)
    .map((point, i) => {
      if (i === points.length - 1)
        return {
          x: 0,
          y: 0,
          xLength: 0,
          yLength: 0,
          angle: 0,
        }

      const data = buildData(point, points[i + 1])

      return {
        ...point,
        ...data,
      }
    })
    .slice(0, points.length - 1)
    // ノイズデータを除去する
    // TODO 両隣 10 点と比較して、著しく値が異なる
    .filter((point: ExtendedPoint) => {
      return Math.abs(point.xLength) > NOIZE_THRESHOLD || Math.abs(point.yLength) > NOIZE_THRESHOLD
    })
    .value()

  console.log(extendedPoints.length)
  // const after = removeNoizePoints(extendedPoints)

  // console.log(extendedPoints.length, after.length)

  // console.log(after)

  // データを分析
  // let yHorizontalCount = 0

  // const analyzedPoints = extendedPoints.map((extendedPoint: any) => {
  //   // y の水平カウント
  //   if (extendedPoint.yLength < Y_LENGTH_THRESHOLD) {
  //     yHorizontalCount += 1
  //   } else {
  //     yHorizontalCount = 0
  //   }

  //   return {
  //     yHorizontalCount,
  //   }
  // })

  // console.log(analyzedPoints);

  // TODO 類似データごとに分割する
  // 過去の直近 10 点と比較
  // for (let i = 10; i < extendedPoints.length; i += 1) {
  //   const current: any = extendedPoints[i]
  //   const recent10Points = extendedPoints.slice(i - 10, i - 1)
  //   const average =
  //     _.sumBy(recent10Points, (point: any) => {
  //       return point.yLength
  //     }) / 10

  //   const result = Math.abs(current.yLength) < 2 ? 0 : current.yLength / average

  //   console.log(
  //     'average',
  //     average,
  //     'current',
  //     current.yLength,
  //     'angle',
  //     current.angle,
  //     Math.round(result * 100),
  //     result === 0 && 45 < Math.abs(current.angle) && Math.abs(current.angle) < 135 ? '水平線' : ''
  //   )
  // }

  const b = countPer90Deg(extendedPoints)
  console.log(b)

  // TODO 形状を判定する
  const c = isLine(b)

  console.log(c ? 'Line' : 'Other')

  isRectangle(b)
}

// 90度ずつでグルーピングしてカウント
function countPer90Deg(extendedPoints: any[]) {
  return extendedPoints.reduce(
    (ac: any, extendedPoint: any) => {
      let { top, right, bottom, left } = ac
      const { angle } = extendedPoint

      const RIGHT_ANGLE = 90
      const HALF_RIGHT_ANGLE = 45

      if (360 - HALF_RIGHT_ANGLE <= angle || angle < HALF_RIGHT_ANGLE) {
        right += 1
      } else if (HALF_RIGHT_ANGLE <= angle && angle < HALF_RIGHT_ANGLE + RIGHT_ANGLE) {
        bottom += 1
      } else if (
        HALF_RIGHT_ANGLE + RIGHT_ANGLE <= angle &&
        angle < HALF_RIGHT_ANGLE + 2 * RIGHT_ANGLE
      ) {
        left += 1
      } else {
        top += 1
      }

      return {
        top,
        right,
        bottom,
        left,
      }
    },
    { top: 0, right: 0, bottom: 0, left: 0 }
  )
}

// 水平線 or 垂直線かどうか判定する
function isLine(data: any): boolean {
  const { top, right, bottom, left } = data

  const values = [top, right, bottom, left]

  const zeroCount = values.filter((value) => value === 0).length

  // 向きが1つだけのときは即決
  if (zeroCount === 3) {
    return true
  }

  // maxの20%未満の値は無視する
  const max = Math.max(top, right, bottom, left)

  const zeroCount2 = values.filter((value) => value < max * 0.2).length

  if (zeroCount2 === 3) {
    return true
  }

  return false
}

// 四角形かどうか判定する
function isRectangle(data: any): boolean {
  const { top, right, bottom, left } = data

  const values = [top, right, bottom, left]

  const zeroCount = values.filter((value) => value === 0).length

  if (zeroCount > 0) {
    return false
  }

  // 始点と終点が近い

  return true
}
