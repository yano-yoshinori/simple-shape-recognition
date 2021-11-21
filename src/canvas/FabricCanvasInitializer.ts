import { fabric } from 'fabric'
import { analyzePath, normalize } from '../models/analyzePath'
import { FabricCanvasEx } from './FabricCanvasEx'

// fabric.Canvas インスタンスの生成とイベントハンドリング
export class FabricCanvasInitializer {
  private canvas: fabric.Canvas

  constructor(canvasEl: HTMLCanvasElement) {
    const { innerWidth, innerHeight } = window

    this.canvas = new FabricCanvasEx(canvasEl, {
      width: innerWidth,
      height: innerHeight,
      isDrawingMode: true,
      backgroundColor: '#333',
    })
    this.canvas.freeDrawingBrush.color = 'white'

    this.canvas.on('path:created', this.onPathCreated)
  }

  onPathCreated(e: any) {
    const {
      path: { path },
    } = e

    const points = normalize(path)
    analyzePath(points)
  }
}
