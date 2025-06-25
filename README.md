# Film List App

Die **Film List App** ist eine moderne Webanwendung zur Verwaltung und Analyse deiner Filmsammlung. 
Sie bietet dir alle wichtigen Funktionen zum Hinzufügen, Bearbeiten, Filtern, Sortieren und Löschen von Filmen: mit einer benutzerfreundlichen Oberfläche und reaktiver Funktionalität auf Basis von Vue.js und Spring Boot.

---

## Funktionen

- Filme hinzufügen mit Titel, Jahr, Genre, Bewertung, "Gesehen" und "Favorit"
- Filme bearbeiten durch Klick auf "Edit"
- Filme löschen - einzeln oder alle auf einmal
- Filter und Suche nach Titel, Jahr, Genre oder Bewertung
- Gesehen- und Favoriten-Filter für gezielte Ansicht
- Sortierung nach Titel, Jahr oder Bewertung
- Zurücksetzen aller Filter, Sortierung und Formulareingaben mit einem Klick
- Statistikseite mit Auswertungen zur Filmsammlung

---

## Benutzung der App

### Filme hinzufügen
- Gib den Titel, das Jahr, Genre(s) und die Bewertung eines Films ein.
- Du kannst auch die Checkboxen "Watched" und "Favorite" aktivieren.
- Klicke auf "Add Film", um den Film zur Liste hinzuzufügen.

### Filme bearbeiten oder löschen
- Klicke bei einem Film auf "Edit", um das Formular automatisch mit den Filmdaten auszufüllen.
- Nimm Änderungen vor und speichere sie mit "Update Film".
- Klicke auf "Delete", um einen einzelnen Film zu löschen.
- Klicke auf "Delete All", um die gesamte Filmliste zu löschen. Dies entfernt alle Filme aus der Datenbank.


### Filter und Sortierung
- Über den Spaltenüberschriften kannst du gezielt nach Titel, Jahr, Genre oder Bewertung filtern.
- Im Filter-Dropdown gibt es ein Suchfeld zur schnellen Eingrenzung der Filteroptionen.
- Links oben kannst du über Schaltflächen nach "Watched" und "Favorite" filtern.
- Rechts oben findest du das Sortierungsmenü, über das du nach Titel, Jahr oder Bewertung sortieren kannst.
- Alle Filter- und Sortier-Dropdowns schließen sich automatisch, wenn du außerhalb klickst.

### Zurücksetzen
- Klicke auf den Seitentitel, um:
    - Alle aktiven Filter zurückzusetzen
    - Die aktuelle Sortierung aufzuheben
    - Alle Eingaben im Formular zu löschen

### Statistikseite
- Die Statistikseite zeigt eine Auswertung deiner Filmsammlung:
    - Gesamtanzahl der Filme
    - Durchschnittliche Bewertung
    - Höchst- und Niedrigstbewerteter Film
    - Anzahl der Filme mit Bewertung >= 7
    - Frühestes und spätestes Erscheinungsjahr
    - Häufigste Genres (Top Genres)

---
