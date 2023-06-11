require('dotenv').config()
const http = require('http')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 8801

const server = http.createServer()
const io = socketIO(server)

let activeUsers: any[] = [];

io.on('connection', (socket) => {

  socket.on('join', (newUserId: number) => {
    const userExist = activeUsers.some(({ userId }) => userId === newUserId)
    if (!userExist) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id
      })
    }
    console.log('Connected to socket');

    io.emit('activeUsers', activeUsers)
  })

  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter(({ socketId }) => socketId !== socket.id)
    console.log('disconnected from socket');
    io.emit('activeUsers', activeUsers)
  })

})

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});