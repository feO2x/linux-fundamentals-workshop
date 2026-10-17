#!/bin/bash
# Startet die Workshop-App. Was sie braucht, steht in /opt/app/LIESMICH.

if [ "$(whoami)" != "appuser" ]; then
  echo "Fehler: Die App läuft nur als appuser (su - appuser)." >&2
  exit 1
fi

echo "Lese Konfiguration aus /etc/app/app.conf …"
source /etc/app/app.conf || exit 1

rechte=$(stat -c %A /etc/app/app.conf)
if [ "${rechte:7:3}" != "---" ]; then
  echo "Fehler: /etc/app/app.conf ist für alle lesbar ($rechte), darin steht ein Passwort!" >&2
  exit 1
fi

echo "Lade Version aus /opt/app/current …"
version=$(cat /opt/app/current/version.txt) || exit 1

echo "Schreibe Log nach /var/log/app/app.log …"
echo "$(date '+%F %T') $version gestartet, Datenbank $DB_HOST" >> /var/log/app/app.log || exit 1

echo "$version läuft."
