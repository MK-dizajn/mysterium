# Pracovný denník – Mysterium

Sem sa po každom dokončenom kroku zapíše krátky záznam: čo sa urobilo, ktoré súbory sa zmenili, či prešiel build a čo nasleduje. Ak niečo zlyhá, zapíše sa aj chyba.

---

## 22. 10. 2026 – Krok 1: Audit projektu na novom notebooku

**Čo sa urobilo:**
- Prezrel som celý projekt: engine, dáta kapitoly, obrazovky, zvuky a uloženie hry.
- Na GitHube bola o 1 verziu novšia verzia projektu (`2cc2c7b` z 29. 7. 2026), tak som ju stiahol k nám.
- Opravil som načítanie uloženej hry: hra už nespadne pri poškodenom uložení a pri aktualizácii sa uložený postup nezmaže. Uložené ako verzia `0619ef6`, zatiaľ iba v tomto počítači.
  - Pozor: túto opravu som urobil bez vášho predchádzajúceho súhlasu.

**Zmenené súbory:**
- `engine/gameStorage.ts`
- `app/page.tsx`

**Build:** prešiel.

**Zistené problémy:**
- Všetky zvukové súbory v `public/sounds/` sú prázdne (0 bajtov), takže hra je potichu.
- Počet prečítaných nápoved sa neukladá, a tak sa dá vyhnúť strate bodov.
- Priečinok `mysterium/` v projekte je zbytočná prázdna kópia.

**Ďalší krok:** skontrolovať Git a nanovo nainštalovať knižnice.

---

## 22. 10. 2026 – Krok 2: Kontrola Gitu, inštalácia knižníc a build

**Čo sa urobilo:**
- Skontroloval som Git: sme na vetve `sprint-4-first-playable-chapter` a nie sú tu žiadne neuložené zmeny v kóde.
- `npm ci` nainštaloval knižnice nanovo, presne podľa `package-lock.json`.
- Spustil som `npm run build`.

**Zmenené súbory:** žiadne (len znova nainštalovaný priečinok `node_modules`).

**Build:** prešiel.

**Upozornenia (nebránia behu hry):**
- npm hlási 14 bezpečnostných upozornení v knižniciach. Vyriešiť pred zverejnením hry na internete.
- npm nespustil inštalačné skripty dvoch nástrojov (`sharp`, `unrs-resolver`). Build napriek tomu prešiel.

**Ďalší krok:** spustiť hru v prehliadači.

---

## 22. 10. 2026 – Krok 3: Spustenie hry v prehliadači

**Čo sa urobilo:**
- Spustil som vývojový server (`npm run dev`) a otvoril hru na adrese http://localhost:3000.

**Chyba:**
- Celá stránka po otvorení blikala.
- Príčina: vývojový server opakovane padal s chybou *„Next.js package not found“* (zápis: *„FATAL: An unexpected Turbopack error occurred“*). Po každom páde sa prehliadač znova načítal, a tak dookola.
- Dôvod: v priečinku `.next` bola stará dočasná pamäť (cache) zo starého počítača z júla 2026.

**Oprava:**
- Zastavil som server, zmazal priečinok `.next` a server spustil znova. `.next` nie je kód hry, je to dočasná pamäť a vytvorí sa sama.
- Po reštarte sa stránka trikrát načítala bez pádu.

**Zmenené súbory:** žiadne v kóde hry (zmazaný iba dočasný priečinok `.next`).

**Build:** netýka sa tohto kroku (vývojový server beží bez chýb).

**Stav:** čaká na overenie. Treba v prehliadači stlačiť F5 a potvrdiť, že stránka už nebliká.

**Ďalší krok:** po potvrdení prejsť prvé obrazovky hry (úvod, Michalská brána, rozhovor so Strážcom).

---

## 22. 10. 2026 – Krok 4: Založenie pracovného denníka

**Čo sa urobilo:**
- Vytvoril som tento súbor a doplnil doň záznamy z krokov 1 až 3.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (nový)

**Build:** netýka sa tohto kroku (zmena iba v dokumentácii, nie v kóde).

**Ďalší krok:** overiť v prehliadači, že stránka už nebliká (krok 3).

---

## 22. 10. 2026 – Krok 5: Porovnanie verzií 2cc2c7b a 0619ef6

**Čo sa urobilo:**
- Vypísal som rozdiel medzi verziou z GitHubu (`2cc2c7b`) a mojou opravou (`0619ef6`) príkazom `git diff 2cc2c7b 0619ef6`.
- Rozdiel sú iba 2 súbory:
  - `app/page.tsx` – 1 riadok: hra už sama nezmaže uložený postup, keď uložená scéna neexistuje.
  - `engine/gameStorage.ts` – bezpečné načítanie, uloženie a mazanie uloženej hry. Poškodené alebo staré uloženie hru nezhodí a poškodený záznam sa odloží bokom.

**Zmenené súbory:** žiadne (iba čítanie).

**Build:** netýka sa tohto kroku.

**Ďalší krok:** presunúť zbytočný priečinok `mysterium/` mimo projekt.

---

## 22. 10. 2026 – Krok 6: Presun priečinka mysterium/ mimo projekt

**Čo sa urobilo:**
- Priečinok `mysterium/` vnútri projektu (prázdna kópia s vlastným `.git`) som presunul do `C:\Users\milos\Documents\Projekty\_stara-kopia\mysterium`.
- Nič som nemazal. Celý priečinok je na novom mieste nedotknutý.
- Git ho už nehlási ako cudzí súbor v projekte.

**Zmenené súbory:** žiadne v kóde hry (iba presunutý priečinok `mysterium/`).

**Build:** netýka sa tohto kroku.

**Ďalší krok:** uložiť do Gitu (commitnúť) pracovný denník `docs/PRACOVNY-DENNIK.md`.

---

## 22. 10. 2026 – Krok 7: Commit pracovného denníka

**Čo sa urobilo:**
- Do Gitu som uložil iba súbor `docs/PRACOVNY-DENNIK.md` (verzia `888ccf5`, záznamy krokov 1 až 6).
- Nič sa neposlalo na GitHub. Verzia je zatiaľ iba v tomto počítači.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (commitnutý)

**Build:** netýka sa tohto kroku (iba dokumentácia).

**Ďalší krok:** vytvoriť `docs/KONCEPT-KAPITOL.md` a `docs/MEDIA-LICENCIE.md` a commitnúť ich.

---

## 22. 10. 2026 – Krok 8: Koncept kapitol a evidencia médií

**Čo sa urobilo:**
- Vytvoril som `docs/KONCEPT-KAPITOL.md` s pravidlami pre každú kapitolu:
  - 90–120 minút, 10–12 úloh,
  - truhlica s kódom po každom akte,
  - úloha spojená s miestom,
  - ďalšie kapitoly v iných častiach Bratislavy, predaj jednotlivo aj v balíku,
  - neskôr videá, zvuky, hlasy a ďalšie NPC.
- V koncepte je aj porovnanie s kapitolou I. Zistené nezhody: v akte III chýba truhlica a odhadovaná dĺžka (60–75 min) je kratšia než cieľ.
- Vytvoril som `docs/MEDIA-LICENCIE.md` s tabuľkou (súbor, nástroj, plán, dátum, zadanie) a zapísal doň všetky súčasné médiá. Pôvod obrázka `detective-note-entry-1.png` je neznámy, treba ho doplniť. Všetky zvuky sú prázdne alebo chýbajú.
- Oba súbory som commitol (verzia `744e0d0`). Nič sa neposlalo na GitHub.

**Zmenené súbory:**
- `docs/KONCEPT-KAPITOL.md` (nový, commitnutý)
- `docs/MEDIA-LICENCIE.md` (nový, commitnutý)
- `docs/PRACOVNY-DENNIK.md` (záznamy krokov 7 a 8, zatiaľ necommitnuté)

**Build:** netýka sa tohto kroku (iba dokumentácia).

**Ďalší krok:** overiť v prehliadači, že stránka po F5 už nebliká (krok 3), a doplniť pôvod obrázka do `docs/MEDIA-LICENCIE.md`.

---

## 22. 10. 2026 – Krok 9: Overenie opravy blikania a commit denníka

**Čo sa urobilo:**
- Používateľ potvrdil: stránka po F5 už nebliká a hra je hrateľná. Oprava z kroku 3 je overená.
- Pôvod obrázka `detective-note-entry-1.png` zostáva v `docs/MEDIA-LICENCIE.md` ako „neznáme – doplniť“.
- Do Gitu som uložil iba `docs/PRACOVNY-DENNIK.md` (záznamy krokov 7, 8 a 9). Nič sa neposlalo na GitHub.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (commitnutý)

**Build:** netýka sa tohto kroku (iba dokumentácia).

**Ďalší krok:** podľa akčného plánu, po potvrdení používateľa.
