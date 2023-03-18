// declare var require: any
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const PORT = 3001


import { Server } from 'socket.io'

const io = new Server(server, {
    cors: {
        origin: '*'
    },
})

type Point = {
    x: number,
    y: number
}
type DrawLine = {
    previousPoint: Point | null
    currentPoint: Point
    color: string
}

io.on('connection', (socket) => {
    console.log('socket connected')

    socket.on('client-ready', () => {
        socket.broadcast.emit('get-canvas-state')
    })
    socket.on('draw-line', ({previousPoint, currentPoint, color}: DrawLine) => {
        socket.broadcast.emit('draw-line', {previousPoint, currentPoint, color})
    })

    socket.on('clear', () => io.emit('clear'))
})

server.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})
