const Document = require("../models/Document");

let rooms = {};

module.exports = (io) => {
  io.on("connection", (socket) => {

    socket.on("join-document", async ({ roomId, username }) => {
      socket.join(roomId);


      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }


      rooms[roomId].push({
        id: socket.id,
        username
      });

      io.to(roomId).emit("room-users", rooms[roomId]);

      let doc = await Document.findOne({ roomId });

      if (!doc) {
        doc = await Document.create({
          roomId,
          content: ""
        });
      }

      socket.emit("load-document", doc.content);
    });

    socket.on("send-changes", ({ roomId, content }) => {
      socket.to(roomId).emit("receive-changes", content);
    });

    socket.on("save-document", async ({ roomId, content }) => {
      await Document.findOneAndUpdate(
        { roomId },
        { content },
        { upsert: true }
      );
    });

    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter(
          user => user.id !== socket.id
        );

        io.to(roomId).emit("room-users", rooms[roomId]);
      }
    });

  });
};