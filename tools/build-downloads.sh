#!/usr/bin/env bash
#
# Packages the native plugin ports into downloads/ and rewrites the `size`
# fields in js/plugin-data.js to match what was actually produced.
#
# Each zip contains the VST3, the AU component, the Standalone app and an
# INSTALL.txt. The builds are expected to be universal (arm64 + x86_64) —
# this script refuses to package a single-architecture binary, because a
# download that silently fails on an Intel Mac is worse than no download.
#
# Usage:  tools/build-downloads.sh [--only=<project-dir>] [path-to-projects-dir]
# Default projects dir is the parent of this repo.
#
# --only repackages a single port. Without it every port is rebuilt from its
# existing build-universal artefacts, which rewrites zips that did not change --
# ~10 MB of pointless binary churn per untouched plugin.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ONLY=""
POSITIONAL=""
for arg in "$@"; do
  case "$arg" in
    --only=*) ONLY="${arg#--only=}" ;;
    *)        POSITIONAL="$arg" ;;
  esac
done

SRC_ROOT="${POSITIONAL:-$(cd "$REPO_DIR/.." && pwd)}"
OUT="$REPO_DIR/downloads"

mkdir -p "$OUT"

# Versions are per-port, not global: the ports ship on their own schedules, and a shared
# version number would silently re-stamp three unchanged plugins every time one of them
# gains a feature. Each entry's version must match that project's project(... VERSION ...)
# in its CMakeLists.txt -- the check below enforces it rather than trusting this table.
#
# project-dir | artefacts-dir | plugin-basename | zip-basename | version
PORTS=(
  "glockwork-vst|Glockwork_artefacts|GLOCKWORK|GLOCKWORK|1.1.0"
  "five-voice-prophet-vst|FiveVoiceProphet_artefacts|FIVE VOICE PROPHET|FIVE-VOICE-PROPHET|1.1.0"
  "jp8-vst|Jp8Synth_artefacts|JP-8|JP-8|1.1.0"
  "spectra-vst|SpectraSynth_artefacts|SPECTRA|SPECTRA|1.2.0"
)

fail=0

for entry in "${PORTS[@]}"; do
  IFS='|' read -r proj artefacts base zipbase VERSION <<< "$entry"
  [[ -n "$ONLY" && "$proj" != "$ONLY" ]] && continue
  rel="$SRC_ROOT/$proj/build-universal/$artefacts/Release"

  # The table above and the plugin's own CMakeLists must agree, or the zip name claims a
  # version the binary does not report to the host.
  declared="$(sed -n 's/^project([A-Za-z0-9_]* VERSION \([0-9.]*\) .*/\1/p' "$SRC_ROOT/$proj/CMakeLists.txt" | head -1)"
  if [[ "$declared" != "$VERSION" ]]; then
    echo "VERSION MISMATCH: $proj declares $declared, this script says $VERSION"
    fail=1
    continue
  fi

  if [[ ! -d "$rel" ]]; then
    echo "MISSING: $rel — build it with:"
    echo "  cmake -S $SRC_ROOT/$proj -B $SRC_ROOT/$proj/build-universal -DCMAKE_BUILD_TYPE=Release"
    fail=1
    continue
  fi

  vst3="$rel/VST3/$base.vst3"
  au="$rel/AU/$base.component"
  app="$rel/Standalone/$base.app"

  # Refuse to ship anything that is not a universal binary.
  for bundle in "$vst3" "$au" "$app"; do
    bin="$bundle/Contents/MacOS/$base"
    [[ -f "$bin" ]] || { echo "MISSING BINARY: $bin"; fail=1; continue; }
    if ! lipo -archs "$bin" | grep -q "x86_64" || ! lipo -archs "$bin" | grep -q "arm64"; then
      echo "NOT UNIVERSAL: $bin — has [$(lipo -archs "$bin")]"
      fail=1
    fi
  done
  [[ $fail -eq 1 ]] && continue

  stage="$(mktemp -d)"
  dest="$stage/$zipbase-$VERSION-macOS"
  mkdir -p "$dest"
  cp -R "$vst3" "$dest/"
  cp -R "$au"   "$dest/"
  cp -R "$app"  "$dest/"

  sed -e "s/{{NAME}}/$base/g" -e "s/{{VERSION}}/$VERSION/g" \
      "$REPO_DIR/tools/INSTALL.template.txt" > "$dest/INSTALL.txt"

  zip_path="$OUT/$zipbase-$VERSION-macOS.zip"
  rm -f "$zip_path"
  # -y keeps symlinks inside the .app/.component bundles intact.
  ( cd "$stage" && zip -q -r -y "$zip_path" "$(basename "$dest")" -x '*.DS_Store' )
  rm -rf "$stage"

  # du -h prints "9.4M"; the site wants "9.4 MB".
  human="$(du -h "$zip_path" | cut -f1 | tr -d ' ' | sed -e 's/M$/ MB/' -e 's/G$/ GB/' -e 's/K$/ KB/')"
  echo "packaged $zipbase -> $human"

  # Keep the size shown on the site honest.
  python3 - "$REPO_DIR/js/plugin-data.js" "$(basename "$zip_path")" "$human" <<'PY'
import io, re, sys
path, fname, size = sys.argv[1], sys.argv[2], sys.argv[3]
s = io.open(path, encoding="utf-8").read()
pat = re.compile(r'(file: "downloads/' + re.escape(fname) + r'",\n\s*size: ")[^"]*(")')
s, n = pat.subn(lambda m: m.group(1) + size + m.group(2), s)
if n != 1:
    sys.exit(f"could not update size for {fname} (matched {n} times)")
io.open(path, "w", encoding="utf-8").write(s)
PY
done

exit $fail
