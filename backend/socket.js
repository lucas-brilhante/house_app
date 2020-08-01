const socketIO = require("socket.io");

let io;

module.exports = {
  initIo(httpServer) {
    io = socketIO(httpServer);
    return io;
  },
  getIo() {
    return io;
  },
};
