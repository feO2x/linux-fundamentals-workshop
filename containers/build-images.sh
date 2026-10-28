#!/usr/bin/env bash
# Baut die Workshop-Images aus containers/<name>/ und taggt sie für jede
# Registry in REGISTRIES: für hub.gwvs.de mit dem Pfad, den die Folien
# anzeigen (siehe src/slides/containers.ts), dazu für Docker Hub.
#
#   containers/build-images.sh                                     # alle Images bauen
#   containers/build-images.sh start users                         # nur die genannten
#   containers/build-images.sh --push docker.io                    # bauen, nach Docker Hub pushen
#   containers/build-images.sh --push hub.gwvs.de --push docker.io # in beide Registrys
#   containers/build-images.sh --push docker.io --no-build tools   # nur pushen
#
# Mit --push werden erst alle Images gebaut und danach in die genannten
# Registrys gepusht, damit ein fehlgeschlagener Build keinen halben Stand in
# einer Registry hinterlässt.
#
# Jedes Image wird für alle Plattformen in PLATFORMS gebaut, damit es auf
# Intel/AMD-Rechnern und auf ARM (z. B. Macs mit Apple Silicon) nativ läuft.
# Das braucht den containerd-Image-Store von Docker (siehe README).
set -euo pipefail

REGISTRIES=(hub.gwvs.de docker.io)
PLATFORMS='linux/amd64,linux/arm64'

# Ein Image heißt <Präfix><name>. Docker Hub kennt keine verschachtelten
# Pfade, deshalb dort linux-fundamentals-<name>. Eine Funktion statt eines
# assoziativen Arrays, weil macOS nur Bash 3.2 mitbringt.
image_prefix() {
  case "$1" in
    hub.gwvs.de) echo 'hub.gwvs.de/gwvs/linux-fundamentals/' ;;
    docker.io) echo 'docker.io/feo2x/linux-fundamentals-' ;;
    *) return 1 ;;
  esac
}

containers_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  echo "Aufruf: $0 [--push <registry>]... [--no-build] [image ...]" >&2
  echo "Registrys: ${REGISTRIES[*]}" >&2
}

build=true
push_registries=()
images=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --push)
      if [ "$#" -lt 2 ] || [ "${2#-}" != "$2" ]; then
        echo "--push braucht eine Registry: ${REGISTRIES[*]}." >&2
        usage
        exit 1
      fi
      if ! image_prefix "$2" >/dev/null; then
        echo "Unbekannte Registry '$2'." >&2
        usage
        exit 1
      fi
      push_registries+=("$2")
      shift
      ;;
    --no-build) build=false ;;
    -h | --help)
      usage
      exit 0
      ;;
    -*)
      echo "Unbekannte Option '$1'." >&2
      usage
      exit 1
      ;;
    *) images+=("$1") ;;
  esac
  shift
done

if [ "$build" = false ] && [ "${#push_registries[@]}" -eq 0 ]; then
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
    tags=()
    for registry in "${REGISTRIES[@]}"; do
      tags+=(-t "$(image_prefix "$registry")$image")
    done
    echo "==> docker build $(image_prefix "${REGISTRIES[0]}")$image ($PLATFORMS)"
    docker build --platform "$PLATFORMS" "${tags[@]}" "$containers_dir/$image"
  done
fi

# Bash 3.2 bricht mit set -u bei "${leeres_array[@]}" ab, daher die Längenprüfung.
if [ "${#push_registries[@]}" -gt 0 ]; then
  for registry in "${push_registries[@]}"; do
    prefix="$(image_prefix "$registry")"
    for image in "${images[@]}"; do
      echo "==> docker push $prefix$image"
      docker push "$prefix$image"
    done
  done
fi
