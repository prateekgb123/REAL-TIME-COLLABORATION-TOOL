import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { socket } from "../socket";
import logo from "../logo.png";
export default function Editor({ roomId, username }) {
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  const hasJoined = useRef(false); 

  // =============================
  // JOIN ROOM & SOCKET LISTENERS
  // =============================
  useEffect(() => {
    if (!roomId || !username) return;

    if (!hasJoined.current) {
      socket.emit("join-document", { roomId, username });
      hasJoined.current = true;
    }

    const handleLoad = (content) => {
      setValue(content);
      setLoaded(true);
    };

    const handleReceiveChanges = (content) => {
      setValue(content);
    };

    const handleRoomUsers = (usersList) => {
      setUsers(usersList);
    };

    socket.once("load-document", handleLoad);
    socket.on("receive-changes", handleReceiveChanges);
    socket.on("room-users", handleRoomUsers);

    return () => {
      socket.off("receive-changes", handleReceiveChanges);
      socket.off("room-users", handleRoomUsers);
      socket.off("load-document", handleLoad);
    };
  }, [roomId]); 

  // =============================
  // HANDLE TEXT CHANGE
  // =============================
  const handleChange = (content) => {
    setValue(content);
    socket.emit("send-changes", { roomId, content });
  };

  // =============================
  // AUTOSAVE
  // =============================
  useEffect(() => {
    if (!loaded) return;

    const interval = setInterval(() => {
      socket.emit("save-document", { roomId, content: value });
    }, 2000);

    return () => clearInterval(interval);
  }, [value, loaded, roomId]);

  if (!loaded) return <p style={{ padding: 20 }}>Loading document...</p>;

  return (
    <div className="editorWrapper">

      {/* ================= HEADER ================= */}
      <div className="editorHeader">

        {/* LEFT */}
        <div className="headerLeft">
        <img src={logo} alt="Logo" className="headerLogo" />
        <span>CollabSpace</span>
      </div>
        {/* CENTER */}
        <div className="headerCenter">
          Room ID: {roomId}
        </div>

        {/* RIGHT - USERS */}
        <div className="headerRight">
          <div
            className="usersDropdown"
            onClick={() => setShowUsers(prev => !prev)}
          >
            👥 {users.length} ▼
          </div>

          {showUsers && (
            <div className="usersMenu">
              {users.map((user) => (
                <div key={user.id} className="userItem">
                  {user.username}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ================= EDITOR BODY ================= */}
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