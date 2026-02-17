import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { socket } from "../socket";

export default function Editor({ roomId, username }) {
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    socket.emit("join-document", { roomId, username });

    socket.once("load-document", (content) => {
      setValue(content);
      setLoaded(true);
    });

    socket.on("receive-changes", (content) => {
      setValue(content);
    });

    return () => {
      socket.off("receive-changes");
    };
  }, [roomId, username]);

  const handleChange = (content) => {
    setValue(content);
    socket.emit("send-changes", { roomId, content });
  };

  // autosave
  useEffect(() => {
    const interval = setInterval(() => {
      if (loaded) {
        socket.emit("save-document", { roomId, content: value });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [value, loaded, roomId]);

  if (!loaded) return <p style={{ padding: 20 }}>Loading document...</p>;

return (
  <div className="editorWrapper">

    {/* HEADER */}
    <div className="editorHeader">
      <div>
        <strong>Room ID:</strong> {roomId}
      </div>
      <div>
        <strong>User:</strong> {username}
      </div>
    </div>

    {/* EDITOR AREA */}
    <div className="editorBody">
      <div className="editorContainer">
        <ReactQuill
          value={value}
          onChange={handleChange}
          theme="snow"
        />
      </div>
    </div>

  </div>
);

}
