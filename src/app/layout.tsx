import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Product Catalogue", template: "%s · Product Catalogue" },
  description: "Browse, filter and review products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className={styles.main}>
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}
