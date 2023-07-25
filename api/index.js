import express from 'express';
import {Server as ServerSocket} from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new ServerSocket(server)

const port = process.env.PORT

io.on('connection' , socket => {
    console.log('Client: ',socket.id);
    socket.on('message' , message => {
        socket.broadcast.emit('message', {
            body:message,
            from: socket.id.slice(6)
        })
    })
    socket.on('stream', image => {
        socket.broadcast.emit('stream', image)
    })
})

server.listen(port, () => {
    console.log('server corriendo en el puerto :', port);
})