const Document = require("../models/Document");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-document", async (roomId) => {
      socket.join(roomId);

      let doc = await Document.findOne({ roomId });

      if (!doc) {
        doc = await Document.create({ roomId, content: "" });
      }

      socket.emit("load-document", doc.content);
    });

    socket.on("send-changes", ({ roomId, content }) => {
      socket.to(roomId).emit("receive-changes", content);
    });

    socket.on("save-document", async ({ roomId, content }) => {
      await Document.findOneAndUpdate({ roomId }, { content });
    });
  });
};
