export default function Presence({ users }) {
  return (
    <div className="presence">
      <h4>Online</h4>
      {users.map((u) => (
        <p key={u.id} style={{ color: u.color }}>
          ● {u.username}
        </p>
      ))}
    </div>
  );
}
