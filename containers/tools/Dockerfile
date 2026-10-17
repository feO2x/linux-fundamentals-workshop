# Ersatz für den apt-Block: das nackte Image aus containers/bare plus die
# Pakete, die die Teilnehmer dort installieren. Für alle, bei denen apt
# nicht durchkommt (z. B. wegen eines Proxys).
FROM ubuntu:24.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends less tree \
    && rm -rf /var/lib/apt/lists/*

ENV LANG=C.UTF-8
WORKDIR /root
