const fs = require("fs");
const path = require("path");

const publicDir = path.join(process.cwd(), "public");
const source = path.join(publicDir, "sitemap.xml");
const backup = path.join(publicDir, "sitemap1.xml");

if (fs.existsSync(source)) {
  fs.copyFileSync(source, backup);
} else {
  console.warn("sitemap.xml not found, skipping backup generation.");
}
