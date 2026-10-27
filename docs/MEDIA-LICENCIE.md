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
| `public/videos/uvod-bratislava.mp4` (video A „Prelet nad Bratislavou“, asi 35 s, 11,8 MB) | **Obraz:** Google Flow, model Veo 3.1; východiskové obrázky Nano Banana (Google). **Hlas:** ElevenLabs, model Eleven v4, hlas „Peter“. **Zostavenie a prechody:** vlastná práca (ffmpeg). | **Obraz:** Google AI Pro – komerčné podmienky Google AI Pro, Flow, Veo a Nano Banana sú **NEOVERENÉ** (vodoznak, právo na komerčné použitie), treba doplniť. **Hlas:** komerčné podmienky ElevenLabs podľa použitého plánu sú **NEOVERENÉ**, treba doplniť. | 27. 10. 2026 | prelet nad Bratislavou k Michalskej bráne, slovenský hlas rozpráva o zmiznutom pátračovi. **Východiskové fotky:** každú fotku z Wikimedie treba vypísať s autorom a licenciou (doplniť). Fotka Michalskej ulice s vodoznakom stock služby sa vo finálnej verzii **nesmie použiť**. |
| `public/videos/uvod-bratislava.poster.jpg` (obrázok pred spustením videa A) | záber z videa A (ako video A) | ako video A, **NEOVERENÉ** | 27. 10. 2026 | obrázok pred spustením videa |
| `public/videos/uvod-bratislava.sk.vtt` (slovenské titulky k videu A, 12 častí) | vlastná práca (prepis hlasu, ffmpeg) | vlastná práca projektu, bez licencie tretej strany | 27. 10. 2026 | text hlasu vo videu A |
| `public/videos/strazca-michalska-brana.mp4` (video B, Strážca Michalskej brány, 5,4 MB) | **Obraz:** Google Flow, model Veo 3.1; východiskové obrázky Nano Banana (Google). **Hlas:** ElevenLabs, model Eleven v4, hlas „Andrej - Mild, Calm“, rýchlosť 0,9. **Zostavenie a prechody:** vlastná práca (ffmpeg). | **Obraz:** Google AI Pro – komerčné podmienky Google AI Pro, Flow, Veo a Nano Banana sú **NEOVERENÉ** (vodoznak, právo na komerčné použitie), treba doplniť. **Hlas:** komerčné podmienky ElevenLabs podľa použitého plánu sú **NEOVERENÉ**, treba doplniť. | 27. 10. 2026 | Strážca víta hráča pod Michalskou bránou a podáva mu zažltnutý list od pátrača. **Východiskové fotky:** každú fotku z Wikimedie treba vypísať s autorom a licenciou (doplniť). Fotka Michalskej ulice s vodoznakom stock služby sa vo finálnej verzii **nesmie použiť**. |
| `public/videos/strazca-michalska-brana.poster.jpg` (obrázok pred spustením videa B) | záber z videa B (ako video B) | ako video B, **NEOVERENÉ** | 27. 10. 2026 | obrázok pred spustením videa |
| `public/videos/strazca-michalska-brana.sk.vtt` (slovenské titulky k videu B, 9 častí) | vlastná práca (prepis hlasu, ffmpeg) | vlastná práca projektu, bez licencie tretej strany | 27. 10. 2026 | Strážcov monológ vo videu B. Nahradil tri dočasné titulky z kroku D3b. |
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
