# Die reparierte Abschlussübung als Dockerfile, gezeigt auf der letzten
# Folie der Übung. Kein Image für die Teilnehmer, nur zum Prüfen (siehe README).
FROM ubuntu:24.04
RUN useradd -m appuser
COPY app/ /opt/app/
COPY --chown=root:appuser app.conf /etc/app/app.conf
RUN chmod +x /opt/app/start.sh \
    && chmod u=rw,g=r,o= /etc/app/app.conf \
    && ln -s releases/1.1 /opt/app/current \
    && mkdir /var/log/app \
    && chown appuser:appuser /var/log/app
USER appuser
CMD ["/opt/app/start.sh"]
