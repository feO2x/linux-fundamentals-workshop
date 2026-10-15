# Start-Image für den ersten Block: ubuntu:24.04 plus ps und tree.
# Nach der ersten Pause wechseln alle auf das nackte ubuntu:24.04 –
# dort fehlen ps und tree, was zum apt-Block überleitet.
FROM ubuntu:24.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends procps tree \
    && rm -rf /var/lib/apt/lists/*

ENV LANG=C.UTF-8
WORKDIR /root
