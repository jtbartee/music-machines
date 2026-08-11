#!/usr/bin/env node
/**
 * Optional dev tool: compares js/project-data.js against live GitHub data
 * (repo description/homepage, and whether the GitHub Pages URL responds)
 * and prints a report. It does NOT write any files — the showcase copy in
 * project-data.js is hand-authored, so this is a diff you read and act on
 * yourself, not an auto-sync.
 *
 * Usage: node tools/refresh-metadata.mjs
 * Optional: GITHUB_TOKEN=... node tools/refresh-metadata.mjs  (raises the
 * unauthenticated 60 req/hour GitHub API rate limit if you hit it)
 */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECTS = require(path.join(__dirname, "..", "js", "project-data.js"));

const OWNER = "jtbartee";
const headers = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function checkProject(p) {
  const notes = [];

  let repo;
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${p.slug}`, { headers });
    if (!res.ok) {
      notes.push(`GitHub API returned ${res.status} for repo "${p.slug}" — does it still exist / is it still public?`);
      return { slug: p.slug, notes };
    }
    repo = await res.json();
  } catch (err) {
    notes.push(`Failed to reach GitHub API: ${err.message}`);
    return { slug: p.slug, notes };
  }

  if (repo.description && repo.description.trim() && repo.description.trim() !== p.tagline.trim()) {
    notes.push(`GitHub repo description differs from tagline in project-data.js:\n      GitHub:  "${repo.description}"\n      Local:   "${p.tagline}"`);
  }
  if (repo.archived) {
    notes.push(`Repo is archived on GitHub.`);
  }
  if (repo.default_branch && repo.default_branch !== "main") {
    notes.push(`Default branch is "${repo.default_branch}", not "main" — the Pages workflow trigger (push to main) may not match.`);
  }

  if (p.liveUrl) {
    try {
      const liveRes = await fetch(p.liveUrl, { method: "GET" });
      if (!liveRes.ok) {
        notes.push(`Live URL ${p.liveUrl} returned HTTP ${liveRes.status}.`);
      }
    } catch (err) {
      notes.push(`Live URL ${p.liveUrl} failed to load: ${err.message}`);
    }
  } else {
    notes.push(`No liveUrl set in project-data.js — check whether Pages has been enabled since this was written.`);
  }

  return { slug: p.slug, notes, pushedAt: repo.pushed_at };
}

const results = await Promise.all(PROJECTS.map(checkProject));

console.log(`\nChecked ${PROJECTS.length} project(s) against https://github.com/${OWNER}\n`);
let clean = 0;
for (const r of results) {
  if (r.notes.length === 0) {
    clean++;
    console.log(`✓ ${r.slug} — looks in sync${r.pushedAt ? ` (last pushed ${r.pushedAt})` : ""}`);
  } else {
    console.log(`⚠ ${r.slug}`);
    for (const note of r.notes) console.log(`  - ${note}`);
  }
}
console.log(`\n${clean}/${PROJECTS.length} projects had no differences worth reviewing.\n`);
