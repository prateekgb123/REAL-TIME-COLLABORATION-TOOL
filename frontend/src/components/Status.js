export default function Status({ connected }) {
  return (
    <div className="status">
      {connected ? "🟢 Connected" : "🔴 Disconnected"}
    </div>
  );
}
