# Start-Image für den ersten Block: ubuntu:24.04 plus tree (ps bringt
# ubuntu:24.04 schon mit). Nach der ersten Pause wechseln alle auf das
# nackte Image aus containers/bare - dort fehlt tree, was zum apt-Block
# überleitet.
FROM ubuntu:24.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends tree \
    && rm -rf /var/lib/apt/lists/*

# Farbiger Prompt: Ubuntus .bashrc schaltet ihn nur für TERM=xterm-color
# ein, docker run -it setzt aber TERM=xterm. Im bare-Image fehlt das
# absichtlich, dort holen die Teilnehmer die Farben im apt-Block zurück.
RUN sed -i 's/^#force/force/' /root/.bashrc

ENV LANG=C.UTF-8
WORKDIR /root
