/**
 * PLUGINS is the single source of truth for the downloads section.
 * These are the native VST3 / AU ports of instruments that also exist as
 * browser machines in PROJECTS — js/site.js renders the download rows from
 * this list, so adding another port means appending one object here.
 *
 * Fields:
 *   slug         kebab-case id; matches the PROJECTS entry it was ported from
 *   title        display name, as the plugin reports itself to the host
 *   category     short classification pill, mirrors the web card
 *   version      plugin version string
 *   description  1-2 sentences: what the port is and what carried over
 *   formats      array of plugin formats in the download
 *   file         path under downloads/, relative to index.html
 *   size         human-readable download size, kept in sync by tools/build-downloads.sh
 *   webSlug      slug of the browser version, used for the "play the web one" link
 *   accent       hex color, matched to the web card so the pair reads as one instrument
 */
const PLUGINS = [
  {
    slug: "glockwork",
    title: "GLOCKWORK",
    category: "MALLET LAB",
    version: "1.1.0",
    description: "The mallet lab as a plugin: the same modal synthesis, the same 22 instrument models and the same hand-tuned partial tables, running natively in your DAW.",
    formats: ["VST3", "AU", "Standalone"],
    file: "downloads/GLOCKWORK-1.1.0-macOS.zip",
    size: "9.4 MB",
    webSlug: "glockwork",
    accent: "#d98a3d",
  },
  {
    slug: "five-voice-prophet",
    title: "FIVE VOICE PROPHET",
    category: "5-VOICE POLYSYNTH",
    version: "1.1.0",
    description: "Five independent analog-style voices with the graph-based Poly Mod / LFO matrix, hard sync, and a nonlinear 4-pole ladder filter that self-oscillates.",
    formats: ["VST3", "AU", "Standalone"],
    file: "downloads/FIVE-VOICE-PROPHET-1.1.0-macOS.zip",
    size: "9.5 MB",
    webSlug: "five-voice-prophet",
    accent: "#c9614a",
  },
  {
    slug: "jp8",
    title: "JP-8",
    category: "8-VOICE POLYSYNTH",
    version: "1.1.0",
    description: "Eight voices, two VCOs with cross modulation, a 24 dB/oct filter, poly / unison / mono voice modes, and the chorus, delay and reverb chain from the web version.",
    formats: ["VST3", "AU", "Standalone"],
    file: "downloads/JP-8-1.1.0-macOS.zip",
    size: "9.6 MB",
    webSlug: "jp8-web-synth",
    accent: "#e2872f",
  },
  {
    slug: "spectra",
    title: "SPECTRA",
    category: "WAVETABLE SYNTH",
    version: "1.1.0",
    description: "Two warped, unison-capable wavetable oscillators with sub and noise, a ZDF state-variable filter, a 4-slot mod matrix, and a distortion / chorus / delay / reverb chain.",
    formats: ["VST3", "AU", "Standalone"],
    file: "downloads/SPECTRA-1.1.0-macOS.zip",
    size: "9.6 MB",
    webSlug: "spectra-synth",
    accent: "#38bdf8",
  },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = PLUGINS;
}
