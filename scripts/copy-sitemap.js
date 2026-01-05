const fs = require("fs");
const path = require("path");

const publicDir = path.join(process.cwd(), "public");
const source = path.join(publicDir, "sitemap.xml");
const backup = path.join(publicDir, "sitemap1.xml");
const textSitemap = path.join(publicDir, "sitemap.txt");

if (fs.existsSync(source)) {
  fs.copyFileSync(source, backup);

  const xml = fs.readFileSync(source, "utf8");
  const urls = [];
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  if (urls.length > 0) {
    fs.writeFileSync(textSitemap, `${urls.join("\n")}\n`);
  } else {
    console.warn("No <loc> entries found, skipping sitemap.txt generation.");
  }
} else {
  console.warn("sitemap.xml not found, skipping backup generation.");
}
