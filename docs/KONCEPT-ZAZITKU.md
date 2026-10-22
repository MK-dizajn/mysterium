# Koncept zážitku – Mysterium

Tento dokument popisuje, ako má hra pôsobiť na hráča od prvého kliknutia až po koniec kapitoly. Zatiaľ ide iba o koncept: nič z toho, čo je tu nové, ešte nie je naprogramované.

Pri každej časti je krátka poznámka **Dnes v hre**, aby bolo jasné, čo už existuje a čo treba vytvoriť.

---

## A. Začiatok hry

- Hra začne **záhadným úvodným videom**.
- Video končí pohľadom na **zatvorenú Michalskú bránu**.
- Brána sa otvorí, hra hráča privíta a povie mu, že **pátranie sa začína pod touto bránou**.
- **Video sa nespustí samo.** Hráč najprv klikne, napríklad na „Vstúpiť“.
- Počas videa je **vždy tlačidlo „Preskočiť“**.
- Ak sa video nenačíta, hra ukáže **náhradnú verziu** (napríklad obrázok Michalskej brány s textom) a hráč môže pokračovať.

**Dnes v hre:** úvodná obrazovka (`LandingScreen`) a textový úvod kapitoly (`IntroScreen`). Video ani otvorenie brány neexistujú. Prvá scéna kapitoly sa už odohráva pod Michalskou bránou.

## B. Predmet po každej úlohe

- Po každej vyriešenej úlohe hráč získa **predmet**, napríklad:
  - útržok fotografie,
  - strana z denníka,
  - kus mapy,
  - pečať alebo minca,
  - hlasová nahrávka,
  - časť kľúča.
- Získanie predmetu sprevádza **krátka animácia**.
- Predmet obsahuje **vodidlo na ďalšie miesto**, nie holú adresu. Hráč má z neho pochopiť, kam ísť ďalej.

**Dnes v hre:** po každej úlohe hráč dostane dôkaz do inventára (žetón, štítok, pečať…) s dvojicou číslic kódu. Ďalšie miesto sa však dozvie iba z textu pokynov (`nextInstruction`), nie z predmetu.

## C. Jedna truhlica ako veľké finále kapitoly

- Truhlica je **iba jedna**, na **konci kapitoly**.
- Priebeh finále:
  1. video, v ktorom **Strážca truhlicu prinesie**,
  2. 3D truhlica,
  3. hráč klikne na zámok,
  4. kamera plynulo priblíži zámok a ukáže mechanizmus,
  5. **tri zámky**, pre každý akt jeden,
  6. po odomknutí všetkých troch sa truhlica otvorí.
- Pre tri zámky sa použijú **existujúce tri sady kódov** z dôkazov:
  - akt I: `00-15-58`
  - akt II: `65-70-09`
  - akt III: `72-81-05`

**Dnes v hre:** dve truhlice, po akte I a po akte II, každá s jedným zámkom. 3D truhlica, priblíženie a mechanizmus kódu už existujú. Kódy aktu III sú v dátach, ale hra ich nepoužíva. Video so Strážcom neexistuje. Strážca Michalskej brány už v hre je ako postava v prvej scéne.

**Pozor:** toto mení pravidlo v `docs/KONCEPT-KAPITOL.md`, kde je zatiaľ zapísané „truhlica po každom akte“. Ten dokument treba neskôr zosúladiť s týmto.

## D. Zložená historická fotografia

- Zozbierané útržky sa **automaticky zložia do jednej historickej fotografie**.
- Fotografiu si hráč môže **preskúmať** (priblížiť) a **otočiť**.
- Na **zadnej strane** je:
  - **miesto**, kde sa začína **ďalšia kapitola**,
  - nápoveda k **veľkej záhade** celej hry.

**Dnes v hre:** z otvorenej truhlice vyletia samostatné útržky fotografie. Skladanie ani otáčanie fotografie neexistuje (overené v histórii Gitu, krok 13 v `docs/PRACOVNY-DENNIK.md`).

## E. Odomknutie ďalšej kapitoly

- Ďalšia kapitola sa odomkne až vtedy, keď hráč **zadá názov miesta zo zadnej strany fotografie**.
- Zadáva sa **ručne**, **bez GPS**.
- Hra **odpustí**:
  - diakritiku (napríklad „Michalska“ = „Michalská“),
  - veľké a malé písmená,
  - drobné preklepy.
- Po správnom zadaní sa **vždy** zobrazí karta **„Ďalšie miesto“**:
  - názov miesta,
  - úplná adresa,
  - tlačidlo **„Otvoriť v mapách“**,
  - krátky popis cesty.
- Karta musí stačiť aj človeku, ktorý Bratislavu nepozná.
- Tlačidlo „Otvoriť v mapách“ iba otvorí mapovú aplikáciu s adresou. Hra sama polohu hráča nezisťuje ani neukladá.

**Dnes v hre:** neexistuje. Hra po finále zobrazí záverečnú obrazovku (`FinishScreen`) a ponúkne iba hru od začiatku. Odpúšťanie diakritiky a veľkých a malých písmen už hra vie pri hádankách. Odpúšťanie preklepov zatiaľ nevie.

## F. Konce aktov bez truhlice

- Koniec aktu I a aktu II dostane **ľahký moment bez truhlice**, napríklad:
  - získanie pečate,
  - hlas Strážcu,
  - nová informácia o veľkej záhade.
- Moment má byť krátky a nesmie zdržiavať pátranie.

**Dnes v hre:** na konci aktu I a II je prechodová obrazovka (`ActTransitionScreen`) a truhlica.

## G. Úlohy spojené s miestom

- Každá úloha má dva kroky:
  1. **najprv si hráč niečo všimne** priamo na mieste (nápis, erb, sochu, detail stavby),
  2. **potom s tým niečo urobí** (porovná, spočíta, spojí s predmetom, rozlúšti, použije v ďalšej úlohe).
- Úloha nemá byť iba „nájdi a opíš“.

**Dnes v hre:** úlohy sú spojené s miestom, ale väčšinou končia zápisom toho, čo hráč našiel (krok 1). Krok 2 („urobiť s tým niečo“) má zatiaľ iba časť úloh, napríklad porovnanie vzdialeností pri Michalskej bráne.

## H. Trasa kapitoly

- Trasa je **jedna plynulá slučka** bez zbytočného vracania.
- Každé nové miesto je **do 3 až 5 minút chôdze** od predchádzajúceho.
- **Posledná zastávka** je blízko štartu alebo pri kaviarni.
- Poradie scén sa **overí na mape vo Fáze 2**.

**Dnes v hre:** trasa vedie Michalská brána → najužší dom → Lekáreň U Salvátora (Panská) → späť na Ventúrsku (Academia Istropolitana) → Mirbachov palác → Hlavné námestie (Stará radnica, Maximiliánova fontána) → Primaciálny palác. Posledné tri úlohy sú pri Primaciálnom paláci. Úsek Panská → Ventúrska je krátky návrat. Vzdialenosti a časy chôdze zatiaľ nikto neoveril.

---

## Súvisiace dokumenty

- `docs/KONCEPT-KAPITOL.md` – rozsah a pravidlá kapitol (treba zosúladiť pravidlo o truhliciach, pozri časť C).
- `docs/MEDIA-LICENCIE.md` – každé video, hlas a zvuk z tohto konceptu sa musí zapísať do evidencie médií.
