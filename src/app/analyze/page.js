"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./page.module.css";

const EXAMPLE_PROMPTS = [
  "A man broke into a house at night to steal jewelry.",
  "Husband harassing his wife for dowry and causing her physical harm.",
  "Driving under the influence of alcohol and causing an accident out of negligence.",
  "Using a forged document to cheat someone out of their property."
];

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  
  const resultsRef = useRef(null);
  const sectionsRef = useRef([]);
  const strategiesRef = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setResults(null);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze text");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // GSAP Animations for results
  useEffect(() => {
    if (results) {
      const ctx = gsap.context(() => {
        // Animate section cards
        if (sectionsRef.current.length > 0) {
          gsap.to(sectionsRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
          });
        }

        // Animate strategy bars
        if (strategiesRef.current.length > 0) {
          strategiesRef.current.forEach((el, index) => {
            const bar = el.querySelector("." + styles.barFill);
            const score = results.strategies[index].score * 100;
            
            gsap.to(el, { opacity: 1, duration: 0.4, delay: index * 0.1 });
            gsap.to(bar, { 
              width: `${score}%`, 
              duration: 1.2, 
              delay: index * 0.1,
              ease: "power3.out"
            });
          });
        }
      }, resultsRef);

      return () => ctx.revert();
    }
  }, [results]);

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <header className={styles.header}>
          <h1 className="gold-gradient-text">Case Intelligence Engine</h1>
          <p className={styles.subtitle}>
            Advanced semantic analysis across BNS, BNSS, and BSA frameworks. Designed for high-speed legal research and tactical defense planning.
          </p>
          <div className={styles.disclaimerPill}>
            <span>⚖️</span> PROFESSIONAL LEGAL RESEARCH ASSISTANT
          </div>
        </header>


        <div className={styles.analyzerLayout}>
          {/* Input Area */}
          <div className={styles.inputPanel}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="caseDescription">Case Description</label>
                <textarea
                  id="caseDescription"
                  className={styles.textarea}
                  placeholder="Enter a short case summary or describe the event..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit" 
                className={`primary-btn ${styles.submitBtn}`}
                disabled={isLoading || !text.trim()}
              >
                {isLoading ? (
                  <><span className={styles.loader}></span> Analyzing Context...</>
                ) : (
                  "Run Analysis"
                )}
              </button>
            </form>

            <div className={styles.examplePrompts}>
              <p>Try an example:</p>
              <div className={styles.tagGroup}>
                {EXAMPLE_PROMPTS.map((prompt, idx) => (
                  <button 
                    key={idx} 
                    className={styles.tag}
                    onClick={() => setText(prompt)}
                  >
                    "{prompt.substring(0, 30)}..."
                  </button>
                ))}
              </div>
            </div>

            {error && <div style={{color: '#ef4444', marginTop: '16px'}}>{error}</div>}
          </div>

          {/* Results Area */}
          <div ref={resultsRef} className={styles.resultsPanel}>
            {results && (
              <>
                <div>
                  <h2 className={styles.sectionHeader}>
                    <span>⚖️</span> Matched Legal Sections
                  </h2>
                  
                  {results.sections.length > 0 ? (
                    <div>
                      {results.sections.map((section, idx) => (
                        <div 
                          key={idx} 
                          className={`glass-panel ${styles.resultCard}`}
                          ref={el => sectionsRef.current[idx] = el}
                        >
                          <div className={styles.sectionBadge}>{section.section}</div>
                          <h3 className={styles.cardTitle}>{section.title}</h3>
                          <p className={styles.cardDesc}>{section.description}</p>
                          
                          {section.loopholes && section.loopholes.length > 0 && (
                            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255, 99, 71, 0.1)', borderRadius: '8px', borderLeft: '3px solid #ff6b6b' }}>
                              <h4 style={{ color: '#ff6b6b', marginBottom: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>🛡️</span> Potential Bails & Loopholes
                              </h4>
                              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {section.loopholes.map((lh, i) => (
                                  <li key={i} style={{ marginBottom: '4px' }}>{lh}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {section.confidence && (
                            <div className={styles.confidenceScore} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Semantic Match:</div>
                              <div className={styles.scorePill} style={{ 
                                background: section.confidence > 70 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                color: section.confidence > 70 ? '#4ade80' : '#fbbf24',
                                padding: '2px 10px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                border: `1px solid ${section.confidence > 70 ? '#4ade80' : '#fbbf24'}`,
                                fontWeight: '600'
                              }}>
                                {section.confidence}% Confidence
                              </div>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`glass-panel ${styles.emptyState}`}>
                      <span style={{fontSize: '2rem', display: 'block', marginBottom: '16px'}}>🔍</span>
                      <p>No specific BNS, BNSS, or BSA sections matched your description.</p>
                      <p style={{fontSize: '0.9rem', marginTop: '8px'}}>Try using more specific legal terms or describing the exact nature of the crime.</p>
                    </div>
                  )}
                </div>

                <div style={{marginTop: '24px'}}>
                  <h2 className={styles.sectionHeader}>
                    <span>💡</span> Suggested Legal Strategies
                  </h2>
                  
                  <div className="glass-panel" style={{padding: '32px'}}>
                    {results.strategies.map((strategy, idx) => (
                      <div 
                        key={idx} 
                        className={styles.strategyItem}
                        ref={el => strategiesRef.current[idx] = el}
                      >
                        <div className={styles.strategyHeader}>
                          <span className={styles.strategyName}>{strategy.label}</span>
                          <span className={styles.strategyScore}>{(strategy.score * 100).toFixed(1)}% Match</span>
                        </div>
                        <p className={styles.strategyDesc}>{strategy.description}</p>
                        <div className={styles.barTrack}>
                          <div className={styles.barFill} />
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!results && !isLoading && (
              <div className={`glass-panel ${styles.emptyState}`} style={{opacity: 0.5}}>
                <span style={{fontSize: '3rem', display: 'block', marginBottom: '16px'}}>📄</span>
                <h2>Awaiting Input</h2>
                <p>Submit a case description to view analysis results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
