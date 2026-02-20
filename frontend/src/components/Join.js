import { useState } from "react";
import { v4 as uuid } from "uuid";
import Editor from "./Editor";
import "../App.css";
import main from "../main.png";
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
      
     <img src={main} alt="Main" className="main" /> 
    <h1>Collaboration Space</h1>

  <div className="inputGroup">
    <input
      type="text"
      placeholder=" "
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <label>Your Name</label>
  </div>

  <div className="inputGroup">
    <input
      type="text"
      placeholder=" "
      value={room}
      onChange={(e) => setRoom(e.target.value)}
    />
    <label>Room ID</label>
  </div>

  <div className="btns">
    <button className="joinBtn" onClick={handleJoin}>
      Join Room
    </button>

    <button className="createBtn" onClick={handleCreate}>
      Create New
    </button>
  </div>
</div>

    </div>
  );
}
