# Fahrzeugverwaltung

Mobile PWA zur lokalen Verwaltung von Autos und Motorrädern. Fahrzeugdaten und Medien werden auf dem Gerät im Browser gespeichert (IndexedDB); es gibt keinen automatischen Cloud-Server.

## Funktionen
- Fahrzeugtyp: Auto oder Motorrad
- KBA-Nummer (HSN / TSN), Kennzeichen, Marke/Modell, Baujahr, FIN/VIN
- Sortierung: zuletzt geänderte Fahrzeuge zuerst
- Wartungsampel anhand von TÜV, offenen Erinnerungen und erfasster Reifentiefe
- Service und Reparaturen mit Kosten
- Kilometerstand-Verlauf und Fahrzeughistorie
- Tankbuch mit Liter, Kosten, Preis je Liter und Volltank-Markierung
- Reifenverwaltung mit Saison, Größe, DOT, Profiltiefe, Status und Kosten
- Dokumentenverwaltung mit Kategorie, Notiz und optionalem Ablaufdatum
- Fotos per Kamera/Galerie und Fotovergrößerung
- Termine bearbeiten, nach offen/demnächst/überfällig/erledigt filtern, mit Vorlauf-Erinnerung und Kalenderexport (.ics)
- Systembenachrichtigungen mit Service Worker, sofern Browserberechtigung erteilt und App aktiv/geöffnet ist
- CSV-Bericht pro Fahrzeug und für den gesamten Fuhrpark
- Druckbericht pro Fahrzeug, im Druckdialog als PDF speicherbar
- JSON-Sicherung und Import
- Offline-Nutzung nach dem ersten Laden

Hinweis: Ohne zusätzlichen Push-Dienst sind Erinnerungen bei vollständig geschlossener App nicht zuverlässig garantiert.

## Datensicherheit
- Beim ersten Laden werden vorhandene lokale Daten aus dem alten Speicher in IndexedDB übernommen, bevor der alte Eintrag entfernt wird.
- Keine App kann Datenverlust absolut ausschließen: regelmäßig JSON-Sicherungen außerhalb des Browsers speichern.
- Browser-/Website-Daten nicht löschen, solange keine aktuelle Sicherung vorliegt.
- Historieneinträge werden für neue Aktionen erstellt; alte Aktionen können nicht rückwirkend rekonstruiert werden.

## GitHub Pages
Repository auf GitHub hochladen und unter **Settings → Pages** den Branch `main` und `/ (root)` aktivieren. Danach die erzeugte Pages-Adresse auf Android/Chrome öffnen und über **⋮ → App installieren** zum Startbildschirm hinzufügen.


## Verschlüsselte JSON-Sicherungen (v40)
- Neue JSON-Sicherungen werden vor dem Speichern mit AES-256-GCM verschlüsselt.
- Der Schlüssel wird aus einem vom Nutzer eingegebenen Passwort mit PBKDF2-SHA-256 (310.000 Iterationen) abgeleitet; jede Sicherung erhält zufälliges Salt und IV.
- Das Passwort wird nicht in der App gespeichert. Ohne Passwort ist eine Wiederherstellung nicht möglich. Passwort sicher separat aufbewahren.
- Import erkennt das verschlüsselte Format und fragt nach dem Passwort. Ältere unverschlüsselte JSON-Backups bleiben importierbar, nach einer deutlichen Bestätigung.
- Verschlüsselung erfordert HTTPS bzw. einen sicheren Browserkontext mit Web Crypto.
- Wichtig: Diese Änderung verschlüsselt neu erzeugte Backup-Dateien. Bereits vorhandene JSON-Dateien bleiben unverschlüsselt und sollten nach Erstellung einer neuen Sicherung geschützt oder gelöscht werden.
