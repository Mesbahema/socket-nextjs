import { Server } from 'socket.io'

const ioHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log('*First use, starting socket.io')

        const io = new Server(res.socket.server)

        io.on('connection', socket => {
            socket.on('send-message', (message, pid) => {
                console.log('message', message, 'pid', pid)
                socket.broadcast.emit(`recieve-message-${pid}`, message)
            })

            socket.on('join-room', (room, cb) => {
                socket.join(room)
                cb(`joined ${room}`)
            })
        })

        //   res.socket.server.io = io
    } else {
        socket.on('send-message', (message) => {
            socket.emit('recieve-message', message)
        })
    }
    return res.status(200).json({ name: 'John Doe' })
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default ioHandler