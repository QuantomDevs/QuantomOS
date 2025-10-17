
 ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗████████╗ ██████╗ ███╗   ███╗               ██████╗██╗      ██████╗ ██╗   ██╗██████╗
██╔═══██╗██║   ██║██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗████╗ ████║              ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗
██║   ██║██║   ██║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║    █████╗    ██║     ██║     ██║   ██║██║   ██║██║  ██║
██║▄▄ ██║██║   ██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║    ╚════╝    ██║     ██║     ██║   ██║██║   ██║██║  ██║
╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║              ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝
 ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝               ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝

#Helpful Linux Commands
## Datei- und Ordner-Operationen
cp <datei> <ziel>                           | Kopiert eine Datei an einen anderen Ort
cp -r <ordner> <ziel>                       | Kopiert einen Ordner rekursiv mit allen Inhalten
mv <quelle> <ziel>                          | Verschiebt oder benennt Dateien und Ordner um
rm <datei>                                  | Löscht eine Datei dauerhaft
rm -r <ordner>                              | Löscht einen Ordner rekursiv mit allen Inhalten
rm -rf <ordner>                             | Löscht einen Ordner ohne Nachfrage (force)
mkdir <ordnername>                          | Erstellt einen neuen Ordner
mkdir -p <pfad/zum/ordner>                  | Erstellt Ordner-Hierarchien, auch wenn übergeordnete Ordner nicht existieren
touch <dateiname>                           | Erstellt eine leere Datei oder aktualisiert den Zeitstempel 

## Navigation und Anzeige
cd <pfad>                                   | Wechselt in ein bestimmtes Verzeichnis
cd ..                                       | Wechselt in das übergeordnete Verzeichnis
cd ~                                        | Wechselt in das Home-Verzeichnis
ls -la                                      | Zeigt detaillierte Informationen inkl. versteckter Dateien
cat <datei>                                 | Zeigt den kompletten Inhalt einer Datei an
less <datei>                                | Zeigt Dateiinhalt seitenweise an (navigierbar)
head <datei>                                | Zeigt die ersten 10 Zeilen einer Datei
tail <datei>                                | Zeigt die letzten 10 Zeilen einer Datei
tail -f <datei>                             | Zeigt die letzten Zeilen und aktualisiert live (gut für Logs)

## Dateiberechtigungen
chmod 755 <datei>                           | Setzt Berechtigungen (rwx für Besitzer, rx für Gruppe/Andere)
chmod +x <datei>                            | Macht eine Datei ausführbar
chown <benutzer>:<gruppe> <datei>           | Ändert Besitzer und Gruppe einer Datei
sudo chown root:root <datei>                | Ändert Besitzer zu root (benötigt sudo)

## Prozesse und System
kill <prozess-id>                           | Beendet einen Prozess über seine ID
killall <prozessname>                       | Beendet alle Prozesse mit dem angegebenen Namen
df -h                                       | Zeigt Festplatten-Speicherplatz in lesbarer Form
free -h                                     | Zeigt Arbeitsspeicher-Nutzung an
