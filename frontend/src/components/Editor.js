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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* HEADER */}
      <div
        style={{
          height: "60px",
          background: "#111",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px"
        }}
      >
        <div>
          <strong>Room:</strong> {roomId}
        </div>

        <div>
          <strong>User:</strong> {username}
        </div>
      </div>

      {/* EDITOR */}
      <div style={{ flex: 1 }}>
        <ReactQuill
          value={value}
          onChange={handleChange}
          theme="snow"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
