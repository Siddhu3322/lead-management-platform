import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 30px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      {/* Logo / Title */}
      <div>
        <h2
          style={{
            margin: 0,
            color: "#2563eb",
          }}
        >
          Lead Management Platform
        </h2>

        <p
          style={{
            margin: "4px 0 0",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Manage leads, notes and activities
        </p>
      </div>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#374151",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Home
        </Link>

        <Link
          to="/task-b"
          style={{
            textDecoration: "none",
            color: "#374151",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Task B
        </Link>
      </nav>

      {/* User Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <strong
            style={{
              display: "block",
              color: "#111827",
            }}
          >
            {user.name || "User"}
          </strong>

          <span
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            {user.role || "MEMBER"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;