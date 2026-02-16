import { useState } from "react";
import { v4 as uuid } from "uuid";
import Editor from "./Editor";
import "../App.css";

export default function Join() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const handleCreate = () => {
    const id = uuid();
    setRoom(id);
    setJoined(true);
  };

  const handleJoin = () => {
    if (!room || !username) return alert("Enter details");
    setJoined(true);
  };

  if (joined) return <Editor username={username} roomId={room} />;

  return (
    <div className="joinPage">
      <div className="joinCard">
        <h1>🚀 Collaboration Space</h1>

        <input
          placeholder="Your name"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Enter Room ID"
          onChange={(e) => setRoom(e.target.value)}
        />

        <div className="btns">
          <button onClick={handleJoin}>Join Room</button>
          <button className="create" onClick={handleCreate}>
            Create New
          </button>
        </div>
      </div>
    </div>
  );
}
