import { useRef, useEffect, useState } from "react"

export const useDraw = ( onDraw: ({ctx, currentPoint, previousPoint}: Draw) => void ) => {

    const [mouseDown, setMouseDown] = useState(false)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const previousPoint = useRef<null | Point>(null)

    const onMouseDown = ()  => setMouseDown(true)

    const clear = () => {
        const canvas = canvasRef.current
        if(!canvas) return

        const ctx = canvas.getContext('2d')
        if(!ctx) return
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    useEffect(() => {

        const handler = (e: MouseEvent) => {

            if (!mouseDown) return

            // console.log({x: e.clientX, y: e.clientY})
            const currentPoint = computePointInCanvas(e)

            const ctx = canvasRef.current?.getContext('2d')
            if(!ctx || !currentPoint) return

            onDraw({ ctx, currentPoint, previousPoint: previousPoint.current })
            previousPoint.current = currentPoint
        }

        const computePointInCanvas = (e: MouseEvent) => {
            const canvas = canvasRef.current
            if (!canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            return { x, y }
        }

        const mouseUpHandler = () => {
            setMouseDown(false)
            previousPoint.current = null
        }

        // Add event listeners if Canvas exists
        canvasRef.current?.addEventListener('mousemove', handler)
        window.addEventListener('mouseup', mouseUpHandler)

        // Remove event listeners
        return () => {
            canvasRef.current?.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', mouseUpHandler)
        }
        
    }, [onDraw])

    return { canvasRef, onMouseDown, clear }
}
