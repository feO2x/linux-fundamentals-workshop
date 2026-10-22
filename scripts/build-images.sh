#!/usr/bin/env bash
# Baut die Workshop-Images aus containers/<name>/ und taggt sie mit dem Pfad,
# den die Folien anzeigen (siehe src/slides/containers.ts).
#
#   scripts/build-images.sh              # alle Images
#   scripts/build-images.sh start users  # nur die genannten
#
# Gepusht wird von Hand, z. B. docker push hub.gwvs.de/levelup/linux-fundamentals/start
set -euo pipefail

REGISTRY_PREFIX='hub.gwvs.de/levelup/linux-fundamentals'

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
containers_dir="$repo_root/containers"

if [ "$#" -gt 0 ]; then
  images=("$@")
else
  images=()
  for dockerfile in "$containers_dir"/*/Dockerfile; do
    images+=("$(basename "$(dirname "$dockerfile")")")
  done
fi

for image in "${images[@]}"; do
  context="$containers_dir/$image"
  if [ ! -f "$context/Dockerfile" ]; then
    echo "Kein Image '$image': $context/Dockerfile fehlt." >&2
    exit 1
  fi
  echo "==> $REGISTRY_PREFIX/$image"
  docker build -t "$REGISTRY_PREFIX/$image" "$context"
done
