# J.BARTEE // MUSIC MACHINES

Browser-based instruments, generators & musical experiments.

The showcase site for a small collection of playable synthesizers, rhythm
machines, and generative instruments that run entirely in the browser — no
installs, no accounts, nothing to sign up for. Four of them are also
available here as free native VST3 / AU plugins for macOS. Plain
HTML/CSS/JS, no build step, no framework.

Live: **https://jtbartee.github.io/music-machines/**

## Running locally

Any static file server works. From the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly as a
`file://` URL also works for this site — there's no AudioWorklet or ES
module here that would require HTTP — but a local server is still the more
reliable option.)

## Project structure

```
index.html                 page markup
styles/site.css             all styling
js/project-data.js          the project list — the single source of truth for the grid
js/plugin-data.js           the plugin list — the source of truth for the downloads section
js/site.js                  renders cards + download rows, oscilloscope animation, scroll reveal
assets/projects/*.png       instrument screenshots
assets/icons/                favicon + apple-touch-icon
assets/og-image.png         social share image
downloads/*.zip             packaged VST3 / AU / Standalone builds served to visitors
tools/refresh-metadata.mjs  optional: diffs project-data.js against live GitHub data
tools/build-downloads.sh    packages the native ports into downloads/
tools/INSTALL.template.txt  the INSTALL.txt placed inside each download
.github/workflows/pages.yml GitHub Pages deploy workflow
```

## Adding another instrument

Everything the grid renders comes from one array in **`js/project-data.js`**.
To add another machine, append one object:

```js
{
  slug: "your-repo-name",       // must match the GitHub repo name
  title: "Display Name",
  category: "SHORT CLASSIFICATION",   // e.g. "POLYSYNTH", "GENERATIVE"
  tagline: "One sentence, shown at normal weight on the card.",
  description: "1-2 supporting sentences with more detail.",
  tech: ["Feature one", "Feature two", "Feature three"],
  repoUrl: "https://github.com/jtbartee/your-repo-name",
  liveUrl: "https://jtbartee.github.io/your-repo-name/",  // or null if unpublished
  screenshot: "assets/projects/your-repo-name.png",
  accent: "#hexcolor",          // used for the card's indicator light / hover glow
  note: "Optional disclaimer",  // only set this if the source repo itself ships one
},
```

Nothing else needs to change — `js/site.js` builds every card from this
list, and the header's status line ("N MACHINES // ...") counts the array
automatically.

### A note on accent colors

Each card gets its own accent (used for the category pill, the indicator
dot, the hover glow, and the LAUNCH button) pulled loosely from that
instrument's own UI. If you pick one for a new project, check it against a
contrast checker — anything used as pill/button text should stay above a
4.5:1 contrast ratio against `#0d0d0e` (the card image scrim) to stay
readable.

## Changing screenshots or descriptions

- **Screenshots**: drop a PNG into `assets/projects/` and point `screenshot`
  at it in `project-data.js`. Cards display at roughly a 16:9 aspect ratio
  (`object-fit: cover`, cropped from the top), so a ~1200px-wide capture of
  the instrument's full control panel works well. If you don't have a
  screenshot yet, you can still add the project — the image tag will just
  404 gracefully into the card's dark background until one is added.
- **Copy**: edit the `tagline`, `description`, or `tech` fields directly in
  `project-data.js`.

## Deploying through GitHub Pages

This repo ships `.github/workflows/pages.yml`, which deploys the site root
on every push to `main`.

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **"GitHub Actions"**.
3. After the next push (or a manual run of the workflow from the Actions
   tab), the site is live at `https://jtbartee.github.io/music-machines/`.

## Updating the plugin downloads

The downloads section is rendered from **`js/plugin-data.js`**, and the zips
it points at are built by **`tools/build-downloads.sh`**.

The script expects each port to have been built as a *universal* binary in
its own `build-universal/` directory, next to this repo:

```bash
cmake -S ../spectra-vst -B ../spectra-vst/build-universal -DCMAKE_BUILD_TYPE=Release
cmake --build ../spectra-vst/build-universal --target SpectraSynth_All -j 8
```

(The `*_UNIVERSAL` CMake option defaults to `ON`, so a fresh configure gets
you `arm64 + x86_64`. An existing `build/` directory configured before that
option existed will still be single-architecture — hence the separate
directory.)

Then package everything:

```bash
tools/build-downloads.sh
```

For each port it stages the VST3, the AU component and the Standalone app,
generates an `INSTALL.txt` from `tools/INSTALL.template.txt`, zips the lot
into `downloads/`, and rewrites the matching `size` field in
`js/plugin-data.js` so the size shown on the page stays honest. It refuses
to package any bundle that isn't universal — a download that silently fails
on an Intel Mac is worse than no download at all.

The plugins are **not code-signed or notarized**, so macOS quarantines them.
Both the page and the bundled `INSTALL.txt` tell users to clear the flag
with `xattr -dr com.apple.quarantine`. If you ever get a Developer ID and
sign them, that instruction is the thing to remove.

## Refreshing project metadata (optional)

`tools/refresh-metadata.mjs` is a small standalone script that checks each
project in `project-data.js` against live GitHub data — it flags cases
where a repo's GitHub description has drifted from the tagline written here,
where a repo is archived, or where a `liveUrl` no longer resolves. It only
prints a report; it never edits `project-data.js` for you, since the copy
on this site is hand-written, not scraped.

```bash
node tools/refresh-metadata.mjs
```

It uses the unauthenticated GitHub API (60 requests/hour is plenty here).
Set `GITHUB_TOKEN` in the environment if you ever need a higher rate limit.
