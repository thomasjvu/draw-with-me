type Draw = {
    ctx: CanvasRenderingContext2D
    currentPoint: Point
    previousPoint: Point | Null
}

type Point = { x: number; y: number }
