import { fabric } from 'fabric'
import { comparePrevPoint } from '../models/analyzePath'

const PREV_POSITION = 5

interface FabricCanvasPrototype {
  _onMouseDownInDrawingMode: (e: any) => void
  _onMouseMoveInDrawingMode: (e: any) => void
  _onMouseUpInDrawingMode: (e: any) => void
}

const fabricCanvasPrototype = fabric.Canvas.prototype as any as FabricCanvasPrototype

// fabric.Canvas をオーバーライド
export const FabricCanvasEx = fabric.util.createClass(fabric.Canvas, {
  freeDrawingPoints: [],

  _onMouseDownInDrawingMode(e: any) {
    // call super method
    fabricCanvasPrototype._onMouseDownInDrawingMode.bind(this)(e)

    const pointer = this.getPointer(e)
    this.freeDrawingPoints.push({ x: pointer.x, y: pointer.y })
  },

  _onMouseMoveInDrawingMode(e: any) {
    // call super method
    fabricCanvasPrototype._onMouseMoveInDrawingMode.bind(this)(e)

    if (this._isCurrentlyDrawing) {
      const pointer = this.getPointer(e)
      this.freeDrawingPoints.push({ x: pointer.x, y: pointer.y })

      if (
        this.freeDrawingPoints.length >= PREV_POSITION &&
        this.freeDrawingPoints.length % PREV_POSITION === 0
      ) {
        comparePrevPoint(this.freeDrawingPoints, PREV_POSITION)
      }
    }
  },

  _onMouseUpInDrawingMode(e: any) {
    // call super method
    fabricCanvasPrototype._onMouseUpInDrawingMode.bind(this)(e)

    const pointer = this.getPointer(e)
    this.freeDrawingPoints.push({ x: pointer.x, y: pointer.y })
    this.freeDrawingPoints.length = 0
  },
})
