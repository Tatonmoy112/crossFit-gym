import Link from "next/link";
export default function NotFound() {
  return (
    <section className="layout-container py-8">
      <h1>404</h1>
      <p>This page could not be found.</p>
      <Link prefetch={false} href="/">
        Back to home
      </Link>
    </section>
  );
}
