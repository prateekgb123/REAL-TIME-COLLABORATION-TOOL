const Document = require("../models/Document");

let activeUsers = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("join-document", async ({ roomId, username }) => {
      socket.join(roomId);

      if (!activeUsers[roomId]) activeUsers[roomId] = [];
      activeUsers[roomId].push({ id: socket.id, username });

      io.to(roomId).emit("users", activeUsers[roomId]);

      let doc = await Document.findOne({ roomId });
      if (!doc) doc = await Document.create({ roomId, content: "" });

      socket.emit("load-document", doc.content);
    });

    socket.on("send-changes", ({ roomId, content }) => {
      socket.to(roomId).emit("receive-changes", content);
    });

    socket.on("typing", ({ roomId, username }) => {
      socket.to(roomId).emit("typing", username);
    });

    socket.on("save-document", async ({ roomId, content }) => {
      await Document.findOneAndUpdate({ roomId }, { content });
    });

    socket.on("disconnect", () => {
      for (const room in activeUsers) {
        activeUsers[room] = activeUsers[room].filter(
          (u) => u.id !== socket.id
        );
        io.to(room).emit("users", activeUsers[room]);
      }
    });
  });
};
