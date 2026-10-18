# Image ab der zweiten Pause: ubuntu:24.04 plus tree und less, die Benutzer
# vom Ende des Blocks „Users & Groups“ und das kaputte Setup für die
# Abschlussübung.
FROM ubuntu:24.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends less tree \
    && rm -rf /var/lib/apt/lists/*

# Farbiger Prompt: Ubuntus .bashrc schaltet ihn nur für TERM=xterm-color
# ein, docker run -it setzt aber TERM=xterm. /etc/skel gilt für alle Benutzer,
# die useradd -m danach anlegt.
RUN sed -i 's/^#force/force/' /root/.bashrc /etc/skel/.bashrc

# Dieselbe Reihenfolge wie in der Übung, damit die IDs übereinstimmen:
# alice 1001, bob 1002, team 1003.
RUN useradd -m -s /bin/bash alice \
    && useradd -m -s /bin/bash bob \
    && groupadd team \
    && usermod -aG team alice \
    && usermod -aG team bob

# Teamverzeichnis für die Übung „Teilt eine Datei“. Nicht /tmp: Dort
# verhindert fs.protected_regular, dass bob mit >> an alices Datei anhängt,
# selbst wenn die Gruppe team schreiben darf.
RUN mkdir /srv/team \
    && chown root:team /srv/team \
    && chmod 770 /srv/team

# Abschlussübung, absichtlich mit vier Fehlern:
# - start.sh ist nicht ausführbar,
# - app.conf mit Passwort ist für alle lesbar,
# - /opt/app/current zeigt auf die Version 1.0, die es nicht gibt,
# - /var/log/app gehört root, appuser kann dort nicht schreiben.
RUN useradd -m -s /bin/bash appuser
COPY app/ /opt/app/
COPY app.conf /etc/app/app.conf
RUN chmod 644 /opt/app/start.sh /etc/app/app.conf \
    && ln -s releases/1.0 /opt/app/current \
    && mkdir -p /var/log/app \
    && touch /var/log/app/app.log

ENV LANG=C.UTF-8
WORKDIR /root
