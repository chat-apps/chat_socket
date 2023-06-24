require('dotenv').config()
const http = require('http')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 8801

const io = socketIO(PORT, {
  cors: {
    origin: "*",
  },
})

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
    io.emit('activeUsers', activeUsers)
  })

  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter(({ socketId }) => socketId !== socket.id)
    io.emit('activeUsers', activeUsers)
  })

})
