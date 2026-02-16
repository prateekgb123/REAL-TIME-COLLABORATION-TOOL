const Document = require("../models/Document");

let rooms = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-document", async ({ roomId, username, color }) => {
      socket.join(roomId);

      if (!rooms[roomId]) rooms[roomId] = [];

      rooms[roomId].push({
        id: socket.id,
        username,
        color
      });

      io.to(roomId).emit("presence", rooms[roomId]);

      let doc = await Document.findOne({ roomId });
      if (!doc) doc = await Document.create({ roomId, content: "" });

      socket.emit("load-document", doc.content);
    });

    socket.on("send-changes", ({ roomId, content }) => {
      socket.to(roomId).emit("receive-changes", content);
    });

    socket.on("save-document", async ({ roomId, content }) => {
      await Document.findOneAndUpdate({ roomId }, { content });
    });

    socket.on("disconnect", () => {
      for (const room in rooms) {
        rooms[room] = rooms[room].filter((u) => u.id !== socket.id);
        io.to(room).emit("presence", rooms[room]);
      }
    });
  });
};
