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

---

## 22. 10. 2026 – Krok 10: Analýza – uložená hra so scénou mimo rozsah

**Otázka:** Čo sa stane, keď uložená hra ukazuje na scénu, ktorá neexistuje (napríklad `currentSceneIndex: 99`, alebo kapitola má po úprave menej scén)?

**Zistenie (iba z čítania kódu, v prehliadači netestované):**
- **Stránka nespadne.**
  - Pri načítaní uloženia (`engine/gameStorage.ts`) sa číslo 99 ponechá, lebo je to platné kladné číslo.
  - Po kliknutí na „Pokračovať v pátraní“ hra na okamih zobrazí náhradnú prvú scénu. V `app/page.tsx` je náhrada `?? currentChapter.scenes[0]`.
  - Hneď nato kontrola v `app/page.tsx` zistí, že scéna neexistuje, a vráti hráča na úvodnú obrazovku.
- **Hra sa zotaví, ale nie úplne čisto:**
  1. Hráč na zlomok sekundy uvidí prvú scénu a potom ho to bez vysvetlenia vráti na úvod.
  2. Uložená hra s číslom 99 zostane v pamäti prehliadača (zámerne sa nemaže). Po ďalšom F5 sa preto tlačidlo „Pokračovať v pátraní“ objaví znova a vedie opäť späť na úvod. Hráč sa točí v kruhu, kým neklikne „Začať odznova“.
  3. Teoretické riziko: funkcia `getNextSceneIndex` v `engine/gameProgress.ts` by pri neexistujúcej scéne spadla. Dnes sa k nej hráč nedostane, lebo kontrola ho vráti na úvod skôr.
- Rovnako sa hra správa pri neexistujúcej kapitole (`currentChapterIndex`).
- Ak má kapitola menej scén, ale uložené číslo ešte existuje, hra nespadne. Hráč však môže pokračovať na inej scéne, než kde skončil, ak sa poradie scén zmenilo.

**Návrh opravy (zatiaľ neurobená):**
- Kontrolovať uloženú hru už pri načítaní, ešte pred zobrazením tlačidla „Pokračovať v pátraní“.
- Ak uložená scéna v hre neexistuje, tlačidlo sa nezobrazí a hráč uvidí krátku správu: „Uložená hra patrí k staršej verzii kapitoly. Začni nové pátranie.“
- Uloženie sa nezmaže, odloží sa bokom, ako pri poškodenom uložení.
- Dotknuté súbory: `hooks/useGameEngine.ts`, `engine/gameStorage.ts` alebo nová malá pomocná funkcia v `engine/`, `components/screens/LandingScreen.tsx`.

**Zmenené súbory:** žiadne v kóde (iba tento denník).

**Build:** netýka sa tohto kroku.

**Ďalší krok:** krok 1.1 – návrh ukladania počtu prečítaných nápoved. Čaká na potvrdenie.

Poznámka: opravu z tohto kroku používateľ presunul do kroku 1.3.

---

## 22. 10. 2026 – Krok 11 (akčný plán 1.1): Počet prečítaných nápoved sa ukladá do hry

**Čo sa urobilo:**
- Počet prečítaných nápoved sa už nepamätá iba na obrazovke s hádankou. Ukladá sa do uloženej hry (`hintsUsed`, pre každú hádanku zvlášť).
- Po otvorení inventára alebo po F5 sa preto nevynuluje a body za nápovedy sa strhnú správne.
- Body za hádanku teraz počíta iba engine z uloženého počtu nápoved, obrazovka ich už neposiela.
- Ochrana, aby sa body za hádanku pripísali iba raz (flag `puzzle-solved-<id>`), zostala zachovaná.
- Pravidlo bodovania sa nezmenilo: 100 bodov, −20 za nápovedu, minimum 20.
- Staršie uloženie bez údaja o nápovedách sa načíta bez chyby (doplní sa prázdny zoznam).

**Zmenené súbory:**
- `types/game.ts` – nový údaj `hintsUsed` v hernom stave
- `engine/gameEngine.ts` – nové funkcie `revealHint` a `getHintsUsed`; `solvePuzzle` berie počet nápoved z herného stavu
- `engine/gameStorage.ts` – doplnenie `hintsUsed` pri načítaní staršieho uloženia
- `components/screens/PuzzleScreen.tsx` – obrazovka už nemá vlastné počítadlo nápoved
- `components/game/PuzzleFlow.tsx` – odovzdá počet nápoved z herného stavu
- `app/page.tsx` – prepojenie tlačidla nápovedy s enginom

**Build:** prešiel (`npm run build`, bez chýb).

**Test:** 12 z 12 kontrol prešlo. Test bežal v dočasnom priečinku mimo projektu a nie je commitnutý. Overené:
- nápovedy sa pripočítavajú a nikdy ich nie je viac, než má hádanka;
- po uložení a načítaní (F5) zostanú zachované;
- 2 nápovedy = 60 bodov, 0 nápoved = 100 bodov, minimum 20;
- druhé vyriešenie tej istej hádanky body nepridá;
- staré aj poškodené uloženie sa načíta bez chyby;
- nápovedy jednej hádanky neovplyvnia inú.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:** používateľ overí v prehliadači:
- prečítať 2 poznámky, otvoriť inventár a vrátiť sa;
- stlačiť F5 a kliknúť „Pokračovať“;
- po vyriešení hádanky musí skóre stúpnuť o 60.

---

## 22. 10. 2026 – Krok 12: Analýza – hráč pri scénach 3 až 10 nevie, čo má zadať

**Zistenie (iba z čítania kódu):**
- Potvrdené. `components/screens/PuzzleScreen.tsx` zobrazí ako úlohu `investigation.objective`. Otázku `puzzle.question` zobrazí iba vtedy, keď scéna `investigation` nemá.
- Všetkých 10 scén má `investigation`, takže sa `puzzle.question` nezobrazí nikde.
- `answerLabel` (text nad políčkom na odpoveď) majú iba scény 1 a 2. Scény 3 až 10 ukazujú iba všeobecné „Zapíš výsledok svojho pátrania.“
- Najhoršie je to pri scéne 3 (Lekáreň U Salvátora): hráč sa nedozvie, že má zapísať rok.

**Navrhovaná oprava (zatiaľ neurobená):** doplniť `answerLabel` do 8 súborov v `data/chapter-one/`: `lekaren-u-salvatora.ts`, `venturska-brana-spomienok.ts`, `mirbachov-palac.ts`, `stara-radnica.ts`, `maximilianova-fontana.ts`, `primacialny-palac.ts`, `bratislavsky-mier.ts`, `zlaty-presporsky-kluc.ts`.

**Zmenené súbory:** žiadne v kóde (iba tento denník).

**Build:** netýka sa tohto kroku.

**Ďalší krok:** používateľ dodá 8 textov pre `answerLabel`.

---

## 22. 10. 2026 – Krok 13: Hľadanie starších funkcií truhlice v histórii Gitu

**Čo sa urobilo:**
- Prešiel som celú históriu Gitu (všetky vetvy) pre súbory truhlice: `components/ui/chest`, `components/ui/chest-3d`, `components/screens/ActChestScreen.tsx`, `components/screens/ChestIntroScreen.tsx`, `components/ui/reward`.
- Podľa kľúčových slov som prehľadal aj ostatný kód (`app`, `data`, `engine`, `types`, `hooks`, `lib`).
- Prvá verzia truhlice je `3069aa4` (16. 7. 2026), posledná `2cc2c7b` (29. 7. 2026). Spolu 11 verzií.

**Výsledok:**
1. **Video s NPC, ktorý prinesie truhlicu – nikdy neexistovalo.** V žiadnej verzii nie je video (žiadny `<video>`, `.mp4` ani `.webm`). `ChestIntroScreen.tsx` bol vždy iba textový úvod s animáciou, v ktorej sa truhlica objaví. Žiadna postava v ňom nie je.
2. **Automatické skladanie útržkov do jednej fotografie – nikdy neexistovalo.** Od verzie `682869e` (21. 7. 2026) z otvorenej truhlice vyletí niekoľko samostatných útržkov (`ChestPhotoFragments.tsx`). Kliknutím na útržok sa otvorí odmena. Skladanie sa spomína iba v texte verzie `64dbb8f`: „Obraz je poškodený a rozdelený na časti. Budeš ho musieť zložiť…“. Ako funkcia však nikdy neexistovalo.
3. **Otočenie fotografie s adresou na zadnej strane – nikdy neexistovalo.** Žiadna verzia neotáča fotografiu (otočenie o 180° sa v histórii nenachádza). Odmena (`RewardReveal.tsx`) ukazuje fotografiu mierne naklonenú s popisom „Nájdené v uzamknutej truhlici“. „Zadná strana fotografie“ sa spomína iba v textoch popisov. Nápis „Potiahni pre otočenie“ znamená otáčanie 3D truhlice, nie fotografie.
4. **Zadanie adresy ďalšieho miesta ako podmienka na pokračovanie – nikdy neexistovalo.** Jediné políčka v truhlici boli na zadanie číselného kódu: vo verzii `3069aa4` číselné políčka, neskôr kolieska s tlačidlami + a −. Po otvorení truhlice hra pokračuje rovno na ďalšiu scénu a ďalšie miesto sa hráč dozvie iba z textu.

**Obmedzenie:** vidím iba to, čo bolo uložené do Gitu. Ak tieto funkcie vznikli na starom počítači alebo na USB a nikdy sa necommitli, v histórii ich nenájdem.

**Zmenené súbory:** žiadne v kóde (iba tento denník).

**Build:** netýka sa tohto kroku.

**Ďalší krok:** rozhodnutie používateľa, či sa tieto štyri prvky majú navrhnúť ako nové funkcie. Stále čaká aj 8 textov pre `answerLabel` (krok 12).

---

## 22. 10. 2026 – Krok 14: Koncept zážitku

**Čo sa urobilo:**
- Vytvoril som `docs/KONCEPT-ZAZITKU.md` podľa zadania. Obsahuje:
  - (A) úvodné video s bránou (spustí sa až po kliknutí, s tlačidlom „Preskočiť“ a náhradnou verziou),
  - (B) predmet s vodidlom po každej úlohe,
  - (C) jednu truhlicu s tromi zámkami ako finále kapitoly,
  - (D) automaticky zloženú fotografiu s adresou na zadnej strane,
  - (E) odomknutie ďalšej kapitoly ručným zadaním miesta, bez GPS,
  - (F) ľahké konce aktov bez truhlice,
  - (G) úlohy typu „všimni si a urob s tým niečo“,
  - (H) otvorené rozhodnutia: brána, NPC, formát adresy.
- Pri každej časti je poznámka, čo z toho už v hre existuje.
- Nič sa nenaprogramovalo.

**Zistený rozpor:** `docs/KONCEPT-KAPITOL.md` má pravidlo „truhlica po každom akte“. Nový koncept chce jednu truhlicu na konci kapitoly. `KONCEPT-KAPITOL.md` som nemenil, treba ho zosúladiť neskôr.

**Zmenené súbory:**
- `docs/KONCEPT-ZAZITKU.md` (nový, commitnutý)
- `docs/PRACOVNY-DENNIK.md` (záznamy krokov 12, 13 a 14, commitnuté)

**Build:** netýka sa tohto kroku (iba dokumentácia).

**Ďalší krok:**
- doplniť otvorené rozhodnutia (časť H),
- zosúladiť `KONCEPT-KAPITOL.md`,
- stále čaká 8 textov pre `answerLabel` (krok 12).

---

## 22. 10. 2026 – Krok 15: Nová verzia konceptu zážitku

**Čo sa urobilo:**
- Prepísal som `docs/KONCEPT-ZAZITKU.md` novou verziou zadania. Zmeny oproti kroku 14:
  - (A) Video končí pri zatvorenej **Michalskej bráne**, pátranie sa začína pod ňou.
  - (C) Truhlicu vo videu prinesie **Strážca**. Kódy troch zámkov: `00-15-58`, `65-70-09`, `72-81-05`.
  - (D) Na zadnej strane fotografie je **miesto** ďalšej kapitoly.
  - (E) Zadáva sa **názov miesta**. Hra odpustí diakritiku, veľké a malé písmená a drobné preklepy. Potom vždy ukáže kartu „Ďalšie miesto“ (názov, úplná adresa, „Otvoriť v mapách“, popis cesty).
  - (H) Namiesto otvorených rozhodnutí sú pravidlá **trasy**: plynulá slučka, 3–5 minút medzi miestami, koniec pri štarte alebo pri kaviarni, overenie na mape vo Fáze 2.
- Poznámky „Dnes v hre“ zostali pri každej časti.
- Nič sa nenaprogramovalo.

**Zistené:**
- Rozpor s `docs/KONCEPT-KAPITOL.md` („truhlica po každom akte“) trvá. Ten súbor som nemenil.
- Dnešná trasa má krátky návrat (Panská → Ventúrska) a končí pri Primaciálnom paláci. Overí sa vo Fáze 2.

**Zmenené súbory:**
- `docs/KONCEPT-ZAZITKU.md` (prepísaný, commitnutý)
- `docs/PRACOVNY-DENNIK.md` (commitnutý)

**Build:** netýka sa tohto kroku (iba dokumentácia).

**Ďalší krok:** push všetkých lokálnych commitov na vetvu `sprint-4-first-playable-chapter`.
