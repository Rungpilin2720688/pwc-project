import Link from "next/link";
import { Container } from "./Container";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/products" className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            P
          </span>
          Product Catalogue
        </Link>
        <nav aria-label="Main">
          <Link href="/products" className={styles.navLink}>
            All products
          </Link>
        </nav>
      </Container>
    </header>
  );
}
