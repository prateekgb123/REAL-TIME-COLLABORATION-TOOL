import { useState } from "react";
import { v4 as uuid } from "uuid";
import Editor from "./Editor";
import "../App.css";

export default function Join() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [join, setJoin] = useState(false);

  const handleCreate = () => {
    setRoom(uuid());
    setJoin(true);
  };

  if (join) return <Editor username={name} roomId={room} />;

  return (
    <div className="join">
      <div className="card">
        <h2>Realtime Collaboration</h2>
        <input
          placeholder="Enter username"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleCreate}>Create Room</button>
      </div>
    </div>
  );
}
