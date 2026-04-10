export default function Footer() {
  return (
    <footer style={{ padding: "40px 0", borderTop: "1px solid var(--card-border)", marginTop: "80px", background: "var(--bg-color)" }}>
      <div className="container" style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        <p style={{ marginBottom: "16px" }}>
          <strong>Disclaimer:</strong> This tool is for educational purposes only and is not a substitute for professional legal advice. 
          The suggestions provided are generated through statistical matching and should be verified by a qualified legal professional.
        </p>
        <p>© {new Date().getFullYear()} STRYIED Framework. All rights reserved.</p>
      </div>
    </footer>
  );
}
