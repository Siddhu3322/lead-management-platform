function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (
    <header className="navbar">
      <div>
        <h2>Lead Management Platform</h2>
        <p>Manage leads, notes and activities</p>
      </div>

      <div className="navbar-user">
        <div className="user-avatar">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <strong>{user.name || "User"}</strong>
          <span>{user.role || "MEMBER"}</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;