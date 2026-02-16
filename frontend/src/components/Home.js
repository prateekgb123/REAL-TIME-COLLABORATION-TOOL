import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import Editor from "./Editor";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const createRoom = () => {
    setRoom(uuid());
    setJoined(true);
  };

  if (joined) return <Editor roomId={room} />;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Real-Time Collaboration</h2>
      <button onClick={createRoom}>Create New Room</button>
    </div>
  );
}
