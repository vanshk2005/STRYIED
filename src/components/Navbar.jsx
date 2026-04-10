import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚖️</span>
          STRYIED
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/analyze">Analyze Case</Link>
          <Link href="/database">Database</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
