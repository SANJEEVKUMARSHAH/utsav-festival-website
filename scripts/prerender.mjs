import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { routeSeo, SITE_URL, DEFAULT_OG_IMAGE } from "../src/seo.js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const routes = [
  "/", "/chhath", "/tihar", "/rangoli-studio", "/calendar",
  "/wishes", "/gallery", "/ritual-guide", "/about", "/countdown"
];

const vite = await createServer({
  configFile: "./vite.config.js",
  server: { middlewareMode: true },
  appType: "custom"
});

try {
  const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
  const template = await readFile("dist/index.html", "utf8");

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const replaceMeta = (html, selector, tag) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`<meta(?=[^>]*${escaped}[^>]*)[^>]*>`, "i");
    return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
  };

  for (const route of routes) {
    const seo = routeSeo[route];
    const canonical = `${SITE_URL}${route === "/" ? "/" : route}`;
    let html = template.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
    html = replaceMeta(html, 'name="description"', `<meta name="description" content="${escapeHtml(seo.description)}" />`);
    html = replaceMeta(html, 'name="robots"', '<meta name="robots" content="index, follow" />');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
    const meta = [
      ['property="og:title"', 'property', 'og:title', seo.title],
      ['property="og:description"', 'property', 'og:description', seo.description],
      ['property="og:type"', 'property', 'og:type', 'website'],
      ['property="og:url"', 'property', 'og:url', canonical],
      ['property="og:image"', 'property', 'og:image', seo.image || DEFAULT_OG_IMAGE],
      ['name="twitter:card"', 'name', 'twitter:card', 'summary_large_image'],
      ['name="twitter:title"', 'name', 'twitter:title', seo.title],
      ['name="twitter:description"', 'name', 'twitter:description', seo.description],
      ['name="twitter:image"', 'name', 'twitter:image', seo.image || DEFAULT_OG_IMAGE]
    ];
    for (const [selector, attr, key, value] of meta) {
      html = replaceMeta(html, selector, `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`);
    }

    const schema = route === "/" ? {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Utsav",
      alternateName: "Utsav – Our Culture, Our Light",
      url: `${SITE_URL}/`,
      description: seo.description
    } : {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: seo.breadcrumb, item: canonical }
      ]
    };
    html = html.replace("</head>", `    <script id="utsav-page-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>\n  </head>`);

    const markup = renderToString(render(route));
    html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    const output = route === "/" ? "dist/index.html" : join("dist", route.slice(1), "index.html");
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, html);
    console.log(`Prerendered ${route}`);
  }
} finally {
  await vite.close();
}
