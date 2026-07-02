# Mysterium Game Engine
Version: Sprint 2

---

# Vízia

Mysterium nie je iba jedna hra.

Mysterium je herný engine pre mestské escape adventúry.

Každé mesto predstavuje samostatný príbeh postavený nad rovnakým enginom.

---

# Architektúra

Game

└── Chapters

&nbsp;&nbsp;&nbsp;&nbsp;└── Scenes

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Puzzle

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── History

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Artifact

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Next Scene

---

# Engine

engine/

- gameEngine.ts
- gameStorage.ts
- gameScoring.ts
- gameProgress.ts
- constants.ts

Engine obsahuje všetku hernú logiku.

React komponenty nesmú obsahovať herné pravidlá.

---

# UI

app/

Riadi iba prepínanie obrazoviek.

components/

Obsahujú výhradne prezentáciu.

Žiadna obchodná ani herná logika.

---

# Game State

Každá hra obsahuje:

- aktuálnu obrazovku
- aktuálnu kapitolu
- aktuálnu scénu
- skóre
- artefakty

GameState predstavuje jediný zdroj pravdy.

---

# Ukladanie

Checkpoint systém používa localStorage.

Ukladanie je oddelené v gameStorage.ts.

V budúcnosti môže byť nahradené cloudovým úložiskom bez zásahu do UI.

---

# Pridanie novej kapitoly

1. Vytvoriť nový Chapter.
2. Pridať Scenes.
3. Registrovať Chapter do mysteriumGame.
4. Engine funguje bez ďalších úprav.

---

# Pravidlá projektu

- Žiadna herná logika v komponentoch.
- Žiadne magické čísla.
- Engine rozhoduje.
- React zobrazuje.
- Každá nová funkcionalita patrí najprv do engine.

---

Sprint 2 predstavuje prvú stabilnú verziu Mysterium Game Engine.