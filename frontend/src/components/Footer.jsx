const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "30px",
        padding: "16px",
        textAlign: "center",
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
        color: "#6b7280",
        fontSize: "14px",
      }}
    >
      <span>Built for </span>

      <a
        href="https://digitalheroesco.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Digital Heroes Training Task
      </a>
    </footer>
  );
};

export default Footer;