#!/usr/bin/env bash
# Baut die Workshop-Images aus containers/<name>/ und taggt sie mit dem Pfad,
# den die Folien anzeigen (siehe src/slides/containers.ts).
#
#   containers/build-images.sh                          # alle Images bauen
#   containers/build-images.sh start users              # nur die genannten
#   containers/build-images.sh --push                   # alle bauen und pushen
#   containers/build-images.sh --push --no-build tools  # nur pushen
#
# Mit --push werden erst alle Images gebaut und danach gepusht, damit ein
# fehlgeschlagener Build keinen halben Stand in der Registry hinterlässt.
#
# Jedes Image wird für alle Plattformen in PLATFORMS gebaut, damit es auf
# Intel/AMD-Rechnern und auf ARM (z. B. Macs mit Apple Silicon) nativ läuft.
# Das braucht den containerd-Image-Store von Docker (siehe README).
set -euo pipefail

REGISTRY_PREFIX='hub.gwvs.de/gwvs/linux-fundamentals'
PLATFORMS='linux/amd64,linux/arm64'

containers_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  echo "Aufruf: $0 [--push] [--no-build] [image ...]" >&2
}

build=true
push=false
images=()
for arg in "$@"; do
  case "$arg" in
    --push) push=true ;;
    --no-build) build=false ;;
    -h | --help)
      usage
      exit 0
      ;;
    -*)
      echo "Unbekannte Option '$arg'." >&2
      usage
      exit 1
      ;;
    *) images+=("$arg") ;;
  esac
done

if [ "$build" = false ] && [ "$push" = false ]; then
  echo "--no-build ohne --push hat nichts zu tun." >&2
  usage
  exit 1
fi

if [ "${#images[@]}" -eq 0 ]; then
  for dockerfile in "$containers_dir"/*/Dockerfile; do
    images+=("$(basename "$(dirname "$dockerfile")")")
  done
fi

for image in "${images[@]}"; do
  if [ ! -f "$containers_dir/$image/Dockerfile" ]; then
    echo "Kein Image '$image': $containers_dir/$image/Dockerfile fehlt." >&2
    exit 1
  fi
done

if [ "$build" = true ]; then
  for image in "${images[@]}"; do
    echo "==> docker build $REGISTRY_PREFIX/$image ($PLATFORMS)"
    docker build --platform "$PLATFORMS" -t "$REGISTRY_PREFIX/$image" "$containers_dir/$image"
  done
fi

if [ "$push" = true ]; then
  for image in "${images[@]}"; do
    echo "==> docker push $REGISTRY_PREFIX/$image"
    docker push "$REGISTRY_PREFIX/$image"
  done
fi
