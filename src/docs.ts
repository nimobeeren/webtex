import fs from "fs";
import { join } from "path";

const docsDirectory = join(process.cwd(), "docs");

export function getDocBySlug(slug: string): string {
  const path = join(docsDirectory, `${slug}.md`);
  return fs.readFileSync(path, "utf-8");
}

export function getAllDocSlugs(): string[] {
  return fs
    .readdirSync(docsDirectory)
    .map((filename) => filename.replace(/\.md$/, ""));
}
