import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ padding: "120px 0 60px", minHeight: "calc(100vh - 160px)" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "16px" }} className="gold-gradient-text">About STRYIED</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>
            Bridging the gap between complex legal code and accessible intelligence.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "40px", marginBottom: "40px", lineHeight: "1.8" }}>
          <h2 style={{ marginBottom: "20px", color: "var(--accent-gold)" }}>Our Mission</h2>
          <p style={{ marginBottom: "20px" }}>
            The STRYIED Case Analyzer was created to democratize access to legal information. 
            Understanding the new Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) can be daunting for the average person. 
            Our tool uses a heuristic matching engine to instantly cross-reference natural language descriptions against a database of over 700 legal sections.
          </p>
          <p>
            Whether you are a law student, legal professional, or a curious citizen, STRYIED provides rapid insights and suggests potential defense strategies based on statistical confidence scores.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "40px", marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "20px", color: "var(--accent-gold)" }}>How It Works</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ background: "rgba(201, 162, 39, 0.1)", color: "var(--accent-gold)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>1</div>
              <div>
                <h3 style={{ marginBottom: "8px" }}>Contextual Input</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>You provide a brief natural-language description of an incident, crime, or legal scenario.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ background: "rgba(201, 162, 39, 0.1)", color: "var(--accent-gold)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>2</div>
              <div>
                <h3 style={{ marginBottom: "8px" }}>Keyword Matching Engine</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Our backend rapidly scans the text and matches intent against thousands of keywords tied to specific BNS, BNSS, and BSA sections.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ background: "rgba(201, 162, 39, 0.1)", color: "var(--accent-gold)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>3</div>
              <div>
                <h3 style={{ marginBottom: "8px" }}>Strategy Scoring</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Using a proprietary algorithm, the analyzer evaluates 25 distinct legal strategies, scoring them based on contextual overlap with the case details.</p>
              </div>
            </div>

          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <Link href="/analyze" className="primary-btn" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
            Try the Analyzer Now
          </Link>
        </div>

      </div>
    </div>
  );
}
