export default function Users({ users }) {
  return (
    <div className="users">
      <h4>Online</h4>
      {users.map((u) => (
        <p key={u.id}>{u.username}</p>
      ))}
    </div>
  );
}
