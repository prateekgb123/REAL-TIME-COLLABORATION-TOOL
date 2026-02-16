import { useEffect, useState } from "react";
import { socket } from "../socket";
import Users from "./Users";

export default function Editor({ roomId, username }) {
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    socket.emit("join-document", { roomId, username });

    socket.on("load-document", (content) => setText(content));
    socket.on("receive-changes", (c) => setText(c));
    socket.on("users", (u) => setUsers(u));
    socket.on("typing", (name) => {
      setTyping(name);
      setTimeout(() => setTyping(""), 1000);
    });
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    socket.emit("send-changes", { roomId, content: value });
    socket.emit("typing", { roomId, username });
  };

  // autosave every 2 sec
  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("save-document", { roomId, content: text });
    }, 2000);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="editorPage">
      <div className="top">
        <h3>Room: {roomId}</h3>
        <button onClick={() => navigator.clipboard.writeText(roomId)}>
          Copy Room ID
        </button>
      </div>

      <div className="body">
        <textarea value={text} onChange={handleChange} />
        <Users users={users} />
      </div>

      {typing && <p className="typing">{typing} is typing...</p>}
    </div>
  );
}
