'use client'

import { FC, useState, useEffect } from "react";
import { useDraw } from "@/hooks/useDraw";
import { ChromePicker } from 'react-color'
import { io } from "socket.io-client"
import { drawLine } from "@/utils/drawLine";
const socket = io('https://draw-with-me.onrender.com')

interface pageProps {}

type DrawLineProps = {
    previousPoint: Point | null
    currentPoint: Point
    color: string
}

const Page: FC<pageProps> = ({}) => {

    const [color, setColor] = useState<string>('#000')

    const { onMouseDown, canvasRef, clear } = useDraw(createLine)

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d')

        socket.emit('client-ready')

        // turn canvas state into a string
        socket.on('get-canvas-state', () => {
            if(!canvasRef.current!.toDataURL()) return 
            socket.emit('canvas-state', canvasRef.current!.toDataURL())
        })

        socket.on('canvas-state-from-server', (state: string) => {
            const img = new Image()
            img.src = state
            img.onload = () => {
                ctx?.drawImage(img, 0, 0)
            }
        })

        socket.on('draw-line', ({ previousPoint, currentPoint, color }: DrawLineProps) => {
            if(!ctx) return
            drawLine({ previousPoint, currentPoint, ctx, color })
        })

        socket.on('clear', clear)

        return () => {
            socket.off('get-canvas-state')
            socket.off('canvas-state-from-server')
            socket.off('draw-line')
            socket.off('clear')
        }

    }, [])

    function createLine({previousPoint, currentPoint, ctx}: Draw) {
        socket.emit('draw-line', ({previousPoint, currentPoint, color}))
        drawLine({previousPoint, currentPoint, ctx, color})

    }

    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <div className="flex flex-col gap-2 pr-10">
                <h1 className="text-center text-3xl uppercase font-mono font-black bg-black text-white p-5 border-2 border-black rounded-md w-full">Draw with Me</h1>
                <ChromePicker color={color} onChange={(e) => setColor(e.hex)}/>
                <div class="text-center font-black bg-black text-white p-5 rounded-md">
                    <p>Draw on a shared canvas!</p>
                    <p>Your changes can be seen by anyone.</p>
                </div>
                <button type="button" onClick={() => socket.emit('clear')} className="p-2 rounded-md border-2 border-black bg-blood font-mono uppercase w-full font-black">Clear canvas</button>
            </div>
            <div className="">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    width={750}
                    height={750}
                    className="border-2 border-black rounded-md shadow-lg shadow-black-700"
                />        
            </div>
        </div>

    )
}

export default Page
