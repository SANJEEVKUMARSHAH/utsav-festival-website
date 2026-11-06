// Scrolls to the top of the page whenever the route changes.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function ScrollTop() {
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, [loc.pathname]);
  return null;
}
