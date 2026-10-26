# Médiá a licencie – Mysterium

Sem sa zapisuje každý obrázok, zvuk, hudba, hlas a video použité v hre. Hra sa bude predávať, preto pri každom súbore musí byť jasné, odkiaľ pochádza a či ho smieme použiť komerčne.

## Čo znamenajú stĺpce

- **Súbor** – cesta k súboru v projekte.
- **Nástroj** – čím súbor vznikol (napríklad generátor obrázkov či zvukov, stránka s licencovanými zvukmi, vlastná nahrávka).
- **Plán** – typ účtu alebo licencie, s ktorým súbor vznikol (napríklad bezplatný alebo platený). Od plánu často závisí, či sa súbor smie použiť v predávanej hre.
- **Dátum** – kedy súbor vznikol alebo bol stiahnutý.
- **Zadanie** – text zadania (prompt) alebo popis, podľa ktorého súbor vznikol, prípadne odkaz na zdroj.

## Zoznam médií

| Súbor | Nástroj | Plán | Dátum | Zadanie |
|---|---|---|---|---|
| ~~`public/images/journal/detective-note-entry-1.png`~~ | neznáme | neznáme | súbor zo dňa 24. 7. 2026 | **odstránený 26. 10. 2026 (krok D3a)** – obrázok zápisu č. 1 s textom vpísaným do obrázka a neznámym pôvodom. Nahradil ho papier nakreslený v kóde (CSS a SVG, vlastná práca projektu) a skutočný text v HTML. |
| Písmo **Patrick Hand** (rukopis pátrača v zápisoch) | Google Fonts (autor Patrick Wagesreiter), pripojené cez `next/font/google` – súbor písma je uložený v projekte pri builde, prehliadač hráča si ho nepýta od Googlu | **SIL Open Font License 1.1** – komerčné použitie a vloženie do hry povolené, písmo sa nesmie predávať samostatne | 26. 10. 2026 | `app/layout.tsx`, premenná `--font-handwriting`, podmnožiny latin a latin-ext (slovenské znaky) |
| Papier zápisu od pátrača (`components/ui/DetectiveNote.tsx`, štýly `.detective-paper` v `app/globals.css`) | vlastná kresba v kóde (CSS prechody, SVG šum) | vlastná práca projektu, bez licencie tretej strany | 26. 10. 2026 | pergamen s roztrhaným okrajom; ak sa neskôr dodá obrázok čistého papiera (pole `paperImageSrc`), zapísať ho sem |
| `public/videos/strazca-michalska-brana.sk.vtt` (slovenské titulky k videu Strážcu na začiatku) | vlastný text projektu (slová Strážcu z dát hry) | vlastná práca projektu, bez licencie tretej strany | 26. 10. 2026 | tri časti titulkov s textom odovzdania zápisu; časy sú zatiaľ odhad, upravia sa podľa skutočného videa (krok D3b). Samotné video zatiaľ neexistuje – keď pribudne, zapísať ho sem. |
| `public/sounds/artifact-unlock.mp3` | – (súbor je prázdny, 0 B) | – | – | treba vytvoriť |
| `public/sounds/chest-unlock.mp3` | – (súbor je prázdny, 0 B) | – | – | treba vytvoriť |
| `public/sounds/city-ambient.mp3` | – (súbor je prázdny, 0 B) | – | – | treba vytvoriť |
| `public/sounds/npc-message.mp3` | – (súbor je prázdny, 0 B) | – | – | treba vytvoriť |
| `public/sounds/puzzle-success.mp3` | – (súbor je prázdny, 0 B) | – | – | treba vytvoriť |
| `public/sounds/button-click.mp3` | – (súbor chýba) | – | – | treba vytvoriť |
| `public/sounds/digit-found.mp3` | – (súbor chýba) | – | – | treba vytvoriť – krátky zvuk po nájdení číslice na predmete (krok B1b-2) |
| `public/images/finale/historicka-fotografia.jpg` | vlastná kresba v kóde (SVG), prevedená v prehliadači na JPG | vlastná práca projektu, bez licencie tretej strany | 24. 10. 2026 | **dočasný obrázok** (krok B5): sépiová „stará fotografia“ budovy s kolonádou na námestí, so zrnom a vinetáciou. Pred vydaním ho nahradí skutočná historická fotografia (pomer 4 : 3) – pri nej zapísať zdroj a licenciu. |

Obrázky predmetov na obrazovke „Prezrieť“ (napríklad žetón v `components/items/TokenArt.tsx`) sú kreslené priamo v kóde (SVG a CSS). Sú to vlastná práca projektu, nepotrebujú licenciu tretej strany.

Poznámka: súbory `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg` a `window.svg` sú predvolené ikony z novej šablóny Next.js. Hra ich nepoužíva.
