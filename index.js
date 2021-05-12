const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = 5000

app.get('/hello', (req, res) => {
    res.send('Welcome to the server');
})

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('call ended');
    })

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('call user', { signal: signalData, from, name })
    })

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data)
    })
})

server.listen(PORT, '127.0.0.1', function () {
    console.log(`server listening on port ${PORT}`)
})