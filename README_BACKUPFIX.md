Fuhrpark-App – Fehlerbehebung verschlüsseltes Backup

Änderung:
- Der Zugriff auf den gespeicherten Sicherungsordner wird beim Klick auf „Verschlüsseltes Backup erstellen“ vor den Passwortdialogen und der Verschlüsselung geprüft.
- Falls Chrome die Freigabe erneut benötigt, wird sie direkt zu Beginn angefordert.
- Bei verweigertem/fehlgeschlagenem Ordnerzugriff wird ausschließlich die verschlüsselte JSON-Datei als Download angeboten.
- Fahrzeugdaten, IndexedDB-Speicherstruktur, Importformat, Verschlüsselung und übrige App-Funktionen bleiben unverändert.

Installation:
1. Vorher in der bestehenden App eine aktuelle verschlüsselte JSON-Sicherung erstellen.
2. In einem separaten Test-Branch/Repository testen, nicht sofort produktiv überschreiben.
3. Dateien aus diesem ZIP im Repository-Root ersetzen/hochladen.
4. Nach Deployment die App vollständig neu laden und testen: Ordner festlegen → Backup erstellen → alte verschlüsselte Sicherung importieren → erneut Backup in denselben Ordner erstellen.

Hinweis: Android/Chrome kann den Zugriff auf gespeicherte Ordner-Handles erneut verlangen. Die App kann eine Browserfreigabe nicht erzwingen; bei fehlender Freigabe bleibt der verschlüsselte Download als Ausweichweg.
