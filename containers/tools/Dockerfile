# Ersatz für den apt-Block: das nackte Image aus containers/bare plus die
# Pakete, die die Teilnehmer dort installieren. Für alle, bei denen apt
# nicht durchkommt (z. B. wegen eines Proxys).
FROM ubuntu:24.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends less tree \
    && rm -rf /var/lib/apt/lists/*

# Farbiger Prompt: Ubuntus .bashrc schaltet ihn nur für TERM=xterm-color
# ein, docker run -it setzt aber TERM=xterm. Dieselbe Änderung machen die
# Teilnehmer in der Bonusaufgabe des apt-Blocks.
RUN sed -i 's/^#force/force/' /root/.bashrc

ENV LANG=C.UTF-8
WORKDIR /root
