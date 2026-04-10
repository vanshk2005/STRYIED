"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./page.module.css";

export default function DatabasePage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [jumpPage, setJumpPage] = useState("");
  
  const gridRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const fetchSections = async (searchQuery, filterType, pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sections?q=${encodeURIComponent(searchQuery)}&type=${filterType}&page=${pageNum}`);
      const data = await res.json();
      
      if (res.ok) {
        setSections(data.sections);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        
        // Animate cards in
        if (gridRef.current) {
          const cards = gridRef.current.children;
          gsap.fromTo(cards, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSections("", "all", 1);
  }, []);

  // Handle Search with Debounce
  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchSections(val, type, 1);
    }, 500);
  };

  // Handle Filter Change
  const handleTypeChange = (newType) => {
    setType(newType);
    setPage(1);
    fetchSections(query, newType, 1);
  };

  // Handle Pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchSections(query, type, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      handlePageChange(p);
      setJumpPage("");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <header className={styles.header}>
          <h1 className="gold-gradient-text">Legal Database</h1>
          <p className={styles.subtitle}>
            Browse all the sections of the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and BSA.
          </p>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <span style={{marginRight: '12px', opacity: 0.5}}>🔍</span>
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Search by section number, keyword, or description..."
              value={query}
              onChange={handleSearch}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <button 
              className={`${styles.filterBtn} ${type === 'all' ? styles.active : ''}`}
              onClick={() => handleTypeChange('all')}
            >
              All
            </button>
            <button 
              className={`${styles.filterBtn} ${type === 'bns' ? styles.active : ''}`}
              onClick={() => handleTypeChange('bns')}
            >
              BNS
            </button>
            <button 
              className={`${styles.filterBtn} ${type === 'bnss' ? styles.active : ''}`}
              onClick={() => handleTypeChange('bnss')}
            >
              BNSS 
            </button>
            <button 
              className={`${styles.filterBtn} ${type === 'bsa' ? styles.active : ''}`}
              onClick={() => handleTypeChange('bsa')}
            >
              BSA
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{textAlign: 'center', padding: '60px'}}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              borderTopColor: 'var(--accent-gold)',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : (
          <>
            <div style={{marginBottom: '16px', color: 'var(--text-muted)'}}>
              Found {totalCount} sections {query ? `matching "${query}"` : ""}
            </div>
            
            {sections.length > 0 ? (
              <>
                <div ref={gridRef} className={styles.grid}>
                  {sections.map((item, idx) => (
                    <div key={`${item.section}-${idx}`} className={`glass-panel ${styles.card}`}>
                      <div className={styles.cardNumber}>{item.section}</div>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardDesc}>{item.description}</p>
                      
                      {item.loopholes && item.loopholes.length > 0 && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ color: '#ff6b6b', fontSize: '0.8rem', fontWeight: 600 }}>🛡️ LOPHOLES / BAIL</span>
                          <ul style={{ paddingLeft: '16px', margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {item.loopholes.slice(0, 2).map((lh, i) => (
                              <li key={i}>{lh}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                      <button 
                        className={styles.pageBtn}
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                      >
                        &larr; Prev
                      </button>
                      <span className={styles.pageInfo}>
                        Page {page} of {totalPages}
                      </span>
                      <button 
                        className={styles.pageBtn}
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        Next &rarr;
                      </button>
                    </div>

                    <form onSubmit={handleJumpSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Jump to:</span>
                      <input 
                        type="number" 
                        min="1" 
                        max={totalPages}
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        placeholder={`1 - ${totalPages}`}
                        style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white', width: '100px' }}
                      />
                      <button type="submit" className={styles.pageBtn} style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Go</button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-panel" style={{textAlign: 'center', padding: '60px'}}>
                <div style={{fontSize: '3rem', marginBottom: '16px'}}>📂</div>
                <h3>No results found</h3>
                <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>Try adjusting your search or filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
