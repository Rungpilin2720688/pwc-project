import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>Page not found</h1>
      <p>The page or product you are looking for does not exist.</p>
      <Link href="/products">Back to products</Link>
    </div>
  );
}
