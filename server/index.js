const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("call-offer", (userId, offer) => {
      socket.broadcast.to(roomId).emit("user-offer", userId, offer);
    });

    socket.on("call-answer", (userId, offer) => {
      socket.broadcast.to(roomId).emit("user-answer", userId, offer);
      io.sockets.in(roomId).emit("text");
    });

    socket.on("new-icecandidate", (candidate) => {
      socket.broadcast.to(roomId).emit("new-icecandidate", candidate);
    });

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});

io.listen(3000);
