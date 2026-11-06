import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DEFAULT_OG_IMAGE, getSeoForPath, SITE_URL } from "../seo";

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeoForPath(pathname);
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    document.title = seo.title;

    setMeta("name", "description", seo.description);
    setMeta("name", "robots", seo.noindex ? "noindex, follow" : "index, follow");
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonicalUrl);
    const shareImage = seo.image || DEFAULT_OG_IMAGE;
    setMeta("property", "og:image", shareImage);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);
    setMeta("name", "twitter:image", shareImage);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const existingSchema = document.getElementById("utsav-page-schema");
    if (existingSchema) existingSchema.remove();
    const schema = document.createElement("script");
    schema.id = "utsav-page-schema";
    schema.type = "application/ld+json";
    const data = pathname === "/"
      ? {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Utsav",
          alternateName: "Utsav – Our Culture, Our Light",
          url: `${SITE_URL}/`,
          description: seo.description,
        }
      : {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: seo.breadcrumb, item: canonicalUrl },
          ],
        };
    schema.textContent = JSON.stringify(data);
    document.head.appendChild(schema);
  }, [pathname]);

  return null;
}
