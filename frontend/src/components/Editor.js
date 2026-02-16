import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { socket } from "../socket";

export default function Editor({ roomId, username }) {
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.emit("join-document", { roomId, username });

    socket.on("load-document", setValue);
    socket.on("receive-changes", setValue);
    socket.on("presence", setUsers);
  }, []);

  const handleChange = (content) => {
    setValue(content);
    socket.emit("send-changes", { roomId, content });
  };

  return (
    <div className="editorLayout">
      {/* HEADER */}
      <div className="header">
        <div>
          <h3>Room: {roomId}</h3>
        </div>

        <div className="users">
          {users.map((u) => (
            <span key={u.id} className="avatar">
              {u.username[0]}
            </span>
          ))}
        </div>
      </div>

      {/* EDITOR */}
      <div className="editorContainer">
        <ReactQuill value={value} onChange={handleChange} theme="snow" />
      </div>
    </div>
  );
}
