/**
 * PROJECTS is the single source of truth for the showcase grid.
 * To add another instrument: append one object here. Nothing else
 * in index.html needs to change — js/site.js renders cards from this list.
 *
 * Fields:
 *   slug         kebab-case id, must match the GitHub repo name
 *   title        display name
 *   category     short classification pill, e.g. "POLYSYNTH"
 *   tagline      one sentence, shown at normal weight on the card
 *   description  1-2 sentences of supporting detail
 *   tech         array of 3-5 short feature/tech chips (not language stats)
 *   repoUrl      canonical GitHub repository URL (SOURCE button)
 *   liveUrl      deployed GitHub Pages URL (LAUNCH button), or null if unpublished
 *   screenshot   path under assets/projects/, relative to index.html
 *   accent       hex color used for this card's indicator light / hover glow
 *   note         optional independent-project disclaimer, only set when the
 *                source repo itself ships one — do not invent new ones
 */
const PROJECTS = [
  {
    slug: "five-voice-prophet",
    title: "Five Voice Prophet",
    category: "5-VOICE POLYSYNTH",
    tagline: "A five-voice browser polysynth inspired by classic late-1970s American analog synthesizer architecture.",
    description: "Five genuinely independent voices, each with dual oscillators, a self-oscillating 4-pole ladder filter, and its own slice of the Poly Mod matrix — custom AudioWorklet DSP with real hard sync, no build step.",
    tech: ["AudioWorklet DSP", "Poly Mod matrix", "Web MIDI + MIDI Learn", "JSON patch system"],
    repoUrl: "https://github.com/jtbartee/five-voice-prophet",
    liveUrl: "https://jtbartee.github.io/five-voice-prophet/",
    screenshot: "assets/projects/five-voice-prophet.png",
    accent: "#c9614a",
    note: "Independent project — not affiliated with Sequential.",
  },
  {
    slug: "jp8-web-synth",
    title: "JP-8 Web Synth",
    category: "8-VOICE POLYSYNTH",
    tagline: "An eight-voice browser-based subtractive polysynth inspired by classic early-1980s Japanese analog instruments.",
    description: "Two oscillators, noise, a two-stage filter, dual envelopes, and an onboard chorus/delay/reverb chain and arpeggiator — installable as a PWA, with 28 factory patches and full MIDI Learn.",
    tech: ["Subtractive synthesis", "Chorus / delay / reverb", "Arpeggiator", "Installable PWA"],
    repoUrl: "https://github.com/jtbartee/jp8-web-synth",
    liveUrl: "https://jtbartee.github.io/jp8-web-synth/",
    screenshot: "assets/projects/jp8-web-synth.png",
    accent: "#e2872f",
    note: "Independent project — not affiliated with Roland Corporation.",
  },
  {
    slug: "cr8000",
    title: "CR-8000",
    category: "RHYTHM MACHINE",
    tagline: "A hardware-inspired synthesized rhythm composer with sequencer, patterns, performance controls, and MIDI features.",
    description: "Twelve voices synthesized live from oscillators, noise and filters — no samples anywhere — with a 16-step sequencer, Song Mode pattern chaining, Euclidean and rule-based rhythm generators, and multi-format WAV export.",
    tech: ["12 synthesized voices", "Song Mode", "Euclidean generator", "WAV export"],
    repoUrl: "https://github.com/jtbartee/cr8000",
    liveUrl: "https://jtbartee.github.io/cr8000/",
    screenshot: "assets/projects/cr8000.png",
    accent: "#df6a30",
  },
  {
    slug: "modulate-synth",
    title: "MODULATE",
    category: "SEMI-MODULAR",
    tagline: "A four-oscillator semi-modular synthesizer designed for ambient, dub, IDM, krautrock, minimal techno, generative and experimental electronic sound.",
    description: "Four band-limited oscillators with cross-modulation and hard sync, dual routable filters, a 16-slot mod matrix, and a 16-step sequencer with per-step probability and ratchet — plus a tempo-aware Evolve mode.",
    tech: ["16-slot mod matrix", "FM / PM / AM / ring mod", "16-step sequencer", "Evolve mode"],
    repoUrl: "https://github.com/jtbartee/modulate-synth",
    liveUrl: "https://jtbartee.github.io/modulate-synth/",
    screenshot: "assets/projects/modulate-synth.png",
    accent: "#2dd4bf",
  },
  {
    slug: "spectra-synth",
    title: "SPECTRA",
    category: "WAVETABLE SYNTH",
    tagline: "A spectral-warping wavetable synthesizer with custom wavetable generation, modulation, effects, MIDI, and advanced sound-design controls.",
    description: "Two band-limited wavetable oscillators with phase and spectral warp (bend, sync, formant, tilt, comb, disperse), a built-in wavetable editor — draw, harmonics, or formula — a full mod matrix, arpeggiator, and effects chain.",
    tech: ["Custom wavetable editor", "Phase + spectral warp", "16-voice polyphony", "Mod matrix"],
    repoUrl: "https://github.com/jtbartee/spectra-synth",
    liveUrl: "https://jtbartee.github.io/spectra-synth/",
    screenshot: "assets/projects/spectra-synth.png",
    accent: "#38bdf8",
  },
  {
    slug: "ambient-drone-machine",
    title: "Ambient Drone Machine",
    category: "GENERATIVE",
    tagline: "A generative ambient composition instrument producing evolving meditative sequences and drones.",
    description: "Pick a root, scale, and melody style and it composes a brand-new sequence every time you press play — layered drones, chord pads, and harmonics shaped by room size, echo, and modulation.",
    tech: ["Generative composition", "Tone.js audio engine", "New sequence every play"],
    repoUrl: "https://github.com/jtbartee/ambient-drone-machine",
    liveUrl: "https://jtbartee.github.io/ambient-drone-machine/",
    screenshot: "assets/projects/ambient-drone-machine.png",
    accent: "#7477f2",
  },
  {
    slug: "everynoise-jukebox",
    title: "Every Noise Jukebox",
    category: "MUSIC DISCOVERY",
    tagline: "A musical exploration tool for discovering and shuffling through the thousands of genres documented by Every Noise.",
    description: "One button shuffles through 30-second previews across all 6,291 genres charted by Every Noise at Once — search, favorite tracks, and watch how much of the map you've heard.",
    tech: ["6,291 genres", "Spotify previews", "Search + favorites"],
    repoUrl: "https://github.com/jtbartee/everynoise-jukebox",
    liveUrl: "https://jtbartee.github.io/everynoise-jukebox/",
    screenshot: "assets/projects/everynoise-jukebox.png",
    accent: "#e8b93a",
  },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = PROJECTS;
}
