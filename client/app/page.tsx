'use client'

import { FC, useState, useEffect } from "react";
import { useDraw } from "@/hooks/useDraw";
import { ChromePicker } from 'react-color'
import { io } from "socket.io-client"
import { drawLine } from "@/utils/drawLine";
const socket = io('http://localhost:3001')

interface pageProps {}

type DrawLineProps = {
    previousPoint: Point | null
    currentPoint: Point
    color: string
}

const page: FC<pageProps> = ({}) => {

    const [color, setColor] = useState<string>('#000')

    const { onMouseDown, canvasRef, clear } = useDraw(createLine)

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d')

        socket.emit('client-ready')

        // socket.on('get-canvas-state', () => {
        //     if(!canvasRef.current.toDataUrl)
        // })

        socket.on('draw-line', ({ previousPoint, currentPoint, color }: DrawLineProps) => {
            if(!ctx) return
            drawLine({ previousPoint, currentPoint, ctx, color })
        })

        socket.on('clear', clear)
    }, [])

    function createLine({previousPoint, currentPoint, ctx}: Draw) {
        socket.emit('draw-line', ({previousPoint, currentPoint, color}))
        drawLine({previousPoint, currentPoint, ctx, color})

    }

    return (
        <div className='w-screen h-screen bg-white flex justify-center items-center'>
            <div className="flex flex-col gap-10 pr-10">
                <ChromePicker color={color} onChange={(e) => setColor(e.hex)}/>
                <button type="button" onClick={() => socket.emit('clear')} className="p-2 rounded-md border border-black font-mono uppercase">Clear canvas</button>
            </div>
            <div>
                <h1 className="text-center text-3xl uppercase my-5">Draw with Me</h1>
                <canvas 
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    width={750}
                    height={750}
                    className="border-2 border-black rounded-md"
                />        
            </div>
        </div>

    )
}

export default page
