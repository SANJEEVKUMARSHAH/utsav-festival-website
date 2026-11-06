import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Shown for any address that does not match a page.
export default function NotFound() {
  return <main className="not-found">
    <p className="not-found-code">404</p>
    <h1>This page has wandered off.</h1>
    <p>The address may have a typo, or the page may have moved.</p>
    <Link
      className="btn btn-gold"
      to="/"
    >
        Back to home <ArrowRight size={16} />
      </Link>
  </main>;
}
