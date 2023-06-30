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

  socket.on('join', (newUserID: number) => {
    const userExist = activeUsers.some(({ userID }) => userID === newUserID)
    if (!userExist) {
      activeUsers.push({
        userID: newUserID,
        socketID: socket.id
      })
    }
    io.emit('active-users', activeUsers)
  })

  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter(({ socketID }) => socketID !== socket.id)
    io.emit('active-users', activeUsers)
  })

  socket.on("send-message", (data) => {
    const { linkedUserID } = data;
    const user = activeUsers.find((user) => user.userID === linkedUserID);
    if (user) io.to(user.socketID).emit("receive-message", data);
  });
  socket.on("delete-message", (data) => {
    const { messageId, linkedUserID } = data;
    const user = activeUsers.find((user) => user.userID === linkedUserID);
    if (user) io.to(user.socketID).emit("after-message-deletion", messageId);
  });
})
