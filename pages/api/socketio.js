import { Server } from 'socket.io'

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log('*First use, starting socket.io')

        const io = new Server(res.socket.server)

        io.on('connection', socket => {
            socket.on('send-message', (message) => {
                console.log(message)
                socket.broadcast.emit('recieve-message', message)
            })
        })

        //   res.socket.server.io = io
    } else {
        socket.on('send-message', (message) => {
            socket.emit('recieve-message', message)
        })
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler