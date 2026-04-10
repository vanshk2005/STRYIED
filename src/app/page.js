"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import styles from "./page.module.css";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedCounter from "@/components/AnimatedCounter";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Basic Hero Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
      
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.4, ease: "back.out(1.7)" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.page}>
      <section ref={heroRef} className={styles.hero}>
        <ParticleBackground />
        
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            AI-Powered Legal Intelligence
          </div>
          
          <h1 ref={headlineRef} className={styles.headline}>
            Analyze Cases.<br/>
            <span className="gold-gradient-text">Identify Strategy.</span>
          </h1>
          
          <p className={styles.subheadline}>
            Instantly cross-reference case details with the Indian Penal Code (IPC) 
            and Code of Criminal Procedure (CrPC). Discover matched sections and AI-driven defense strategies.
          </p>
          
          <div ref={ctaRef} className={styles.ctaGroup}>
            <Link href="/analyze" className="primary-btn">
              Analyze a Case Now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
            <Link href="/database" className="secondary-btn">
              Browse Sections
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={`container ${styles.statsGrid}`}>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3><AnimatedCounter value={700} suffix="+" /></h3>
            <p>BNS, BNSS & BSA Sections</p>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3><AnimatedCounter value={25} suffix="+" /></h3>
            <p>Legal Strategies</p>
          </div>
          <div className={`glass-panel ${styles.statCard}`}>
            <h3><AnimatedCounter value={99} suffix="%" /></h3>
            <p>Analysis Accuracy</p>
          </div>
        </div>
      </section>
    </div>
  );
}
