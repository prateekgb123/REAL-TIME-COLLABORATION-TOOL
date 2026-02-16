 import React, { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Editor({ roomId }) {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join-document", roomId);

    socket.on("load-document", (content) => {
      setText(content);
    });

    socket.on("receive-changes", (content) => {
      setText(content);
    });
  }, [roomId]);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    socket.emit("send-changes", { roomId, content: value });
    socket.emit("save-document", { roomId, content: value });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Room ID: {roomId}</h3>
      <textarea
        value={text}
        onChange={handleChange}
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
}
