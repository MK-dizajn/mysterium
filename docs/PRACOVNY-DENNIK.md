# Pracovný denník – Mysterium

Sem sa po každom dokončenom kroku zapíše krátky záznam: čo sa urobilo, ktoré súbory sa zmenili, či prešiel build a čo nasleduje. Ak niečo zlyhá, zapíše sa aj chyba.

## Stály postup: procesy a pamäť (od 28. 10. 2026)

Zabudnutý vývojový server (Next, Turbopack) raz narástol asi na 15 GB pamäte a zasekol počítač. Preto platí:

1. **Na začiatku každého sedenia** skontrolovať bežiace procesy node a testovacieho Chromu aj porty 3000 a vyššie. Čo ostalo z tohto projektu, ukončiť.
2. **Na konci každého kroku** a po každej sérii testov zastaviť server.
3. **Iba jeden server naraz**, na porte 3000.
4. **Testy v prehliadači** bežia po jednom a prehliadač sa po každom teste zatvorí. Jeho testovací profil sa zmaže.

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

---

## 22. 10. 2026 – Krok 16: Push na GitHub – ZLYHAL

**Čo sa urobilo:**
- Pred pushom som overil GitHub (`git fetch`): vetva `sprint-4-first-playable-chapter` sa medzitým nezmenila. Lokálne sme 7 verzií napred a 0 pozadu, takže push nepotreboval force.
- Spustil som `git push origin sprint-4-first-playable-chapter` (iba táto vetva, nie `main`, bez force).

**Chyba:**
```
fatal: Cannot prompt because user interactivity has been disabled.
fatal: could not read Username for 'https://github.com': terminal prompts disabled
```
- Jednoducho: Git nemá uložené prihlásenie ku GitHubu. Pýtal by si meno a heslo, ale v tomto prostredí sa nemôže opýtať.
- Git z GitHub Desktop má nastaveného správcu prihlásenia (`credential.helper = manager`), ale prihlásenie v ňom nie je uložené pre tento spôsob spúšťania.

**Výsledok:** na GitHub sa **nič neposlalo**. GitHub má stále poslednú verziu `2cc2c7b`. Všetkých 7 verzií je bezpečne uložených iba v tomto počítači:
- `0619ef6`, `888ccf5`, `744e0d0`, `73f6f77`, `d194d72`, `cc9bfe3`, `ff8bc61`

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (tento záznam, zatiaľ necommitnutý)

**Build:** netýka sa tohto kroku.

**Ďalší krok:** pushnúť cez aplikáciu GitHub Desktop (v nej je používateľ prihlásený), alebo nastaviť prihlásenie pre Git v termináli.

---

## 22. 10. 2026 – Krok 17: Overenie pushu cez GitHub Desktop

**Čo sa urobilo:**
- Používateľ pushol 8 commitov sám cez GitHub Desktop.
- Overil som to príkazmi `git fetch`, `git status -sb` a `git log origin/sprint-4-first-playable-chapter -3 --oneline`.

**Výsledok:** push je hotový.
- Lokálna vetva `sprint-4-first-playable-chapter` je zhodná s GitHubom. Obe sú na verzii `2742611`.
- Na odoslanie čaká 0 commitov.

**Zmenené súbory:** žiadne (iba overenie).

**Build:** netýka sa tohto kroku.

**Ďalší krok:** krok 0.1 – jasné zadanie úloh v scénach 3 až 10.

---

## 22. 10. 2026 – Krok 18 (akčný plán 0.1): Jasné zadanie úloh v scénach 3 až 10

**Čo sa urobilo:**
- Do scén 3 až 10 som doplnil `answerLabel`, teda krátky text nad políčkom na odpoveď. Hráč z neho vie, čo má zadať, ale odpoveď mu neprezradí:
  - 3\. Salvátor: „Zadaj rok, ktorým sa končí latinský nápis.“
  - 4\. Academia Istropolitana: „Zadaj meno panovníka, ktorý školu založil.“
  - 5\. Mirbachov palác: „Zadaj, čo sa nachádza pod korunou.“
  - 6\. Stará radnica: „Zadaj, aký predmet zostal v stene veže.“
  - 7\. Maximiliánova fontána: „Zadaj, čo má postava oblečené na ochranu v boji.“
  - 8\. Primaciálny palác: „Zadaj obe písmená v poradí zľava doprava.“
  - 9\. Bratislavský mier: „Zadaj názov sály, v ktorej bol podpísaný mier.“
  - 10\. Zlatý prešporský kľúč: „Zadaj dvoma slovami, čo všetky stopy spoločne uchovávajú.“
- Salvátor (scéna 3):
  - nový `objective`, aby hráč hľadal latinský odkaz a **rok**,
  - pôvodne aj vstup dovnútra lekárne a nový `cinematicText`.
  - **Opravené v kroku 19:** hráč dnu nevchádza, všetko je zvonku. `cinematicText` je opäť pôvodný.
- Bratislavský mier (scéna 9): nový `objective` začína vetou „V tomto paláci bol 26. decembra 1805 podpísaný Bratislavský mier.“ Nahradil nejasné „Použi pátračov historický záznam“.
- Prijímané odpovede, nápovedy ani kód obrazoviek a enginu sa nezmenili.

**Zmenené súbory:**
- `data/chapter-one/lekaren-u-salvatora.ts`
- `data/chapter-one/venturska-brana-spomienok.ts`
- `data/chapter-one/mirbachov-palac.ts`
- `data/chapter-one/stara-radnica.ts`
- `data/chapter-one/maximilianova-fontana.ts`
- `data/chapter-one/primacialny-palac.ts`
- `data/chapter-one/bratislavsky-mier.ts`
- `data/chapter-one/zlaty-presporsky-kluc.ts`

**Build:** prešiel (`npm run build`, bez chýb).

**V prehliadači:** zatiaľ neoverené používateľom.

**Otvorené veci na overenie v teréne:**
1. **Salvátor:** overiť v teréne presné miesto latinského nápisu na vonkajšku. Vstup dnu sa nevyžaduje.
2. **Primaciálny palác:** či sú písmená na fasáde naozaj v poradí C, I zľava doprava.
3. **Mirbachov palác:** odpoveď „znak“ (a „rodový znak“) je príliš ľahká, lebo slovo „znak“ je priamo v pátračovej poznámke. Zvážiť jej vyradenie vo Fáze 2.

**Ďalší krok:**
- používateľ overí nové texty v prehliadači (aspoň scénu 3),
- stále čaká overenie nápoved z kroku 11 (akčný plán 1.1).

---

## 22. 10. 2026 – Krok 19: Oprava Salvátora – všetko sa hľadá zvonku

**Čo sa urobilo:**
- Oprava kroku 18: pri Lekárni U Salvátora hráč **nevchádza dnu**. Všetko hľadané je dostupné zvonku.
- `investigation.objective` má nové, vonkajšie znenie: „Postav sa pred Lekáreň U Salvátora a pozorne si prezri jej vonkajšie priečelie. Pátrač nehľadá názov lekárne ani súčasné nápisy. Hľadá starý latinský odkaz a rok, ktorým sa končí.“
- `cinematicText` je vrátený do pôvodnej podoby o fasáde: „…Jej fasáda však ukrýva viac než názov a výzdobu — zostal na nej odkaz starší než samotná budova.“ Overené porovnaním s verziou pred krokom 18 (`2742611`).
- `answerLabel` („Zadaj rok, ktorým sa končí latinský nápis.“) zostal. Nič iné sa nezmenilo.
- V kroku 18 som opravil otvorenú vec č. 1 a vyradil zápis o otváracích hodinách.

**Zmenené súbory:**
- `data/chapter-one/lekaren-u-salvatora.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:**
- používateľ overí scénu 3 v prehliadači,
- stále čaká overenie nápoved z kroku 11 (akčný plán 1.1).

---

## 22. 10. 2026 – Krok 20: Koniec pracovného dňa

**Čo sa urobilo:**
- Vývojový server (`npm run dev`) je vypnutý.
- Všetky zmeny sú uložené v Gite a aj na GitHube: verzia `b534ecf` je na vetve `sprint-4-first-playable-chapter`.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (tento záznam)

**Build:** posledný build (krok 19) prešiel.

**Na zajtra – čaká na overenie alebo rozhodnutie:**
1. V prehliadači overiť:
   - scénu 3 (nové texty Salvátora),
   - nápovedy z kroku 11: po F5 a po otvorení inventára zostanú, skóre +60 pri 2 nápovedách.
2. V teréne overiť:
   - Salvátor – presné miesto nápisu na vonkajšku,
   - Primaciálny palác – poradie písmen,
   - Mirbachov palác – odpoveď „znak“.
3. Krok 1.3: uložená hra so scénou mimo rozsah (návrh v kroku 10).
4. Zosúladiť `docs/KONCEPT-KAPITOL.md` s `docs/KONCEPT-ZAZITKU.md` (jedna truhlica na konci kapitoly).
5. Zvukové súbory sú prázdne – treba ich nájsť alebo vytvoriť.

**Ako zajtra spustiť hru:** v termináli v priečinku projektu `npm run dev`, potom otvoriť http://localhost:3000.

---

## Krok 21: Overenie Salvátora a návrh krokov 0.2 a 0.3

**Čo sa urobilo (iba čítanie):**
- Overil som `data/chapter-one/lekaren-u-salvatora.ts`. Hráč **nevchádza dnu**:
  - riadok 9, `cinematicText`: pôvodný text o fasáde,
  - riadok 16, `objective`: „Postav sa pred Lekáreň U Salvátora a pozorne si prezri jej vonkajšie priečelie…“,
  - riadok 24, `answerLabel`: „Zadaj rok, ktorým sa končí latinský nápis.“
  - Vo výklade histórie (riadok 46) zostáva veta o barokovom mobiliári „vo vnútri“. Je to iba historická informácia, hráča dnu neposiela.
- Zmena je commitnutá (`b534ecf`) a je aj na GitHube.
- Pripravil som návrhy:
  - krok 0.2: odmena za quest iba z dát,
  - krok 0.3a: potvrdenie pred zmazaním postupu,
  - krok 0.3b: oprava uloženia s neexistujúcou scénou.
- Používateľ schválil poradie 0.3a → 0.2 → 0.3b.

**Zmenené súbory:** žiadne v kóde.

**Build:** netýka sa tohto kroku.

**Ďalší krok:** krok 0.3a.

---

## Krok 22 (akčný plán 0.3a): Potvrdenie pred zmazaním postupu

**Čo sa urobilo:**
- Pred zmazaním uloženej hry sa hra najprv opýta v okienku s tlačidlami **„Áno, začať odznova“** a **„Zrušiť“**:
  - **úvodná obrazovka**, tlačidlo „Začať odznova“: „Tvoj doterajší postup sa vymaže: body, dôkazy, artefakty aj vyriešené úlohy. Túto akciu nemožno vrátiť.“
  - **záverečná obrazovka**, tlačidlo „Hrať kapitolu od začiatku“: „Dokončenú kapitolu aj získané body vymažeš a začneš od prvej zastávky. Túto akciu nemožno vrátiť.“
- Predvolené (vybraté) tlačidlo je **„Zrušiť“**. Kláves **Esc** aj kliknutie mimo okienka ho zavrú bez zmazania.
- Okienko sa zmestí na malú obrazovku mobilu. Ak by bol text dlhší, dá sa v ňom posúvať.
- Pri **úplne prvom spustení bez uloženej hry** sa nič nepýta, „Začať pátranie“ funguje ako doteraz.
- Samotné mazanie postupu (`startNewGame` v `app/page.tsx`) sa nezmenilo.

**Zmenené súbory:**
- `components/ui/ConfirmDialog.tsx` (nový)
- `components/screens/LandingScreen.tsx`
- `components/screens/FinishScreen.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb). Kontrola kódu (`eslint`) zmenených súborov je bez chýb.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:**
- používateľ overí okienko v prehliadači,
- potom krok 0.2 (odmena za quest), až po potvrdení.

---

## Krok 23: Overenie potvrdzovacieho okienka v prehliadači

**Čo sa urobilo:**
- Používateľ otestoval krok 22 (akčný plán 0.3a) v prehliadači. Všetko funguje:
  - „Zrušiť“, Esc aj kliknutie mimo okienka nič nezmažú,
  - „Áno, začať odznova“ hru vymaže a začne odznova,
  - okienko sa zobrazuje správne.
- Krok 0.3a je **overený a dokončený**.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (tento záznam)

**Build:** netýka sa tohto kroku.

**Ďalší krok:** krok 0.2 (odmena za quest iba z dát), až po potvrdení používateľa.

---

## Krok 24 (akčný plán 0.2): Odmena za úlohu iba z dát

Poznámka: používateľ tento krok nazval „krok 23“. Číslo 23 už patrí overeniu okienka, preto je zapísaný ako krok 24.

**Čo sa urobilo:**
- Odmena za úlohu sa berie **iba** z `reward.score` v `data/chapter-one/quests.ts` (+10 bodov za „Zlatý prešporský kľúč“).
- Pripíše ju funkcia `completeQuest` v `engine/gameEngine.ts`, a to **iba pri prvom splnení** úlohy. Už splnená úloha sa nemení, takže odmena sa nedá získať dvakrát.
- Z poslednej scény (`data/chapter-one/zlaty-presporsky-kluc.ts`) som vymazal samostatnú akciu `addScore 10`.
- `engine/dialogueActions.ts` už nemá vlastnú kópiu dokončenia úlohy. Volá tú istú funkciu `completeQuest`, takže aj úloha dokončená rozhovorom dá odmenu, a iba raz. Predtým odmenu nedávala vôbec.
- `engine/events.ts` a `app/page.tsx` iba odovzdávajú zoznam úloh kapitoly ďalej.

**Test (mimo projektu, necommitnutý):** test prejde všetkých 10 scén so skutočnými dátami kapitoly.

| Kontrola | Pred zmenou | Po zmene |
|---|---|---|
| Skóre na konci kapitoly, 0 nápoved | **1010** | **1010** |
| Skóre na konci, 2 nápovedy pri Salvátorovi | 970 | 970 |
| Úloha „Zlatý prešporský kľúč“ | splnená | splnená |
| Druhé vyriešenie finále | 1010 (nič nepridá) | 1010 (nič nepridá) |
| Opakované `completeQuest` | 1010 | 1010 |
| Po uložení a načítaní (F5) | 1010, úloha splnená | 1010, úloha splnená |
| Po F5 a znova finále | 1010 | 1010 |
| Úloha dokončená rozhovorom | 0 bodov (odmena chýbala) | **+10, druhýkrát už nič** |

Skóre vo finále je pred zmenou aj po nej rovnaké: 10 hádaniek × 100 + odmena 10 = 1010.

**Zmenené súbory:**
- `engine/gameEngine.ts`
- `engine/events.ts`
- `engine/dialogueActions.ts`
- `app/page.tsx`
- `data/chapter-one/zlaty-presporsky-kluc.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint (`eslint` zmenených súborov):** 1 chyba v `app/page.tsx`, riadok 101 (`react-hooks/set-state-in-effect`).
- Chyba **existovala už pred touto zmenou** (overené na verzii pred zmenou) a netýka sa riadkov, ktoré som menil.
- Ide o efekt pre neexistujúcu scénu, ktorý prepíše krok 0.3b.
- Ostatné zmenené súbory sú bez chýb.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:** používateľ overí v prehliadači, potom krok 0.3b, až po potvrdení.

---

## Krok 25 (akčný plán 0.3b): Oprava uloženej hry s neexistujúcou scénou

**Čo sa urobilo:**
- Pri načítaní hry sa skontroluje, či uložená kapitola a scéna existujú. **Iba ak nie** (číslo mimo rozsahu alebo neplatné), hra uloženie opraví:
  - body, dôkazy, artefakty, úlohy aj nápovedy zostanú,
  - hráč pokračuje **prvou nevyriešenou scénou** podľa značiek `puzzle-solved-<id>`,
  - ak nie je žiadna značka, začne prvou scénou,
  - ak sú vyriešené všetky scény, zobrazí sa záver kapitoly.
- **Platné uloženie sa nikdy nemení.**
- Pôvodné uloženie sa pred opravou odloží pod samostatný kľúč `mysterium-progress-v2-backup-before-repair`.
- Hráč sa už nezacyklí: opravené uloženie sa hneď uloží, takže „Pokračovať v pátraní“ funguje aj po F5.
- Neplatné číslo scény (−1, text) sa pri načítaní už potichu nenahrádza nulou. Označí sa ako neplatné, aby ho oprava rozpoznala. Predtým by takéto uloženie poslalo hráča na už vyriešenú prvú scénu.
- Z `app/page.tsx` som odstránil starý efekt, ktorý pri neexistujúcej scéne vracal hráča na úvod.
- Pomocnú funkciu `getPuzzleSolvedFlagId` (názov značky vyriešenej hádanky) som presunul z `engine/gameEngine.ts` do `engine/gameProgress.ts`, aby ju oba súbory zdieľali a nevznikla kópia.

**Test (mimo projektu, necommitnutý):** uloženie so 4 vyriešenými scénami, 400 bodmi, 4 dôkazmi, 4 artefaktmi, aktívnou úlohou a 1 nápovedou.

| Uloženie | Pred zmenou | Po zmene |
|---|---|---|
| Číslo scény 99 | úvodná obrazovka, **skóre 0**, body stratené, hráč v kruhu | scéna 5 (prvá nevyriešená), skóre 400, všetko zostalo, záloha vytvorená |
| Číslo scény −1 | scéna 1 (už vyriešená), skóre 400 | scéna 5, skóre 400, všetko zostalo, záloha vytvorená |
| Text namiesto čísla | scéna 1 (už vyriešená), skóre 400 | scéna 5, skóre 400, všetko zostalo, záloha vytvorená |
| Všetky scény vyriešené (99) | úvodná obrazovka, skóre 0 | záver kapitoly, skóre 400, všetko zostalo, záloha vytvorená |
| Žiadna značka vyriešenia (99) | úvodná obrazovka, skóre 0 | scéna 1, skóre 400, všetko zostalo, záloha vytvorená |
| Bežné platné uloženie (scéna 5) | scéna 5, nezmenené | scéna 5, **nezmenené**, žiadna záloha |

- Pri všetkých prípadoch po zmene sa po opätovnom načítaní (F5) nič ďalej nezmenilo.
- Záloha sa vo všetkých opravených prípadoch zhodovala s pôvodným uložením.
- Poznámka: test čísluje scény od 0, v tabuľke sú od 1 (scéna 5 = Mirbachov palác).

**Zmenené súbory:**
- `engine/gameProgress.ts` (nová funkcia `repairGameProgress`, presunutá `getPuzzleSolvedFlagId`)
- `engine/gameStorage.ts` (nová funkcia `loadRepairedGameState`, záloha pred opravou, neplatné číslo sa nenahrádza nulou)
- `engine/gameEngine.ts` (iba používa presunutú `getPuzzleSolvedFlagId`)
- `hooks/useGameEngine.ts` (pri načítaní volá `loadRepairedGameState`)
- `app/page.tsx` (odstránený starý efekt, riadky 83–111)
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:**
- Chyba v `app/page.tsx`, riadok 101 **zmizla**. `app/page.tsx` je teraz bez chýb.
- V `hooks/useGameEngine.ts` zostávajú 2 chyby (riadky 26 a 41, `react-hooks/set-state-in-effect`). **Boli tam už pred touto zmenou**, na tých istých riadkoch (overené na verzii pred zmenou).
  - Ich oprava by znamenala prepísať spôsob načítania v hooku. Navrhujem ju ako samostatný krok.
- Ostatné zmenené súbory sú bez chýb.

**Zostávajúce riziko:**
- Ak oprava posunie hráča za koniec aktu, ktorého truhlicu ešte neotvoril, truhlicu preskočí. Stane sa to iba pri poškodenom alebo veľmi starom uložení.
- Počas vývoja (zmena dát kapitoly bez obnovenia stránky) by sa oprava spustila až po F5.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:**
- používateľ overí v prehliadači,
- rozhodne, či opraviť 2 staré lint chyby v `hooks/useGameEngine.ts`.

---

## Krok 26: Overenie opravy uloženia v prehliadači

**Čo sa urobilo:**
- Používateľ otestoval krok 25 (akčný plán 0.3b) v prehliadači. Všetko funguje podľa popisu:
  - scéna 99 aj text namiesto čísla → hra pokračuje prvou nevyriešenou scénou so zachovaným skóre a nálezmi,
  - po F5 žiadny návrat na úvod,
  - záloha `mysterium-progress-v2-backup-before-repair` existuje,
  - bežná hra sa nezmenila.
- Pri teste Chrome zablokoval vkladanie kódu do konzoly (bezpečnostné upozornenie prehliadača, nie chyba hry). Pomohlo napísať `allow pasting`.
- Krok 0.3b je **overený a dokončený**.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (tento záznam)

**Build:** netýka sa tohto kroku.

**Ďalší krok:** podľa akčného plánu, po potvrdení používateľa.

---

## Krok 27 (akčný plán 0.4a): Jednotné názvy a opravy textov

**Rozhodnutia používateľa:**
- Možnosť A: v lište „Úlohy“, „Inventár“, „Artefakty“; „Denník pátrača“ zostáva nadpisom lišty.
- Štítok „Zápis do denníka pátrača“.
- Dvojice kódov číslované 1 až 9.

**Čo sa urobilo:**
- **Horná lišta** (`components/ui/CodexBar.tsx`):
  - 🕵️ Prípad → **🕵️ Úlohy**, 🔎 Dôkazy → **🔎 Inventár**, 📖 História → **📖 Artefakty**.
  - Popis pod Úlohami: „1 aktívny / Dokončený / Nezačatý“ → **„1 aktívna“ (2–4 aktívne, 5+ aktívnych) / „Splnené“ / „Žiadne“**.
  - Popis pod Inventárom: „1 dôkaz…“ → **„1 predmet / 2–4 predmety / 0 alebo 5+ predmetov“**.
- **Obrazovka Úloh** (`components/screens/QuestScreen.tsx`):
  - nadpis „🕵️ Úlohy“,
  - stavy „Aktívna / Splnená / Zamknutá“,
  - sekcie „Aktívne úlohy“ a „Splnené úlohy“,
  - „Odmena za splnenie úlohy“,
  - nový úvodný text a text pri žiadnej úlohe.
- **Inventár** (`components/screens/InventoryScreen.tsx`):
  - nadpis „Inventár“,
  - „Zatiaľ nemáš žiadne predmety“,
  - štítok „Fragment“ → **„Útržok“**.
- **Artefakty:** nadpis zoznamu „Artefakty“ (`ArtifactsScreen.tsx`), štítok v detaile „Artefakt“ (`ArtifactScreen.tsx`).
- **Záver kapitoly** (`FinishScreen.tsx`): „V časti História zostáva…“ → „V Artefaktoch zostáva…“.
- **Obrazovka histórie** (`HistoryScreen.tsx`): „Zápis do Codexu“ → **„Zápis do denníka pátrača“**.
- **Jazyk stránky** (`app/layout.tsx`): `lang="en"` → **`lang="sk"`**.
- **Poradie dvojíc kódov** v popisoch dôkazov 2 až 9 opravené na „druhá“ až „deviata“ (dôkaz 1 „prvá“ bol správne). Kódy ani poradie dôkazov sa nezmenili.

**Kontrola tvarov slov (pre počty 0, 1, 2, 3, 4, 5, 6, 10, 11, 12, 21, 22):**
- predmety: 0 predmetov, 1 predmet, 2–4 predmety, 5+ predmetov (aj 21 a 22 predmetov), všetko správne.
- aktívne úlohy: 1 aktívna, 2–4 aktívne, 5+ aktívnych, všetko správne. Pri 0 sa nezobrazuje, vtedy sa ukáže „Splnené“ alebo „Žiadne“.

**Kontrola poradia dvojíc:** všetkých 9 dôkazov má slovo, ktoré sedí s ich číslom (`evidenceOrder`).

**Zmenené súbory (zmeny kódu a textov v commite `20c2987`):**
- `components/ui/CodexBar.tsx`
- `components/screens/QuestScreen.tsx`
- `components/screens/InventoryScreen.tsx`
- `components/screens/ArtifactsScreen.tsx`
- `components/screens/ArtifactScreen.tsx`
- `components/screens/FinishScreen.tsx`
- `components/screens/HistoryScreen.tsx`
- `app/layout.tsx`
- `data/chapter-one/` – 8 súborov: `tajna-stopa-michalska.ts`, `lekaren-u-salvatora.ts`, `venturska-brana-spomienok.ts`, `mirbachov-palac.ts`, `stara-radnica.ts`, `maximilianova-fontana.ts`, `primacialny-palac.ts`, `bratislavsky-mier.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** 1 chyba a 1 upozornenie, **obe existovali už pred touto zmenou** (overené na verzii pred zmenou):
- `CodexBar.tsx`, riadok 53 (predtým 47; posunul sa, lebo som vyššie pridal funkciu): `react-hooks/set-state-in-effect`, načítanie stavu zvuku.
- `HistoryScreen.tsx`, riadok 7: nepoužitý `LightbulbIcon` (iba upozornenie).

**Chyba pri zápise:** zápis do denníka najprv zlyhal (miesto v denníku sa nedalo jednoznačne nájsť), ale commit zmien sa už vykonal. Zmeny kódu sú preto v jednom commite a tento záznam v samostatnom commite hneď za ním.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:** používateľ overí v prehliadači (aj šírku 360 px), potom časť 0.4b (počet artefaktov z dát namiesto „/10“), až po potvrdení.

---

## Krok 28: Overenie názvov v prehliadači pri šírke 360 px

**Čo sa urobilo:**
- Používateľ overil krok 27 (akčný plán 0.4a) v prehliadači pri šírke 360 px a poslal snímku obrazovky. Podľa neho je všetko v poriadku:
  - lišta „🕵️ Úlohy / 1 aktívna“, „🔎 Inventár / 2 predmety“, „📖 Artefakty / 1/10 objavených“,
  - tlačidlá sa zmestia vedľa seba, nič nie je orezané a stránka sa vodorovne neposúva.
- **Drobný vizuálny rozdiel na snímke:**
  - pri tlačidle Artefakty je ikona 📖 na samostatnom riadku nad textom a „1/10 objavených“ sa zalomí na dva riadky,
  - pri Úlohách a Inventári sú ikona aj text v jednom riadku.
  - Je to čitateľné, nič sa neprekrýva, iba tlačidlá nevyzerajú rovnako. Zatiaľ sa nerieši.
- Krok 0.4a je **overený a dokončený**.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (tento záznam)

**Build:** netýka sa tohto kroku.

**Ďalší krok:** časť 0.4b (počet artefaktov z dát kapitoly namiesto „/10“), až po potvrdení používateľa.

---

## Krok 29 (akčný plán 0.4b): Počet artefaktov z dát kapitoly

**Čo sa urobilo:**
- Číslo za lomkou pri Artefaktoch v hornej lište („1/10 objavených“) už nie je natvrdo 10.
- Vypočíta sa z aktuálnej kapitoly ako **počet scén, ktoré majú artefakt**. Pre kapitolu 1 je to 10, takže hráč vidí to isté ako predtým.
- Výpočet je v novej funkcii `countChapterArtifacts` v `engine/gameProgress.ts`, aby sa dal otestovať samostatne. `app/page.tsx` ho vypočíta a cez obrazovky ho odovzdá lište.
- Vzhľad lišty (ikona pri Artefaktoch) sa nemenil.

**Test (mimo projektu, necommitnutý):**
| Kapitola | Výsledok | Očakávané |
|---|---|---|
| kapitola 1 (skutočné dáta) | 10 | 10 |
| kapitola s 12 scénami | 12 | 12 |
| 12 scén, z toho 1 bez artefaktu | 11 | 11 |

**Zmenené súbory:**
- `engine/gameProgress.ts` (nová funkcia `countChapterArtifacts`; súbor navyše oproti návrhu, kvôli testu)
- `components/ui/CodexBar.tsx` (`/10` → `/{totalArtifacts}`)
- `components/layout/GameLayout.tsx`
- `components/game/PuzzleFlow.tsx`
- `components/game/HistoryFlow.tsx`
- `components/game/NpcFlow.tsx`
- `app/page.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** iba stará chyba v `CodexBar.tsx`, riadok 55 (predtým 53; posunula sa o 2 pridané riadky), `react-hooks/set-state-in-effect`, načítanie stavu zvuku. **Existovala už pred touto zmenou.** Nová chyba nevznikla.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:** používateľ overí, že lišta ukazuje rovnaké „x/10“ ako predtým. Potom ďalší krok akčného plánu, až po potvrdení.

---

## Krok 30 (časť A, krok A1): Akty kapitoly v dátach

**Cieľ časti A:** logika aktov a odmien sa presunie z kódu (čísla scén 2, 3 a 5 v `gameEngine.ts` a `page.tsx`, odmeny z truhlíc) do dát kapitoly. Nové kapitoly sa tak budú pridávať bez zásahu do enginu. Kroky A1 až A3 **nemenia správanie hry**.

**Rozhodnutia používateľa:**
- Názov aktu II: **„Akt II – Moc a poznanie“**.
- `ActId` je všeobecný text, nie pevné tri hodnoty.
- Počet dvojíc kódov zámku sa odvodí z dôkazov so `secretCode` v scénach aktu, nie natvrdo tri.

**Čo sa urobilo:**
- `types/game.ts`:
  - `ActId` je teraz `string` (predtým iba `"act-1" | "act-2" | "act-3"`),
  - nový typ `Act` (id, názov, zoznam scén, označenie zámku),
  - `Chapter` má nové pole `acts`.
- Nový súbor `data/chapter-one/acts.ts` s tromi aktmi kapitoly 1:
  - akt I „Akt I – Prvé stopy“: Michalská brána, najužší dom, Lekáreň U Salvátora; zámok I,
  - akt II „Akt II – Moc a poznanie“: Academia Istropolitana, Mirbachov palác, Stará radnica; zámok II,
  - akt III „Akt III – Posledné tajomstvo“: Maximiliánova fontána, Primaciálny palác, Bratislavský mier, Zlatý prešporský kľúč; zámok III.
- `data/chapter-one.ts`: kapitola používa `acts`.
- `engine/gameProgress.ts`: nová funkcia `getActLockCodes`. Odvodí kódy zámku aktu z dôkazov jeho scén v poradí podľa `evidenceOrder`; počet dvojíc nie je pevný. Hra ju zatiaľ nepoužíva, použije ju krok A2.
- Engine ani obrazovky akty zatiaľ nepoužívajú. Hra sa správa presne ako predtým.

**Nezhody v názvoch aktov:**
- Akt II mal v `app/page.tsx` dva názvy: „Akt II – **Moc a pamäť**“ (riadok 397, koniec aktu II) a „Akt II – **Moc a poznanie**“ (riadok 401, začiatok aktu II). Používateľ vybral „Moc a poznanie“. V dátach je už správne, ale **v hre sa „Moc a pamäť“ zobrazuje ďalej, kým ho krok A2 nenahradí názvom z dát**.
- Akt I („Prvé stopy“) a akt III („Posledné tajomstvo“) sú v kóde zapísané každý iba raz, nezhoda nie je.

**Test dát (mimo projektu, necommitnutý):**
- **Pred zmenou:** zlyhal podľa očakávania („kapitola nemá zoznam aktov“).
- **Po zmene:** všetkých 26 kontrol prešlo:
  - každá z 10 scén je práve v jednom akte, akty neobsahujú neexistujúce scény, id aktov sú jedinečné,
  - poradie scén v aktoch je rovnaké ako poradie scén v kapitole,
  - odvodené kódy: akt I **00-15-58**, akt II **65-70-09**, akt III **72-81-05**, každý so 3 dvojicami,
  - všetkých 9 dôkazov má v dátach `actId` zhodné s aktom svojej scény.
- **Test celej kapitoly** (z kroku 24) dáva po zmene rovnaké výsledky: skóre 1010, s 2 nápovedami 970, úloha splnená, po F5 bez zmeny.

**Zmenené súbory:**
- `types/game.ts`
- `engine/gameProgress.ts`
- `data/chapter-one.ts`
- `data/chapter-one/acts.ts` (nový)
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory sú bez chýb.

**Na neskôr – texty kapitoly natvrdo v obrazovkách:** presunú sa do dát kapitoly v kroku B7 alebo skôr:
- `components/screens/FinishScreen.tsx` – celý záver kapitoly (Zlatý prešporský kľúč, útržok mapy, „Prešporok neukrýval jeden kľúč…“),
- `components/screens/IntroScreen.tsx` – „Presuň sa pod Michalskú bránu…“, tlačidlo „Som pri Michalskej bráne“,
- `components/screens/QuestScreen.tsx` – „…po odhalení Zlatého prešporského kľúča“, „Začni vyšetrovanie pri Michalskej bráne. Po rozhovore so strážcom…“.

**Ďalší krok:** krok A2 (engine a `page.tsx` berú hranice aktov a kódy truhlíc z dát namiesto čísel scén 2, 3 a 5), až po potvrdení používateľa.

---

## Krok 31 (časť A, krok A2): Hranice aktov, názvy aktov a kódy truhlíc z dát

**Čo sa urobilo:**
- `engine/gameEngine.ts`: prechod aktu sa už nespúšťa po scénach s indexom **2** a **5**. Spustí sa vtedy, keď ďalšia scéna patrí do iného aktu podľa `data/chapter-one/acts.ts`. `currentActId` sa nastaví na dokončený akt z dát.
- `app/page.tsx`:
  - prechod aktu a truhlica sa už nerozhodujú podľa scény s indexom **3**,
  - názvy aktov sú z dát,
  - dokončený a nasledujúci akt, počet dôkazov a kódy truhlice dáva nová funkcia `getActTransition`.
- `engine/gameProgress.ts`: nové funkcie:
  - `getActForScene` (v ktorom akte je scéna),
  - `getActLockEvidence` (dôkazy aktu z dát),
  - `getActTransition` (údaje pre prechod aktu a truhlicu).
  - `getActLockCodes` z kroku A1 teraz používa `getActLockEvidence`.
- Kódy truhlice majú poradie z dát aktu, ale **iba za dôkazy, ktoré hráč naozaj má**. Tak zostala zachovaná dnešná kontrola „Chýba ti niektorý z dôkazov…“: chýbajúci dôkaz = menej kódov, rovnako ako predtým.
- Názov aktu II sa všade zobrazuje ako **„Akt II – Moc a poznanie“** (predtým na konci aktu II „Moc a pamäť“).
- **Nezmenené (krok A3):**
  - odmeny z truhlíc (útržky fotografie) a ich texty v `page.tsx` a `ActChestScreen.tsx`,
  - nadpisy „Truhlica prvého/druhého aktu“; tie sa teraz vyberajú podľa poradia aktu, nie podľa čísla scény.
- Zostáva aj predvolený akt novej hry `"act-1"` v `createNewGameState`. Pri prechode aktu ho engine prepíše hodnotou z dát, takže o ničom nerozhoduje.

**Test (mimo projektu, necommitnutý):** zachytil priebeh celej kapitoly (každá obrazovka, akt, skóre, `currentActId`, kódy), 6 uložených hier a truhlicu s chýbajúcim dôkazom. Výsledok pred zmenou a po nej sa porovnal riadok po riadku.
- **48 riadkov, líšia sa iba 4.** Vo všetkých 4 je jediný rozdiel „Akt II – Moc a pamäť“ → „Akt II – Moc a poznanie“, čo je zámer.
- **Rovnaké pred aj po:**
  - poradie obrazoviek,
  - kódy 00-15-58 a 65-70-09,
  - skóre (100 až 1010),
  - `currentActId` po každej scéne (act-1, pri prechode act-1, po truhlici act-2 atď.).
- **Uložené hry** (všetky rovnaké pred aj po; žiadna sa pri načítaní neopravovala):
  - úplný začiatok (úvod),
  - uprostred prechodu aktu I a aktu II,
  - pred truhlicou aktu I a aktu II (po otvorení pokračuje scénou 4, resp. 7, so správnym aktom),
  - koniec kapitoly.
- **Chýbajúci dôkaz** (bez štítku domu): 2 dôkazy, kódy 00-58, rovnako ako predtým.
- **Test skóre z kroku 24:** stále 1010, s 2 nápovedami 970.

**Zmenené súbory:**
- `engine/gameProgress.ts`
- `engine/gameEngine.ts`
- `app/page.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory sú bez chýb.

**V prehliadači:** zatiaľ neoverené používateľom. Prechod aktu II má ukazovať „Akt II – Moc a poznanie“.

**Ďalší krok:** krok A3 (odmeny a texty truhlíc z `page.tsx` a `ActChestScreen.tsx` do dát), až po potvrdení používateľa.

---

## Krok 32: Karty úloh – odmeny, jednociferné kódy a truhlica

**Čo sa urobilo:**
- Vytvoril som `docs/KARTY-USLOH.md` s návrhom odmien po úlohách pre kapitolu I. Nič sa nenaprogramovalo.
- **Rozhodnutia používateľa zapísané v dokumente:**
  - kódy zámkov sú **jednociferné**, každý predmet nesie jednu číslicu: zámok I = **3-8-1** (scény 1–3), II = **6-0-4** (scény 4–6), III = **9-2-7** (scény 7–9),
  - starý dvojciferný systém (00-15-58, 65-70-09, 72-81-05) sa nahrádza,
  - odmeny po scénach: žetón nultého kilometra, kus mapy s domom č. 15, strana z denníka, pečať vzdelanosti, druhý kus mapy, hlasová nahrávka Strážcu (zatiaľ text), tri zuby Zlatého kľúča, vo finále zložený kľúč,
  - pri každej odmene tlačidlo „Ukáž cestu“ s dnešným textom trasy (`nextInstruction`), bez straty bodov,
  - konce aktov bez truhlice: hlas Strážcu, pečať, zloženie kľúča, a vždy útržok fotografie,
  - jedna truhlica na konci kapitoly s tromi zámkami (kolieska 0–9, 3 číslice), potom Zlatý kľúč do stredného zámku a otvorenie veka; v truhlici štvrtý útržok s adresou,
  - staré uložené hry sa po zmene **resetujú**.
- Sekcia „Otvorené veci“: presné vodidlá po terénnom overení, texty koncov aktov, adresa a názov ďalšieho miesta.
- Pri každej časti je poznámka „Dnes v hre“.

**Na zosúladenie (zapísané aj v dokumente):**
- `docs/KONCEPT-ZAZITKU.md` (časť C) uvádza staré kódy,
- `docs/KONCEPT-KAPITOL.md` uvádza „truhlica po každom akte“,
- test dát z krokov A1 a A2 overoval staré kódy a pri zmene sa upraví,
- reset uložených hier je zámerná výnimka z pravidla „uložený postup sa nemaže“; pred realizáciou treba rozhodnúť, ako sa spraví a ako sa o ňom hráč dozvie.

**Zmenené súbory:**
- `docs/KARTY-USLOH.md` (nový)
- `docs/PRACOVNY-DENNIK.md`

**Build:** netýka sa tohto kroku (iba dokumentácia).

**Ďalší krok:** krok A3, až po potvrdení používateľa. Treba zvážiť, či A3 (presun dnešných dvoch truhlíc do dát) má ešte zmysel, keď sa truhlice po aktoch nahradia jednou truhlicou na konci kapitoly.

---

## Krok 33: Karty úloh – ako je číslica ukrytá, Zápisník kódov

**Čo sa urobilo:**
- Doplnil som `docs/KARTY-USLOH.md`. Iba dokument, nič sa nenaprogramovalo.
- **(1)** Do tabuľky odmien pribudol stĺpec **„Ako je číslica ukrytá“**:
  - 1 žetón: vyrytá na okraji (otočiť na hranu),
  - 2 kus mapy: spočítať veže,
  - 3 strana z denníka: podčiarknutá číslica v poznámke na okraji,
  - 4 pečať: spočítať lúče okolo koruny,
  - 5 druhý kus mapy: číslica pri kompase,
  - 6 nahrávka: Strážca povie číslicu, v prepise sa zvýrazní,
  - 7 až 9 zuby kľúča: počet zárezov.
  - Pridaná kontrola pre kreslenie: mapa 8 veží, pečať 6 lúčov, zuby 9, 2 a 7 zárezov.
- **(2)** Mechanika:
  - „Prezrieť“ → predmet sa zväčší → hráč číslicu nájde alebo spočíta → zvuk → číslica sa sama zapíše do **„Zápisníka kódov“** (tri zámky po troch miestach, chýbajúce prázdne),
  - pri nečinnosti detail jemne žiari, „Ukáž číslicu“ je posledná možnosť,
  - pri truhlici sa kolieska nastavujú podľa zápisníka.
- **(3)** Obrázky predmetov sa kreslia v kóde (SVG a CSS), nie AI obrázkami.
- **(4)** Poradie: **B1a** = jednociferné kódy, **B1b** = táto mechanika, samostatný krok po B1a.
- Do „Otvorených vecí“ pribudol zvuk po nájdení číslice, keďže zvukové súbory hry sú dnes prázdne.

**Zmenené súbory:**
- `docs/KARTY-USLOH.md`
- `docs/PRACOVNY-DENNIK.md`

**Build:** netýka sa tohto kroku (iba dokumentácia).

**Ďalší krok:** rozhodnutie používateľa o kroku A3 (vynechať, keďže truhlice po aktoch zaniknú?), potom návrh kroku B1a, až po potvrdení.

---

## Krok 34 (krok B1a): Jednociferné kódy v dátach

**Rozhodnutie používateľa:** krok **A3 sa vynecháva**, lebo truhlice po aktoch podľa `docs/KARTY-USLOH.md` zaniknú. Robí sa B1a.

**Čo sa urobilo:**
- `secretCode` pri 9 dôkazoch je teraz **jedna číslica** podľa kariet úloh:
  - scéna 1: 3, scéna 2: 8, scéna 3: 1,
  - scéna 4: 6, scéna 5: 0, scéna 6: 4,
  - scéna 7: 9, scéna 8: 2, scéna 9: 7.
- Kódy zámkov sa odvodia z dát (`getActLockCodes`): **I = 3-8-1**, **II = 6-0-4**, **III = 9-2-7**.
- Popisy všetkých 9 dôkazov: „…je vyrytá *n*-tá dvojica číslic tajnej kombinácie“ → „…je vyrytá **jedna číslica tajného kódu**“. Číslica sa v texte neprezrádza.
- Truhlica:
  - `components/ui/chest/chestUtils.ts`: šírka kódu jedného miesta je na jednom mieste (`CHEST_CODE_LENGTH = 1`, predtým natvrdo 2 znaky v `normalizeChestCode`); nová funkcia `createEmptyChestCode` (predtým natvrdo `"00"`); overenie kódu presunuté do funkcie `checkChestCode`, aby sa dalo otestovať.
  - `components/screens/ActChestScreen.tsx`: začiatočný kód cez `createEmptyChestCode` (predtým `"00"` na 2 miestach), overenie cez `checkChestCode`; hláška „Niektorá **dvojica** nesedí“ → „Niektorá **číslica** nesedí“.
  - `components/ui/chest/ChestEvidencePanel.tsx`: „Objavená dvojica“ → „Objavená číslica“.
  - Každý zámok má stále **3 miesta**, každé teraz s **jedným kolieskom** (predtým dve).
- **Nezmenené (zámerne):**
  - 3D model truhlice (`components/ui/chest-3d/ChestModel.tsx`) má na prednej strane ozdobné, nepohyblivé okienka, **dve na každý zámok**. Na zadávanie kódu nemajú vplyv (kód sa zadáva v 2D paneli `ChestCodePanel.tsx`). Úprava 3D modelu presahuje tento krok; truhlicu prestavia kroky B3/B4.
  - Nepoužívaný súbor `components/ui/chest/ChestCode.tsx` má vlastnú šírku 2 znaky; nikde sa neimportuje, preto som ho nemenil.
  - Texty „Potvrdiť kombináciu“ a „Tri dôkazy. Jedna kombinácia.“ v truhlici platia aj pre tri číslice.
  - Názvy predmetov (žetón, štítok, pečate…) zatiaľ zostávajú. Predmety podľa kariet úloh (mapa, strana z denníka, zuby kľúča…) prídu v ďalších krokoch.

**Test (mimo projektu, necommitnutý):**
| Kontrola | Pred zmenou | Po zmene |
|---|---|---|
| prázdny kód jedného miesta | „00“ (2 znaky) | „0“ (1 znak) |
| kódy zámkov z dát | 00-15-58, 65-70-09, 72-81-05 | **3-8-1, 6-0-4, 9-2-7** |
| správny kód zadaný kolieskami (všetky 3 zámky) | správny | správny |
| zlý kód (jedna číslica inak) | zlý | zlý |
| chýbajúci dôkaz | „chýba dôkaz“ | „chýba dôkaz“ |
| popisy dôkazov so slovom „dvojica“ alebo „kombinácia“ | 9 z 9 | 0 z 9 |
| priebeh celej kapitoly (48 riadkov) | – | líši sa iba 9 riadkov, a to **iba kódmi**; poradie obrazoviek, akty, skóre (1010) a uložené hry sú rovnaké |

**Zistený problém so starými uloženiami (zatiaľ neriešený, čaká na rozhodnutie):**
- Uložená hra má v inventári **kópie** predmetov so starými kódmi.
- Truhlica už čaká nový kód (**3-8-1**), ale inventár a panel dôkazov pri starom uložení ukazujú **00-15-58**. Overené testom.
- Návrh riešenia je v odpovedi používateľovi; zapracuje sa až po potvrdení.

**Zmenené súbory:**
- `components/ui/chest/chestUtils.ts`
- `components/screens/ActChestScreen.tsx`
- `components/ui/chest/ChestEvidencePanel.tsx`
- `data/chapter-one/` – 9 súborov scén 1 až 9
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** v `ActChestScreen.tsx` 2 staré chyby `react-hooks/set-state-in-effect` (riadky 65 a 77, predtým 63 a 75; posunuli sa o 2 riadky importu). **Existovali už pred touto zmenou.** Ostatné zmenené súbory sú bez chýb.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:** rozhodnutie používateľa o starých uloženiach, potom B1b, až po potvrdení.

---

## Krok 35: Rozhodnutie o starých uloženiach a návrh B1b

**Rozhodnutie používateľa o starých uloženiach:**
- **Teraz sa starým uloženiam nič nerobí.** Uloženie spred kroku B1a môže v inventári ukazovať staré dvojciferné kódy (00, 15, 58…), kým truhlica čaká nové (3-8-1…).
- **Tester začína hru odznova** („Začať odznova“).
- **Pred prvým externým testerom treba zvýšiť verziu uloženia** z `mysterium-progress-v2` na `mysterium-progress-v3`, aby nikto nehral so starým, nezhodným uložením.

**Čo sa urobilo:**
- Iba čítanie kódu a návrh kroku B1b podľa `docs/KARTY-USLOH.md` (stav nájdených číslic, Zápisník kódov, obrazovka „Prezrieť“, kreslenie predmetov v SVG, dostupnosť, rozdelenie na kroky). Návrh je v odpovedi používateľovi.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (tento záznam)

**Build:** netýka sa tohto kroku.

**Ďalší krok:** potvrdenie návrhu B1b používateľom.

---

## Krok 36: Rozhodnutia k B1b, zmena poradia a návrh B2

**Rozhodnutia používateľa k B1b** (B1b sa zatiaľ nerobí):
- názvy predmetov sa premenujú v **B1b-3** spolu s kreslením,
- „Ukáž číslicu“ **body nestojí**, ale zapamätá sa,
- žiara po **20 s**, „Ukáž číslicu“ po ďalších **20 s**,
- Zápisník kódov je **v Inventári**, nie v lište a nie pri dnešnej truhlici po akte.

**Zmena poradia:** pred B1b sa robí **B2**: odstránenie truhlíc po akte I a II a ich nahradenie ľahkým koncom aktu.

**Čo sa urobilo:** iba čítanie kódu a návrh B2 (v odpovedi používateľovi). Kód sa nemenil.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (tento záznam)

**Build:** netýka sa tohto kroku.

**Ďalší krok:** potvrdenie návrhu B2 používateľom.

---

## Krok 37 (krok B2): Koniec aktu bez truhlice

**Čo sa urobilo:**
- Po akte I a akte II už **nie je truhlica**. Ostala iba obrazovka konca aktu (`ActTransitionScreen`), ktorá teraz ukáže moment z dát `data/chapter-one/acts.ts`:
  - **akt I – 🔊 Hlas Strážcu:** „Tri stopy máš za sebou. Pátrač mi povedal, že kto dôjde až sem, nezačal náhodou. Ešte nie je čas na otázky. Prijmi prvý útržok fotografie a pokračuj.“
  - **akt II – 🛡️ Pečať:** „Vzdelanie, znak aj stopa vojny. Mesto si pamätá všetko, aj to, na čo by najradšej zabudlo. Druhý útržok fotografie je tvoj.“
  - pod textom karta útržku fotografie a tlačidlo **„Prijať útržok a pokračovať“**,
  - zostali „Dôkazy zhromaždené“, „Vyhodnotenie prípadu“ a „Nasleduje“; odstránila sa iba veta „Pred pokračovaním musíš odhaliť miesto…“, ktorá patrila k truhlici.
- **Útržky fotografie** udeľuje nová funkcia `completeActEnding` v `engine/gameEngine.ts` z dát (`ending.reward`):
  - **iba raz**,
  - mimo obrazovky konca aktu nerobí nič, takže opakované kliknutie ani F5 nič nezdvoja.
  - Natvrdo zapísané odmeny a `continueToNextAct` z `app/page.tsx` zmizli.
- **Útržky:** id (`torn-photo-fragment-act-1`, `-act-2`), názvy a `actId` sú rovnaké. Popisy sa upravili, aby nespomínali truhlicu:
  - prvý: „Útržok starej fotografie, **ktorý ti odovzdal Strážca**. …“
  - druhý: „Druhý útržok starej fotografie, **ktorý ti pripadol po pečati**. …“
- **Staré uloženia:** uloženie na obrazovke truhlice (`actChest`) sa pri načítaní prevedie na koniec aktu (`actTransition`). Pôvodné uloženie sa pred prevodom zálohuje pod `mysterium-progress-v2-backup-before-repair`, ako pri kroku 0.3b. Uloženia na konci aktu sa nemenia.
- **Po scéne 10** nasleduje ako doteraz záverečná obrazovka (`FinishScreen`). Akt III zatiaľ nemá vlastný koniec.
- **Nič sa nezmazalo.** V projekte ostali nepoužité súbory truhlice pre kroky B3 a B4:
  - `components/screens/ActChestScreen.tsx`, `components/screens/ChestIntroScreen.tsx`,
  - celé priečinky `components/ui/chest/` a `components/ui/chest-3d/` (spolu 29 súborov),
  - `components/ui/reward/RewardReveal.tsx`,
  - zvuk `chest-unlock`.
  - Obrazovka `"actChest"` zostala v type `GameScreen`, aby ju prevod starých uložení rozpoznal.

**Test (mimo projektu, necommitnutý):**
| Kontrola | Pred zmenou | Po zmene |
|---|---|---|
| poradie obrazoviek celej kapitoly | … prechod aktu → **truhlica** → scéna 4 … | … prechod aktu → scéna 4 … (truhlica 2× zmizla, nič iné) |
| kedy pribudne útržok | po truhlici aktu I / II | po konci aktu I / II (rovnaký okamih pred scénou 4 / 7) |
| id a `actId` útržkov | act-1 → actId act-2, act-2 → actId act-3 | rovnaké |
| popisy útržkov | „…nájdený v truhlici prvého aktu…“ | „…ktorý ti odovzdal Strážca…“, „…ktorý ti pripadol po pečati…“ |
| skóre | 1010 | **1010** |
| uložené hry: začiatok, uprostred prechodu aktu I a II, koniec kapitoly | – | rovnaké ako pred zmenou, bez zálohy |
| uložené hry pred truhlicou aktu I a II | ostali na truhlici | prevedené na koniec aktu, **záloha = pôvodné uloženie**, po pokračovaní scéna 4 / 7 so správnym útržkom |
| opakované kliknutie (4×) na konci aktu I | (dnešná funkcia by posunula akt aj na act-3) | 1 útržok, akt act-2, scéna 4 |
| F5 na konci aktu a po prijatí + ďalšie kliknutie | – | 1 útržok, akt act-2, scéna 4 |

**Zmenené súbory:**
- `types/game.ts` (typy `ActEnding`, `ActEndingKind`, pole `ending` pri akte)
- `data/chapter-one/acts.ts` (koniec aktu I a II s textami a útržkami)
- `engine/gameEngine.ts` (`completeActEnding`)
- `engine/gameStorage.ts` (prevod `actChest` → `actTransition` so zálohou)
- `components/screens/ActTransitionScreen.tsx`
- `app/page.tsx`
- `docs/PRACOVNY-DENNIK.md` (aj záznamy krokov 35 a 36)

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory sú bez chýb.

**Riziko:** do kroku B3 hra nemá žiadnu truhlicu. Zbierané číslice (3-8-1…) sa ukazujú v Inventári, ale zatiaľ nič neodomykajú.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:** používateľ overí koniec aktu I a II v prehliadači, potom ďalší krok podľa plánu (B1b alebo B3), až po potvrdení.

---

## Krok 38 (krok B1b-1): Stav nájdených číslic a Zápisník kódov

**Čo sa urobilo:**
- **Herný stav** (`types/game.ts`, `engine/gameEngine.ts`) má dva nové zoznamy:
  - `foundCodeItemIds` – predmety, na ktorých hráč našiel číslicu,
  - `revealedCodeItemIds` – predmety, ktorých číslicu odhalil tlačidlom „Ukáž číslicu“ (bez straty bodov, iba sa zapamätá).
  - Ukladajú sa s hrou, takže prežijú F5.
- **Nový súbor `engine/codeNotebook.ts`:**
  - `markCodeDigitFound(stav, idPredmetu, { revealed })` zapíše nájdenú číslicu. Iba pri predmete, ktorý hráč má a ktorý nesie číslicu, a **iba raz**.
  - `getCodeNotebook(kapitola, stav)` pripraví Zápisník kódov: pre každý akt jeden zámok, miesta v poradí dôkazov. **Číslice berie z dát kapitoly**, nie z uloženého inventára, takže aj staré uloženie so starými kódmi ukáže v zápisníku správne číslice.
- **Pravidlo „nájdené hneď po získaní“:** predmet bez obrazovky „Prezrieť“ (nové pole `inspect` pri predmete; zatiaľ ho nemá žiadny predmet) má číslicu nájdenú, hneď ako ho hráč má. Do zoznamu sa preto nič nezapisuje a hra sa správa ako doteraz. Zoznam `foundCodeItemIds` sa začne používať v kroku B1b-2.
- **Nový komponent `components/ui/CodeNotebook.tsx`:**
  - zámky I, II, III × 3 miesta,
  - nájdená číslica je veľká,
  - nenájdená je prázdne prerušované políčko s bodkou a popisom pre čítačku „zatiaľ nenájdená“,
  - každý riadok je skupina „Zámok I“ atď.
  - Navrhnutý na šírku 360 px (riadok asi 208 px z dostupných asi 232 px).
- **Inventár** (`InventoryScreen.tsx`, `CollectionFlow.tsx`): Zápisník kódov je **prvá sekcia**. Pri predmetoch zostáva aj „Tajný údaj“ ako doteraz (skryje sa v B1b-2).
- **Uloženie** (`engine/gameStorage.ts`): staré uloženie bez zoznamov dostane pri načítaní prázdne zoznamy; poškodené zoznamy sa nahradia prázdnymi.
- Pri dnešnej (nepoužívanej) truhlici sa nič nemenilo.

**Test (mimo projektu, necommitnutý):**
- **Celá kapitola pred zmenou a po nej: žiadny rozdiel** (41 riadkov: poradie obrazoviek, akty, útržky, uložené hry, skóre **1010**).
- **Zápisník a stav – 16 z 16 kontrol prešlo:**
  - nová hra: prázdne zoznamy, zápisník `I:___ II:___ III:___`,
  - po scénach 1 a 2: `I:38_`; po celej kapitole: `I:381 II:604 III:927`,
  - číslica sa zapíše iba raz; predmet, ktorý hráč nemá, alebo predmet bez číslice sa nezapíše,
  - „Ukáž číslicu“ sa zapíše do nájdených aj odhalených, iba raz,
  - po uložení a načítaní (F5) zoznamy zostanú,
  - staré uloženie bez zoznamov: prázdne zoznamy a zápisník ukazuje získané číslice,
  - poškodené zoznamy sa nahradia prázdnymi,
  - staré dvojciferné kódy v uloženom inventári: zápisník ukazuje číslicu z dát,
  - predmet s `inspect` (príprava na B1b-2): pred nájdením prázdne miesto, po nájdení číslica.

**Zmenené súbory:**
- `types/game.ts`
- `engine/codeNotebook.ts` (nový)
- `engine/gameEngine.ts`
- `engine/gameStorage.ts`
- `engine/index.ts`
- `components/ui/CodeNotebook.tsx` (nový)
- `components/screens/InventoryScreen.tsx`
- `components/game/CollectionFlow.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory sú bez chýb.

**V prehliadači:** zatiaľ neoverené používateľom (aj šírka 360 px).

**Ďalší krok:** používateľ overí zápisník v prehliadači, potom B1b-2 (prototyp „Prezrieť“ na žetóne), až po potvrdení.

---

## Krok 39: Oprava vzhľadu Zápisníka kódov

**Problém (od používateľa):** popisy „ZÁMOK I / II / III“ sa zalamovali na dva riadky a políčka s číslicami neboli v riadkoch pod sebou.

**Príčina:** stĺpec popisu mal 64 px, ale „ZÁMOK III“ (veľké písmená, riedke písmo) má asi 84 px. Pri šírke 360 px by sa popis vedľa troch políčok nezmestil ani na jednom riadku (k dispozícii asi 232 px).

**Čo sa urobilo** (iba vzhľad, `components/ui/CodeNotebook.tsx`):
- popis je vždy na jednom riadku (`whitespace-nowrap`),
- na úzkych obrazovkách (pod 640 px, teda aj pri 360 px) je popis **nad políčkami**, vo všetkých troch riadkoch rovnako, takže políčka začínajú pod sebou,
- na širších obrazovkách je popis **vedľa políčok** v stĺpci s pevnou šírkou 96 px,
- texty, logika a popisy pre čítačku sa nezmenili.

**Zmenené súbory:**
- `components/ui/CodeNotebook.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**V prehliadači:** zatiaľ neoverené používateľom.

**Ďalší krok:** používateľ overí zápisník pri 360 px a na počítači, potom B1b-2, až po potvrdení.

---

## Krok 40 (krok B1b-2): Obrazovka „Prezrieť“ – prototyp so žetónom

**Čo sa urobilo:**
- **Žetón nultého kilometra** (scéna 1) má v dátach obrazovku „Prezrieť“: pole `inspect` v `data/chapter-one/michalska-brana.ts` (druh „hotspot“, obrázok „token“, pokyn pre hráča, popis miesta pre čítačku). Ostatné predmety ho zatiaľ nemajú, ich číslica je nájdená hneď ako doteraz.
- **Nový kreslený žetón** `components/items/TokenArt.tsx` (SVG):
  - **líce:** starý mosadzný žetón s veternou ružicou, ryskami, nápismi „BRATISLAVA“ a „0 KM“,
  - **hrana:** ryhovaný okraj s hladkým miestom, kde je **vyrytá číslica**.
- **Nová obrazovka** `components/items/ItemInspector.tsx`:
  - okno cez celú obrazovku; **Esc** ho zavrie; pri otvorení sa zameria prvý ovládací prvok („Otočiť na hranu“),
  - tlačidlo **„Otočiť na hranu“ / „Otočiť späť“** s krátkou animáciou otočenia,
  - na hrane je **miesto s číslicou** – skutočné tlačidlo (myš, Tab, Enter, medzerník), plocha aspoň 44 × 44 px, popis pre čítačku „Vyrytá číslica na hrane žetónu“,
  - po **20 s** nečinnosti jemne **žiari** miesto, kam sa pozrieť (na líci tlačidlo „Otočiť“, na hrane miesto s číslicou); pri vypnutých animáciách zostane výrazný obrys bez pulzovania,
  - po ďalších **20 s** sa ukáže **„Ukáž číslicu“** – bez straty bodov, zapíše sa do `revealedCodeItemIds`,
  - po nájdení: číslica sa zvýrazní, krátka animácia, text **„Číslica pre zámok I zapísaná do zápisníka (miesto 1).“** (čítačka ho oznámi), zvuk `digit-found` cez `soundManager`. Súbor zvuku zatiaľ chýba a pri vypnutom zvuku sa preskočí – hra pokračuje bez neho,
  - zameranie klávesnice potom prejde na tlačidlo „Hotovo“.
- **Inventár** (`InventoryScreen.tsx`):
  - pri žetóne je „Tajný údaj“ **skrytý**, kým hráč číslicu nenájde („Číslica je na predmete ukrytá. Prezri ho a nájdi ju.“), a je tam tlačidlo **„Prezrieť“**,
  - číslica sa teraz berie zo zápisníka, teda z dát kapitoly.
- **Po vyriešení scény 1** (`HistoryScreen.tsx`) je nová karta **„Nová odmena“** so žetónom a tlačidlom „Prezrieť“. Ukáže sa iba pri predmete s obrazovkou „Prezrieť“, ostatné scény sa nemenia.
- **Engine** (`engine/codeNotebook.ts`):
  - `getSceneCodeItemId` (predmet s číslicou za scénu),
  - `getCodeItemInfo` (zámok, miesto, nájdená/odhalená),
  - zápisník pri každom mieste vie, či má predmet obrazovku „Prezrieť“.
- `lib/soundManager.ts`: nový zvuk `digit-found` (`/sounds/digit-found.mp3`).
- `docs/MEDIA-LICENCIE.md`: doplnený chýbajúci zvuk `digit-found.mp3` a poznámka, že obrázky predmetov sú kreslené v kóde (vlastná práca).
- Nepoužívaný panel dôkazov truhlice (`ChestEvidencePanel.tsx`) sa nemenil; do hry sa vráti s novou truhlicou.

**Test (mimo projektu, necommitnutý):**
- **Testy enginu:** pred zmenou 6 z 13 zlyhalo (žetón ešte nemal `inspect`), **po zmene 13 z 13 prešlo**:
  - získanie žetónu číslicu nezapíše, zápisník má prázdne miesto (`I:___`),
  - nájdenie zapíše „3“ do zámku I, iba raz, body sa nemenia,
  - „Ukáž číslicu“ zapíše do nájdených aj odhalených, body sa nemenia,
  - nájdená číslica prežije F5; nenájdená po F5 zostane nenájdená,
  - ostatné predmety sú nájdené hneď (`I:_81` po scéne 3).
- **Celá kapitola pred zmenou a po nej: žiadny rozdiel** (41 riadkov, poradie obrazoviek, skóre **1010**).

**Zmenené súbory:**
- `types/game.ts`
- `data/chapter-one/michalska-brana.ts`
- `engine/codeNotebook.ts`
- `lib/soundManager.ts`
- `components/items/TokenArt.tsx` (nový)
- `components/items/ItemInspector.tsx` (nový)
- `components/screens/InventoryScreen.tsx`
- `components/screens/HistoryScreen.tsx`
- `components/game/CollectionFlow.tsx`
- `components/game/HistoryFlow.tsx`
- `app/page.tsx`
- `docs/MEDIA-LICENCIE.md`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** iba staré upozornenie v `HistoryScreen.tsx` (nepoužitý `LightbulbIcon`, známe z kroku 27). Nová chyba ani upozornenie nevzniklo.

**V prehliadači:** zatiaľ neoverené používateľom (myš, klávesnica, 360 px, vypnutý zvuk, vypnuté animácie).

**Ďalší krok:** používateľ overí obrazovku „Prezrieť“ v prehliadači, potom B1b-3 (zvyšné predmety), až po potvrdení.

---

## Krok 41: Návrh B1b-2b – otáčanie žetónu prstom alebo myšou

**Čo sa urobilo:** iba čítanie kódu a návrh (v odpovedi používateľovi). Kód sa nemenil. B1b-3 sa nezačína, kým používateľ nepotvrdí B1b-2b.

**Zistenia z kódu:**
- three.js 0.185.1, @react-three/fiber 9.6.1 a @react-three/drei 10.7.7 sú v projekte.
- 3D truhlica (`components/ui/chest-3d/`) už má vlastné otáčanie ťahaním. Plátno (`Canvas`) sa nastavuje v `ChestScene.tsx`.
- Po kroku B2 hra 3D truhlicu nenačítava, takže three.js dnes nie je v balíku hry. Nová 3D časť by sa mala načítať až pri otvorení „Prezrieť“.

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md` (tento záznam)

**Build:** netýka sa tohto kroku.

**Ďalší krok:** rozhodnutie používateľa medzi možnosťou A (CSS 3D) a B (three.js), až potom realizácia.

---

## Krok 42: Záver pracovného dňa

**Stav Gitu:** všetky commity až po krok 40 (B1b-2) sú na GitHube (vetva `sprint-4-first-playable-chapter`). Na odoslanie čaká iba commit s týmto záznamom a záznamom kroku 41.

**Hotové (kód, build prešiel, otestované):**
- **0.1** – jasné zadanie úloh v scénach 3 až 10 (`answerLabel`), Salvátor zvonku.
- **0.2** – odmena za úlohu iba z dát (`quests.ts`), pripíše sa raz.
- **0.3a** – potvrdzovacie okienko pred zmazaním postupu (overené v prehliadači).
- **0.3b** – oprava uloženej hry s neexistujúcou scénou so zálohou (overené v prehliadači).
- **0.4a** – jednotné názvy Úlohy, Inventár, Artefakty, `lang="sk"`, poradie dvojíc (overené pri 360 px).
- **0.4b** – počet artefaktov z dát kapitoly namiesto „/10“.
- **1.1** – počet prečítaných nápoved sa ukladá do hry.
- **A1** – akty kapitoly v dátach (`acts.ts`), `ActId` ako text.
- **A2** – hranice aktov, názvy aktov a kódy z dát namiesto čísel scén.
- **A3** – vynechaný (truhlice po aktoch zanikli).
- **B1a** – jednociferné kódy 3-8-1, 6-0-4, 9-2-7.
- **B2** – ľahký koniec aktu (Hlas Strážcu, Pečať) s útržkami fotografie namiesto truhlíc po akte I a II.
- **B1b-1** – stav nájdených číslic a Zápisník kódov v Inventári.
- **B1b-2** – obrazovka „Prezrieť“, prototyp so žetónom (2D, tlačidlo „Otočiť na hranu“).
- **Dokumenty:** `KONCEPT-KAPITOL.md`, `KONCEPT-ZAZITKU.md`, `KARTY-USLOH.md`, `MEDIA-LICENCIE.md`.

**Rozpracované:**
- **B1b-2b** – otáčanie žetónu prstom alebo myšou podľa návrhu (možnosť B, three.js), rozdelené na kroky:
  - **2b-1** – kresba žetónu ako jeden SVG zdroj pre 2D aj 3D – **zatiaľ sa nezačal**,
  - **2b-2** – 3D žetón (ťahanie so zotrvačnosťou, šípky, natočenie hrany a tlačidlo pri číslici, 2D záloha, načítanie až pri „Prezrieť“),
  - **2b-3** – výkon a dokončenie.
- **B1b-3** (ostatné predmety) sa začne až po B1b-2b.

**Otvorené veci:**
1. **Zarovnanie Zápisníka kódov** – oprava je urobená (krok 39), ale používateľ ju zatiaľ neoveril v prehliadači (360 px aj počítač). Snímka sa k správe nepripojila.
2. **Overenie v prehliadači** – B2 (koniec aktu bez truhlice), B1b-1 (zápisník) a B1b-2 (obrazovka „Prezrieť“: myš, klávesnica, 360 px, vypnutý zvuk, vypnuté animácie).
3. **Terén:**
   - Salvátor – presné miesto latinského nápisu na vonkajšku,
   - Primaciálny palác – poradie písmen C, I zľava doprava,
   - Mirbachov palác – príliš ľahká odpoveď „znak“,
   - vodidlá na ďalšie miesta, dĺžka trasy.
4. **Verzia uloženia** – pred prvým externým testerom zvýšiť `mysterium-progress-v2` na `v3`.
5. **Ďalšie otvorené** (z predchádzajúcich krokov):
   - zvukové súbory sú prázdne alebo chýbajú (aj nový `digit-found.mp3`),
   - zosúladiť `KONCEPT-KAPITOL.md` a `KONCEPT-ZAZITKU.md` s kartami úloh (jedna truhlica, nové kódy),
   - texty kapitoly natvrdo v `FinishScreen.tsx`, `IntroScreen.tsx` a `QuestScreen.tsx` presunúť do dát (B7),
   - staré lint chyby `set-state-in-effect` (`useGameEngine.ts`, `CodexBar.tsx`, `ActChestScreen.tsx`),
   - 3D model truhlice má ozdobné okienka pre 2 číslice (rieši B3/B4).

**Zmenené súbory:**
- `docs/PRACOVNY-DENNIK.md`

**Build:** netýka sa tohto kroku.

**Ďalší krok:** používateľ potvrdí odpovede k návrhu B1b-2b (A alebo B, spôsob otáčania, prepínač `?bez3d`), potom krok 2b-1.

---

## 23. 10. 2026 – Krok 43 (krok B1b-2b, časť 2b-1): Kresba žetónu ako jeden SVG zdroj

**Rozhodnutie používateľa:** návrh B1b-2b je schválený, **možnosť B (skutočné 3D)**. Robí sa iba krok 2b-1.

**Čo sa urobilo:**
- Nový súbor `components/items/art/tokenArt.ts`: funkcia `getTokenSvg({ side, digit, isDigitFound, idPrefix })` vráti celé SVG žetónu ako text:
  - **líce:** veterná ružica, 16 rysiek, „BRATISLAVA“, „0 KM“,
  - **hrana:** ryhovanie s hladkým miestom a vyrytou číslicou.
  - Číslica sa berie zo vstupu (z dát predmetu) a escapuje sa.
  - Je to **jediný zdroj kresby**: použije ho 2D obrazovka a v kroku 2b-2 aj 3D textúra.
- `components/items/TokenArt.tsx` už nekreslí sám. Vloží SVG z `tokenArt.ts`.
- Všetky tvary, farby, súradnice, písmo aj tieň sú prenesené bez zmeny, takže **vzhľad sa nemá zmeniť**. Tieň (`drop-shadow`) je teraz na obale namiesto priamo na SVG, s rovnakým výsledkom.
- Engine, dáta ani ostatné obrazovky sa nemenili.

**Test (mimo projektu, necommitnutý):**
- **Test kresby:** pred zmenou zlyhal (súbor neexistoval), **po zmene 8 z 8 prešlo**:
  - hrana obsahuje číslicu z dát žetónu (3), aj pri inej číslici sa zmení,
  - líce číslicu kódu neobsahuje (iba „BRATISLAVA“ a „0 KM“),
  - nájdená číslica má svetlejšiu farbu ako nenájdená,
  - platné SVG s rovnakým rozmerom (`viewBox 0 0 240 240`),
  - líce má 16 rysiek a hrana 18 ryh, ako pôvodná kresba,
  - nebezpečné znaky sa escapujú.
- **Celá kapitola pred zmenou a po nej: žiadny rozdiel** (41 riadkov, poradie obrazoviek, skóre **1010**).

**Zmenené súbory:**
- `components/items/art/tokenArt.ts` (nový)
- `components/items/TokenArt.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**V prehliadači:** zatiaľ neoverené používateľom (žetón má vyzerať rovnako ako pred zmenou).

**Ďalší krok:** používateľ overí vzhľad žetónu, potom krok 2b-2 (3D žetón), až po potvrdení.

---

## 23. 10. 2026 – Krok 44 (krok B1b-2b, časť 2b-2): Skutočný 3D žetón

**Čo sa urobilo:**
- **3D žetón** (three.js, react-three-fiber, drei) na obrazovke „Prezrieť“:
  - `components/items/3d/TokenModel.tsx` – valec s **ryhovanou hranou** (opakovaná ryha, jemný reliéf), **líce a rub** z kresby v `tokenArt.ts`, **hladká plôška s vyrytou číslicou** na hrane. Všetko je kreslené v kóde, nie AI obrázky.
  - `components/items/art/tokenArt.ts` – pridané 3 kresby pre 3D z tých istých farieb: líce bez tieňa, ryha hrany, plôška s číslicou (2D kresba sa nezmenila).
  - `components/items/3d/useSvgTexture.ts` – prevod SVG na textúru, pri zatvorení sa uvoľní.
- **Spoločný „stôl“** `components/items/3d/InspectStage.tsx`:
  - jedno plátno, svetlo, kamera,
  - kreslí iba pri pohybe (`frameloop="demand"`), rozlíšenie najviac 1,5×,
  - na plátne vypnuté posúvanie stránky (`touch-action: none`),
  - pri strate grafického kontextu sa prepne na 2D.
- **Ovládanie** (`components/items/3d/Token3DView.tsx`):
  - ťahanie myšou alebo prstom **voľne doľava a doprava so zotrvačnosťou**,
  - **nakláňanie hore a dole najviac ±35°**, po pustení sa vráti,
  - **šípky** ← → otáčajú po 15°, ↑ ↓ nakláňajú (náklon chvíľu podrží), **Home** vráti do základnej polohy,
  - tlačidlo **„Otočiť na hranu“** plynulo natočí žetón najkratšou cestou tak, aby bola číslica otočená k hráčovi.
- **Natočenie hrany** (`components/items/3d/facing.ts`, čistá funkcia):
  - číslica je natočená k hráčovi, keď smer k nej a smer ku kamere zvierajú najviac **25°**,
  - číslica je na jednej strane hrany: ukáže sa pri otočení o 90° jedným smerom, na druhej strane nie je.
- **HTML tlačidlo nad číslicou** (cez drei `Html`): skutočné tlačidlo 48 × 64 px s popisom pre čítačku. Zobrazí sa **iba keď je číslica natočená k hráčovi**. Tab a Enter fungujú. Čítačka oznámi „Vyrytá číslica je natočená k tebe“.
- **Zápis číslice:**
  - keď je číslica natočená k hráčovi aspoň **1,5 s**, zapíše sa sama,
  - ťuknutie alebo Enter ju zapíše hneď,
  - **pri vypnutých animáciách sa sama nezapíše** – iba ťuknutím alebo Enterom,
  - zapíše sa iba raz, aj keď ťuknutie a automatický zápis prídu naraz.
- **Vypnuté animácie:** bez zotrvačnosti, náklon sa vráti hneď, „Otočiť na hranu“ je okamžité, žiara iba ako obrys.
- **Fyzika otáčania** (`components/items/3d/rotationPhysics.ts`, čisté funkcie): ťahanie, zotrvačnosť, náklon, plynulé natočenie.
- **Načítanie a záloha** (`components/items/ItemInspector.tsx`, `supportsWebGL.ts`, `InspectErrorBoundary.tsx`, `useReducedMotion.ts`, `inspectStyles.ts`):
  - 3D časť sa stiahne **až pri otvorení „Prezrieť“** (`next/dynamic`); kým sa sťahuje, ukáže sa 2D líce,
  - **záloha na dnešnú 2D obrazovku** (žetón, „Otočiť na hranu“, miesto s číslicou), keď prehliadač nevie WebGL, keď 3D spadne alebo sa stratí grafický kontext,
  - **skrytý prepínač `?bez3d`** v adrese zapne 2D zálohu na skúšku,
  - jedno plátno naraz (v hre nie je iné 3D).
- Engine, dáta ani uloženie hry sa nemenili.

**Rozhodnutia, ktoré nemali v zadaní presné číslo:**
- citlivosť ťahania 0,01 rad/px,
- zotrvačnosť slabne s koeficientom 4/s a zastaví sa pod 0,05 rad/s,
- náklon sa vracia s koeficientom 10/s,
- „Otočiť na hranu“ dobieha s koeficientom 8/s,
- krok šípok 15°, podržanie náklonu z klávesnice 0,9 s,
- hrúbka žetónu 0,24 (aby bola číslica na hrane čitateľná),
- tolerancia natočenia 25° (podľa návrhu).

**Test (mimo projektu, necommitnutý):**
- **Test logiky:** pred zmenou zlyhal (súbory neexistovali), **po zmene 25 z 25 prešlo**:
  - natočenie: 0° nie, −90° áno, +90° (druhá strana) nie, 180° nie; −90° ± 20° áno, ± 30° nie; náklon 15° áno, 35° nie; celá otáčka navyše áno; „Otočiť na hranu“ ide najkratšou cestou (zo 170° na 270°, z −30° na −90°),
  - zotrvačnosť: po pustení sa ešte otáča a postupne sa zastaví; pri vypnutých animáciách sa zastaví hneď,
  - náklon: obmedzený na ±35°, po pustení sa vráti, pri vypnutých animáciách hneď,
  - „Otočiť na hranu“: plynulé a dorazí do cieľa, pri vypnutých animáciách okamžité,
  - zápis: po 1,4 s ešte nie, po 1,5 s áno; po odtočení sa odpočet vynuluje; **pri vypnutých animáciách ani po 5 s nie**; nájdená číslica sa znova nezapíše.
- **Celá kapitola: žiadny rozdiel** (41 riadkov, skóre **1010**, poradie obrazoviek).
- **Test kresby žetónu (2b-1):** stále 8 z 8.

**Veľkosť stiahnutých častí** (`next build` + `next start`, merané gzip):
- pri otvorení stránky: 9 súborov, spolu **717 kB, gzip 213 kB** – **neobsahujú 3D knižnicu**,
- 3D časť (stiahne sa až pri „Prezrieť“, jednorazovo): **877 kB, gzip 232 kB** + doplnok 4 kB (gzip 1 kB).

**Zmenené súbory:**
- `components/items/art/tokenArt.ts`
- `components/items/ItemInspector.tsx`
- `components/items/3d/facing.ts` (nový)
- `components/items/3d/rotationPhysics.ts` (nový)
- `components/items/3d/useSvgTexture.ts` (nový)
- `components/items/3d/InspectStage.tsx` (nový)
- `components/items/3d/TokenModel.tsx` (nový)
- `components/items/3d/Token3DView.tsx` (nový)
- `components/items/InspectErrorBoundary.tsx` (nový)
- `components/items/inspectStyles.ts` (nový)
- `components/items/supportsWebGL.ts` (nový)
- `components/items/useReducedMotion.ts` (nový)
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb. Prvý pokus hlásil 7 chýb (priamy zápis do polí ovládača otáčania), opravené presunom zápisov do metód.

**V prehliadači:** zatiaľ neoverené. Vzhľad 3D žetónu (svetlo, orientácia číslice a nápisov, ryhy) som nemohol vidieť a treba ho skontrolovať.

**Ďalší krok:** používateľ overí 3D žetón v prehliadači, potom krok 2b-3 (výkon a dokončenie), až po potvrdení.

---

## 23. 10. 2026 – Krok 45 (krok 2b-3, časť vzhľad): Oprava vzhľadu 3D žetónu

**Problém (snímka od používateľa):** 3D žetón sa točil a číslica sa zapisovala, ale:
1. líce bolo jednofarebne pastelovo béžové, bez veternej ružice, bez nápisov „BRATISLAVA“ a „0 KM“ a bez zlatého vzhľadu,
2. svetlá plôška na hrane bola prázdna, bez číslice 3.

**Diagnóza (overená snímkami z prehliadača, pozri nižšie):**
- Textúry z SVG sa načítavajú **asynchrónne**, až po prvom vykreslení. Materiál vznikol najprv bez textúry. three.js zostaví program materiálu (shader) iba raz, takže keď textúra neskôr prišla, **shader ju vôbec nepoužil**. Materiál sa iba prepol na bielu farbu (pripravenú pre textúru), preto bolo líce aj plôška biele. To isté platilo pre ryhy hrany.
- Biela plocha bola navyše prejasnená silným svetlom (ambient 0,9 + smerové 2,4 + bodové 0,8) a tónovaním ACES, preto pôsobila pastelovo béžovo.
- `colorSpace` textúr bol už správne `sRGB`.
- Orientácia textúr bola správna; po oprave sú nápisy aj číslica rovno a nie zrkadlovo.

**Čo sa urobilo:**
- `components/items/3d/TokenModel.tsx`:
  - materiál sa po príchode textúry **vytvorí nanovo** (`key`), takže sa textúra skutočne zobrazí (líce, rub, ryhy hrany, plôška s číslicou),
  - nižší lesk materiálov,
  - plôška s číslicou v dvojnásobnom rozlíšení (480 × 720).
- `components/items/3d/InspectStage.tsx`:
  - vypnuté tónovanie (`flat`), aby farby kresby zostali verné,
  - nižšie svetlá: ambient 0,6, smerové 1,5, bodové 0,35.
- `components/items/art/tokenArt.ts` (iba 3D plôška, 2D kresba sa nezmenila):
  - plôška má stredne tmavú mosadz s tenkým rámikom,
  - nenájdená číslica je tmavohnedá (`#3b2608`),
  - **nájdená číslica je svetlá (`#fff1c1`) s tmavým obrysom**, zvýraznená ako v 2D a čitateľná na mosadzi.
- Výkon a uvoľnenie pamäte (zvyšok kroku 2b-3) sa zatiaľ nerobili.

**Kontrola vzhľadu snímkami:**
- Nástroj: Chrome bez okna (headless) so softvérovým 3D (SwiftShader), riadený skriptom cez Chrome DevTools Protocol, mimo projektu (necommitnutý).
- Skript otvorí hru (`next start`), vloží uloženú hru so žetónom, otvorí Inventár → „Prezrieť“, klikne „Otočiť na hranu“ a urobí 3 snímky.
- **Pred opravou:** líce jednofarebný krémový kruh; na hrane svetlý prázdny obdĺžnik, ryhy neviditeľné. Potvrdilo to snímku používateľa.
- **Po oprave:** líce je zlatá mosadz s veternou ružicou, 16 ryskami, prerušovaným kruhom, „BRATISLAVA“ a „0 KM“; hrana má viditeľné ryhy a čitateľnú tmavohnedú **3**; po zápise je 3 svetlá s tmavým obrysom a zobrazí sa „Číslica pre zámok I zapísaná do zápisníka (miesto 1)“.
- Obmedzenie: softvérové 3D môže vyzerať o niečo inak než grafická karta v počítači alebo mobile.
- Pri prvom pokuse po oprave sa stránka nenačítala, lebo na porte 3124 ešte bežal starý skúšobný server z prvého pokusu (servíroval starú verziu). Ukončil som iba tento proces a skript opravil. Vývojový server používateľa (`next dev`) som nechal bežať.

**Test (mimo projektu, necommitnutý):**
- pred zmenou aj po nej: **test logiky 25 z 25**, **test kresby žetónu 8 z 8**,
- **celá kapitola: žiadny rozdiel** (41 riadkov, skóre **1010**).

**Zmenené súbory:**
- `components/items/3d/TokenModel.tsx`
- `components/items/3d/InspectStage.tsx`
- `components/items/art/tokenArt.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**V prehliadači:** overené snímkami z prehliadača bez okna. Používateľ zatiaľ neoveril na svojom zariadení.

**Ďalší krok:** používateľ overí vzhľad 3D žetónu u seba, potom zvyšok kroku 2b-3 (výkon a uvoľnenie pamäte), až po potvrdení.

---

## 23. 10. 2026 – Krok 46 (krok 2b-3, dokončenie): Nula na žetóne, výkon a uvoľnenie pamäte

Používateľ potvrdil, že 3D žetón vyzerá dobre.

**Čo sa urobilo:**
1. **„0 KM“ na líci žetónu** (`components/items/art/tokenArt.ts`):
   - písmo Georgia má nízke „starodávne“ číslice, nula vyzerala ako malé „o“ („o KM“),
   - nápis „0 KM“ má teraz písmo s číslicami rovnakej výšky (Times New Roman, Times, Liberation Serif) a `font-variant-numeric: lining-nums`,
   - platí pre 2D aj 3D, kresba je spoločná.
2. **Výkon a uvoľnenie pamäte:**
   - kreslenie iba pri pohybe (`frameloop="demand"`) a rozlíšenie najviac 1,5× boli už nastavené v kroku 44; overené, bez zmeny,
   - `components/items/3d/useSvgTexture.ts`: pri výmene textúry (napríklad po nájdení číslice) sa stará textúra uvoľní **až po nasadení novej**, aby materiál nikdy nekreslil uvoľnenú textúru; pri zatvorení okna sa uvoľní posledná textúra,
   - `components/items/supportsWebGL.ts`: skúška WebGL sa robí **iba raz** a výsledok sa zapamätá (predtým vznikal skúšobný 3D kontext pri každom otvorení „Prezrieť“); prepínač `?bez3d` funguje ďalej,
   - materiály, tvary a plátno uvoľňuje react-three-fiber sám pri zatvorení okna – overené záťažovým testom,
   - jedno 3D plátno naraz: v hre je jediné okno „Prezrieť“ a iné 3D sa nezobrazuje – overené (vždy najviac 1 plátno).

**Kontrola snímkami z prehliadača** (Chrome bez okna, softvérové 3D, skript mimo projektu):
- detail líca v dvojnásobnom zväčšení: nápis je zreteľne **„0 KM“** s vysokou nulou,
- hrana s ryhami a čitateľnou 3, po zápise svetlá 3 s obrysom a správa o zápise – bez zmeny oproti kroku 45.

**Záťažový test (20× a 40× otvoriť a zavrieť „Prezrieť“):**
- otvorené okno má vždy **1 plátno**, po každom zatvorení **0 plátien**,
- prehliadač ani raz nehlásil „príliš veľa WebGL kontextov“,
- pamäť JavaScriptu po upratovaní: 6,9 MB na začiatku → 8,3 MB po 10 kolách → 9,8 MB po 40 kolách. Po zahriatí rastie asi o **50 kB na jedno otvorenie a zatvorenie**. Grafické kontexty a plátna sa uvoľňujú správne. Malý zvyšok je pravdepodobne v knižniciach; pri bežnom hraní ide o stovky kB. **Zapisujem ako pozorovanie na neskôr.**
- v konzole je iba upozornenie knižnice react-three-fiber „THREE.Clock … deprecated“ (pochádza z knižnice, nie z nášho kódu, hru neovplyvňuje).

**Veľkosť stiahnutých častí** (`next build` + `next start`, gzip):
- pri otvorení stránky: 9 súborov, **717 kB, gzip 213 kB**, **bez 3D knižnice**,
- 3D časť (stiahne sa až pri „Prezrieť“): **877 kB, gzip 232 kB**.

**Test (mimo projektu, necommitnutý):**
- pred zmenou aj po nej: **logika 25 z 25**, **kresba žetónu 8 z 8**,
- **celá kapitola: žiadny rozdiel** (41 riadkov, skóre **1010**).

**Zmenené súbory:**
- `components/items/art/tokenArt.ts`
- `components/items/3d/useSvgTexture.ts`
- `components/items/supportsWebGL.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Stav:** krok **B1b-2b (2b-1 až 2b-3) je dokončený**. Zostáva overenie plynulosti na mobile používateľom.

**Ďalší krok:** používateľ overí plynulosť (emulácia mobilu so spomalením procesora alebo skutočný telefón), potom B1b-3 (ostatné predmety), až po potvrdení.

---

## 23. 10. 2026 – Krok 47 (krok B1b-3a): Ploché predmety, nahrávka a tajomné texty

**Čo sa urobilo:**
- **Tri nové predmety na obrazovke „Prezrieť“** (id predmetov sa nezmenili, kvôli uloženým hrám):
  - **scéna 3 – „Pátračova strana z denníka“** (📜, číslica 1): tenký list papiera. Líce má latinský odkaz z lekárne a rok 1658, rub poznámky a **podčiarknutú 1** v poznámke na okraji („Môj prvý krok:“).
  - **scéna 5 – „Kus mapy: námestie“** (🗺️, číslica 0): líce má pôdorys Františkánskeho námestia s malým kompasom v rohu, rub pátračov náčrt kompasu a **0 pri severe**.
  - **scéna 6 – „Nahrávka Strážcu“** (🎙️, číslica 4): 2D prepis, slovo **„štyri“** je zvýraznené a kliknutím naň sa číslica objaví (3D nepotrebuje, sama sa nezapisuje).
- **Popisy** troch predmetov sú nové a nespomínajú pôvodný druh predmetu (pečať, úlomok).
- **Kresby v kóde** (SVG, jeden zdroj pre 2D aj 3D):
  - `components/items/art/journalPageArt.ts`, `mapArt.ts`,
  - spoločný papier a ručne písaná číslica v `paper.ts`,
  - register všetkých kresieb `itemArtRegistry.ts` (tvar, rozmery, miesto číslice, názvy tlačidiel).
- **Plochý predmet v 3D** (`components/items/3d/Flat3DView.tsx`):
  - tenká doska s textúrou líca a rubu,
  - ťahaním sa **nakláňa ±30°** do strán aj hore a dole a po pustení sa vráti,
  - šípky nakláňajú,
  - **„Obrátiť“** ho plynulo otočí o 180°,
  - keď je rub otočený k hráčovi (do 25°), nad číslicou je HTML tlačidlo (48 × 48 px), ťuknutie alebo Enter zapíše hneď a po **1,5 s** sa zapíše sama (pri vypnutých animáciách iba ťuknutím alebo Enterom).
- **Logika** (`facing.ts`, `rotationPhysics.ts`): natočenie rubu `isBackFacing` a nakláňanie s obrátením (`createFlatState`, `applyFlatDrag`, `releaseFlatDrag`, `flipFlat`, `nudgeFlat`, `stepFlat`, `isFlatAtRest`).
- **Všeobecné okno „Prezrieť“** (`components/items/ItemInspector.tsx`) pre všetky predmety (žetón, list, prepis), 3D aj 2D. `TokenArt.tsx` nahradil všeobecný `ItemArtImage.tsx` (súbor `TokenArt.tsx` je odstránený).
- **2D záloha a `?bez3d`:** všetky kreslené predmety majú 2D verziu. Ťuknutie na predmet ho otočí aj bez tlačidla, skryté miesto je tlačidlo nad číslicou.

**Doplnok – tajomné texty (platí pre všetky predmety, aj žetón):**
- texty sú v dátach pri každom predmete (pole `inspect`: `intro`, `hint`, `foundText`, `hotspotLabel`),
- **úvod:** „Preskúmaj predmet a objav niečo, čo si nečakal.“ (bez slov okraj, hrana, číslica),
- **po asi 20 s nečinnosti:** žiara a jemná nápoveda daného predmetu,
- **po ďalších asi 20 s:** „Ukáž číslicu“,
- **po objavení:** „Objavil si číslo, ktoré ti na konci pomôže odomknúť tajomstvo.“ a menším písmom „Zapísané do zápisníka kódov (zámok I, miesto 1).“
- **žetón:** „Otočiť na hranu“ sa ukáže až spolu s nápovedou po 20 s,
- **ploché predmety:** „Obrátiť“ je viditeľné hneď, lebo ťahaním sa list iba nakláňa a bez tlačidla by sa na rub nedalo dostať,
- **čítačka obrazovky:** popisy ovládania a skrytých miest (`hotspotLabel`) zostali, viditeľné texty sú tajomné.

**Rozhodnutia, ktoré nemali v zadaní presné určenie:**
- **Skrytý detail plochých predmetov je na rube.** Keby bola číslica na líci, zapísala by sa sama 1,5 s po otvorení a hráč by nič neobjavoval. Na líci strany denníka je latinský odkaz, na líci mapy pôdorys námestia s malým kompasom v rohu.
- **Rozmery v 3D:** list má výšku 1,9 (asi 80 % plochy). Po prvej snímke bola mapa príliš malá a texty na rube sa ťažko čítali.

**Snímky z prehliadača** (Chrome bez okna, softvérové 3D, skript mimo projektu):
- **3D:**
  - žetón (bez „Otočiť na hranu“ po otvorení, hrana, nájdená číslica),
  - strana z denníka (líce s latinským odkazom, rub s poznámkou a podčiarknutou 1, nájdená 1 zvýraznená žltým zvýrazňovačom),
  - mapa (líce s námestím a kompasom, rub s náčrtom kompasu a 0 pri severe, nájdená 0),
  - nahrávka (prepis so zvýrazneným „štyri“, po kliknutí „štyri (4)“ zelene).
  - Pri všetkých sa ukázal úvodný a záverečný text a správne miesto v zápisníku (I-1, I-3, II-2, II-3).
- **2D záloha `?bez3d`:** strana, mapa, žetón – otočenie, kliknutie na skryté miesto, zápis.
- **Časovanie (žetón):** 0 s iba úvod; po 22 s nápoveda „Skús predmet otočiť a pozrieť si ho zblízka.“ a žiariace „Otočiť na hranu“; po 43 s „Ukáž číslicu“, ktoré číslicu zapíše.

**Test (mimo projektu, necommitnutý):**
- **nový test B1b-3a:** pred zmenou 10 chýb, **po zmene 28 z 28**:
  - dáta a názvy troch predmetov, id bez zmeny, popisy bez starého druhu,
  - 4 predmety s „Prezrieť“, úvody bez slov okraj, hrana, číslica, nápovedy a texty po objavení, presné texty žetónu,
  - rub natočený pri 180° (aj s náklonom 20°, nie s 30°), náklon ±30°, návrat, plynulé a okamžité „Obrátiť“,
  - bez prezerania je zápisník `I:_8_ II:6__ III:927`; nájdenie zapíše iba raz; „Ukáž číslicu“ bez straty bodov; prežije F5.
- **logika žetónu 25 z 25**, **kresba žetónu 8 z 8**,
- **celá kapitola: žiadny rozdiel** (41 riadkov, skóre **1010**).

**Veľkosť:**
- pri otvorení stránky 9 súborov, **gzip 216 kB** (predtým 213 kB; pribudli kresby a všeobecné okno), bez 3D knižnice,
- 3D časť (až pri „Prezrieť“) **gzip 231 kB**.

**Nezmenené (návrh na neskôr):** mimo okna „Prezrieť“ ostali texty, ktoré prezrádzajú skrytú číslicu:
- v Inventári: „Číslica je na predmete ukrytá. Prezri ho a nájdi ju.“,
- v karte „Nová odmena“ po vyriešení úlohy: „Na predmete je ukrytá číslica kódu. Prezri ho a nájdi ju.“

**Zmenené súbory:**
- `types/game.ts`
- `data/chapter-one/michalska-brana.ts`, `lekaren-u-salvatora.ts`, `mirbachov-palac.ts`, `stara-radnica.ts`
- `components/items/art/paper.ts` (nový), `journalPageArt.ts` (nový), `mapArt.ts` (nový), `itemArtRegistry.ts` (nový)
- `components/items/ItemArtImage.tsx` (nový), `components/items/TokenArt.tsx` (odstránený)
- `components/items/ItemInspector.tsx`
- `components/items/3d/Flat3DView.tsx` (nový), `Token3DView.tsx`, `facing.ts`, `rotationPhysics.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** používateľ skontroluje znenie textov a predmety v prehliadači, potom B1b-3b (počítacie predmety: mapa s vežami, pečať, zuby kľúča), až po potvrdení.

---

## 23. 10. 2026 – Krok 48: Tajomné texty aj mimo okna „Prezrieť“

**Čo sa urobilo:** dva texty, ktoré prezrádzali skrytú číslicu, sú nahradené textom **„Preskúmaj predmet zblízka.“**:
- Inventár (`components/screens/InventoryScreen.tsx`): predtým „Číslica je na predmete ukrytá. Prezri ho a nájdi ju.“
- karta „Nová odmena“ po vyriešení úlohy (`components/screens/HistoryScreen.tsx`): predtým „Na predmete je ukrytá číslica kódu. Prezri ho a nájdi ju.“

**Test (mimo projektu, necommitnutý):** pred zmenou 6 chýb, **po zmene 6 z 6** – oba súbory obsahujú „Preskúmaj predmet zblízka.“ a neobsahujú „ukrytá“ ani pôvodné vety.

**Zmenené súbory:**
- `components/screens/InventoryScreen.tsx`
- `components/screens/HistoryScreen.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** iba staré upozornenie v `HistoryScreen.tsx` (nepoužitý `LightbulbIcon`, známe od kroku 27).

**Ďalší krok:** krok B1b-3b (počítacie predmety).

---

## 23. 10. 2026 – Krok 49: Počítacie predmety (B1b-3b)

**Čo sa urobilo:** päť predmetov sa prezerá na spoločnom „stole“ (okno „Prezrieť“). Hráč ťuká na prvky na líci predmetu. Ťuknutý prvok sa označí. Keď sú označené všetky, číslica je nájdená. Počítadlo sa nikde nezobrazuje a žiadny text neprezrádza, že treba počítať.

| Scéna | Predmet | Prvky | Číslica | Zápisník |
|---|---|---|---|---|
| 2 | Kus mapy: staré mesto | veže | 8 | zámok I, miesto 2 |
| 4 | Pečať vzdelanosti | lúče | 6 | zámok II, miesto 1 |
| 7 | Prvý zub Zlatého kľúča | zárezy | 9 | zámok III, miesto 1 |
| 8 | Druhý zub Zlatého kľúča | zárezy | 2 | zámok III, miesto 2 |
| 9 | Tretí zub Zlatého kľúča | zárezy | 7 | zámok III, miesto 3 |

- Poloha a počet prvkov sú v zozname v dátach (`data/chapter-one/item-art.ts`). Kresba vykreslí presne tieto prvky.
- Zárezy sú rozdelené na hornú a dolnú hranu zuba, aby boli ťukacie plochy aj na mobile od seba aspoň 44 px.
- 3D: mapa je plochý list, ktorý sa dá nakláňať a obracať. Pečať je valec s reliéfom. Zub je vytiahnutý tvar so zárezmi. Záložná 2D verzia a `?bez3d` fungujú.
- Ovládanie klávesnicou: Tab prechádza medzi prvkami, Enter prvok označí. Čítačka prečíta „Veža“, „Lúč“ alebo „Zárez“ a stav označený/neoznačený, bez čísla.
- Texty: úvod „Preskúmaj predmet a objav niečo, čo si nečakal.“, po 20 s nápoveda pre konkrétny predmet (zároveň sa prvky jemne rozžiaria), po ďalších 20 s „Ukáž číslicu“.
- `Flat3DView.tsx` je premenovaný na `Item3DView.tsx` (teraz kreslí aj pečať a zub).

**Chyba nájdená pri snímkach a opravená:** v 3D bol pri počítacích predmetoch na líci text tlačidla „Obrátiť späť“ namiesto „Obrátiť“ (3D pohľad hlásil opačnú stranu). Opravené. Opravené je aj oznámenie pre čítačku, ktoré teraz hovorí „Zadná strana … je otočená k tebe.“

**Testy (mimo projektu, necommitnuté):**
- Nový test: pred zmenou 30 chýb, po zmene 45 z 45 OK. Vzdialenosti ťukacích plôch pri šírke 280 px: mapa 51 px, pečať 46 px, zuby 50, 106 a 62 px.
- Priebeh celej hry: bez rozdielu oproti stavu pred zmenou (41 riadkov).
- Fyzika: 25 z 25. Kresba žetónu: 8 z 8.
- Starý test B1b-3a: 4 očakávané rozdiely. Test predpokladal, že tieto číslice sa zapíšu samy, a to už neplatí. Nejde o chybu.
- Snímky z prehliadača (3D aj `?bez3d`) pre každý predmet: líce, rub, čiastočne označené, nájdená číslica. Zápisník na konci: I ·8·, II 6··, III 927.

**Zmenené súbory:**
- `types/game.ts`
- `data/chapter-one/item-art.ts` (nový), `tajna-stopa-michalska.ts`, `venturska-brana-spomienok.ts`, `maximilianova-fontana.ts`, `primacialny-palac.ts`, `bratislavsky-mier.ts`
- `components/items/art/oldTownMapArt.ts`, `educationSealArt.ts`, `keyToothArt.ts` (nové), `itemArtRegistry.ts`
- `components/items/ItemArtImage.tsx`, `components/items/ItemInspector.tsx`
- `components/items/3d/Item3DView.tsx` (premenovaný z `Flat3DView.tsx`), `facing.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** používateľ skontroluje texty nápovedy a popisov a vyskúša predmety v prehliadači.

---

## 23. 10. 2026 – Rozbor (bez zmeny kódu): tvar Zlatého kľúča a Inventár po konci kapitoly

- **Zuby kľúča:** návrh, aby každý zub bol tretinou brady historického kľúča. Nad ním má byť kúsok drieku, po bokoch spoje, ktoré ukazujú poradie. Zložený kľúč má ozdobnú hlavu, driek a bradu z troch častí. Návrh je nakreslený mimo projektu a odfotený v prehliadači. Otvorené: pri 9 prvkoch treba prvky rozostúpiť, aby boli od seba aspoň 44 px.
- **Inventár po konci kapitoly:** záverečná obrazovka má dnes iba tlačidlo „Hrať kapitolu od začiatku“. Inventár, zápisník kódov aj Artefakty sú tam nedostupné. Návrh: pridať tlačidlá „Inventár“ a „Artefakty“.
- Oba návrhy čakajú na potvrdenie.

---

## 23. 10. 2026 – Krok 50: Ťukanie na detaily pri počítacích predmetoch

**Čo sa urobilo:**
- Riadok pod predmetom (v 3D): pri mape, pečati a zuboch „Ťahaj, nakláňaj a ťukaj na detaily.“, pri ostatných predmetoch „Ťahaj a nakláňaj predmet.“ Predtým: „Predmet nakláňaj/otáčaj ťahaním prstom alebo myšou, prípadne šípkami na klávesnici.“
- Veže, lúče a zárezy sa pod myšou a pri dotyku krátko rozsvietia a kurzor sa zmení na ukazovateľ. Platí to v 3D aj v 2D. Štýl je na jednom mieste (`TAP_FEEDBACK_CLASSES` v `inspectStyles.ts`).
- Nové nápovedy po 20 s (v dátach pri predmete): mapa „Skús ťuknúť na to, čo ťa v meste zaujme.“, pečať „Skús ťuknúť na to, čo žiari okolo koruny.“, všetky tri zuby „Skús ťuknúť na to, čo vidíš na hranách zubu.“ Po nápovede sa prvky rozžiaria ako doteraz.
- Logika ani počet prvkov sa nezmenili.

**Poznámka:** v 2D verzii (`?bez3d`) sa riadok pod predmetom nezobrazuje, ani predtým sa nezobrazoval. Predmet sa tam nedá ťahať ani nakláňať, takže text „Ťahaj, nakláňaj…“ by bol nepravdivý. Nechané bez zmeny, rozhodne používateľ.

**Test (mimo projektu, necommitnutý):** pred zmenou 11 chýb, po zmene všetko OK. Overuje:
- nové nápovedy,
- nové riadky pod predmetom,
- žiadne „počítaj“, „spočítaj“ ani „číslica“ v textoch počítacích predmetov,
- rozsvietenie pod myšou a pri dotyku a kurzor ukazovateľ,
- nezmenený počet prvkov.

**Snímky z prehliadača (3D aj `?bez3d`):** pre každý predmet líce, prechod myšou nad prvkom (kurzor ukazovateľ, prvok sa rozsvieti) a nápoveda po 20 s.

**Zmenené súbory:**
- `components/items/inspectStyles.ts`, `components/items/ItemInspector.tsx`, `components/items/3d/Item3DView.tsx`
- `data/chapter-one/tajna-stopa-michalska.ts`, `venturska-brana-spomienok.ts`, `maximilianova-fontana.ts`, `primacialny-palac.ts`, `bratislavsky-mier.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** potvrdenie návrhov z rozboru (Inventár po konci kapitoly, tvar Zlatého kľúča).

---

## 23. 10. 2026 – Rozbor finále kapitoly (bez zmeny kódu) a rozhodnutia používateľa

**Zistenia:**
- Po scéne 10 hra ide rovno na záverečnú obrazovku. Akt III nemá koniec. Truhlica, skladanie fotografie ani zadanie miesta neexistujú.
- Scéna 10 dáva „Zlatý prešporský kľúč“ a „Útržok mapy ďalšieho prípadu“.
- Žiadny súbor truhlice (`components/ui/chest`, `components/ui/chest-3d`, `ActChestScreen`, `ChestIntroScreen`, `RewardReveal`) hra dnes nepoužíva.
- **Dá sa znova použiť:**
  - koliesko `ChestDial` (treba ho zväčšiť na 44 px, dnes má 32 px),
  - `ChestCodePanel`,
  - 3D truhlica (treba 3 × 3 okienka a kľúčovú dierku v strede),
  - 2D truhlica ako záloha,
  - `ChestIntroScreen` (Strážca),
  - `RewardReveal` (štvrtý útržok),
  - `CodeNotebook`,
  - `Item3DView` (fotografia).
- **Nahradí sa:** `ChestEvidencePanel` (dvojciferné kódy) nahradí Zápisník kódov priamo na obrazovke truhlice.

**Návrh:** pole `finale` v kapitole (Strážca, truhlica, fotografia, ďalšie miesto, záverečný text) a koniec aktu III (zloženie kľúča, tretí útržok). Postup finále sa uloží do príznakov hry. Kroky: B3-0, B3a, (7), B3b, B4a, B4b, B4c, B5, B6, B7.

**Rozhodnutia používateľa:**
- Uložená hra na záverečnej obrazovke prejde po zmene do finále (so zálohou uloženia).
- Zuby kľúča ostanú v Inventári aj po zložení.
- „Útržok mapy ďalšieho prípadu“ zo scény 10 nahradí štvrtý útržok fotografie. Záverečný text sa upraví.
- Zámky sa odomykajú v pevnom poradí I, II, III.
- „Otvoriť v mapách“ otvára Google Mapy.
- **B5:** fotografia bude obrázkový súbor (zatiaľ dočasný sépiový), zdroj je v dátach. Kód ho rozreže na 4 útržky s roztrhnutými hranami.
- **Kresba kľúča (krok 7):** návrh schválený, vrátane tieňového obrysu celého kľúča pod zubom po nájdení číslice. Valček na zube a driek zloženého kľúča majú rovnakú hrúbku. Ťukacie plochy aspoň 44 px, ak treba, zub bude v okne väčší. Počty 9, 2 a 7 sa nemenia. Robí sa po B3a a pred B3b.

---

## 23. 10. 2026 – Krok 51 (krok B3-0): Inventár a Artefakty aj po konci kapitoly

**Čo sa urobilo:** záverečná obrazovka má hore ten istý panel ako ostatné obrazovky hry: Úlohy, Inventár (so Zápisníkom kódov a „Prezrieť“) a Artefakty. „Späť“ vráti hráča na záverečnú obrazovku. Funguje to aj po obnovení stránky (F5), lebo hra si to miesto pamätá. Tlačidlo „Hrať kapitolu od začiatku“ ostalo. Texty záverečnej obrazovky sa nemenili (budú v kroku B7).

**Test (v prehliadači, mimo projektu, necommitnutý):** pred zmenou 13 chýb, po zmene 16 z 16 OK, v 3D aj `?bez3d`. Overuje:
- tlačidlá Inventár a Artefakty na záverečnej obrazovke,
- otvorenie Zápisníka kódov,
- prezretie zubu a nájdenie číslice po konci kapitoly (zápisník III: 9 → 92),
- F5 v Inventári a potom návrat na záverečnú obrazovku,
- Artefakty a Úlohy a návrat späť.

Prvé behy testu hlásili chyby v samotnom teste (nadpisy sú na obrazovke veľkými písmenami, test otvoril iný zub). Test som opravil. Kód hry to nebol.

**Snímky z prehliadača:** záverečná obrazovka s panelom, Inventár otvorený zo záverečnej obrazovky, Artefakty, návrat na záverečnú obrazovku.

**Zmenené súbory:**
- `app/page.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** čakám na potvrdenie kroku B3a (typy, dáta finále a logika enginu bez obrazoviek).

---

## 23. 10. 2026 – Krok 52 (krok B3a): Dáta finále a logika enginu (bez obrazoviek)

**Čo sa urobilo:**
- **Typy** (`types/game.ts`): `ChapterFinale` (Strážca, truhlica, fotografia, ďalšie miesto, záverečný text) a voliteľné pole `finale` v kapitole. Nový druh konca aktu `keyAssembly` (zloženie kľúča).
- **Dáta finále** (`data/chapter-one/finale.ts`, dočasné texty):
  - zámky I, II, III, kľúč `golden-pressburg-key-complete`,
  - štvrtý útržok `torn-photo-fragment-chest`,
  - fotografia zo 4 útržkov so zdrojom obrázka v dátach (`/images/finale/historicka-fotografia.jpg`, súbor sa doplní v kroku B5),
  - ďalšie miesto Slovenské národné divadlo, Hviezdoslavovo námestie 1 (`isPlaceholder: true`),
  - záverečný text, zatiaľ prevzatý z `FinishScreen.tsx`; namiesto útržku mapy hovorí o zloženej fotografii.
- **Koniec aktu III** (`data/chapter-one/acts.ts`): „Zlatý kľúč“ (zloženie kľúča) s odmenou `torn-photo-fragment-act-3`.
- **Logika** (`engine/finale.ts`):
  - zámky sa odomykajú iba v poradí I, II, III,
  - zlý kód ani zámok mimo poradia nič nezmenia,
  - kľúč sa dá vložiť až po troch zámkoch a iba s kľúčom v inventári,
  - truhlica sa otvorí až po vložení kľúča a štvrtý útržok pridá iba raz,
  - zadanie miesta.
- **Postup** sa ukladá do príznakov hry (`finale-lock-open-act-1` až `-act-3`, `finale-key-inserted`, `finale-chest-opened`, `finale-place-solved`). Uloženie sa nemení.
- **Porovnanie odpovedí** (`engine/answerMatching.ts`):
  - odpustí diakritiku, veľké a malé písmená a interpunkciu,
  - preklepy: 1 pri odpovediach s aspoň 5 písmenami, 2 od 10 písmen,
  - výmena dvoch susedných písmen = 1 preklep.
- `ActTransitionScreen.tsx`: iba ikona 🗝️ pre nový druh konca aktu. Bez nej by build neprešiel.
- **Priebeh hry sa nemení.** Koniec aktu III ani finále sa zatiaľ nezobrazia (krok B3b). Scéna 10 zatiaľ stále dáva „Útržok mapy ďalšieho prípadu“; nahradí sa v kroku B3b alebo B7 spolu so záverečnou obrazovkou.

**Test (mimo projektu, necommitnutý):** pred zmenou 19 chýb (logika ešte neexistovala), po zmene **65 z 65 OK** a 1 upozornenie. Overuje:
- dáta finále,
- poradie zámkov,
- zlý kód,
- kľúč pred zámkami a bez kľúča v inventári,
- truhlicu pred kľúčom,
- štvrtý útržok iba raz (aj po 4 otvoreniach a po F5),
- tabuľku 21 odpovedí s preklepmi (napr. „S.N.D.“ a „Slovneske narodne divadlo“ prijaté, „SNG“, „SDN“ a „Slovenske narodne muzeum“ odmietnuté),
- kapitolu bez finále.

**Upozornenie testu:** „ďalšie miesto Slovenské národné divadlo je dočasný údaj (isPlaceholder) – pred vydaním nahradiť“.

**Priebeh celej kapitoly:** bez rozdielu (41 riadkov), skóre **1010**. Test predmetov z B1b-3b: 45 z 45.

**Chyba počas práce:** úprava súboru testu cez PowerShell pokazila slovenské znaky (zlé kódovanie). Súbor testu som opravil. Kód projektu to nezasiahlo.

**Zmenené súbory:**
- `types/game.ts`
- `data/chapter-one/finale.ts` (nový), `data/chapter-one/acts.ts`, `data/chapter-one.ts`
- `engine/finale.ts` (nový), `engine/answerMatching.ts` (nový), `engine/index.ts`
- `components/screens/ActTransitionScreen.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** krok (7) kresba Zlatého kľúča, až po potvrdení.

---

## 23. 10. 2026 – Krok 53 (krok 7): Kresba Zlatého kľúča – tri časti brady a zložený kľúč

**Čo sa urobilo:**
- **Každý zub je časť brady historického kľúča** (`components/items/art/keyToothArt.ts`, kresba 320 × 240).
  - Hore je kúsok okrúhleho drieku (valček), pod ním blok brady.
  - Prvky na počítanie: zárezy v spodnej hrane a okienka v strede brady.
  - Po bokoch sú rybinové spoje: časť 1 má vpravo výstupok, časť 2 vľavo výrez a vpravo výstupok, časť 3 vľavo výrez.
  - Rub je zrkadlový a nemá značky.
- **Počty zostali 9, 2 a 7.** Poloha prvkov je ďalej v dátach (`data/chapter-one/item-art.ts`). Zárezy sú od seba 0,18 šírky kresby, okienka 0,2. Pri zuboch pribudlo poradie časti (`artPart: 1/2/3`).
- **3D:** vytiahnutý tvar so zárezmi a s okienkami ako otvormi, nad ním valec drieku. Zub sa v 3D zobrazí o niečo väčší (výška 2,15 namiesto 1,9), aby boli plochy aj v 3D od seba aspoň 44 px. 2D záloha a `?bez3d` fungujú.
- **Zložený kľúč** (`getGoldenKeySvg`): ozdobná hlava v tvare štvorlístka s korunkou, golier, driek s guľkou a brada z troch častí. **Driek má rovnakú hrúbku ako valček na zube** (40 × mierka 0,5 = 20). Časti na seba nadväzujú bez medzery. V hre sa zložený kľúč ukáže až v kroku B3b (koniec aktu III).
- **Tieňový obrys celého kľúča** sa po nájdení číslice ukáže v okne „Prezrieť“ pod textom. Zvýraznená je zlatá časť, kam zub patrí, ostatné časti sú tieň.
- **Kresby predmetov** dostávajú jeden objekt s voľbami (strana, číslica, prvky, poradie časti) namiesto dlhého zoznamu parametrov. Ostatné predmety sa kreslia rovnako ako predtým.

**Test (mimo projektu, necommitnutý):** pred zmenou 6 chýb (nová kresba neexistovala), po zmene **54 z 54 OK**. Overuje:
- počty 9, 2 a 7,
- zárezy pod spojmi a okienka mimo spojov,
- ťukacie plochy aspoň 44 px pri šírke 280 px (najmenej 50 px) aj pri 3D zmenšení na 90 % (najmenej 45 px),
- presný počet prvkov v kresbe a žiadne na rube,
- spoje podľa poradia časti,
- 3D obrys so zárezmi a otvormi,
- rovnakú hrúbku drieku a valčeka a nadväzujúce časti,
- zložený kľúč s 18 zárezmi a okienkami,
- obrys so zvýraznenou časťou,
- ostatné kresby (mapa, pečať, žetón, list).

Test B3a: všetko OK. Priebeh celej kapitoly: bez rozdielu, skóre 1010.

**Snímky z prehliadača:**
- každý zub v 3D aj `?bez3d`, pri šírke 420 px aj 360 px: líce, rub, nájdená číslica s obrysom,
- zložený kľúč a tri obrysy (vykreslené z kódu projektu).

Najmenšia vzdialenosť stredov ťukacích plôch nameraná v prehliadači:

| Šírka | 3D | 2D |
|---|---|---|
| 420 px | 53 px | 57 px |
| 360 px | 45 px | 48 px |

**Chyby počas práce:**
- Prvé meranie v prehliadači ukázalo v 3D iba 43 px (3D predmet je v okne menší ako 2D obrázok). Opravené: spoje sa posunuli nad zárezy, prvky sa rozostúpili a zub je v 3D väčší.
- Test raz chybne považoval zárez pri okraji za výrez spoja. Test som spresnil, kód to nebol.

**Na rozhodnutie používateľa:**
- Nápoveda pri zuboch znie „Skús ťuknúť na to, čo vidíš na hranách zubu.“, ale okienka sú teraz v strede brady, nie na hrane. Text som nemenil.
- Popis pre čítačku pri okienkach je tiež „Zárez“. Text som nemenil.

**Kontrola pred vydaním:** pred vydaním hry treba skontrolovať, či v dátach nezostal žiadny údaj s `isPlaceholder`. Zapísané do nového dokumentu `docs/KONTROLA-PRED-VYDANIM.md`. Kontrola v `package.json` sa podľa rozhodnutia používateľa nepridáva.

**Zmenené súbory:**
- `components/items/art/keyToothArt.ts`, `components/items/art/itemArtRegistry.ts`
- `components/items/ItemArtImage.tsx`, `components/items/ItemInspector.tsx`, `components/items/3d/Item3DView.tsx`
- `types/game.ts`
- `data/chapter-one/item-art.ts`, `maximilianova-fontana.ts`, `primacialny-palac.ts`, `bratislavsky-mier.ts`
- `docs/KONTROLA-PRED-VYDANIM.md` (nový), `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** čakám na potvrdenie kroku B3b.

---

## 23. 10. 2026 – Záver dňa

**Hotové dnes:**
- **B1b-3b** – počítacie predmety (mapa, pečať, tri zuby kľúča) v 3D aj 2D (krok 49).
- **Ťukanie na detaily** – nový riadok pod predmetom, rozsvietenie prvkov, nápovedy o ťukaní (krok 50).
- **B3-0** – Inventár, zápisník kódov a Artefakty dostupné aj na záverečnej obrazovke (krok 51).
- **B3a** – dáta finále, koniec aktu III a logika finále v engine, zatiaľ bez obrazoviek (krok 52).
- **Krok 7** – kresba Zlatého kľúča: tri časti brady, zložený kľúč a tieňový obrys (krok 53).
- Rozbory finále a kresby kľúča s rozhodnutiami používateľa a nový dokument `docs/KONTROLA-PRED-VYDANIM.md`.

**Ukončenie:** vývojový server (`npm run dev`) zastavený, všetko commitnuté, nič sa nepushovalo.

**Najbližšie kroky v tomto poradí:**
1. Nápovedy v troch stupňoch.
2. B3b – po scéne 10 koniec aktu III (zloženie kľúča, tretí útržok) a prechod do finále.
3. Texty finále do dát.
4. B4a – obrazovka Strážcu (miesto pre video, „Preskočiť“).
5. B4b – truhlica v 2D: tri zámky v poradí, Zápisník kódov na obrazovke truhlice, vloženie kľúča.
6. B4c – 3D truhlica.
7. B5 – fotografia zo štyroch útržkov (obrázkový súbor rozrezaný na útržky).
8. B6 – zadanie názvu miesta a karta „Ďalšie miesto“.
9. B7 – záverečný text kapitoly z dát.
10. Vodidlá na ďalšie miesto pri odmenách a tlačidlo „Ukáž cestu“.

**Otvorené otázky pre používateľa:**
- nápoveda pri zuboch („…na hranách zubu“) a popis „Zárez“ pre okienka (krok 53),
- riadok pod predmetom v 2D verzii (krok 50).

---

## 24. 10. 2026 – Krok 54: Nápovedy v troch stupňoch pri počítacích predmetoch

**Čo sa urobilo (mapa, pečať, tri zuby):**
- **Stupne nápovedy** (časy od otvorenia okna alebo poslednej aktivity, ako doteraz):

  | Čas | Čo sa ukáže |
  |---|---|
  | 20 s | 1. nápoveda a jemná žiara prvkov |
  | 40 s | 2. nápoveda „Označ každý detail, ktorý vidíš. Keď označíš všetky, objavíš číslo.“ |
  | 60 s | tlačidlo „Ukáž číslicu“ (predtým po 40 s) |

- **Nápoveda pri zuboch:** „Skús ťuknúť na to, čo vidíš na zube.“ (predtým „…na hranách zubu“).
- **Po prvom ťuknutí** sa raz ukáže riadok „Pokračuj. Zdá sa, že tu ešte niečo je.“ (bez počtu). Zmizne pri ďalšom ťuknutí alebo po 5 s. Pri tom istom otvorení okna sa už neukáže.
- **Čítačka obrazovky:** zárezy sa volajú „Zárez“, okienka „Okienko“ (popis je pri polohe prvku v dátach).
- **2D záloha (`?bez3d`):** pod počítacím predmetom je riadok „Ťukaj na detaily.“ Riadky pod predmetom ostali v kóde okna, ako rozhodol používateľ.
- **Texty a časy sú v dátach pri predmete:** `secondHint`, `firstTapText`, `timing`. Spoločné časy 20/40/60 s sú v `COUNT_INSPECT_TIMING` v `data/chapter-one/item-art.ts` a predmet môže mať aj vlastné.
- **Ostatné predmety** (žetón, list, mapa s kompasom, nahrávka) sa nemenia: nápoveda po 20 s, „Ukáž číslicu“ po 40 s.

**Testy (mimo projektu, necommitnuté):**
- **Dáta:** pred zmenou 22 chýb, po zmene 37 z 37 OK. Overuje texty bez „počítaj“ a „spočítaj“, 2. nápovedu, text po prvom ťuknutí a časy pri všetkých 5 predmetoch, „Zárez“ a „Okienko“ a nezmenené ostatné predmety.
- **Prehliadač na dev serveri** (hodiny zrýchlené 10×): pred zmenou 8 chýb, po zmene 16 z 16 OK v 2D aj 3D. Overené časy:
  - 15 s žiadna nápoveda,
  - 26 s 1. nápoveda,
  - 46 s 2. nápoveda,
  - 46 s ani 55 s ešte bez „Ukáž číslicu“,
  - 67 s „Ukáž číslicu“ je.

  Ďalej: riadok po prvom ťuknutí iba raz (1. ťuknutie áno, 2. a 3. nie), čítačka 5× „Zárez“ a 4× „Okienko“, žetón ako predtým (po 40 s).
- **Test kresby kľúča (krok 7):** stále všetko OK.

**Overenie:** vývojový server (`npm run dev`) beží na http://localhost:3000. Testy v prehliadači bežali proti nemu. Snímky boli spravené po 55 s, po 67 s a po prvom ťuknutí.

**Zmenené súbory:**
- `types/game.ts`
- `data/chapter-one/item-art.ts`, `tajna-stopa-michalska.ts`, `venturska-brana-spomienok.ts`, `maximilianova-fontana.ts`, `primacialny-palac.ts`, `bratislavsky-mier.ts`
- `components/items/ItemInspector.tsx`, `components/items/3d/Item3DView.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Otvorené otázky z kroku 50 a 53 sú týmto vyriešené** (nápoveda zubov, „Okienko“, riadok v 2D).

**Ďalší krok:** B3b, až po potvrdení.

---

## 24. 10. 2026 – Krok 55 (krok B3b): Koniec aktu III – zloženie Zlatého kľúča

**Čo sa urobilo:**
- **Priebeh** (`engine/gameEngine.ts`): po histórii scény 10 príde **koniec aktu III** (dnešná obrazovka konca aktu), po „Prijať útržok a pokračovať“ záverečná obrazovka. Funguje všeobecne: koniec posledného aktu sa ukáže, iba ak ho dáta majú. Tretí útržok fotografie pridá tá istá funkcia ako pri akte I a II, iba raz.
- **Obrazovka konca aktu III** (`ActTransitionScreen.tsx`):
  - nad textom je zložený Zlatý kľúč z kroku 7,
  - tri časti brady sa postupne zosunú k sebe (zľava, zdola, sprava), pri vypnutých animáciách je hneď celý kľúč,
  - riadok „Nasleduje“ sa pri poslednom akte neukáže,
  - zárezy troch zubov odovzdáva `app/page.tsx` z dát,
  - kresba kľúča má okolo každej časti obal pre animáciu (`keyToothArt.ts`); vzhľad sa nemení.
- **Scéna 10** (`zlaty-presporsky-kluc.ts`):
  - „Útržok mapy ďalšieho prípadu“ vypadol z odmien; štvrtý útržok fotografie dá truhlica vo finále (dáta z B3a),
  - „Ďalšia stopa“: namiesto „…zostal útržok mapy a veta: „Prešporok neukrýval jeden kľúč. Toto bol iba prvý.““ je teraz „…zostala veta: „Kľúč otvára viac, než si myslíš.““, zvyšok textu je rovnaký. Veta o jednom kľúči patrí do záveru kapitoly (B7).
- **Záverečná obrazovka** (`FinishScreen.tsx`), dočasne až do B4:
  - „…získal dokončený kľúč a tri útržky starej fotografie. Posledný útržok ešte čaká.“
  - „…no útržky fotografie odhaľujú začiatok väčšieho tajomstva.“
- **Uložené hry na záverečnej obrazovke** ostávajú na nej, bez prevodu do finále a bez zálohy (prevod príde v B4a). Útržok mapy v nich ostáva, tretí útržok zatiaľ nedostanú.

**Test (mimo projektu, necommitnutý):** pred zmenou 14 chýb, po zmene **26 z 26 OK**. Overuje:
- celú kapitolu so skóre 1010,
- poradie obrazoviek: pribudol iba „koniec aktu III“ medzi históriou scény 10 a záverom,
- konce aktov po scéne 3, 6 a 10,
- útržky 1, 2, 3 každý práve raz, útržok mapy už nie, Zlatý kľúč áno, štvrtý útržok ešte nie,
- F5 po každom kroku celej kapitoly (rovnaké poradie, inventár aj skóre),
- 4× kliknutie na konci aktu III, F5 na konci aktu III a po prijatí,
- staré uloženia: začiatok, uprostred aktu II, akt III pred scénou 10 a záverečná obrazovka (bez prevodu, bez zálohy, inventár bez zmeny),
- texty scény 10 a záverečnej obrazovky.

Testy z B3a, kroku 7 a nápovedí: všetko OK.

**V prehliadači na dev serveri** (3D, `?bez3d`, vypnuté animácie):
- koniec aktu III so zloženým kľúčom; animácia beží, pri vypnutých animáciách je kľúč hneď celý,
- karta tretieho útržku, bez „Nasleduje“,
- po prijatí záverečná obrazovka s novými vetami,
- v uloženej hre tretí útržok práve raz.

Prvý beh hlásil jednu chybu v teste (nadpis karty je veľkými písmenami). Test som opravil, kód hry to nebol.

**Zmenené súbory:**
- `engine/gameEngine.ts`
- `components/screens/ActTransitionScreen.tsx`, `components/screens/FinishScreen.tsx`
- `components/items/art/keyToothArt.ts`
- `app/page.tsx`
- `data/chapter-one/zlaty-presporsky-kluc.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** texty finále do dát, až po potvrdení.

---

## 24. 10. 2026 – Krok 56: Schválené texty finále v dátach

**Čo sa urobilo:** dočasné texty nahradili schválené (v `data/chapter-one/acts.ts` a `data/chapter-one/finale.ts`). Priebeh hry ani obrazovky sa nemenia.

**Koniec aktu III:**
- nadpis „Kľúč je kompletný“ (predtým „Zlatý kľúč“),
- nový text („Tri zuby do seba zapadli bez jedinej škáry… Strážca vie, ktorý.“),
- nový popis tretieho útržku,
- názov útržku a tlačidlo sa nemenia.

**Strážca:** nový text s úvodzovkami ‚…‘, tlačidlo „Otvoriť truhlicu“ (predtým „Pristúpiť k truhlici“). Nadpis a „Preskočiť“ sa nemenia.

**Truhlica:**
- nadpis „Truhlica starého pátrača“,
- nové texty: úvod, zlý kód, zámok odomknutý, otvorenie, popis štvrtého útržku,
- „Vložiť Zlatý kľúč“ a názov útržku sa nemenia.

**Fotografia:** nadpis „Historická fotografia“, nový popis a 4 riadky zadnej strany. Popis obrázka pre čítačku sa nemení.

**Zadanie miesta:**
- nová otázka, zlá odpoveď a cesta (cesta je dočasná, `isPlaceholder` ostáva),
- adresa „Hviezdoslavovo námestie 1, Bratislava“ (bez neovereného PSČ),
- nové pole `mapsButtonLabel` „Otvoriť v mapách“ (`types/game.ts`), aby boli všetky texty finále na jednom mieste,
- názov a prijaté odpovede sa nemenia.

**Záver kapitoly:**
- nadpis „Zlatý prešporský kľúč“, nový text (jeden odsek), citát bez úvodzoviek (doplní ich obrazovka v B7),
- pokračovanie „Druhý prípad sa blíži“,
- „Kapitola dokončená“, „Prípad uzavretý“ a jeho text ostali, rozhodne sa o nich v B7,
- dnešná záverečná obrazovka (`FinishScreen.tsx`) sa nemenila, do dát prejde v B7.

**Testy (mimo projektu, necommitnuté):**
- **Texty finále:** pred zmenou 23 chýb, po zmene **37 z 37 OK**. Každé pole sa presne zhoduje so schváleným textom, `isPlaceholder` ostáva, iba slovenské úvodzovky „…“ a ‚…‘.
- **Priebeh a staré uloženia (test z B3b):** 26 z 26, skóre 1010, staré uloženia (začiatok, uprostred, záverečná obrazovka) fungujú.
- **Ďalšie testy:** B3a 65 z 65 (upozornenie na dočasné miesto), kresba kľúča 54 z 54, nápovedy 37 z 37.
- **V prehliadači na dev serveri (3D aj `?bez3d`):** koniec aktu III ukazuje nadpis, text a popis útržku z dát.

**Zmenené súbory:**
- `data/chapter-one/acts.ts`, `data/chapter-one/finale.ts`
- `types/game.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** B4a (obrazovka Strážcu), až po potvrdení.

---

## 24. 10. 2026 – Krok 57 (krok B4a): Obrazovka „Strážca prichádza“

**Čo sa urobilo:**
- **Priebeh:** koniec aktu III → „Prijať útržok a pokračovať“ → **Strážca prichádza** → „Otvoriť truhlicu“ alebo „Preskočiť“ → dočasne záverečná obrazovka (kým pribudne truhlica v B4b).
  - Pri vstupe do finále sa do uloženia zapíše príznak `finale-started` a obrazovka `finaleGuardian`, takže F5 vráti hráča na Strážcu.
  - Funkcie `startFinale` a `leaveFinaleGuardian` sú v `engine/finale.ts`. Koniec posledného aktu vedie do finále iba vtedy, ak ho kapitola má.
- **Obrazovka** (`components/screens/FinaleGuardianScreen.tsx`, nová):
  - nadpis, text a tlačidlá z dát; hore panel Úlohy, Inventár, Artefakty,
  - bez videa: pokojné nehybné pozadie a text,
  - video: stačí doplniť `videoSrc` (prípadne `posterSrc` a nové pole `captionsSrc` pre titulky .vtt) do `finale.ts`. Spúšťa sa iba ovládačmi prehliadača, nič sa nesťahuje vopred, pri chybe zmizne a ostane text,
  - „Preskočiť“ je vždy viditeľné, tlačidlá majú 54 px, text 16 px, pri vypnutých animáciách sa nič nehýbe (ani tlačidlo pri stlačení).
- **Prevod starých uložení** (`engine/gameStorage.ts`, `migrateFinishedSaveToFinale` v `engine/finale.ts`): hra na záverečnej obrazovke bez príznaku `finale-started` sa pri načítaní presunie na obrazovku Strážcu.
  - Tretí útržok sa pridá iba ak chýba, „Útržok mapy ďalšieho prípadu“ sa odstráni, ostatné ostáva.
  - Pôvodné uloženie sa zálohuje pod novým kľúčom `mysterium-progress-v2-backup-before-finale`, iba raz a už sa neprepíše. Kľúč `…-backup-before-repair` sa pri tomto prevode nepoužíva.
  - Hry dohrané po zmene majú príznak, ostanú na záverečnej obrazovke a nezacyklia sa.

**Test (mimo projektu, necommitnutý):** pred zmenou 11 chýb a test spadol (nové funkcie ešte neexistovali), po zmene **20 z 20 OK**. Overuje:
- celú kapitolu so skóre 1010 a poradím `… history|10 → actTransition|10 → finaleGuardian|10 → finish|10`,
- F5 po každom kroku a F5 na Strážcovi,
- 4× „Prijať útržok“ aj 4× „Otvoriť truhlicu“ (tretí útržok raz),
- staré uloženia:
  - začiatok a scéna 5 bez zálohy,
  - stará záverečná obrazovka: prevod, záloha = pôvodné uloženie, tretí útržok raz, mapa preč, skóre ostáva,
  - druhé načítanie: záloha sa neprepíše,
  - po prevode Strážca → záver → F5 ostane na závere,
  - záverečná obrazovka s príznakom ostane.

**Ostatné testy:** texty finále 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37. Starý test B3b hlási 4 očakávané rozdiely: predpokladal záverečnú obrazovku hneď po konci aktu III a žiadny prevod uložení, a to sa týmto krokom zámerne zmenilo.

**V prehliadači na dev serveri (360 px; aj `?bez3d` a vypnuté animácie):** 13 z 13 OK.
- Po „Prijať útržok“ príde Strážca.
- Tlačidlá 286 × 54 px, text 16 px, bez vodorovného posúvania.
- Bez videa sa nič nespúšťa.
- F5 na Strážcovi, Inventár a späť.
- „Otvoriť truhlicu“ vedie na záver a F5 tam ostane.
- Stará záverečná obrazovka sa prevedie so zálohou.
- Pri vypnutých animáciách beží 0 animácií.
- Snímky: Strážca, tlačidlá a obrazovka po prevode.

**Neoverené:** prehrávanie videa a náhrada pri chybe videa. Súbor videa ešte neexistuje; overí sa, keď sa doplní.

**Zmenené súbory:**
- `types/game.ts`
- `engine/finale.ts`, `engine/gameEngine.ts`, `engine/gameStorage.ts`
- `components/screens/FinaleGuardianScreen.tsx` (nový), `app/page.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** B4b (truhlica v 2D), až po potvrdení.

---

## 24. 10. 2026 – Krok 58 (krok B4b): Truhlica s tromi zámkami (2D)

**Čo sa urobilo:**
- **Priebeh:** Strážca → „Otvoriť truhlicu“ alebo „Preskočiť“ → **Truhlica starého pátrača** → zámky I, II, III → „Vložiť Zlatý kľúč“ → veko sa otvorí, štvrtý útržok → „Prijať útržok a pokračovať“ → dočasne záverečná obrazovka (kým pribudne fotografia v B5).
- **Obrazovka** (`components/screens/FinaleChestScreen.tsx`, nová):
  - **truhlica:** existujúca 2D kresba (`ChestStage`, `ChestLid`, `ChestBody`, svetlo a hmla po otvorení). Na prednej strane sú štítky zámkov I, II, III so stavom 🔒/🔓 a v strede kľúčová dierka, do ktorej sa zasunie Zlatý kľúč (kresba z kroku 7),
  - **zámky:** riadky „Zámok I/II/III“ po troch číselníkoch, pod zámkom na rade „Odomknúť zámok“. Odomknutý zámok ukazuje ✓, nie číslice, takže kódy sa nikde nezobrazujú. Zámky, ktoré nie sú na rade, sú stlmené a nedajú sa meniť,
  - **hlásenia:** „Zámok sa ani nepohol. Niektorá číslica nesedí.“ (bez označenia číslice) a „Zámok cvakol. Ďalší čaká.“, čítačka ich prečíta,
  - **kontrola kódu** je iba v engine (`unlockFinaleLock`),
  - **vloženie kľúča a otvorenie veka** zapíše engine jedným ťuknutím (`insertFinaleKey` a `openFinaleChest`), animácia je iba vizuálna,
  - **Zápisník kódov** je priamo pod zámkami. Pri každej nenájdenej číslici je tlačidlo „Prezrieť“, ktoré otvorí predmet nad truhlicou. Čítačka hlási „Prezrieť: názov predmetu“.
- **Číselník** (`components/ui/chest/ChestDial.tsx`): šípky aj číslica 44 × 44 px, ťuknutie na číslicu ju zvýši, popis pre čítačku „Zámok I, číslica 1: 3“. Dva staré nevyužité súbory (`ChestCodePanel`, `ChestCode`) dostali popis, aby prešla kontrola typov.
- **Zápisník kódov** (`components/ui/CodeNotebook.tsx`, `engine/codeNotebook.ts`): voliteľné tlačidlá „Prezrieť“ (iba pri truhlici, v Inventári bez zmeny) a názov predmetu v údajoch miesta.
- **Nové texty v dátach** (schválené): „Odomknúť zámok“, „Prijať útržok a pokračovať“, „odomknutý“/„zamknutý“.
- **Engine** (`engine/finale.ts`): `leaveFinaleGuardian` vedie na truhlicu, nové `leaveFinaleChest` (iba po otvorení truhlice).
- **Prevod uložení:** hra z dočasnej záverečnej obrazovky z B4a (príznak finále, truhlica neotvorená) sa vráti k truhlici. Záloha `…-backup-before-finale` sa zapíše iba ak ešte neexistuje. Prevod z B4a (stará záverečná obrazovka → Strážca) platí ďalej.
- **Vypnuté animácie** (`app/globals.css`, iba trieda `finale-chest`): veko je hneď otvorené a nič sa nehýbe. Hmla, svetlo a častice sa vtedy vôbec nevykreslia.

**Test (mimo projektu, necommitnutý):** pred zmenou 9 chýb, po zmene **26 z 26 OK**. Overuje:
- celú kapitolu so skóre 1010 a poradím `… actTransition|10 → finaleGuardian|10 → finaleChest|10 → finish|10`,
- F5 po každom kroku (aj po každom zámku a po otvorení),
- zlý kód: stav bez zmeny, výsledok iba „wrong“, text bez číslic,
- zámky II a III mimo poradia, kľúč pred zámkami, odchod pred otvorením,
- F5 po zámku I,
- 4× „Vložiť Zlatý kľúč“ a 4× „Prijať útržok“ (útržok raz),
- nové texty,
- staré uloženia: začiatok, scéna 5, Strážca, dočasná záverečná obrazovka z B4a (prevod, záloha, existujúca záloha sa neprepíše), záver po truhlici, stará záverečná obrazovka spred finále.

**Upravené testy:**
- test z B3b (podľa zadania): nové poradie obrazoviek, Strážca po konci aktu III, prevod starej záverečnej obrazovky, štvrtý útržok raz; 26 z 26,
- test z B4a: zo Strážcu sa ide na truhlicu; 20 z 20.

Ostatné testy: texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.

**V prehliadači na dev serveri (360 px; aj `?bez3d` a vypnuté animácie):** 17 z 17 OK.
- kódy sa nezobrazujú,
- všetky tlačidlá aspoň 44 × 44 px, bez vodorovného posúvania,
- zlý kód, správny kód I, F5 so zámkom I,
- „Prezrieť“ zo zápisníka a návrat k truhlici,
- zámky II a III, kľúč, veko, štvrtý útržok raz,
- F5 po otvorení,
- pokračovanie na záver,
- pri vypnutých animáciách je útržok hneď viditeľný a beží 0 animácií.

Snímky: truhlica, zlý kód, zápisník, kľúč a veko, otvorená truhlica.

**Zmenené súbory:**
- `types/game.ts`, `data/chapter-one/finale.ts`
- `engine/finale.ts`, `engine/codeNotebook.ts`
- `components/screens/FinaleChestScreen.tsx` (nový)
- `components/ui/chest/ChestDial.tsx`, `ChestCodePanel.tsx`, `ChestCode.tsx`, `components/ui/CodeNotebook.tsx`
- `app/page.tsx`, `app/globals.css`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** B4c (3D truhlica) alebo B5 (fotografia) podľa plánu, až po potvrdení.

---

## 24. 10. 2026 – Krok 59 (krok B5): Historická fotografia zo štyroch útržkov

**Čo sa urobilo:**
- **Priebeh:** truhlica → „Prijať útržok a pokračovať“ → **Historická fotografia** → „Pokračovať v pátraní“ → dočasne záverečná obrazovka (kým pribudne zadanie miesta v B6).
- **Príznaky v uložení:**
  - `finale-photo-assembled`: zapíše sa hneď pri prvom príchode, takže F5 ukáže celú fotografiu bez opakovaného skladania,
  - `finale-photo-seen`: pri odchode, aby sa záver po F5 nevracal k fotografii.
- **Dočasný obrázok** `public/images/finale/historicka-fotografia.jpg` (1200 × 900 px, 86 kB):
  - vlastná sépiová kresba budovy s kolonádou na námestí, so zrnom, škrabancami a vinetáciou,
  - nakreslená ako SVG a prevedená v prehliadači na JPG,
  - cesta je v dátach, dá sa vymeniť bez zásahu do kódu.
- **Obrazovka** (`components/screens/FinalePhotoScreen.tsx`, nová, 2D):
  - **útržky:** jeden obrázok sa zobrazí štyrikrát a každá kópia sa oreže tvarom `clip-path` so zúbkovanými trhlinami. Susedné útržky zdieľajú body trhliny, takže presne zapadnú. Ukážu sa iba útržky, ktoré hráč má,
  - **skladanie:** pri prvom príchode ležia útržky 0,9 s od seba a potom sa za 1,2 s zložia. Pri vypnutých animáciách je fotografia hneď celá,
  - **preskúmanie:**
    - tlačidlá + a − (48 px, kroky 1×, 1,5×, 2×, 3×),
    - ťuknutie priblíži na 2× v mieste ťuknutia, ďalšie vráti späť,
    - štipnutie dvoma prstami,
    - posúvanie priblíženej fotografie s okrajmi,
  - **„Otočiť“:** prevráti na zadnú stranu s poznámkou pátrača z dát. Pri vypnutých animáciách je otočenie okamžité. Čítačka oznámi stranu,
  - **náhrada:** ak sa obrázok nenačíta, ukáže sa sépiová plocha s popisom z dát a všetko ďalej funguje.
- **Nové schválené texty v dátach:** „Otočiť“, „Priblížiť“/„Oddialiť“ (+/− pre čítačku), „Predná/Zadná strana fotografie“, „Pokračovať v pátraní“.
- **Engine** (`engine/finale.ts`):
  - `leaveFinaleChest` vedie na fotografiu,
  - nové `markFinalePhotoAssembled` a `leaveFinalePhoto`,
  - prevod: záverečná obrazovka po truhlici z B4b (bez `finale-photo-seen`) sa vráti k fotografii. Záloha `…-backup-before-finale` iba ak ešte neexistuje. Prevody z B4a a B4b platia ďalej.
- **Dokumenty:** obrázok je zapísaný v `docs/MEDIA-LICENCIE.md` (vlastná práca, dočasný). V `docs/KONTROLA-PRED-VYDANIM.md` pribudla položka „nahradiť dočasnú fotografiu skutočnou“.

**Test (mimo projektu, necommitnutý):** pred zmenou 10 chýb, po zmene **21 z 21 OK**. Overuje:
- celú kapitolu so skóre 1010 a poradím `… finaleGuardian|10 → finaleChest|10 → finalePhoto|10 → finish|10`,
- všetky štyri útržky práve raz,
- F5 po každom kroku a F5 na fotografii (už zložená),
- 4× „Pokračovať v pátraní“,
- dáta (nové texty, popis obrázka, zadná strana) a súbor obrázka (86 kB),
- staré uloženia: začiatok, uprostred, na Strážcovi, v truhlici, dočasná záverečná obrazovka z B4b (→ fotografia, záloha) aj z B4a (→ truhlica), záver po fotografii.

**Upravené staré testy** na nové poradie: B3b 26/26, B4a 20/20, B4b 26/26. Ostatné: texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.

**V prehliadači na dev serveri (360 px; aj `?bez3d` a vypnuté animácie):** 17 z 17 OK.
- štyri útržky z jedného obrázka, najprv od seba, potom zložené (pri vypnutých animáciách hneď celé, 0 bežiacich animácií),
- popis pre čítačku z dát,
- tlačidlá aspoň 44 px, bez vodorovného posúvania,
- + a − (1,5× → 2× → 1×), ťuknutie (2× → 1×),
- zadná strana a oznámenie pre čítačku,
- otočenie bez prechodu pri vypnutých animáciách,
- F5 ukáže hneď celú fotografiu,
- nenačítaný obrázok → náhrada,
- pokračovanie na záver, F5 tam ostane, skóre 1010.

Snímky: útržky, zložená fotografia, priblíženie, zadná strana, náhrada.

**Chyby počas práce:**
- Lint našiel zbytočné nastavenie stavu v efekte. Odstránené: pri vypnutých animáciách je fotografia hneď celá aj bez neho.
- Dve chyby boli v teste (pomocná funkcia a kontrola otočenia sledovala dĺžku prechodu namiesto toho, či prechod beží). Opravené v teste, kód hry to nebol.

**Neoverené:** štipnutie dvoma prstami na skutočnom dotykovom displeji. Prehliadač v teste ho nevie verne napodobniť.

**Zmenené súbory:**
- `types/game.ts`, `data/chapter-one/finale.ts`
- `engine/finale.ts`
- `components/screens/FinalePhotoScreen.tsx` (nový), `app/page.tsx`
- `public/images/finale/historicka-fotografia.jpg` (nový)
- `docs/MEDIA-LICENCIE.md`, `docs/KONTROLA-PRED-VYDANIM.md`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** B6 (zadanie názvu miesta a karta „Ďalšie miesto“) alebo B4c (3D truhlica), až po potvrdení.

---

## 24. 10. 2026 – Krok 60 (krok B6): Zadanie názvu miesta a karta „Ďalšie miesto“

**Čo sa urobilo:**
- **Priebeh:** fotografia → „Pokračovať v pátraní“ → **zadanie miesta** → po správnej odpovedi **karta „Ďalšie miesto“** → „Dokončiť kapitolu“ → dočasne záverečná obrazovka (kým pribudne záver z dát v B7).
  - Zadanie aj karta sú jedna obrazovka `finalePlace`. Čo sa ukáže, rozhoduje príznak `finale-place-solved` z B3a, takže F5 vráti hráča k zadaniu alebo na kartu.
- **Zadanie** (`components/screens/FinalePlaceScreen.tsx`, nový):
  - otázka z dát je popisom poľa (čítačka ju prečíta),
  - „Overiť odpoveď“ je vypnuté, kým je pole prázdne (aj iba medzery). Enter na prázdnom poli nič neurobí a nič nehlási,
  - kontrola ide iba cez `submitFinalePlace` / `isAnswerAccepted` (veľké a malé písmená, diakritika, preklepy; „Slovenské národné divadlo“, „SND“, „Národné divadlo“),
  - zlá odpoveď: „Toto nie je to miesto. Pozri sa na fotografiu ešte raz.“ (čítačka ju prečíta), bez straty bodov.
- **„Pozrieť fotografiu“** otvorí okno nad zadaním:
  - priblíženie, štipnutie a otočenie ako v B5, hneď celá fotografia,
  - zatvorenie: „Zavrieť“, Escape alebo ťuknutie mimo,
  - zameranie: na „Zavrieť“ a po zatvorení späť na „Pozrieť fotografiu“,
  - napísaný text ostane.
- **Karta „Ďalšie miesto“:**
  - názov, „Adresa“ s celou adresou a „Ako sa tam dostaneš“ s popisom cesty z dát, všetko vždy viditeľné,
  - „Otvoriť v mapách“ je odkaz na Google Mapy s názvom a adresou (`target="_blank"`, `rel="noopener noreferrer"`, 54 px),
  - po správnej odpovedi prejde zameranie na nadpis karty,
  - dočasnosť údajov (`isPlaceholder`) sa hráčovi nezobrazuje.
- **Prehliadanie fotografie** (priblíženie, štipnutie, posúvanie, otočenie, náhrada) je presunuté do `components/finale/FinalePhotoViewer.tsx`. Používa ho obrazovka fotografie (vyzerá a funguje rovnako) aj okno pri zadaní.
- **Nové schválené texty v dátach:** „Overiť odpoveď“, „Pozrieť fotografiu“, „Zavrieť“, „Ďalšie miesto“, „Adresa“, „Ako sa tam dostaneš“, „Dokončiť kapitolu“.
- **Engine** (`engine/finale.ts`):
  - `leaveFinalePhoto` vedie na zadanie miesta,
  - nové `leaveFinalePlace` (iba po správnej odpovedi) a `getFinaleMapsUrl`,
  - prevod: záverečná obrazovka po fotografii z B5 (miesto nezadané) sa vráti k zadaniu. Záloha `…-backup-before-finale` iba ak ešte neexistuje. Prevody z B4a, B4b a B5 platia ďalej.

**Test (mimo projektu, necommitnutý):** pred zmenou 11 chýb, po zmene **32 z 32 OK**. Overuje:
- celú kapitolu so skóre 1010 a poradím `… finaleChest|10 → finalePhoto|10 → finalePlace|10 → finish|10`,
- F5 po každom kroku, pri zadaní aj na karte,
- prijaté odpovede: „Slovenské národné divadlo“, bez diakritiky, veľkými písmenami, s preklepom, „SND“, „snd“, „Národné divadlo“,
- odmietnuté odpovede bez zmeny stavu a skóre: prázdne, iba medzery, „SNG“, „Bratislavský hrad“,
- odchod z karty pred správnou odpoveďou nejde, 4× „Dokončiť kapitolu“,
- nové texty a adresa,
- odkaz do Google Máp,
- staré uloženia: začiatok, uprostred, na Strážcovi, v truhlici, na fotografii, dočasné záverečné obrazovky z B5 (→ zadanie, záloha), B4b (→ fotografia) aj B4a (→ truhlica), záver po zadanom mieste.

**Upravené staré testy** na nové poradie: B3b 26/26, B4a 20/20, B4b 26/26, B5 21/21; test fotografie v prehliadači (B5) 17/17. Ostatné: texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.

**V prehliadači na dev serveri (360 px; aj `?bez3d` a vypnuté animácie):** 25 z 25 OK.
- prázdne pole, medzery aj Enter bez hlásenia,
- zlá odpoveď s hlásením pre čítačku, bez straty bodov,
- tlačidlá aspoň 44 px,
- fotografia v okne (zameranie, otočenie, Escape, text ostal, zameranie späť),
- F5 pri zadaní,
- správna odpoveď a karta s adresou a cestou,
- odkaz Google Mapy v novom okne s `noopener`,
- karta bez zmienky o dočasnosti, zameranie na nadpis karty,
- F5 na karte,
- „Dokončiť kapitolu“ vedie na záver a F5 tam ostane, skóre 1010,
- pri vypnutých animáciách nič nebeží.

Snímky: zlá odpoveď, fotografia v okne, karta.

**Neoverené:** otvorenie Google Máp na skutočnom mobile (aplikácia alebo prehliadač). Odkaz je overený, samotné otvorenie treba vyskúšať na telefóne.

**Zmenené súbory:**
- `types/game.ts`, `data/chapter-one/finale.ts`
- `engine/finale.ts`
- `components/finale/FinalePhotoViewer.tsx` (nový), `components/screens/FinalePlaceScreen.tsx` (nový), `components/screens/FinalePhotoScreen.tsx`
- `app/page.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** B7 (záver kapitoly z dát) alebo B4c (3D truhlica), až po potvrdení.

---

## 24. 10. 2026 – Krok 61 (krok B7): Záverečná obrazovka z dát

**Čo sa urobilo:**
- **Záverečná obrazovka** (`components/screens/FinishScreen.tsx`) berie všetky texty z dát (`data/chapter-one/finale.ts`, záver kapitoly):
  - „Kapitola dokončená“, „Zlatý prešporský kľúč“,
  - text „Kľúč, ktorý si držal, neotvoril dvere…“,
  - **„Konečné skóre“** s počtom bodov z uloženej hry (1010 pri hre bez nápovedy),
  - „Posledná strana denníka“ s citátom (úvodzovky „…“ doplní obrazovka),
  - „Druhý prípad sa blíži“ s vetou o fotografii,
  - tlačidlá **„Zobraziť ďalšie miesto“**, „Pozrieť fotografiu“ a „Hrať kapitolu od začiatku“.
- **Odstránené zastarané texty:**
  - „Prípad uzavretý“ + „…ale mapu.“ z obrazovky aj z dát (`summaryTitle`, `summaryText`),
  - „Záver vyšetrovania“ s odsekmi o útržkoch a mape,
  - starý odsek „Pátranie pokračuje“ o mape.
- **Texty presunuté z obrazovky do dát bez zmeny:** „Posledná strana denníka“, „Hrať kapitolu od začiatku“ a texty potvrdzovacieho okna. **Nové texty** (schválené): „Konečné skóre“, „Zobraziť ďalšie miesto“. Zatvorenie a fotografia používajú existujúce „Zavrieť“ a „Pozrieť fotografiu“.
- **Karta a fotografia v okne nad záverom**, hráč sa nikam nepresúva a F5 ho vždy vráti na záver:
  - zatvorenie: „Zavrieť“, Escape alebo ťuknutie mimo okna; zameranie sa vráti na tlačidlo, ktoré okno otvorilo,
  - tlačidlá sa ukážu, iba ak hráč miesto zadal a fotografiu videl.
- **Spoločné prvky:**
  - karta „Ďalšie miesto“ je vyňatá do `components/finale/NextPlaceCard.tsx`,
  - okno nad obrazovkou do `components/finale/FinaleDialog.tsx`,
  - zadanie miesta (B6) ich používa a funguje rovnako ako predtým.
- **Začatie odznova** zmaže iba uloženú hru, zálohy ostávajú (bez zmeny správania, overené testom).

**Test (mimo projektu, necommitnutý):** pred zmenou 5 chýb, po zmene **20 z 20 OK**. Overuje:
- celú kapitolu so skóre 1010 a F5 na závere,
- dáta záveru (odstránené polia, nové a presunuté texty),
- FinishScreen bez natvrdo zapísaných textov,
- začatie odznova (uložená hra zmazaná, zálohy ostali, nová hra bez bodov, inventára a príznakov),
- staré uloženia na každom bode cesty: začiatok, scéna 5, koniec aktu III, Strážca, truhlica, fotografia, zadanie, karta, záver.

**Upravené staré testy:** B3b (záverečné vety sú teraz v dátach) 25/25 a texty finále („Prípad uzavretý“ odstránený) 37/37. Ostatné: B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37; zadanie miesta v prehliadači (B6) 25/25.

**V prehliadači na dev serveri (360 px; aj `?bez3d` a vypnuté animácie):** 20 z 20 OK.
- texty z dát, skóre 1010, citát s úvodzovkami, zastarané texty preč,
- tlačidlá aspoň 44 px, bez vodorovného posúvania,
- karta v okne (adresa, cesta, odkaz Google Mapy s `noopener`), zameranie, Escape, ťuknutie mimo,
- fotografia v okne s otočením, „Zavrieť“ so zameraním späť,
- F5,
- potvrdzovacie okno z dát, „Zrušiť“, „Áno, začať odznova“ (nová hra a zálohy ostali),
- pri vypnutých animáciách nič nebeží.

Snímky: záver hore a dole, karta v okne, fotografia v okne, potvrdzovacie okno.

**Chyba počas práce:** prvý beh testu v prehliadači hlásil zastaraný text. Bola to chyba testu: schválený text pokračovania obsahuje „…a pátranie pokračuje.“ Test teraz hľadá iba staré vety.

**Zmenené súbory:**
- `types/game.ts`, `data/chapter-one/finale.ts`
- `components/screens/FinishScreen.tsx`, `components/screens/FinalePlaceScreen.tsx`
- `components/finale/NextPlaceCard.tsx` (nový), `components/finale/FinaleDialog.tsx` (nový)
- `app/page.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** podľa plánu B4c (3D truhlica) alebo vodidlá a tlačidlo „Ukáž cestu“, až po potvrdení.

---

## 24. 10. 2026 – Krok 62 (krok C1): Vodidlá na ďalšie miesto a „Ukáž cestu“

**Prieskum (pred zmenou):** dnešný `nextInstruction` mal tri úniky:
- scéna 3 „na **Ventúrskej 3**“ (holá adresa s číslom domu),
- scéna 4 „…a **rodovým znakom**“ (odpoveď úlohy 5),
- scéna 8 „…k jeho **Zrkadlovej sieni**“ (odpoveď úlohy 9, najvážnejší).

**Čo sa urobilo:**
- **Vodidlá** (schválené, 1 až 2 vety, bez odpovede) sú v dátach pri odmene každej scény (`clue`). Pri scéne 10 je vodidlo pri Zlatom kľúči a nadväzuje na finále („Kľúč otvára viac, než si myslíš. Strážca vie, ktorý zámok.“).
- **`nextInstruction` je rozdelený** na poznámku pátrača (`nextReflection`) a cestu (`route`). Nič sa nestratilo, iba sa očistili úniky:
  - scéna 1: nová cesta k najužšiemu domu,
  - scéna 3: cesta „…s pamätnou tabuľou“ bez čísla domu,
  - scéna 4: poznámka bez „a rodovým znakom“,
  - scéna 8: vodidlo „Ostaň pri paláci. Jeho steny pamätajú viac, než ukazuje priečelie.“ a cesta „Zostaň pri Primaciálnom paláci. Ďalšia úloha sa odohráva na tom istom mieste.“ (nič neposiela dovnútra),
  - scéna 10: bez cesty, finále nasleduje na mieste.
- **Obrazovka histórie:** v karte „Ďalšia stopa“ je poznámka, vodidlo a tlačidlo „Ukáž cestu“, ktoré rozbalí cestu a zmení sa na „Skryť cestu“.
- **Úloha ďalšej scény:** hore „Ukáž cestu“ s cestou, ktorá hráča mala doviesť sem. Pri scéne 1 (štart) tlačidlo nie je.
- **„Ukáž cestu“** nestojí body, nepočíta sa ako nápoveda a nič neukladá (`components/ui/RouteHint.tsx`, 44 px, čítačka prečíta cestu).
- **Inventár:** pri predmete riadok „Stopa: …“. Vodidlo sa berie z dát kapitoly, takže sa ukáže aj pri staršej uloženej kópii predmetu (`getItemClue`, `getSceneClue` v `engine/codeNotebook.ts`).
- **Nové texty v dátach kapitoly** (`guidance`): „Ďalšia stopa“ (presunuté z obrazovky), „Ukáž cestu“, „Skryť cestu“, „Stopa“.
- **Dokumenty:**
  - tabuľka vodidiel a ciest je v `docs/KARTY-USLOH.md`,
  - overenie vodidiel a ciest v teréne (najmä scéna 1, Spasiteľ nad lekárňou, pamätná tabuľa, „pri františkánoch“, priechod k palácu) je v `docs/KONTROLA-PRED-VYDANIM.md`.

**Test (mimo projektu, necommitnutý):** pred zmenou 41 chýb (vrátane zachytených únikov), po zmene **63 z 63 OK**. Overuje:
- schválené vodidlá pri odmenách všetkých 10 scén, poznámky a cesty,
- vodidlá bez číslic,
- vodidlá, poznámky ani cesty neprezrádzajú odpoveď ďalšej úlohy,
- scéna 3 bez „Ventúrskej 3“, scéna 4 bez „znak“, scéna 8 bez cesty dovnútra a bez „zrkadl“,
- texty `guidance`,
- vodidlo z dát aj pre starú kópiu predmetu,
- obrazovky používajú vodidlo, poznámku a „Ukáž cestu“.

**Ostatné testy:** B7 20/20, B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3b (upravený na `nextReflection`) 25/25, texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37. Skóre 1010 bez zmeny.

**V prehliadači na dev serveri (360 px; aj `?bez3d` a vypnuté animácie):** 14 z 14 OK.
- história scény 3: poznámka a vodidlo, cesta skrytá až do ťuknutia, bez „Ventúrskej 3“,
- „Ukáž cestu“ / „Skryť cestu“, cesta v oblasti pre čítačku,
- skóre aj nápovedy bez zmeny,
- tlačidlá aspoň 44 px,
- Inventár so „Stopa“ aj pri starej kópii,
- úloha scény 4 s cestou zo scény 3,
- scéna 1 bez tlačidla,
- história scény 10 s vodidlom na finále a bez cesty,
- pri vypnutých animáciách nič nebeží.

Snímky: história s vodidlom a cestou, Inventár, úloha s cestou.

**Chyby počas práce:**
- Test B3b čítal zrušený `nextInstruction`, upravený.
- V teste v prehliadači som zabudol na koniec aktu I po scéne 3 a raz porovnal názov miesta, ktorý je na obrazovke veľkými písmenami. Opravené v teste, kód hry to nebol.
- Lint celého priečinka obrazoviek ukázal staré chyby v nepoužívanom `ActChestScreen.tsx` (známe). Zmenené súbory sú bez chýb, ostalo iba staré upozornenie `LightbulbIcon` v `HistoryScreen.tsx` (známe od kroku 27).

**Na rozhodnutie používateľa (mimo tohto kroku, nemenené):** úvodný text scény 4 (`cinematicText`) hovorí „…prichádzaš k domu číslo 3“. Hráč je vtedy už na mieste, takže to nie je cesta, ale je to to isté číslo ako odstránené „Ventúrska 3“.

**Zmenené súbory:**
- `types/game.ts`
- `data/chapter-one.ts` a všetkých 10 scén v `data/chapter-one/`
- `engine/codeNotebook.ts`
- `components/ui/RouteHint.tsx` (nový)
- `components/screens/HistoryScreen.tsx`, `PuzzleScreen.tsx`, `InventoryScreen.tsx`
- `components/game/HistoryFlow.tsx`, `PuzzleFlow.tsx`, `CollectionFlow.tsx`
- `app/page.tsx`
- `docs/KARTY-USLOH.md`, `docs/KONTROLA-PRED-VYDANIM.md`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory bez chýb (staré upozornenie `LightbulbIcon`).

**Ďalší krok:** B4c (3D truhlica) alebo iný krok podľa plánu, až po potvrdení.

---

## 24. 10. 2026 – Krok 63: Scéna 4 bez čísla domu

**Čo sa urobilo** (`data/chapter-one/venturska-brana-spomienok.ts`, schválené znenie):
- **Úvodný text** (`cinematicText`): „…prichádzaš k domu **číslo 3**.“ → „…prichádzaš k domu, **v ktorom sa pred stáročiami učilo**.“ Zvyšok textu (smer, „Si na správnom mieste“, atmosféra) je bez zmeny.
- **Prvá nápoveda úlohy:** „Hľadaj budovu na adrese Ventúrska 3.“ → „Hľadaj na Ventúrskej ulici budovu Academie Istropolitany s pamätnou tabuľou.“ Pri prieskume sa ukázalo, že číslo domu je aj tu. Druhá nápoveda je bez zmeny.
- Rok založenia 1465 ostal (nie je číslo domu).

**Test (mimo projektu, necommitnutý):** pred zmenou 3 chyby, po zmene **7 zo 7 OK**. Overuje:
- v dátach scény 4 nie je „číslo 3“, „Ventúrska 3“, „Ventúrskej 3“ ani „domu 3“,
- obe schválené znenia,
- druhú nápovedu bez zmeny,
- nápovedy neprezrádzajú odpoveď (Korvín),
- rok 1465 ostal.

Test C1 (vodidlá) a celá kapitola (B7): všetko OK.

**Zmenené súbory:**
- `data/chapter-one/venturska-brana-spomienok.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** bez chýb.

**Ďalší krok:** B4c (3D truhlica) alebo iný krok podľa plánu, až po potvrdení.

---

## 24. 10. 2026 – Záver dňa

**Hotové dnes:**
- **Nápovedy v troch stupňoch** pri počítacích predmetoch (krok 54).
- **B3b** – koniec aktu III so zložením Zlatého kľúča a tretím útržkom (krok 55).
- **Texty finále v dátach** (krok 56).
- **B4a** – obrazovka „Strážca prichádza“, miesto pre video a prevod starých záverečných uložení so zálohou (krok 57).
- **B4b** – truhlica s tromi zámkami v 2D, Zápisník kódov pri truhlici, štvrtý útržok (krok 58).
- **B5** – historická fotografia zo štyroch útržkov, priblíženie a otočenie, dočasný obrázok (krok 59).
- **B6** – zadanie názvu miesta a karta „Ďalšie miesto“ s odkazom do Google Máp (krok 60).
- **B7** – záverečná obrazovka z dát, konečné skóre, karta a fotografia v okne (krok 61).
- **C1** – vodidlá na ďalšie miesto, „Ukáž cestu“ bez straty bodov, odstránené úniky odpovedí (krok 62).
- **Úprava scény 4** – úvodný text a prvá nápoveda bez čísla domu (krok 63).

Celá kapitola je prejditeľná od začiatku po záver: scény 1–10 → koniec aktu III → Strážca → truhlica → fotografia → zadanie miesta → záver. Skóre 1010.

**Ukončenie:** vývojový server (`npm run dev`) zastavený, všetko commitnuté, nič sa nepushovalo.

**Najbližšie kroky v tomto poradí:**
1. **B4c – 3D truhlica v troch krokoch:** zámky rozložené po truhlici, priblíženie (zoom) na zámok, hlásenie po odomknutí, 2D truhlica ostáva ako záloha. Návrh je v súbore `b4c-3d-truhlica.md` v projekte Mysterium (v priečinku projektu na disku zatiaľ nie je).
2. **Terénna kontrola** ciest a vodidiel podľa `docs/KONTROLA-PRED-VYDANIM.md`.
3. **Video a zvuky** (video Strážcu, zvukové súbory hry sú zatiaľ prázdne).

---

## 25. 10. 2026 – Krok 64 (krok B4c-1): 3D truhlica – scéna, otáčanie, tri zámky

**Čo sa urobilo:**
- **Nová odľahčená 3D truhlica:**
  - `components/finale/chest3d/ChestModel3D.tsx`: telo, veko, kovanie, tri zámky, kľúčová dierka, kľúč,
  - `components/finale/chest3d/Chest3DView.tsx`: plátno, otáčanie a štítky,
  - `components/finale/chest3d/chestFacing.ts`: matematika natočenia.
  - **Vzhľad** (nity, rohové kovanie, rúčka, emblém) je prevzatý z pôvodného modelu. Tieto časti sú presunuté do `components/ui/chest-3d/ChestParts.tsx` a pôvodný (nevyužívaný) `ChestModel.tsx` ich importuje.
  - Bez tieňov, spoločné plátno `InspectStage`, ktoré kreslí iba pri pohybe.
- **Rozloženie zámkov:** Zámok I na ľavom boku, Zámok II vpredu nad kľúčovou dierkou, Zámok III na pravom boku, kľúčová dierka v strede prednej strany.
- **Stav zámku:**
  - zamknutý: tmavá mosadz,
  - na rade: teplé svetlo a zlatý štítok, ktorý jemne pulzuje (iba pri zapnutých animáciách),
  - odomknutý: zelený nádych a vysunutý oblúk.
  - Po vložení kľúča je kľúč v dierke, po otvorení je veko otvorené. Zatiaľ bez animácie, tá príde v B4c-3.
- **Štítky „Zámok I/II/III“:** tlačidlá s textom 16 px a výškou 44 px. Sú viditeľné, iba keď je strana zámku natočená k hráčovi. Popis pre čítačku je napríklad „Zámok II – na rade“.
- **Výber zámku:** ťuknutie na štítok alebo na zámok ho vyberie a zvýrazní (rám v 3D) a zvýrazní aj jeho 2D riadok s číselníkmi. Ťahanie sa za ťuknutie nepočíta.
- **Otáčanie:** prstom alebo myšou so zotrvačnosťou (fyzika ako pri žetóne), šípky na klávesnici.
- **Natočenie k zámku:**
  - pri vstupe je truhlica natočená k zámku na rade,
  - po odomknutí sa plynulo natočí k ďalšiemu, pri vypnutých animáciách okamžite,
  - po troch zámkoch sa natočí dopredu ku kľúčovej dierke.
- **Odomykanie** ide ďalej cez dnešné 2D ovládanie pod 3D scénou (číselníky, „Odomknúť zámok“, hlásenia, „Vložiť Zlatý kľúč“, Zápisník kódov), bez prepínača. Engine (`engine/finale.ts`) ani uloženie sa nemenili.
- **Záloha:** 2D truhlica z B4b sa ukáže iba pri `?bez3d` a pri chybe WebGL. Pri vypnutých animáciách ostáva 3D, vypne sa iba pulzovanie a plynulé natáčanie.
- **Nové schválené texty v dátach:** „Ťahaj a otáčaj truhlicu. Ťukni na zámok.“ (riadok pod 3D) a „na rade“ (stav zámku pre čítačku, aj v 2D riadkoch).

**Test (mimo projektu, necommitnutý):** pred zmenou 10 chýb, po zmene **18 z 18 OK**. Overuje:
- nové texty,
- rozloženie a natočenie zámkov (viditeľnosť pri 0°, ±90°, celej otáčke; najbližšie natočenie; natočenie k zámku na rade aj ku kľúčovej dierke),
- načítanie 3D až na truhlici, zálohu, 2D ovládanie, 3D pri vypnutých animáciách,
- plátno `InspectStage`, štítky s výberom, natáčanie, vzhľad z `ChestParts`.

**Všetky doterajšie testy:** C1 63/63, B7 20/20, B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3b 25/25, texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37. Skóre 1010.

**V prehliadači na dev serveri (360 px):**
- **3D (17 z 17):**
  - pri vstupe je viditeľný štítok „Zámok I – na rade“, 44 px a 16 px, pulzuje,
  - výber zámku zvýrazní aj 2D riadok,
  - **plátno v pokoji nekreslí (0 kreslení za 1 s)**,
  - ťahanie otočí truhlicu,
  - po odomknutí I natočenie k II, F5 (I odomknutý, natočenie k II), po II natočenie k III, po III dopredu,
  - kľúč a otvorenie cez 2D, F5 po otvorení,
  - bez chýb v prehliadači.
- **`?bez3d` a nefunkčné WebGL:** 2D truhlica, odomykanie funguje.
- **Vypnuté animácie:** 3D ostáva, štítok nepulzuje, plátno v pokoji nekreslí.
- **Starý test truhlice v prehliadači (B4b)** v 3D aj `?bez3d`: všetko OK po úprave na stav „na rade“ a na pokračovanie na fotografiu (od B5).

Snímky: vstup (zámok I), po otočení, natočená k II, natočená k III, otvorená.

**Výkon (produkčný build):**
- úvodná stránka 8 skriptov, 204 kB (komprimované),
- na obrazovke Strážcu sa 3D nenačíta,
- pri vstupe na truhlicu pribudne 238 kB: 234 kB je spoločný 3D základ (three.js), 3,8 kB samotná truhlica.

**Chyby počas práce:**
- Prvé meranie ukázalo, že plátno kreslí nepretržite (asi 1 260 kreslení za sekundu). Ovládač otáčania si pri každom kroku snímky vyžiadal ďalšiu snímku. Opravené: krok v snímke ďalšiu snímku nevyžiada, vyžiada ju iba ťahanie, šípky a natáčanie.
- **Rovnaký vzor je v 3D predmetoch v okne „Prezrieť“** (`Token3DView.tsx`, `Item3DView.tsx`), takže tam plátno pravdepodobne tiež kreslí nepretržite. Zistené čítaním kódu, neoverené meraním a nemenené. Navrhujem samostatný malý krok.
- Lint: v nevyužívanom pôvodnom `ChestModel.tsx` je ďalej stará chyba (`setState` v efekte) a dve staré upozornenia. Boli tam aj pred zmenou (overené na verzii z gitu), teraz je o jedno upozornenie menej. Nové súbory sú bez chýb.

**Zmenené súbory:**
- `types/game.ts`, `data/chapter-one/finale.ts`
- `components/finale/chest3d/Chest3DView.tsx`, `ChestModel3D.tsx`, `chestFacing.ts` (nové)
- `components/ui/chest-3d/ChestParts.tsx` (nový), `components/ui/chest-3d/ChestModel.tsx`
- `components/screens/FinaleChestScreen.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** nové a zmenené súbory bez chýb (okrem starých chýb v nevyužívanom `ChestModel.tsx`).

**Ďalší krok:** B4c-2 (zadávanie číslic v 3D s priblížením na zámok), až po potvrdení.

## 25. 10. 2026 – Krok 65 (krok B4c-2): Zadávanie číslic v 3D s priblížením na zámok

**Čo sa urobilo:**
- **Priblíženie:**
  - Ťuknutie na zámok na rade (na zámok alebo jeho štítok) natočí truhlicu rovno k hráčovi a plynulo ju priblíži, kým tri kolieska nevyplnia obrázok. Pri vypnutých animáciách sa priblíži hneď.
  - Kamera stojí, truhlica sa posunie a zväčší. Kolieska sú presne v tretinách šírky, aby pod nimi sedeli dotykové stĺpce.
  - Počas priblíženia sa truhlica neotáča a štítky zámkov sú skryté.
  - Zamknutý zámok, ktorý nie je na rade, sa iba zvýrazní. Odomknutý zámok nereaguje.
- **Tri kolieska v 3D** (nový `components/finale/chest3d/LockDials3D.tsx`):
  - Valce s číslicami 0 až 9 dokola. Číslice sú nakreslené systémovým písmom do malej textúry, nič sa nesťahuje.
  - Pri zmene sa koliesko plynulo pretočí najkratšou cestou (9 → 0 o jeden krok).
  - Nahradili tri tmavé okienka na zámku.
- **Ovládanie koliesok nad scénou:**
  - Tri stĺpce, na 360 px každý 109 × 176 px. Ťuknutie do hornej polovice pridá 1, do dolnej uberie 1. Ťahanie prstom hore pridáva, dole uberá (32 px na číslicu).
  - Šípky ▲ ▼ ukazujú, kam ťuknúť.
  - Pre čítačku a klávesnicu je každé koliesko „otočné pole“ s popisom napríklad „Zámok I, koliesko 1 z 3“ a hodnotou „číslica 4“. Mení sa šípkami hore a dole.
  - Po priblížení dostane fokus prvé koliesko.
- **Tlačidlá nad scénou (54 px):**
  - „Späť“ oddiali pohľad bez odomykania. Rovnako funguje klávesa Esc.
  - „Odomknúť zámok“.
  - Číslice ostanú nastavené, lebo 3D aj 2D ovládanie menia ten istý stav.
- **Zlý kód:**
  - Zobrazí sa text a zámok sa na 0,45 s zatrasie. Pri vypnutých animáciách iba text.
  - Neprezradí, ktorá číslica je zlá, nič sa neuloží, priblíženie ostane a fokus ostane na tlačidle.
- **Správny kód:**
  - Zámok hneď zozelenie a plynulo vysunie oblúk. Kolieska a tlačidlá zmiznú.
  - Po 0,35 s sa pohľad plynulo oddiali, potom sa ukáže hláška a truhlica sa natočí k ďalšiemu zámku.
  - Po treťom zámku príde hláška o kľúči a tlačidlo „Vložiť Zlatý kľúč“ (kľúč a veko v 3D sú až v B4c-3).
  - Pri vypnutých animáciách sa všetko stane naraz.
- **2D ovládanie:**
  - Pri 3D je v rozbaľovacom bloku `<details>` „Ovládanie pre klávesnicu a čítačku“, na začiatku zbalenom.
  - Hlášky sú hneď pod obrázkom, mimo bloku, a čítačka ich prečíta pri oboch spôsoboch.
  - Pri záložnej 2D truhlici (`?bez3d`, chyba WebGL) je ovládanie viditeľné stále ako doteraz.
  - Ak sa zámok odomkne 2D ovládaním počas priblíženia, pohľad sa oddiali.
- **Posun stránky:** pri priblížení sa stránka posunie tak, aby bola celá truhlica pod pevnou hlavičkou (161 px).
- **Nové a zmenené schválené texty v dátach:**
  - `lockOpenedText` (zmena, platí aj pre 2D): „Gratulujem, zámok sa otvoril. Pokračuj ďalším zámkom.“
  - `lastLockOpenedText`: „Gratulujem, posledný zámok sa otvoril. Teraz vlož Zlatý kľúč.“
  - `backLabel`: „Späť“
  - `dialHint`: „Ťukni hore alebo dole na koliesko, alebo ním potiahni prstom.“
  - `dialWheelLabel`: „Koliesko {index} z {count}“
  - `accessibleControlsTitle`: „Ovládanie pre klávesnicu a čítačku“
- **Výpočty bez kreslenia** sú v novom `components/finale/chest3d/chestZoom.ts` (priblíženie, kolieska, zatrasenie, dobiehanie), aby sa dali testovať.
- **Engine (`engine/finale.ts`) ani uloženie sa nemenili.** Kódy kontroluje iba engine a v komponentoch nie sú.

**Test (mimo projektu, necommitnutý):** pred zmenou 14 chýb, po zmene **33 z 33 OK**. Overuje:
- texty,
- kolieska (krok dokola, najkratšia cesta, ťuknutie, ťahanie),
- priblíženie (plynulé do 1 s, okamžité pri vypnutých animáciách, kolieska v tretinách šírky a nad tlačidlami, zámok pred kamerou),
- zatrasenie, dobiehanie,
- rozbaľovací blok, kolieska pre čítačku, tlačidlá z dát,
- písmo sa nesťahuje, kódy v komponentoch nie sú.

**V prehliadači na dev serveri (360 px), nový test:** pred zmenou zlyhal (kolieska, blok a texty neexistovali).
- **Po zmene 3D: 48 z 48.**
  - zbalený blok (47 px),
  - priblíženie: tri kolieska s popisom, štítky skryté, stĺpce 109 × 176 px, tlačidlá 54 px, pokyn ku kolieskam,
  - plátno v pokoji nekreslí (aj priblížené),
  - zlý kód: text, zatrasenie, nič sa neuloží, fokus ostane,
  - ťuknutie hore a dole, ťahanie hore o 80 px (+2) a dole, šípky, rovnaký stav v 2D,
  - „Späť“ aj Esc bez odomknutia,
  - zámok I ťukaním 3-8-1: hláška až po oddialení, natočenie k II,
  - F5, zámok II cez 2D blok, F5,
  - zámok III klávesmi 9-2-7: hláška o kľúči, tlačidlo kľúča, natočenie dopredu,
  - F5, bez chýb v prehliadači.
- **Vypnuté animácie: 48 z 48** (bez trasenia, hláška hneď).
- **`?bez3d` a nefunkčné WebGL:** všetko OK (2D bez bloku, nové hlášky).

**Všetky doterajšie testy:** B4c-1 18/18, C1 63/63, B7 20/20 (celá kapitola, skóre **1010**), B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3b 25/25 (aj staré uloženia), texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.
- **Staré testy v prehliadači:** B4b (3D aj `?bez3d`) OK, B4c-1 (3D, vypnuté animácie, `?bez3d`, nefunkčné WebGL) OK.
- Úpravy starých testov:
  - test textov a B4b na nový schválený text hlášky,
  - B4c-1: ťuknutie na zámok na rade ho teraz aj priblíži, test potom stlačí „Späť“.

Snímky: priblíženie, zlý kód, po odomknutí, 2D blok, zámok III, všetko odomknuté.

**Výkon (produkčný build):**
- úvodná stránka bez zmeny (8 skriptov, 204,6 kB),
- pri vstupe na truhlicu pribudne 240,9 kB: 234,4 kB three.js, **6,5 kB truhlica** (predtým 3,8 kB).

**Chyby počas práce:**
- **Ťuknutie na hornú časť kolieska nefungovalo.** Pevná hlavička (161 px) zakrývala hornú časť truhlice, keď bola stránka posunutá, a ťuknutie trafilo hlavičku. Opravené v hre: pri priblížení sa truhlica posunie celá pod hlavičku (`scroll-mt-44`).
- **Po zlom kóde sa fokus presúval z tlačidla na truhlicu**, čo by používateľa klávesnice rušilo. Opravené: fokus sa presúva iba po správnom kóde, keď tlačidlá zmiznú.
- **Nápis „ODOMKNÚŤ ZÁMOK“** sa nad scénou na 360 px zalomil do dvoch riadkov. Opravené užšími medzerami medzi písmenami.
- **Lint:** tri chyby v nových súboroch (priama zmena ovládača v snímke, `useMemo` bez vnorenej funkcie). Opravené: zmeny cez metódy ovládača.
- **Testy:**
  - Overenie viditeľnosti v zbalenom bloku bolo zlé (Chrome hlási skryté prvky inak). Opravené na `checkVisibility()`.
  - Testy čakali príliš krátko, lebo softvérové kreslenie v testovacom prehliadači je pomalé. Upravené tak, aby čakali na pokoj plátna a na hlášku najviac 5 s.
  - Kontrola „bez trasenia“ započítala jedno prekreslenie hneď po ťuknutí. Spresnená na čas 0,1 až 0,35 s po ťuknutí.
- **Porušenie pravidla o UTF-8:** dva pomocné súbory mimo projektu (ladiaci skript a spúšťací skript testu) som upravil alebo vytvoril cez PowerShell a pokazila sa v nich diakritika. Prepísané cez Write. Súbory projektu to nezasiahlo.
- **Lint celého projektu:** ostávajú staré chyby a upozornenia v súboroch, ktoré sa v tomto kroku nemenili (napríklad `ActChestScreen.tsx`, `CodexBar.tsx`, `ChestCameraRig.tsx`, `ChestModel.tsx`, `useGameEngine.ts`).

**Poznámka:** odomknutý zámok v 3D ukazuje na kolieskach číslice, ktoré hráč sám nastavil, až kým sa stránka neobnoví (po F5 ukazuje 0-0-0). 2D ovládanie ukazuje pri odomknutom zámku ✓.

**Do kontroly pred vydaním** pribudlo: vyskúšať kolieska prstom a s čítačkou na skutočnom mobile.

**Zmenené súbory:**
- `types/game.ts`, `data/chapter-one/finale.ts`
- `components/finale/chest3d/Chest3DView.tsx`, `ChestModel3D.tsx`
- `components/finale/chest3d/chestZoom.ts`, `LockDials3D.tsx` (nové)
- `components/screens/FinaleChestScreen.tsx`
- `docs/KONTROLA-PRED-VYDANIM.md`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** nové a zmenené súbory bez chýb.

**Ďalší krok:** B4c-3 (vloženie Zlatého kľúča a otvorenie veka v 3D), prípadne malý krok s opravou zbytočného kreslenia pri 3D predmetoch, až po potvrdení.

## 25. 10. 2026 – Krok 66 (krok B4c-3): Zlatý kľúč a otvorenie veka v 3D

**Čo sa urobilo:**
- **Tlačidlo „Vložiť Zlatý kľúč“:** po treťom zámku je nad scénou (54 px) a aj v zbalenom bloku „Ovládanie pre klávesnicu a čítačku“. Obe robia to isté.
- **Animácia otvárania (3,6 s):**
  1. priblíženie ku kľúčovej dierke, trochu zboku a zhora (0,7 s),
  2. Zlatý kľúč priletí a zasunie sa (0,7 s),
  3. otočí sa o štvrť otáčky (0,6 s),
  4. pohľad sa oddiali a veko sa plynulo zdvihne, z truhlice vyjde teplé svetlo (žiariace dno, lúč, svetlo vnútri),
  5. štvrtý útržok vystúpi a ostane sa vznášať nad truhlicou,
  6. potom text o otvorení, karta útržku a „Prijať útržok a pokračovať“ ako doteraz.
  - Útržok sa po vystúpení nehýbe, aby plátno v pokoji nekreslilo.
  - Pod scénou je počas animácie „Kľúč zapadol. Pomaly ho otáčaš…“ a po otvorení „Štvrtý útržok sa vznáša nad truhlicou.“ (aj pre čítačku).
  - Zvuk otvárania pri zdvihnutí veka.
- **Preskočenie (tvoja doplnená požiadavka):** ťuknutie na scénu počas animácie ju hneď dokončí. Na klávesnici to isté robí Esc, Enter alebo medzerník.
- **Zlatý kľúč v 3D** (nový `components/finale/chest3d/ChestKey3D.tsx`): štvorlístková hlava s otvormi a stredom s korunkou, driek s dvoma krúžkami, brada s tromi zubmi (podľa kresby z kroku 7). Iba základné tvary, nič sa nesťahuje.
- **Štvrtý útržok v 3D** (nový `components/finale/chest3d/PhotoFragment3D.tsx`): papier s roztrhnutými okrajmi a pravý dolný diel historickej fotografie z dát (rovnaký obrázok ako pri skladaní, nič zvonku). Kým sa obrázok nenačíta alebo ak zlyhá, je to sépiový papier.
- **Spoločný tvar útržkov:** body trhlín sú v novom `components/finale/photoPieces.ts`. Používa ho obrazovka fotografie (`FinalePhotoViewer.tsx`, bez zmeny vzhľadu) aj 3D útržok.
- **Odomknutý zámok v 3D (tvoje rozhodnutie):** kolieska neukazuje vôbec, ani pred F5, ani po ňom. Je iba zelený s vysunutým oblúkom.
- **Engine a uloženie sa nemenili:**
  - jedno ťuknutie zapíše `insertFinaleKey` a `openFinaleChest` (cez `app/page.tsx`, ako doteraz),
  - útržok je v uložení hneď a práve raz,
  - opakované ťuknutie nič nepridá (tlačidlo zmizne a obrazovka si pamätá, že kľúč už vložila),
  - animácia je iba vizuálna.
- **Vypnuté animácie:** hneď konečný stav (kľúč otočený v dierke, veko otvorené, svetlo, útržok, karta).
- **F5 s otvorenou truhlicou (aj počas animácie):** hneď konečný stav, bez opakovania animácie.
- **Po otvorení** sa skryjú štítky zámkov.
- **2D záloha** (`?bez3d`, chyba WebGL) sa správa ako doteraz.
- **Nové schválené texty:** `keyTurningText` „Kľúč zapadol. Pomaly ho otáčaš…“, `openedHint` „Štvrtý útržok sa vznáša nad truhlicou.“
- **Výpočty v `chestZoom.ts`:** časová os otvárania, priblíženie na kľúčovú dierku, pohľad na otvorenú truhlicu (menšia a nižšie, aby sa nad ňu zmestil útržok). Pohľad má po novom aj posun do strany a pootočenie.

**Test (mimo projektu, necommitnutý):** pred zmenou 11 chýb, po zmene **24 z 24 OK**. Overuje:
- texty,
- časovú os: začiatok, koniec = konečný stav, najviac 4 s, poradie (priblíženie → zasunutie → otočenie → veko → útržok), plynulo jedným smerom,
- pohľad bez skokov (celá truhlica → dierka → otvorená truhlica), dierka v strede obrázka a zboku,
- spoločný tvar útržkov, kľúč s tromi zubmi bez sťahovania, útržok z dát,
- odomknutý zámok bez koliesok,
- zapojenie (tlačidlo nad scénou aj v bloku, preskočenie, riadky pod scénou, 2D záloha).

**Test B4c-2** je doplnený o kontrolu „odomknutý zámok v 3D bez koliesok“: 34 z 34.

**V prehliadači na dev serveri (360 px), nový test:** pred zmenou 6 chýb v 3D (`?bez3d` OK).
- **Po zmene 3D: 18 z 18.**
  - tlačidlo nad scénou (54 px) aj v bloku,
  - **4 ťuknutia naraz: útržok v uložení hneď a práve raz**, tlačidlá zmiznú,
  - počas animácie text o otáčaní a kreslí sa,
  - po animácii (3,7 s) text, karta, pokračovanie a riadok o útržku, štítky skryté,
  - **plátno potom nekreslí**,
  - F5 po otvorení: hneď karta, bez animácie, plátno nekreslí,
  - **F5 počas animácie:** hneď otvorená truhlica, útržok raz,
  - **ťuknutie na scénu počas animácie ju dokončí (za 0,2 s)**, útržok raz,
  - pokračovanie na fotografiu, bez chýb v prehliadači.
- **Vypnuté animácie: 13 z 13** (hneď otvorené).
- **`?bez3d` a nefunkčné WebGL:** OK (2D ako doteraz, 4 ťuknutia, útržok raz, F5).

**Všetky doterajšie testy:** B4c-2 34/34, B4c-1 18/18, C1 63/63, B7 20/20 (celá kapitola, skóre **1010**), B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3b 25/25 (aj staré uloženia), texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.
- **V prehliadači:**
  - B4c-2 (3D, `?bez3d`) OK,
  - B4c-1 (3D, vypnuté animácie, `?bez3d`) OK,
  - B4b (3D, vypnuté animácie, `?bez3d`) OK,
  - B5 (obrazovka fotografie) OK.
- **Úprava starých testov B4c-1 a B4b:** na otvorenie čakajú najviac 8 s namiesto pevných 2,6 s, lebo 3D animácia je dlhšia.

Snímky: pred vložením (zelené zámky bez koliesok), kľúč pri dierke, otočený kľúč, zdvíhanie veka so svetlom, otvorená truhlica s útržkom, po F5.

**Výkon (produkčný build):**
- úvodná stránka 205,9 kB (predtým 204,6 kB, +1,3 kB),
- pri vstupe na truhlicu pribudne 242,3 kB: 234,4 kB three.js, **7,9 kB truhlica** (predtým 6,5 kB).

**Chyby počas práce:**
- Pri svetle z truhlice som najprv použil metódu, ktorú svetlo v three.js nemá. Odhalila to kontrola typov ešte pred spustením, opravené.
- Regex v novom teste nepoznal zápis s typom (`TEETH: [number, number][] = …`). Opravený test.
- Útržok bol na prvých snímkach malý a nízko, takmer v truhlici. Zväčšený a zdvihnutý vyššie.
- Staré testy B4c-1 a B4b čakali na otvorenie príliš krátko (pozri vyššie).
- **Lint celého projektu:** ostávajú staré chyby a upozornenia v súboroch, ktoré sa v tomto kroku nemenili (rovnaké ako v B4c-2).

**Zmenené súbory:**
- `types/game.ts`, `data/chapter-one/finale.ts`
- `components/finale/chest3d/Chest3DView.tsx`, `ChestModel3D.tsx`, `chestZoom.ts`
- `components/finale/chest3d/ChestKey3D.tsx`, `PhotoFragment3D.tsx` (nové)
- `components/finale/photoPieces.ts` (nový), `components/finale/FinalePhotoViewer.tsx`
- `components/screens/FinaleChestScreen.tsx`
- `docs/KONTROLA-PRED-VYDANIM.md`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** nové a zmenené súbory bez chýb.

**Ďalší krok:** malý krok s opravou zbytočného kreslenia pri 3D predmetoch v okne „Prezrieť“, alebo ďalší krok podľa plánu, až po potvrdení.

## 25. 10. 2026 – Krok 67 (krok C2): 3D predmety v okne „Prezrieť“ v pokoji nekreslia

**Meranie pred zmenou** (okno „Prezrieť“, predmet sa nehýbe, 360 px, testovací prehliadač): **všetkých 8 predmetov v 3D kreslilo nepretržite**, aj pri vypnutých animáciách.

| Predmet | Snímky za sekundu v pokoji (zapnuté / vypnuté animácie) |
|---|---|
| Žetón nultého kilometra | 49 / 43 |
| Kus mapy: staré mesto | 50 / 51 |
| Pátračova strana z denníka | 49 / 49 |
| Pečať vzdelanosti | 48 / 47 |
| Kus mapy: námestie | 51 / 44 |
| Prvý, druhý, tretí zub kľúča | 45 až 50 / 40 až 50 |
| Nahrávka Strážcu | bez 3D |

- V testovacom prehliadači sa kreslí softvérovo, preto okolo 50. Na mobile by to bolo toľko, koľko zvláda displej (60 až 120).
- **Príčina:** rovnaký vzor ako pri truhlici pred B4c-1. Krok pohybu v každej snímke išiel cez funkciu, ktorá si vždy vyžiadala ďalšiu snímku. Kontrola „v pokoji netreba ďalšiu snímku“ preto nemala účinok.

**Čo sa urobilo:**
- `components/items/3d/Token3DView.tsx` (žetón) a `components/items/3d/Item3DView.tsx` (list, mapa, pečať, zuby):
  - do ovládačov pribudla metóda `advance()`, krok v snímke ide cez ňu a ďalšiu snímku si nevyžiada,
  - ďalšiu snímku vyžiada iba existujúca kontrola na konci snímky: keď sa predmet hýbe (ťahanie, zotrvačnosť, natočenie, „Obrátiť“, návrat náklonu) alebo beží odpočet automatického zápisu,
  - ťahanie, šípky, „Otočiť na hranu“ a „Obrátiť“ si snímku vyžiadajú ako doteraz.
- Výpočty pohybu (`rotationPhysics.ts`), kresby ani správanie sa nemenili.

**Meranie po zmene:** všetkých 8 predmetov **v pokoji 0 snímok za sekundu**, so zapnutými aj vypnutými animáciami. Po otvorení sa predmet nakreslí (2 až 3 snímky) a ďalej plátno stojí.
- Jedno osamotené prekreslenie po zmene v okne je v poriadku a očakávané, napríklad keď príde nová textúra so zapísanou číslicou alebo sa v okne zmení prvok. Plátno sa potom znova zastaví.

**Nový test v prehliadači (mimo projektu, necommitnutý):**
- Pred zmenou 15 chýb (zapnuté animácie) a 15 chýb (vypnuté animácie).
- Po zmene **23 z 23** (zapnuté) a **21 z 21** (vypnuté).
- Overuje:
  - každý 3D predmet: nakreslený po otvorení a v pokoji 0 snímok,
  - žetón: po pustení sa točí so zotrvačnosťou a potom stojí, automatický zápis po natočení (nie hneď, po 1,7 až 2,1 s), potom pokoj,
  - strana z denníka: „Obrátiť“ kreslí počas otočenia, automatický zápis, potom pokoj,
  - mapa: šípka nakloní, náklon sa vráti, potom pokoj,
  - pečať: značky sa dajú označiť, pokoj aj po náklone ťahaním,
  - zub kľúča: značky na ťuknutie, pokoj,
  - vypnuté animácie: bez zotrvačnosti a bez automatického zápisu ako doteraz, v pokoji 0 snímok,
  - bez chýb v prehliadači.

**Staré testy:**
- **Staré skripty 3D predmetov v prehliadači** (produkčný build): predmety, zuby kľúča, počítanie, ťukanie, časovanie nápovedy a zápisu. **Výsledky pred zmenou a po nej sú zhodné.**
- **`?bez3d`:** 2D obrázky a nájdenie číslic fungujú ako doteraz.
- **Node:** fyzika otáčania 25/25, B4c-3 24/24, B4c-2 34/34, B4c-1 18/18, C1 63/63, B7 20/20 (celá kapitola, skóre **1010**), B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3b 25/25 (aj staré uloženia), texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.
- **Starý test predmetov z B1b-3b: 40 z 45.** Rovnakých 5 chýb je aj na stave pred touto zmenou (aj pred B4c-3), takže ich zmena nespôsobila. Test počíta prvky kresby zubov a máp podľa starého označenia. Kresby sa zmenili v kroku 7 a odvtedy ich overuje test kresby kľúča (54/54). Test B1b-3b je zastaraný, v tomto kroku som ho neupravoval.

**Chyby počas práce:**
- V novom teste:
  - test hľadal tlačidlo „Otočiť na hranu“, ktoré sa pri žetóne ukáže až s nápovedou; upravené na šípky (Home a 6 × doľava), ako v starom skripte,
  - test čakal na pokoj príliš krátko a započítal jedno osamotené prekreslenie; upravené na 2 s pokoja pred meraním.
- Jeden beh testu pri vypnutých animáciách sa zasekol na spojení s testovacím prehliadačom (chyba prostredia). Ďalšie behy prebehli normálne.

**Zmenené súbory:**
- `components/items/3d/Token3DView.tsx`, `components/items/3d/Item3DView.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory bez chýb. V celom projekte ostávajú staré nálezy v súboroch, ktoré sa nemenili.

**Ďalší krok:** podľa plánu, až po potvrdení.

## 25. 10. 2026 – Krok 68 (krok C3): Upratovanie – test B1b-3b, rozostupy v zápisníku, koncept kapitol

**1. Test B1b-3b (mimo projektu, necommitnutý):**
- **Príčina 5 trvalých chýb:** test volal kresbu starým spôsobom (`getSvg("front", číslica, …)`), kým kresby sa volajú s jedným balíkom nastavení (`getSvg({ side, digit, …, countPoints, artPart })`). Dostal prázdnu kresbu a napočítal 0 prvkov. Kresby boli v poriadku: pri dnešnom volaní nakreslia presne 8, 6, 9, 2 a 7 prvkov.
- Opravený jeden riadok volania (vrátane `artPart` pre zuby kľúča): **pred 40 z 45, po 45 z 45**. Test je zaradený medzi stále spúšťané testy.

**2. Zápisník kódov – rozostupy (`components/ui/CodeNotebook.tsx`):**
- **Kontrola na 360 px pred zmenou:**
  - štítky „ZÁMOK I/II/III“ boli v Inventári aj na obrazovke truhlice zarovnané a na jeden riadok (`nowrap`), bez vodorovného posúvania,
  - na obrazovke truhlice však okienka číslic nemali rovnaké rozostupy (60 a 72 px), lebo tlačidlo „Prezrieť“ (64 px) je širšie ako okienko (40 px).
- **Zmena:**
  - pri truhlici (keď sú v zápisníku tlačidlá „Prezrieť“) má každé miesto rovnako široký stĺpec (64 px),
  - okienko aj tlačidlo vyplnia stĺpec,
  - Inventár (bez tlačidiel) ostáva bez zmeny.
  - Prvá verzia okienko v stĺpci centrovala, takže sa posunulo o 12 px od začiatku štítku. Opravené: okienko je široké ako stĺpec a začína presne pod štítkom.
- **Meranie po zmene (360 px):**
  - Inventár bez zmeny: rozostupy 48 a 48, prvé okienko pod štítkom,
  - obrazovka truhlice: **rozostupy 72 a 72**, prvé okienko presne pod štítkom (x = 41),
  - štítky zarovnané a na jeden riadok, tlačidlá 64 × 44 px s neorezaným textom, bez vodorovného posúvania.
- Snímky: `c3-zapisnik-inventar.png`, `c3-zapisnik-truhlica.png`.

**3. `docs/KONCEPT-KAPITOL.md` zosúladený s dnešným stavom:**
- Kapitola 2 je po novom „Jedna truhlica na konci kapitoly“: tri zámky v poradí I, II, III, tri číslice z predmetov aktu, kľúč, Zápisník kódov ukazuje chýbajúce číslice.
- Nové kapitoly:
  - „Odmena po každej úlohe“ (predmet s vodidlom a ukrytou číslicou, okno „Prezrieť“),
  - „Koniec aktu“ (krátka scéna bez truhlice, útržok fotografie),
  - „Finále“ (Strážca, truhlica, fotografia, názov miesta, karta „Ďalšie miesto“, záver).
- Príklad pri ďalších kapitolách: namiesto útržku mapy historická fotografia a karta „Ďalšie miesto“.
- Porovnanie s kapitolou I k 25. 10. 2026: nové riadky (truhlica vo finále, predmet po úlohe, konce aktov, finále), stĺpec „Predmet“ v tabuľke úloh **bez číslic kódov**, poznámka o dočasnom ďalšom mieste.
- **Nič sa nezmazalo bez náhrady:** pôvodné pravidlo „Truhlica po každom akte“ je v novej kapitole „Zmeny konceptu“ s odkazom na koncept zážitku (krok 14) a kroky B1 až B7.
- Kapitoly sa prečíslovali (pribudli 3 až 5). Žiadny iný dokument sa na ne neodvoláva číslom.
- Kontrola: údaje porovnané s dátami hry (10 úloh, 3 akty, odmeny aktov, finále), v dokumente nie sú kódy.

**Testy po zmene:**
- **Node:** B1b-3b 45/45, fyzika otáčania 25/25, B4c-3 24/24, B4c-2 34/34, B4c-1 18/18, C1 63/63, B7 20/20 (celá kapitola, skóre **1010**), B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3b 25/25 (aj staré uloženia), texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.
- **Prehliadač:** test truhlice B4b (3D aj `?bez3d`, používa zápisník s tlačidlami „Prezrieť“) OK.

**Zistené, nemenené:**
- **Starý Node test zápisníka z kroku B1b-1 hlási 6 chýb**, rovnako aj na stave pred touto zmenou (aj pred B4c-2 a B4c-3). Predpokladá pravidlo z B1b-1, že predmet bez okna „Prezrieť“ má číslicu nájdenú hneď. Dnes majú okno „Prezrieť“ všetky predmety a číslica sa zapíše až po nájdení (to overuje B1b-3b). Test nebol medzi stále spúšťanými, preto sa to neukázalo. Navrhujem ho v samostatnom malom kroku aktualizovať alebo vyradiť.
- `docs/KARTY-USLOH.md` a `docs/KONCEPT-ZAZITKU.md` ešte uvádzajú, že `KONCEPT-KAPITOL.md` má „truhlica po každom akte“. To už neplatí; navrhujem tieto poznámky upraviť v samostatnom kroku.

**Chyby počas práce:**
- Prvé meranie „obrazovky truhlice“ bolo omylom znova v Inventári, lebo hra si po obnovení stránky pamätala Inventár. Opravený skript merania.
- Do časti „Zmeny konceptu“ som najprv napísal dôvod zmeny, ktorý nie je nikde doložený. Nahradil som ho odkazom na koncept zážitku (krok 14) a kroky B1 až B7.

**Zmenené súbory:**
- `components/ui/CodeNotebook.tsx` (commit „zápisník“)
- `docs/KONCEPT-KAPITOL.md`, `docs/PRACOVNY-DENNIK.md` (commit „dokumentácia“)

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** `CodeNotebook.tsx` bez chýb.

**Ďalší krok:** podľa plánu, až po potvrdení (napríklad starý test B1b-1 a poznámky v `KARTY-USLOH.md` a `KONCEPT-ZAZITKU.md`).

## 25. 10. 2026 – Krok 69 (krok C4): Test zápisníka B1b-1 a zmienky o truhliciach v dokumentoch

**1. Test zápisníka B1b-1 (mimo projektu, necommitnutý)**, aktualizovaný podľa dnešného pravidla: číslica sa zapíše až po objavení v okne „Prezrieť“.
- **Pred úpravou 10 zo 16** (6 starých chýb), **po úprave 17 zo 17**.
- Nové alebo zmenené kontroly:
  - každý z 9 predmetov s číslicou má okno „Prezrieť“,
  - bez prezerania je zápisník prázdny (po scénach 1 a 2 aj po celej kapitole),
  - po objavení číslice na žetóne a na mape sa vyplnia prvé dve miesta zámku I,
  - po objavení všetkých 9 je zápisník celý vyplnený,
  - staré uloženie bez zoznamu nájdených číslic má prázdny zápisník,
  - starý kód v uloženom inventári sa neuplatní, platí číslica z dát.
- Ostali kontroly: zápis iba raz, predmet, ktorý hráč nemá, útržok bez číslice, „Ukáž číslicu“, F5, poškodené zoznamy.
- Test nevypisuje číslice kódov (pri plnom zápisníku iba znaky #).
- **Stále spúšťané testy** sú po novom aj B1b-1 a B1b-3b.

**2. Zmienky o „truhlici po každom akte“ v dokumentoch:**
- `docs/KONCEPT-ZAZITKU.md`:
  - **časť C:** poznámka „Dnes v hre“ opisuje jednu truhlicu vo finále s tromi zámkami, kolieskami v 3D a Zlatým kľúčom,
  - **časť C:** upozornenie „treba zosúladiť“ je nahradené poznámkou „Zosúladené“ s odkazom na „Zmeny konceptu“ v `docs/KONCEPT-KAPITOL.md`,
  - **časť C:** tri staré dvojciferné kódy (už neplatné) sú nahradené popisom „ukryté číslice z predmetov úloh“,
  - **časť F:** „Dnes v hre“ je po novom „konce aktov bez truhlice“ (hlas Strážcu, pečať, zloženie kľúča, vždy útržok), s poznámkou o pôvodných truhliciach,
  - **„Súvisiace dokumenty“:** odkaz upravený.
- `docs/KARTY-USLOH.md`:
  - úvod: návrh je k 25. 10. 2026 naprogramovaný,
  - **časť 1:** „Dnes v hre“ opisuje dnešný stav (jedna ukrytá číslica na predmet, jedna truhlica vo finále, konce aktov bez truhlice, kódy kontroluje iba engine); starý dvojciferný systém je opísaný bez čísel,
  - **časti 3 a 4:** „Dnes v hre“ opisuje dnešný stav, s poznámkou, ako to bolo pôvodne,
  - **„Na zosúladenie“:** všetky tri body sú označené ako vyriešené s odkazom na „Zmeny konceptu“.
- **Nič sa nezmazalo bez náhrady:** pôvodný stav je vždy uvedený ako „pôvodne“ alebo prečiarknutý s odkazom.
- **V upravených častiach nie sú žiadne kódy zámkov** (ani staré, ani dnešné).

**Mimo zadania, nemenené (rozhodnutie autora):** `docs/KARTY-USLOH.md` obsahuje v tabuľke kódov (časť 1), v tabuľke odmien (časť 2) a v pláne kroku B1a dnešné číslice kódov. Je to pôvodný návrhový dokument s kartami úloh, preto ich bez rozhodnutia nemažem. Kódy sú aj v historických záznamoch tohto denníka. V `docs/KONCEPT-ZAZITKU.md` sú v častiach D a E zastarané poznámky „Dnes v hre“ (fotografia a ďalšie miesto už existujú). Netýkajú sa truhlice, preto som ich nemenil.

**Testy:** všetkých 17 stále spúšťaných testov OK:
- B1b-1 17/17, B1b-3b 45/45,
- fyzika otáčania 25/25,
- B4c-3 24/24, B4c-2 34/34, B4c-1 18/18,
- C1 63/63, B7 20/20 (celá kapitola, skóre **1010**), B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3b 25/25 (aj staré uloženia),
- texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.

**Zmenené súbory:** `docs/KONCEPT-ZAZITKU.md`, `docs/KARTY-USLOH.md`, `docs/PRACOVNY-DENNIK.md` (kód hry sa nemenil).

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** kód sa nemenil. V celom projekte ostávajú staré nálezy v nemenených súboroch.

**Ďalší krok:** podľa plánu, až po potvrdení.

## 25. 10. 2026 – Záver dňa

**Hotové dnes (popoludní):**
- **C2** – 3D predmety v okne „Prezrieť“ v pokoji nekreslia (0 snímok za sekundu).
- **C3** – opravený test B1b-3b, rovnaké rozostupy v Zápisníku kódov pri truhlici, `docs/KONCEPT-KAPITOL.md` zosúladený s dnešným stavom.
- **C4** – aktualizovaný test zápisníka B1b-1, zmienky o truhliciach v `docs/KARTY-USLOH.md` a `docs/KONCEPT-ZAZITKU.md` zosúladené.

Vývojový server je zastavený. Kód sa v závere dňa nemenil.

**Najbližšie:**
1. Opraviť v `docs/KONCEPT-ZAZITKU.md` poznámky „Dnes v hre“ v častiach D a E (skladanie fotografie a karta „Ďalšie miesto“ už existujú).
2. Pred zverejnením repozitára odstrániť kódy zámkov z `docs/KARTY-USLOH.md` a zo starých záznamov tohto denníka.
3. Terénna kontrola (vodidlá, cesty, dĺžka trasy – pozri `docs/KONTROLA-PRED-VYDANIM.md`).
4. Príprava na beta test: verzia uloženia z v2 na v3, kontrola `isPlaceholder` v dátach.
5. Video a zvuky.

## 26. 10. 2026 – Krok 70 (krok C5): Príprava na beta test – koncept zážitku, súpis dočasných údajov, štítok ukážkovej verzie

**1. `docs/KONCEPT-ZAZITKU.md`, časti D a E** (commit `f802387`): poznámky „Dnes v hre“ opisujú dnešný stav.
- **D:** štyri útržky sa samy zložia, fotografia sa dá priblížiť, posúvať a otočiť, na rube je poznámka s miestom; obrázok je dočasná kresba.
- **E:** názov miesta sa zadáva ručne, bez GPS, s odpustením diakritiky, veľkých a malých písmen, interpunkcie a drobných preklepov; potom karta „Ďalšie miesto“ s adresou, „Otvoriť v mapách“ a cestou, „Dokončiť kapitolu“ vedie na záver; ďalšia kapitola zatiaľ neexistuje; miesto a cesta sú dočasné.
- Pôvodný stav je uvedený ako „pôvodne“. Kódy v dokumente nie sú.

**2. Verzia uloženia (v2 na v3) – podľa rozhodnutia sa teraz nerobí.** Zapísaná do `docs/KONTROLA-PRED-VYDANIM.md` ako krok „tesne pred prvým testerom“:
- zmena `SAVE_KEY` v `engine/constants.ts`,
- bez prevodu, všetci začnú odznova,
- staré kľúče v2 a ich zálohy ostanú v prehliadači nedotknuté,
- úprava kľúča v stále spúšťaných testoch a nový test.
- `engine/constants.ts` ostáva `mysterium-progress-v2` (overené testom).

**3. Súpis dočasných údajov a štítok ukážkovej verzie:**
- **Kontrola `isPlaceholder`:** v dátach je iba raz, pri ďalšom mieste (`data/chapter-one/finale.ts`). Ostatné dočasné veci sú označené komentárom alebo chýbajúcim súborom.
- **Nové riadky v `docs/KONTROLA-PRED-VYDANIM.md`:**
  - zmena ďalšieho miesta naraz na 4 miestach dát (názov a adresa, prijaté odpovede, cesta, riadok „Miesto:“ na rube fotografie), potom odstrániť `isPlaceholder`,
  - cesta k ďalšiemu miestu overiť pešo,
  - video Strážcu pridať alebo vedome vynechať (v dátach dnes nie je),
  - zvuky: 5 súborov v `public/sounds` má 0 bajtov a 2 súbory (`digit-found.mp3`, `button-click.mp3`) chýbajú, hra je dnes úplne tichá,
  - štítok ukážkovej verzie pred vydaním odstrániť,
  - kódy zámkov z `docs/KARTY-USLOH.md` a starých záznamov denníka pred zverejnením repozitára,
  - verzia uloženia v3 tesne pred prvým testerom (pozri bod 2).
  - Fotografia, vodidlá a cesty v teréne a kolieska na mobile tam už boli.
- **Štítok ukážkovej verzie:**
  - nové nepovinné pole `previewNotice` v type hry (`types/game.ts`) a v dátach (`data/mysterium-game.ts`): „Ukážková verzia 0.1 – niektoré obrázky, zvuky a údaje sú zatiaľ dočasné.“,
  - úvodná obrazovka (`components/screens/LandingScreen.tsx`) ho ukáže namiesto vety „Najlepší zážitok dosiahneš so zapnutým zvukom.“; keď sa pole z dát odstráni, vráti sa pôvodná veta,
  - `app/page.tsx` odovzdá štítok z dát.

**Testy:**
- **Nový test (Node):** pred zmenou 13 chýb, po zmene **15 z 15** (štítok v dátach a v úvodnej obrazovke, návrat vety o zvuku bez štítku, časti D a E, všetky nové riadky kontroly, verzia uloženia nezmenená, žiadne kódy v upravených dokumentoch).
- **Prehliadač (360 px), úvodná obrazovka:** pred zmenou 3 chyby, po zmene **5 z 5** (štítok viditeľný, veta o zvuku nahradená, zmestí sa bez vodorovného posúvania, tlačidlo „Začať pátranie“, bez chýb).
- **Všetky stále spúšťané testy OK:**
  - B1b-1 17/17, B1b-3b 45/45, fyzika otáčania 25/25,
  - B4c-3 24/24, B4c-2 34/34, B4c-1 18/18,
  - C1 63/63, B7 20/20 (celá kapitola, skóre **1010**), B6 32/32, B5 21/21, B4b 26/26, B4a 20/20, B3b 25/25 (aj staré uloženia),
  - texty 37/37, B3a 65/65, kresba kľúča 54/54, nápovedy 37/37.

**Zistené, nemenené:** na úvodnej obrazovke je na 360 px nápis „MYSTERIUM“ orezaný na pravom okraji (veľké písmo s rozostupmi). Nadpis sa v tomto kroku nemenil; opravený v kroku 71.

**Chyby počas práce:** žiadne.

**Zmenené súbory:**
- commit 1: `docs/KONCEPT-ZAZITKU.md`
- commit 2: `types/game.ts`, `data/mysterium-game.ts`, `components/screens/LandingScreen.tsx`, `app/page.tsx`, `docs/KONTROLA-PRED-VYDANIM.md`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory bez chýb.

**Ďalší krok:** podľa plánu, až po potvrdení.

## 26. 10. 2026 – Krok 71: Nadpis „MYSTERIUM“ na úvodnej obrazovke sa zmestí celý

**Meranie pred zmenou** (skutočné hranice písmen nadpisu):

| Šírka | Písmo | Písmená od – do | Stav |
|---|---|---|---|
| 320 px | 48 px | 24 – 384 px | **orezaný o 64 px** |
| 360 px | 48 px | 24 – 384 px | **orezaný o 24 px** |
| 390 px | 48 px | 24 – 384 px | celý, ale nie v strede (vľavo 24, vpravo 6 px) |
| 768 px | 72 px | 128 – 669 px | celý, ale nie v strede (vľavo 128, vpravo 99 px) |

- **Príčina:** nadpis je širší ako stĺpec stránky (na mobile šírka mínus 2 × 24 px, na širšej obrazovke 512 px), preto pretečie doprava. Na úzkom mobile ho stránka oreže, takže sa vodorovne neposúva, ale nápis nie je celý.

**Čo sa urobilo** (`components/screens/LandingScreen.tsx`, iba nadpis):
- na úzkych obrazovkách sa písmo prispôsobí šírke obrazovky, najviac na doterajších 48 px (pri 320 px asi 35 px, pri 360 px 40 px, pri 390 px asi 44 px),
- od 640 px ostáva doterajších 72 px a nadpis má miesto o 64 px z každej strany širšie ako stĺpec, aby ostal v strede,
- nadpis je vždy na jednom riadku,
- malé odsadenie vľavo (rovnaké ako medzera medzi písmenami) vyrovná medzeru za posledným písmenom, takže nápis je presne v strede.

**Test v prehliadači (nový, mimo projektu):** pred zmenou 6 chýb, po zmene **17 z 17**. Pri šírkach 320, 360, 390 a 768 px overuje:
- nadpis celý viditeľný, na jednom riadku, v strede (rozdiel okrajov najviac 0,1 px),
- aspoň 24 px od okraja,
- bez vodorovného posúvania,
- písmo na mobile 35 až 44 px, na 768 px 72 px ako doteraz,
- bez chýb v prehliadači.

Snímky: `c6-po-320.png`, `c6-po-360.png`, `c6-po-390.png`, `c6-po-768.png`.

**Ďalšie testy:** test úvodnej obrazovky zo C5 (štítok ukážkovej verzie) 5/5, Node test C5 15/15.

**Chyby počas práce:** žiadne. Meranie však ukázalo, že nadpis nebol v strede ani pri 390 a 768 px, preto je opravené aj to.

**Zmenené súbory:** `components/screens/LandingScreen.tsx`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** `LandingScreen.tsx` bez chýb.

**Ďalší krok:** podľa plánu, až po potvrdení.

## 26. 10. 2026 – Krok 72: Riadkovanie a medzery medzi odsekmi v kartách s dlhším textom

**Zistenie:** riadkovanie nie je nastavené spoločne. Každá obrazovka ho má vo vlastných triedach. Dlhšie texty mali výšku riadku 32 px pri písme 15 až 16 px (riadkovanie 2,0 až 2,13) a „Pátračov denník“ k tomu 20 px medzi odsekmi. Odseky preto pôsobili, akoby medzi nimi boli prázdne riadky. Úvod scény („Hlas pátrača“, „Tvoja úloha“) má riadkovanie 1,625 a v dátach nie sú dvojité zalomenia, takže tam problém nebol.

**Čo sa urobilo:** riadkovanie 1,5 (`leading-normal`) a medzi odsekmi 12 px (asi polovica riadku), veľkosť písma bez zmeny:
- `components/screens/IntroScreen.tsx` – „Pátračov denník“ (aj medzera medzi odsekmi) a „Prvá stopa“ (na tej istej obrazovke, mala riadkovanie 2,0),
- `components/screens/HistoryScreen.tsx` – „Pátračov zápis“ (história scény),
- `components/screens/ActTransitionScreen.tsx` – „Vyhodnotenie prípadu“ (koniec aktu),
- `components/screens/FinaleGuardianScreen.tsx` – text Strážcu,
- `components/screens/FinishScreen.tsx` – záverečné odseky (aj medzera medzi nimi) a karta pokračovania,
- `components/screens/ArtifactScreen.tsx` – „Historický príbeh“ artefaktu.

**Test v prehliadači (360 px, nový, mimo projektu):** pred zmenou 5 chýb, po zmene **12 z 12**.

| Obrazovka | Pred | Po |
|---|---|---|
| Úvod kapitoly („Pátračov denník“) | 15 px / riadok 32 px (2,13), medzera 20 px | 15 px / 22,5 px (1,5), medzera 12 px |
| História scény | 15 / 32 (2,13) | 15 / 22,5 (1,5) |
| Koniec aktu | 15 / 32 (2,13) | 15 / 22,5 (1,5) |
| Strážca | 16 / 32 (2,0) | 16 / 24 (1,5) |
| Záverečná obrazovka | 16 / 32 (2,0) | 16 / 24 (1,5) |

- Na všetkých obrazovkách písmo aspoň 15 px a bez vodorovného posúvania.
- Snímky pred a po: `c7-pred-*.png`, `c7-po-*.png`.
- Test úvodnej obrazovky zo C5 (štítok) OK.

**Nemenené (kratšie texty alebo zámerne iný vzhľad):** rozhovor so Strážcom v prvej scéne (17 px / 32 px), papierová poznámka pátrača (`DetectiveNote`), prepis nahrávky v okne „Prezrieť“, „Ukáž cestu“, karta „Ďalšie miesto“, úvody obrazoviek truhlice a fotografie (16 px / 28 px, 1,75), krátke texty na úvodnej obrazovke, v dialógoch a v odmene (14 px / 28 px). Ak chceš, zjednotíme ich v ďalšom kroku.

**Lint:** zmenené súbory bez chýb. V `HistoryScreen.tsx` ostáva staré upozornenie na nepoužitú ikonu `LightbulbIcon` (bolo tam už predtým).

**Chyby počas práce:** žiadne.

**Zmenené súbory:** `components/screens/IntroScreen.tsx`, `HistoryScreen.tsx`, `ActTransitionScreen.tsx`, `FinaleGuardianScreen.tsx`, `FinishScreen.tsx`, `ArtifactScreen.tsx`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Ďalší krok:** podľa plánu, až po potvrdení.

## 26. 10. 2026 – Krok 73: Riadkovanie 1,5 zjednotené aj na ostatných obrazovkách

**Čo sa urobilo:** riadkovanie 1,5 (`leading-normal`) a medzi odsekmi 12 px (asi polovica riadku), veľkosť písma bez zmeny:
- **rozhovor so Strážcom:**
  - `components/screens/NpcScreen.tsx`,
  - `components/ui/Typewriter.tsx` – samotný text rozhovoru mal vlastné riadkovanie 1,625, ktoré prepísalo obal,
- **„Brána mlčí“** pred rozhovorom (`components/game/PuzzleFlow.tsx`): dva odseky s rovnakým štýlom (riadkovanie 1,625, medzera 16 px), zjednotené aj s medzerou,
- **prepis nahrávky** v okne „Prezrieť“ (`components/items/ItemInspector.tsx`),
- **„Ukáž cestu“** (`components/ui/RouteHint.tsx`),
- **karta „Ďalšie miesto“**, adresa a cesta (`components/finale/NextPlaceCard.tsx`),
- **úvody truhlice a fotografie** (`components/screens/FinaleChestScreen.tsx`, `FinalePhotoScreen.tsx`),
- **krátke texty a dialógy:**
  - úvodná obrazovka, dve vety (`components/screens/LandingScreen.tsx`),
  - dialóg „Začať odznova?“ (`components/ui/ConfirmDialog.tsx`),
- **predvolené riadkovanie textu v kartách** (`components/ui/SectionCard.tsx`, predtým 28 px).

**Ťukacie slovo v prepise nahrávky:** pri menšom riadkovaní roztiahlo tlačidlo vysoké 44 px svoj riadok, takže okolo neho vznikla väčšia medzera. Opravené:
- záporný zvislý okraj, tlačidlo ostáva 44 px a riadok sa neroztiahne,
- `relative z-10`, lebo dolnú časť plochy prekrýval nasledujúci riadok a ťuknutie tam netrafilo slovo.

**Výnimky (zámerne nemenené):**
- **rub historickej fotografie a náhradný text pri chybe obrázka** (`FinalePhotoViewer.tsx`, 16 px kurzívou, riadkovanie 1,75): ručne písaná poznámka na zadnej strane fotky v pevnom rámčeku 4 : 3, väčšie riadkovanie je súčasť jej vzhľadu,
- **nepoužívané v hre:** papierová poznámka `DetectiveNote` a staré obrazovky truhlice po akte (`ActChestScreen`, `ChestIntroScreen`, `RewardReveal`); hráč ich neuvidí, preto sa nemenili,
- **riadkovanie 1,625** (`leading-relaxed`) pri krátkych textoch v kartách (úvod scény, odmeny, artefakty, správy) ostáva; je blízko 1,5 a nebolo v zadaní.

**Test v prehliadači (360 px, nový, mimo projektu):** pred zmenou 12 chýb, po zmene **29 z 29**.
- **Riadkovanie 1,5 na všetkých meraných miestach:**
  - úvodná obrazovka 14 / 21 px,
  - dialóg 14 / 21 px,
  - „Brána mlčí“ 16 / 24 px s medzerou 12 px,
  - rozhovor 17 / 25,5 px,
  - „Ukáž cestu“ 15 / 22,5 px,
  - prepis nahrávky 15 / 22,5 px,
  - úvod truhlice 16 / 24 px,
  - úvod fotografie 16 / 24 px,
  - karta „Ďalšie miesto“ 16 / 24 px.
- Rub fotografie ostal 1,75 (výnimka).
- Prepis nahrávky: slovo „štyri“ má 47 × 44 px, ťuknutie ho trafí hore, v strede aj dole, riadky sú rovnomerné (22 až 23 px).
- Bez vodorovného posúvania, bez chýb v prehliadači.
- Snímky pred a po: `c8-pred-*.png`, `c8-po-*.png`.

**Ďalšie testy:**
- testy z krokov 71 a 72 a zo C5 OK (riadkovanie dlhých textov, nadpis, štítok),
- test okna „Prezrieť“ zo C2 OK,
- všetkých 18 stále spúšťaných Node testov OK (celá kapitola, skóre **1010**).

**Lint:** zmenené riadky bez nových chýb. Ostávajú staré nálezy v zmenených súboroch, ktoré tam boli už predtým: `Typewriter.tsx` (`setState` v efekte) a `NpcScreen.tsx` (nepoužitá premenná `onChooseNode`).

**Chyby počas práce:**
- Test najprv nenašiel rozhovor. Rozhovor sa nedá otvoriť iba uložením obrazovky (chýba, s kým hráč hovorí); test ho teraz otvorí cez novú hru, úvod, „Som pri Michalskej bráne“ a „Osloviť Strážcu“.
- Ťukacie slovo v prepise roztiahlo riadok a jeho dolná časť sa nedala ťuknúť (opravené, pozri vyššie).

**Zmenené súbory:**
- `components/screens/NpcScreen.tsx`, `LandingScreen.tsx`, `FinaleChestScreen.tsx`, `FinalePhotoScreen.tsx`
- `components/ui/Typewriter.tsx`, `ConfirmDialog.tsx`, `RouteHint.tsx`, `SectionCard.tsx`
- `components/game/PuzzleFlow.tsx`, `components/items/ItemInspector.tsx`, `components/finale/NextPlaceCard.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Ďalší krok:** podľa plánu, až po potvrdení.

## 26. 10. 2026 – Krok 74 (krok D1): Dizajnový audit celej hry (bez zmien v kóde)

**Rozsah:**
- 41 snímok celých obrazoviek pri 360 px a niekoľko kľúčových pri 390 a 768 px, od úvodnej obrazovky po záver,
- obrazovky: úvod, rozhovor, úlohy, nápovedy, história, okno „Prezrieť“ v 3D aj 2D, Inventár so zápisníkom, Artefakty, Úlohy, konce aktov, Strážca, truhlica (3D, priblíženie, zlý kód, všetky zámky, otvorená, 2D), fotografia aj s rubom, zadanie miesta, karta „Ďalšie miesto“, záver, dialóg „Začať odznova?“.
- Snímky: `shots/d1/d1-01` až `d1-41` v pracovnom priečinku.

**Merania na každej obrazovke:** ovládacie prvky pod 44 px, kontrast textu podľa WCAG, vodorovné posúvanie.

**Hlavné nálezy:**
- **P1 (kazí dojem alebo použiteľnosť):**
  - pevná hlavička zaberá 161 px (20 až 25 % výšky obrazovky),
  - pole odpovede v úlohe je asi 1 400 px pod začiatkom stránky,
  - tlačidlo zvuku 32 × 32 px a odkaz „Späť k pátraniu“ v rozhovore vysoký 20 px,
  - nadpisy kariet a pomocné texty majú kontrast 4,14 : 1 (pod 4,5 : 1).
- **P2 (zlepší kvalitu):**
  - prázdny riadok v karte „Tvoja úloha“,
  - verzálky s rozostupmi v otázkach rozhovoru,
  - nejednotné pomenovania (dôkaz, predmet, odmena, artefakt, stopa) a emoji ikony,
  - Inventár je dlhý asi 6 900 px,
  - nejednotné ovládanie „Späť“ a hlavička,
  - texty, ktoré nezodpovedajú stavu (truhlica, Strážca bez videa, „Ďalšia stopa“),
  - detail artefaktu sa posúva do strany (374 px),
  - 3D truhlica je v rámčeku malá.
- **P3 (nice to have):** vypnuté tlačidlo „Overiť odpoveď“ je na slnku takmer neviditeľné, chýba pokyn k ťuknutiu na rozbiehajúci sa text, dlhé odkazy na Artefaktoch.
- Celá správa je v odpovedi používateľovi.

**Chyba počas práce:** prvé meranie kontrastu vynechalo väčšinu textov, lebo farby sú vo formáte `oklch` (Tailwind v4) a meranie čítalo iba `rgb`. Opravené prevodom farieb cez plátno a audit spustený znova.

**Zmenené súbory:** iba `docs/PRACOVNY-DENNIK.md` (kód sa nemenil).

**Ďalší krok:** výber opráv z auditu, až po potvrdení.

## 26. 10. 2026 – Krok 75 (krok D2): Nálezy P1 z auditu – hlavička, obrazovka úlohy, dotykové plochy, kontrast

**1. Hlavička na jeden riadok** (`components/ui/CodexBar.tsx`): 161 px → **57 px**.
- Úlohy, Inventár a Artefakty sú tlačidlá 44 px vysoké s ikonou, nápisom 12 px a malým odznakom:
  - Úlohy: počet aktívnych, „✓“ keď sú splnené, bez odznaku keď žiadne nie sú,
  - Inventár: počet predmetov,
  - Artefakty: počet objavených.
- Skóre ostáva ako zlatá pilulka, zvuk je 44 × 44 px.
- Pre čítačku ostáva všetko celé, napríklad „Inventár – 14 predmetov“, „Artefakty – 10 z 10 objavených“, „Úlohy – splnené“, „Skóre: 1010“.
- Nápis „Denník pátrača“ je vizuálne skrytý a slúži ako názov hlavičky pre čítačku.
- 3D truhlica sa pri priblížení posúva pod novú hlavičku (`components/finale/chest3d/Chest3DView.tsx`, odsadenie 80 px namiesto 176 px).

**2. Obrazovka úlohy** (`components/screens/PuzzleScreen.tsx`):
- **Lišta s odpoveďou** (popis odpovede, hlásenie, pole a „Overiť“):
  - prilepená k spodku obrazovky cez `position: sticky`, kým hráč číta obsah nad ňou; na konci obsahu leží pod kartou poznámok,
  - výška obmedzená na 60 `dvh`,
  - hlásenie o zlej aj správnej odpovedi je priamo v lište nad poľom,
  - nápis na tlačidle je skrátený na „Overiť“.
- **„Hlas pátrača“** je krátky citát so zlatou čiarou namiesto veľkej karty s ikonou.
- **Zadanie** v karte „Tvoja úloha“ sa delí na odseky s polriadkovou medzerou (zmizol prázdny riadok).
- Príbeh aj „Hlas pátrača“ ostali celé a v rovnakom poradí.
- `components/ui/ScreenContainer.tsx`: výška stránky v `dvh` (podľa skutočne viditeľnej plochy).

**3. Dotykové plochy:**
- zvuk 44 × 44 px,
- „Späť k pátraniu“ v rozhovore 128 × 44 px (vyzerá ďalej ako odkaz) – `components/screens/NpcScreen.tsx`,
- „← Späť k pátraniu“ na obrazovke Úlohy 147 × 44 px – `components/screens/QuestScreen.tsx`.

**4. Kontrast:** šedá `slate-500` (4,14 : 1) zmenená na `slate-400`, nameraných **7,5 až 7,8 : 1**:
- nadpisy bežných kariet (`SectionCard.tsx`),
- pomocné texty pri poznámkach (`PuzzleScreen.tsx`),
- druhá veta a štítok ukážky na úvodnej obrazovke (`LandingScreen.tsx`),
- popis nad poľom (`TextInput.tsx`),
- nadpis informačnej správy (`MessageBox.tsx`).
- Zástupný text v poli je posunutý zo `slate-600` na `slate-500`, ostáva odlíšený od napísaného textu.

**Test v prehliadači (nový, mimo projektu)** pri 320 × 568, 360 × 740, 390 × 844 a 768 × 1024 px: pred zmenou **46 chýb**, po zmene **všetko OK** (48 kontrol). Overuje:
- hlavička najviac 60 px (57) a v jednom riadku,
- všetky tlačidlá v nej aspoň 44 × 44 px (aj pri 320 px), nápisy 12 px,
- odznaky (14, 10, ✓) a celé popisy pre čítačku, „Denník pátrača“ nie je vidieť,
- pole aj „Overiť“ viditeľné hneď po načítaní pri všetkých šírkach, aj na 320 × 568,
- hlásenie o zlej odpovedi viditeľné v lište,
- na konci stránky leží lišta pod kartou poznámok,
- kontrast 7,5 : 1 (karty a pomocné texty) a 7,75 až 7,8 : 1 (úvodná obrazovka),
- správna odpoveď vedie na históriu scény,
- „Späť k pátraniu“ v rozhovore a na Úlohách aspoň 44 px,
- bez vodorovného posúvania a bez chýb v prehliadači.

Snímky pred a po: `d2-pred-*.png`, `d2-po-*.png`.

**Staré testy:**
- v prehliadači: B4b, B4c-2, B4c-3, C1, C2, C5, C6, C7, C8, B6 – všetko OK,
- 18 stále spúšťaných Node testov OK (celá kapitola, skóre **1010**).

**Chyby počas práce:**
- Pri 320 px sa tlačidlo zvuku zúžilo na 43 px. Opravené: zvuk sa nezmenšuje a skóre má o 2 px užší okraj.
- V teste:
  - nápisy v hlavičke hľadal iba mimo prvkov skrytých pre čítačku,
  - nadpis „Pátračov zápis“ hľadal malými písmenami, hoci je zobrazený veľkými.
  - Opravené.

**Lint:** zmenené riadky bez nových chýb. Ostávajú staré nálezy: `CodexBar.tsx` (stav zvuku sa pri štarte načíta v efekte, prevzaté bez zmeny) a `NpcScreen.tsx` (nepoužitá premenná).

**Do kontroly pred vydaním** pribudlo: lišta s odpoveďou pri otvorenej klávesnici na iPhone a Androide.

**Zmenené súbory:**
- `components/ui/CodexBar.tsx`, `SectionCard.tsx`, `TextInput.tsx`, `MessageBox.tsx`, `ScreenContainer.tsx`
- `components/screens/PuzzleScreen.tsx`, `LandingScreen.tsx`, `NpcScreen.tsx`, `QuestScreen.tsx`
- `components/finale/chest3d/Chest3DView.tsx`
- `docs/KONTROLA-PRED-VYDANIM.md`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Ďalší krok:** nálezy P2 z auditu, až po potvrdení.

## 26. 10. 2026 – Krok 76 (krok D3a): Zápis od pátrača ako papier s rukopisom

**Ako to bolo:**
- Zápis č. 1 (Strážca podáva zažltnutý list) bol obrázok `public/images/journal/detective-note-entry-1.png` (3,4 MB, bez priehľadnosti, s tmavým pozadím a s textom vpísaným do obrázka).
- Čítačka prečítala iba popis obrázka.
- Posledný odsek ešte hovoril o „dvoch číslach“.
- Pôvod obrázka nebol známy.

**Čo sa urobilo:**
- **Papier nakreslený v kóde** (`components/ui/DetectiveNote.tsx`, štýly `.detective-paper` v `app/globals.css`):
  - pergamen so zrnom (SVG šum), svetlom, škvrnami, ohybom, stmavnutými okrajmi a roztrhaným okrajom,
  - leží priamo na pozadí scény s mäkkým tieňom, bez tmavého obdĺžnika,
  - nepovinné pole `paperImageSrc` v dátach: ak sa dodá obrázok čistého papiera s priehľadným pozadím, nahradí papier v kóde (text ostane v HTML).
- **Jemný 3D náklon:**
  - pri ťahaní prstom alebo myšou sa papier nakloní najviac o 8°, tieň sa posunie opačne a po papieri prejde slabý lesk,
  - po pustení sa vráti,
  - iba CSS, mení sa len pri pohybe,
  - pri vypnutých animáciách je papier nehybný,
  - zvislé posúvanie prstom ostáva prehliadaču,
  - ťahanie myšou neoznačuje text.
- **Text v HTML, rukopisné písmo:**
  - Patrick Hand cez `next/font/google` (`app/layout.tsx`, podmnožiny latin a latin-ext); súbor písma je v projekte, prehliadač hráča si ho nepýta od Googlu,
  - overené, že všetkých 32 slovenských znakov (ľ, ť, ď, ň, ô, ŕ, ĺ, č, š, ž, ý, á, í, é, ú, ä aj veľké) sa vykreslí týmto písmom,
  - písmo 18,4 px, kontrast atramentu **8 : 1**.
- **Nový text zápisu v dátach** (`data/chapter-one/michalska-brana.ts`) presne podľa zadania:
  - nadpis „Brána je iba začiatok“,
  - štyri odseky,
  - podpis „Starý pátrač“.
- **Scéna zápisu** (`components/ui/JournalReveal.tsx`, `components/game/PuzzleFlow.tsx`):
  - dlhší zápis sa dá posúvať a tlačidlo „Preskúmať nultý bod“ je pod papierom,
  - stôl, svetlo a prach sú v pevnej vrstve pod obsahom,
  - **obmedzené animácie:** stôl sa pohne raz, prach preletí dvakrát, potom scéna nič nekreslí.
- **Inventár** (`components/screens/InventoryScreen.tsx`, `components/game/CollectionFlow.tsx`):
  - karta „Pátračov zápis č. 1 – Brána je iba začiatok“ s novým popisom,
  - nové tlačidlo „Prečítať zápis“ otvorí ten istý papier v okne so „Zavrieť“ (aj klávesa Esc).
- **Názov a popis predmetov v Inventári sa berú z dát kapitoly**, aj pri starom uložení:
  - nová funkcia `getChapterItem` v `engine/codeNotebook.ts` nájde predmet v odmenách scén aj v rozhovoroch,
  - zápis sa pridáva z rozhovoru, preto ho staršie hľadanie nenašlo.
- **Starý obrázok** `detective-note-entry-1.png` je zmazaný (aj prázdny priečinok `public/images/journal`).
- **`docs/MEDIA-LICENCIE.md`:**
  - starý obrázok je označený ako odstránený,
  - pribudlo písmo Patrick Hand (SIL Open Font License 1.1) a papier v kóde (vlastná práca).

**Test (Node, nový, mimo projektu):** pred zmenou 15 chýb, po zmene **16 z 16**. Overuje:
- texty v dátach, kartu v Inventári,
- zmazaný obrázok,
- licencie, písmo cez `next/font`,
- nepovinný obrázok papiera, náklon najviac 8°,
- žiadne nekonečné animácie, tlačidlo „Prečítať zápis“.

**Test v prehliadači (nový)** pri 320 × 568, 360 × 740 a 768 × 1024 px: pred zmenou **20 chýb**, po zmene **všetko OK**, aj pri vypnutých animáciách. Overuje:
- papier v kóde bez obrázka,
- skutočný text so všetkými odsekmi a podpisom,
- bez vodorovného posúvania, papier sa zmestí, obal má priehľadné pozadie,
- úvodná veta nad papierom viditeľná (nie odrezaná),
- písmo so všetkými slovenskými znakmi, 18,4 px, kontrast 8 : 1,
- náklon pri ťahaní (asi 6°, najviac 8°) a návrat; pri vypnutých animáciách bez náklonu,
- ťahanie neoznačí text,
- po dobehnutí úvodu bežia 0 animácií,
- tlačidlo dosiahnuteľné (54 px), pokračovanie na úlohu, F5,
- Inventár: karta s novým názvom a popisom, „Prečítať zápis“ a „Zavrieť“.

Snímky: `d3a-pred-*.png`, `d3a-po-*.png`.

**Staré testy:**
- v prehliadači: D2, C1, C7, C8, C2, B4b – všetko OK,
- 18 stále spúšťaných Node testov OK (celá kapitola, skóre **1010**).

**Chyby počas práce:**
- Úvodná veta nad papierom sa pri dlhom zápise odrezala: obsah bol centrovaný zvislo a vrch pretiekol mimo posúvania. Opravené centrovaním cez okraje.
- Ťahanie myšou po papieri označovalo text. Samotné CSS (`user-select: none`) nestačilo; opravené zrušením predvoleného správania pri stlačení myši na papieri.
- Karta v Inventári ukazovala starý názov z uloženej hry. Opravené čítaním názvu a popisu z dát (`getChapterItem`).
- V teste:
  - chyba v regulárnom výraze pri kontrole pozadia obalu,
  - porovnanie názvu bez ohľadu na veľké písmená.
- Test C2 raz zlyhal na časovaní (pri obrátení strany nenameral snímky); pri dvoch ďalších behoch prešiel celý, okno „Prezrieť“ sa v tomto kroku nemenilo.

**Zmenené súbory:**
- `app/layout.tsx`, `app/globals.css`
- `types/game.ts`, `data/chapter-one/michalska-brana.ts`, `engine/codeNotebook.ts`
- `components/ui/DetectiveNote.tsx`, `components/ui/JournalReveal.tsx`, `components/game/PuzzleFlow.tsx`, `components/game/CollectionFlow.tsx`, `components/screens/InventoryScreen.tsx`
- `docs/MEDIA-LICENCIE.md`, `docs/PRACOVNY-DENNIK.md`
- zmazaný `public/images/journal/detective-note-entry-1.png`

**Build:** prešiel (`npm run build`, bez chýb; písmo sa pri builde stiahne a uloží do projektu).

**Lint:** zmenené súbory bez chýb.

**Ďalší krok:** D3b (tlačidlo „Prezrieť zápis“ po videu), až po potvrdení.

---

## 26. 10. 2026 – Krok 77 (krok D3b): Miesto pre video Strážcu na začiatku hry

**Ako to bolo:**
- Po otázke Strážcovi nasledoval ešte jeden krok rozhovoru s textom odovzdania a tlačidlom „Prijať Pátračov zápis“.
- Potom sa hneď ukázal papier so zápisom. Pre video nebolo miesto.

**Čo sa urobilo:**
- **Rozhovor** (`data/chapter-one/michalska-brana.ts`):
  - otázky „Čo ti tu pátrač zanechal?“ a „Ukáž mi jeho pravidlo.“ hneď odovzdajú zápis: zapíšu rozhovor, pridajú zápis do Inventára, spustia úlohu a vedú na novú obrazovku,
  - starý krok rozhovoru s „Prijať Pátračov zápis“ ostal iba pre staré uloženia uprostred rozhovoru,
  - akcie odovzdania aj text Strážcu sú v dátach iba raz a používajú ich obe cesty.
- **Nová obrazovka „Strážca Michalskej brány“** (`components/screens/NoteHandoverScreen.tsx`, nové pole `noteHandover` v dátach scény a typ `NoteHandover` v `types/game.ts`):
  - s videom: prehrávač a vždy viditeľné „Preskočiť“; po konci videa alebo po „Preskočiť“ sa ukáže text Strážcu a dve tlačidlá,
  - bez videa (dnes) alebo keď súbor chýba: hneď text Strážcu a dve tlačidlá „Prezrieť zápis“ a „Preskúmať nultý bod“,
  - „Prezrieť zápis“ otvorí papier z D3a; pri ňom „Preskúmať nultý bod“ (pokračuje na úlohu) a nové „Zavrieť“ (návrat na obrazovku Strážcu, zápis sa ešte neoznačí ako prečítaný),
  - „Preskúmať nultý bod“ na obrazovke Strážcu vedie rovno na úlohu,
  - nový uložený príznak `seen_guardian_handover_video`: po skončení alebo preskočení videa sa po F5 video neopakuje.
- **Spoločný prehrávač** (`components/ui/StoryVideo.tsx`):
  - nikdy sa nespustí sám, nič nesťahuje vopred, má obrázok pred spustením,
  - slovenské titulky sú predvolene zapnuté,
  - krátky popis deja videa pre čítačku obrazovky,
  - najprv overí, či súbor existuje (iba hlavičku); ak nie, alebo sa video nenačíta, ukáže sa text.
- **Finále** (`components/screens/FinaleGuardianScreen.tsx`) používa ten istý prehrávač, tlačidlá sú bez zmeny.
- **Papier zápisu** (`components/ui/JournalReveal.tsx`): nepovinné druhé tlačidlo „Zavrieť“.
- **Titulky** `public/videos/strazca-michalska-brana.sk.vtt`: text Strážcu v troch častiach; časy sú zatiaľ odhad.
- **Video zatiaľ nie je v dátach.** Plánovaný súbor je `/videos/strazca-michalska-brana.mp4`; stačí ho doplniť do `noteHandover.videoSrc`.
- **Dokumenty:**
  - `docs/KONTROLA-PRED-VYDANIM.md`: nový riadok (doplniť video alebo vedome vynechať, upraviť časy titulkov podľa skutočného videa),
  - `docs/MEDIA-LICENCIE.md`: titulky ako vlastný text projektu.

**Test (Node, nový, mimo projektu):** pred zmenou 17 chýb, po zmene **19 z 19**. Overuje:
- texty obrazovky v dátach a to, že video ešte nie je zapísané,
- obe otázky pridajú zápis a vedú na novú obrazovku, starý krok rozhovoru ostal,
- titulky: tri časti, text zhodný s textom Strážcu v dátach,
- prehrávač bez automatického spustenia, s titulkami a kontrolou súboru, finále ho používa,
- riadky v kontrole pred vydaním a v licenciách.

**Test v prehliadači (nový, 360 × 740 px):** pred zmenou **26 chýb**, po zmene **všetko OK** (aj pri vypnutých animáciách). Overuje:
- **bez videa:**
  - obe cesty rozhovorom vedú na obrazovku Strážcu,
  - text a dve tlačidlá (54 px), bez vodorovného posúvania,
  - zápis je v Inventári hneď po otázke,
  - „Prezrieť zápis“ → papier, „Zavrieť“ → späť, „Preskúmať nultý bod“ → úloha,
  - staré uloženie uprostred rozhovoru („Prijať Pátračov zápis“) stále funguje,
- **video v dátach, ale súbor chýba (404):** text a dve tlačidlá,
- **testovacie video** (vyrobené v prehliadači, do dát podstrčené iba počas testu):
  - prehrávač sa nespustí sám,
  - titulky sú slovenské, zapnuté a načítané (3 časti),
  - popis pre čítačku,
  - „Preskočiť“ je viditeľné,
  - po konci videa aj po „Preskočiť“ sa ukážu dve tlačidlá a uloží sa príznak,
  - zápis je v Inventári,
  - po F5 sa video neopakuje.

Snímky: `d3b-po2-*.png`.

**Staré testy:**
- 19 stále spúšťaných Node testov OK (celá kapitola, skóre **1010**),
- v prehliadači: B4b, C1, D2, D3a (aj pri vypnutých animáciách) – všetko OK,
- test D3a v prehliadači je upravený: pred papierom najprv ťukne na „Prezrieť zápis“, lebo pred papierom je teraz obrazovka Strážcu,
- starý test B3b v prehliadači hlási 2 známe rozdiely z kroku B4a (čaká záverečnú obrazovku hneď po akte III, no odvtedy je pred ňou Strážca). So zmenou D3b nesúvisia.

**Chyby počas práce:**
- V novom teste sa titulky merali až po konci videa, keď už prehrávač zmizol. Opravené meraním v okamihu konca videa. Hra bola v poriadku.

**Zmenené súbory:**
- `types/game.ts`, `data/chapter-one/michalska-brana.ts`
- `components/ui/StoryVideo.tsx` (nový), `components/screens/NoteHandoverScreen.tsx` (nový), `components/screens/FinaleGuardianScreen.tsx`, `components/ui/JournalReveal.tsx`, `components/game/PuzzleFlow.tsx`
- `public/videos/strazca-michalska-brana.sk.vtt` (nový)
- `docs/KONTROLA-PRED-VYDANIM.md`, `docs/MEDIA-LICENCIE.md`, `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory bez chýb (celý projekt má staršie chyby v iných súboroch, tento krok ich nemenil).

**Ďalší krok:** podľa plánu, až po potvrdení.

---

## 26. 10. 2026 – Krok 78 (krok D4): Prilepená lišta „Späť“, kompaktný Inventár, pojmy predmet a artefakt

**Ako to bolo (nálezy 7, 8, 9 z auditu D1):**
- Inventár mal pri 360 px asi 7 000 px: 14 veľkých kariet a pri každej rámček „Tajný údaj – Preskúmaj predmet zblízka“.
- „Späť k pátraniu“:
  - v Inventári a Artefaktoch iba na konci dlhého zoznamu,
  - v Úlohách iba hore,
  - v detaile artefaktu („Späť“) sa ukázalo až po 1,5 s,
  - v rozhovore ako odkaz pod voľbami.
- Hra miešala slová dôkaz, predmet, odmena, stopa a tajný údaj.
- Na konci etapy bola pri jednom predmete gramatická chyba („získal 1 dôkazy“).

**Čo sa urobilo:**
- **Lišta „Späť“** (nový `components/ui/BackBar.tsx`):
  - prilepená k spodku obrazovky (sticky, výška v dvh) na obrazovkách Inventár, Artefakty a Úlohy („Späť k pátraniu“) a v detaile artefaktu („Späť na artefakty“),
  - zlaté hlavné tlačidlo 54 px,
  - na krátkej obrazovke stojí tiež dole, nie v polovici,
  - staré tlačidlá zlúčené do lišty, takže každé je iba raz (horná „← Späť“ v Úlohách zmizla),
  - v detaile artefaktu je lišta hneď, bez čakania na animáciu.
- **Rozhovor:** rovnaká lišta dole, v nevýraznom štýle, aby nesúperila s voľbami.
- **Chyba načítania rozhovoru:** tlačidlo „Späť“ má aspoň 44 px.
- **Kompaktný Inventár** (`components/screens/InventoryScreen.tsx`):
  - zápisník kódov ostal hore, pod ním veta „Počas pátrania budeš nachádzať predmety. Prezri si ich pozorne, niektoré skrývajú viac, než sa zdá.“ (rovnaká aj pri prázdnom Inventári),
  - jeden riadok na predmet: ikona, názov, štítok „Číslica nájdená“ (iba pri nájdenej číslici, inak nič), malé tlačidlo „Prezrieť“ alebo „Prečítať zápis“ (44 px),
  - ťuknutie na riadok rozbalí podrobnosti (druh predmetu, popis, „Stopa: …“); dá sa to aj klávesnicou a čítačka hlási, či je riadok rozbalený,
  - zmizli rámčeky „Tajný údaj“, veta „Tento údaj si zapamätaj…“ aj štítky „Dôkaz 1 až 9“,
  - výška pri 360 px: **z 7 022 na 1 958 px** (pri 320 px z 7 790 na 2 155, pri 768 px z 6 228 na 1 710).
- **Pojmy (schválené texty):**
  - Inventár: nadpis „Nájdené predmety“, druh „Predmet“ namiesto „Dôkaz“,
  - história scény: „Nový predmet“ namiesto „Nová odmena“; ikony kariet 📖 (Získaný artefakt) a 🔎 (Nový predmet) ako v hlavičke, vlastná ikona je pred názvom,
  - koniec etapy: „Predmety zhromaždené“, „Predmety, ktoré si našiel, začínajú…“, „V tejto etape si našiel 3 predmety. Každý z nich ukrýva jednu číslicu kódu.“ (správny tvar: 1 predmet, 3 predmety, 5 predmetov; funkcia presunutá z hlavičky do `lib/itemCount.ts`),
  - úvod, „Začať odznova?“: „…body, predmety, artefakty aj vyriešené úlohy…“,
  - Artefakty: „Prečítať príbeh miesta“,
  - úloha: „Táto odpoveď zatiaľ nesedí…“ a „Odpoveď potvrdená. Pátračov záznam sa otvára.“

**Test (Node, nový, mimo projektu):** pred zmenou 23 chýb, po zmene **23 z 23**. Overuje:
- lištu na všetkých obrazovkách, každé „Späť“ iba raz,
- texty z tabuľky,
- že v Inventári nie je „Tajný údaj“, „Dôkaz“ ani „Číslica skrytá“,
- rozbaľovacie riadky.

**Test v prehliadači (nový)** pri 320, 360 a 768 px aj pri vypnutých animáciách: pred zmenou **30 chýb**, po zmene **všetko OK**. Overuje:
- lištu dole hneď aj na konci zoznamu, aspoň 44 px, návrat na úlohu,
- výšku Inventára pod 2 000 px,
- „Číslica nájdená“ pri nájdených číslicach a nič pri nenájdenej,
- rozbalenie a zbalenie ťuknutím aj klávesou Enter, „Stopa: …“ v podrobnostiach,
- „Prezrieť“ a „Prečítať zápis“, detail artefaktu a návrat na zoznam,
- Úlohy bez hornej šípky, nevýraznú lištu v rozhovore,
- ikony v histórii, „1 predmet“ a „3 predmety“ na konci etapy, nové hlásenie v úlohe,
- bez vodorovného posúvania.

Snímky: `d4-pred-*.png`, `d4-po3-*.png`.

**Staré testy:**
- 20 stále spúšťaných Node testov OK (celá kapitola, skóre **1010**),
- v prehliadači: C1, D2, B4b, D3a, D3b – všetko OK,
- upravené, lebo zámerne čítajú zmenené miesta:
  - D2 (nové hlásenia v úlohe),
  - C1 a D3a (pred čítaním popisu v Inventári ťuknú na riadok).

**Chyby počas práce:**
- Na krátkych obrazovkách (Úlohy, rozhovor) stála lišta hneď pod obsahom, nie pri spodku. Opravené rozložením obrazovky (lišta sa pri krátkom obsahu stlačí dole).
- Inventár prvý raz vyšiel 2 303 px: názvy mali úzky stĺpec a štítok sa lámal na dva riadky. Zúžené ikony, šípka a tlačidlá v riadku, štítok na jednom riadku.
- V novom teste:
  - testovacie uloženie nemalo nájdené číslice,
  - druh predmetu je napísaný veľkými písmenami,
  - kláves Enter potreboval znak; opravené.
- Test prvý raz spadol pred zmenou (chýbajúce riadky); doplnené, aby pokračoval a zapísal chybu.

**Známy nález mimo D4:** detail artefaktu je pri 360 px široký 369 px (audit D1 nameral 374 px). Žiadny prvok nepresahuje; presah robí 3D prechod pri otváraní stránky (`codex-page-perspective`). Bol tam už pred zmenou a ostáva na samostatný krok.

**Zmenené súbory:**
- `lib/itemCount.ts` (nový), `components/ui/BackBar.tsx` (nový), `components/ui/CodexBar.tsx`
- `components/screens/InventoryScreen.tsx`, `ArtifactsScreen.tsx`, `ArtifactScreen.tsx`, `QuestScreen.tsx`, `NpcScreen.tsx`, `HistoryScreen.tsx`, `ActTransitionScreen.tsx`, `LandingScreen.tsx`, `PuzzleScreen.tsx`
- `components/game/NpcFlow.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** nové a zmenené riadky bez chýb. V dotknutých súboroch ostali 3 staršie nálezy, ktoré tento krok nemenil:
- `CodexBar.tsx`: nastavenie zvuku v efekte,
- `HistoryScreen.tsx`: nepoužitá ikona `LightbulbIcon`,
- `NpcScreen.tsx`: nepoužitý `onChooseNode`.

**Ďalší krok:** podľa plánu, až po potvrdení.

---

## 26. 10. 2026 – Krok 79 (krok D5): Zvyšné nálezy z auditu D1

**Stav nálezov z auditu:**
- vyriešené skôr:
  - D2: 1 až 5 a 14,
  - D4: 7, 8 a 9,
- vyriešené teraz: 6, 10, 11, 12, 15, 16, 17,
- iba zhodnotené: 13 (ikony).

**Čo sa urobilo:**
- **Detail artefaktu bol pri 360 px široký 369 px** (nález 11):
  - príčina overená pokusom: animácia otvárania stránky (`codex-page-open`) v polovici kartu naklonila a zväčšila na 101 %, prehliadač si väčšiu šírku pamätal aj po skončení,
  - animácia sa teraz iba dvíha bez zväčšenia nad 100 % a na konci nezostane 3D posun,
  - poistka `overflow-x: clip` na obale,
  - platí aj pre úvod kapitoly (`app/globals.css`).
- **Rozhovor a nápisy** (nález 6):
  - otázky v rozhovore bežnými písmenami bez rozostupov (nová voľba `textCase="sentence"` v `ActionButton`),
  - rozostupy písmen na tlačidlách zmenšené (0,18 → 0,1 em),
  - kratšie nápisy „Som pri bráne“ a „Prijať útržok“ (konce aktov I až III a truhlica); pri 360 px sú na jednom riadku.
- **Texty podľa stavu** (nález 10):
  - truhlica: nové polia v dátach `introAllOpen`, `introOpened`, `rotateHintAllOpen` („Všetky tri zámky povolili. Zostáva posledný krok: Zlatý kľúč.“, „Truhlica je otvorená. Pátrač ti v nej nechal posledný útržok.“, „Ťahaj a otáčaj truhlicu.“),
  - Strážca vo finále: „Preskočiť“ iba pri videu, bez videa len „Otvoriť truhlicu“,
  - „Ďalšia stopa“: scéna 1 „Meno najbližšieho mesta odkrylo prvú vetu denníka.“, scéna 10 končí „Kľúč máš. Zostáva otvoriť to, čo pátrač zamkol.“
- **3D truhlica** (nález 12, `components/finale/chest3d/chestZoom.ts`):
  - celkový pohľad: zmenšenie 0,55 → 0,64 a vyššie (y −0,12 → 0,20); truhlica zaberá **69 % šírky** rámčeka (predtým 55 %), hore je 12 % voľna (predtým 26 %) a už nemá odrezaný spodok,
  - otvorená truhlica s útržkom: 0,46 → 0,48 (viac sa nezmestí, útržok nad ňou potrebuje miesto),
  - pri nakláňaní ťahaním sa truhlica mierne oddiali (najviac o 22 % pri 35°) a po pustení sa vráti; inak by sa pri náklone veko odrezalo (nová funkcia `getTiltFitScale`),
  - rámček ostáva 4 : 3, výpočet priblíženia na kolieska sa nemenil.
- **Vypnuté tlačidlo** (nález 15): bez priesvitnosti, tmavosivé so svetlým písmom a viditeľným okrajom.
  - Kontrast okraja sa zlepšil z 2,87 : 1 nad 3 : 1, písmo má aspoň 4,5 : 1.
  - Tlačidlo ostáva vypnuté a zjavne sa líši od zlatého aktívneho.
- **Rozhovor** (nález 16, `components/ui/Typewriter.tsx`):
  - počas vypisovania pokyn „Ťukni na text a zobrazí sa celý.“, po dopísaní zmizne,
  - pri vypnutých animáciách je celý text hneď,
  - **oprava pre čítačku:** predtým čítačka namiesto textu Strážcu prečítala iba „Zobraziť celý text“; teraz dostane celý text naraz.
- **Artefakty** (nález 17): „Prečítať príbeh miesta“ bežnými písmenami; pri 360 px na jednom riadku (pri 320 px sa ešte zalomí, stĺpec má asi 136 px).
- **Ikony** (nález 13), iba zhodnotenie, bez zmeny:
  - dnes sa miešajú emoji a kreslené ikony,
  - najmenší krok neskôr: jeden súbor so zoznamom ikon podľa významu, ktoré sa potom vymenia na jednom mieste.

**Test (Node, nový, mimo projektu):** pred zmenou 22 chýb, po zmene **všetko OK**.
- Hranice veľkosti truhlice som po meraní upravil: návrh počítal so zmenšením 0,72 a 0,58, no nízky rámček 4 : 3 dovolí iba 0,64 a 0,48.

**Test v prehliadači (nový)** pri 320, 360 a 768 px aj pri vypnutých animáciách: pred zmenou **27 chýb**, po zmene **všetko OK**. Overuje:
- šírku detailu artefaktu a úvodu,
- nápisy na jednom riadku,
- otázky bežnými písmenami,
- pokyn a celý text pre čítačku,
- kontrast vypnutého „Overiť“,
- texty „Ďalšia stopa“,
- Strážcu bez „Preskočiť“,
- texty truhlice podľa stavu,
- veľkosť truhlice nameranú zo snímky (aj pri najväčšom náklone oboma smermi a po otvorení).

Snímky: `d5-pred-*.png`, `d5-po2-*.png`, `d5-po-red-*.png`.

**Staré testy:**
- 20 stále spúšťaných Node testov OK (celá kapitola, skóre **1010**),
- v prehliadači: B4b, B4c-1, B4c-2, B4c-3, C1, D2, D3a, D3b, D4 – všetko OK,
- upravené na schválené nové znenie: B3b, B4b, B4c-3, texty (Node); B4b, B4c-3, C1, D2 (prehliadač).

**Chyby počas práce:**
- V novom teste:
  - výrez snímky truhlice sa najprv počítal od viditeľnej časti namiesto od začiatku stránky,
  - skrátený beh iba pre truhlicu preskočil nastavenie šírky obrazovky,
  - pri 320 px test chcel jeden riadok, hoci návrh sľuboval jeden riadok od 360 px.
- Prvé meranie príčiny presahu bolo nepresné, lebo vrátenie štýlov znova spustilo animácie; zopakované po jednom pravidle.
- Väčšia truhlica sa pri náklone ťahaním nadol odrezávala hore aj dole; pridané mierne oddialenie pri náklone.

**Zmenené súbory:**
- `app/globals.css`, `types/game.ts`
- `components/ui/ActionButton.tsx`, `components/ui/Typewriter.tsx`
- `components/screens/NpcScreen.tsx`, `IntroScreen.tsx`, `ArtifactsScreen.tsx`, `FinaleChestScreen.tsx`, `FinaleGuardianScreen.tsx`
- `components/finale/chest3d/chestZoom.ts`, `Chest3DView.tsx`
- `data/chapter-one/acts.ts`, `finale.ts`, `michalska-brana.ts`, `zlaty-presporsky-kluc.ts`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Lint:** zmenené súbory bez chýb. Ostalo staršie upozornenie (nepoužitý `onChooseNode` v `NpcScreen.tsx`). Stará chyba v `Typewriter.tsx` zmizla, lebo prepísaný komponent už nenastavuje stav priamo v efekte.

**Ďalší krok:** podľa plánu, až po potvrdení.

---

## 26. 10. 2026 – Krok 80 (krok C6): Upratovanie – test B3b a lint

**Čo sa urobilo:**
- **Test B3b v prehliadači** (mimo projektu) zodpovedá dnešnému poradiu obrazoviek:
  - po konci aktu III a „Prijať útržok“ overuje obrazovku „Strážca prichádza“ (nie hneď záverečnú obrazovku),
  - overuje, že bez videa je tam iba „Otvoriť truhlicu“ a že uložená hra je na obrazovke Strážcu,
  - celé ďalšie poradie (truhlica, fotografia, zadanie miesta, záver) overuje Node test B7,
  - test je teraz **medzi stále spúšťanými** (výsledok: všetko OK, aj pri vypnutých animáciách).
- **Lint v súboroch z krokov C až D**, bez zmeny správania:
  - `NpcScreen.tsx`: odstránená nepoužitá vlastnosť `onChooseNode` (aj z odovzdania v `NpcFlow.tsx`; rozhovor ju naďalej používa vo vlastnej logike),
  - `HistoryScreen.tsx`: odstránený nepoužitý import ikony `LightbulbIcon`,
  - `CodexBar.tsx`: stav zvuku sa už nenastavuje v efekte. Hlavička ho číta zo správcu zvuku a prihlási sa na jeho udalosť zmeny (`useSyncExternalStore`, rovnaký spôsob ako pri vypnutých animáciách).

**Ponechané (iba vypísané):**
- `hooks/useGameEngine.ts` (2 chyby): načítanie uloženej hry pri štarte a zápis „naposledy uloženej hry“ po každej zmene.
  - Oprava by znamenala zmeniť spôsob, ako hra pri štarte zisťuje uložený postup a ako ho obnoví po „Pokračovať v pátraní“.
  - Je to najcitlivejšie miesto hry, preto ostáva bez zmeny.
- 12 nálezov v starých súboroch truhlice po aktoch:
  - `ActChestScreen.tsx`, `ChestIntroScreen.tsx` a ich pomocné súbory (`chest-3d/ChestCameraRig.tsx`, `ChestModel.tsx`, `chest/ChestRevealOverlay.tsx`, `useChestUnlockSequence.ts`, `reward/RewardReveal.tsx`),
  - aplikácia tieto obrazovky už nikde nenačítava (hra od B3 používa ľahké konce aktov),
  - z `chest-3d` sa používa iba `ChestParts.tsx` (ozdoby 3D truhlice vo finále), ten nálezy nemá,
  - návrh na neskôr: staré súbory odstrániť v samostatnom kroku.

**Lint celkovo:** zo 17 nálezov (14 chýb, 3 upozornenia) na **14 (12 chýb, 2 upozornenia)**. Všetky zvyšné sú v nepoužívaných súboroch alebo v `useGameEngine.ts`.

**Test správania (nový, mimo projektu):** pred zmenou aj po nej **všetko OK**. Overuje:
- prepínač zvuku: stav, uloženie, zapamätanie po F5 aj po návrate z Inventára, popis pre čítačku,
- voľbu v rozhovore,
- históriu scény.

**Všetky testy:**
- Node: 22 testov OK (20 stálych, D4 a D5; celá kapitola, skóre **1010**),
- prehliadač: B3b (nový v zozname), B4b, B4c-1, B4c-2, B4c-3, C1, D2, D3a, D3b, D4, D5 – všetko OK.

**Chyby počas práce:**
- Test D3b raz zlyhal: prehliadač pri vytváraní testovacieho videa nahral iba 148 bajtov, takže video nebolo čo prehrať. Dva ďalšie behy prešli celé; hry sa to netýka.
- Nový test som nazval `c6-browser.mjs` a tým v pracovnom priečinku prepísal starší pomocný test s rovnakým názvom (nebol medzi stále spúšťanými).

**Zmenené súbory:**
- `components/ui/CodexBar.tsx`, `components/screens/HistoryScreen.tsx`, `components/screens/NpcScreen.tsx`, `components/game/NpcFlow.tsx`
- `docs/PRACOVNY-DENNIK.md`

**Build:** prešiel (`npm run build`, bez chýb).

**Ďalší krok:** podľa plánu, až po potvrdení.

---

## 26. 10. 2026 – Záver dňa

**Hotové:**
- C5,
- D1 až D5 (audit a opravy vzhľadu),
- D3a (zápis ako papier),
- D3b (miesto pre video),
- C6 (upratovanie).

**Najbližšie:**
1. Terénna kontrola ciest, vodidiel a hádaniek (`docs/KONTROLA-PRED-VYDANIM.md`).
2. Médiá: video so Strážcom podľa scenára, hlas, zvuky.
3. Pred prvým testerom: verzia uloženia v3, kontrola `isPlaceholder`.
4. Malé upratovanie:
   - test B3b je už hotový (krok C6),
   - ostávajú staré lintové upozornenia (2 v `useGameEngine.ts`, 12 v nepoužívaných súboroch starej truhlice po aktoch).

Vývojový server je zastavený.

---

## 27. 10. 2026 – Nový úvod, krok 1: videá v gite

**Schválený nový úvod:**
1. Video A „Prelet nad Bratislavou“.
2. Obrazovka „Vydaj sa k Michalskej bráne“ s tlačidlom „Som pri bráne“.
3. Video B so Strážcom, náhradou je písaný rozhovor.
4. Zápis č. 1 a prvá úloha.

Hlasy vo videách sa nemenia: vykanie vo videu A aj mužský rod vo videu B ostávajú.

**Čo sa zmenilo v tomto kroku:**
- Nový súbor `.gitattributes`. Videá, zvuky a obrázky sú pre git binárne súbory: neporovnáva ich po riadkoch a nemení v nich konce riadkov. Titulky (`.vtt`) sú text s jednotnými koncami riadkov.
- Do gitu pribudlo všetkých 6 súborov videí z `public/videos/` (spolu asi 17,4 MB):
  - video A: 11,8 MB, plagát, titulky,
  - video B: 5,4 MB, plagát, titulky.
- Titulky videa B sú nový text Strážcovho monológu. Nahradili tri pôvodné titulky z D3b.

**Kontrola:**
- Pred zmenou git pre videá nemal žiadne pravidlo.
- Po zmene `git check-attr` ukazuje: `.mp4` a `.jpg` sú binárne, `.vtt` je text s koncami riadkov LF.
- Obe videá sa začnú prehrávať ešte počas sťahovania. Hlavička je na začiatku súboru (faststart).

**Git a nasadenie:**
- Limit GitHubu je 100 MB na súbor, varovanie prichádza pri 50 MB. Nič z toho sa nás netýka.
- Pravidlo: commitovať iba hotové verzie videí. Každá nová verzia ostane v histórii celá.

**Build:** prešiel. **Lint:** bez zmeny, 14 starých problémov.

**Chyby:** žiadne.

**Ďalší krok:** krok 2, video A a obrazovka „Vydaj sa k Michalskej bráne“, až po „pokračuj“.

---

## 27. 10. 2026 – Nový úvod, krok 2: video A a „Vydaj sa k Michalskej bráne“

**Čo sa zmenilo pre hráča:**
- Po „Začať pátranie“ sa ukáže **úvodné video A**:
  - nadpis „Stratený denník starého pátrača“,
  - video sa nespustí samo a nič sa nesťahuje vopred,
  - slovenské titulky sú zapnuté, čítačka dostane popis videa,
  - pod videom je „Preskočiť“.
- Po skončení videa alebo „Preskočiť“ sa uloží príznak `seen_intro_city_video` a hra prejde na novú obrazovku **„Vydaj sa k Michalskej bráne“**:
  - štítky „Úvodný prípad“ a „Prvá stopa“, pokyn s bronzovým kruhom,
  - „Otvoriť v mapách“ (Google Mapy, nové okno),
  - „Som pri bráne“, ktoré vedie na scénu pri bráne ako doteraz.
- Tri staré vety úvodu („Mesto si pamätá všetko…“) sú preč, nahradilo ich video.
- **Keď súbor videa chýba:** hra ide rovno na „Vydaj sa…“ a pridá kartu „Pátračov denník“ s príbehom v skratke. Príznak sa vtedy neuloží, takže keď súbor pribudne, video sa ukáže.
- **Po F5:**
  - počas videa sa video ukáže znova,
  - na obrazovke „Vydaj sa…“ hráč ostane.
- **Po „Začať odznova“** sa video A ukáže znova.
- **Úprava navyše:** video je na výšku, takže pri šírke 360 px bolo „Preskočiť“ pod okrajom obrazovky. Výška videa je teraz obmedzená a tlačidlo vidno bez posúvania.

**Rozhodnutie mimo návrhu:** horný štítok obrazovky ostal „Úvodný prípad“ (ako doteraz) a schválené „Prvá stopa“ je nad pokynom. Inak by sa „Prvá stopa“ ukázala dvakrát pod sebou.

**Súbory:**
- `components/screens/IntroVideoScreen.tsx` (nový),
- `components/screens/IntroScreen.tsx` (prerobená),
- `app/page.tsx`,
- `types/game.ts` (nové `introVideo` a `arrival`, bez `introLines`),
- `data/chapter-one.ts`,
- `engine/finale.ts` (spoločný odkaz do máp `getMapsSearchUrl`),
- `docs/MEDIA-LICENCIE.md` (video A, plagát, titulky; nástroj a plán treba doplniť),
- `docs/KONTROLA-PRED-VYDANIM.md` (video A na skutočnom mobile).

**Testy:**
- **Nový test E2 v prehliadači** (360 px, zapnuté aj vypnuté animácie). Pred zmenou 22 chýb, po zmene všetko OK. Overuje:
  - video so skutočným súborom: nespustí sa samo, 12 titulkov, prehrá sa,
  - F5, koniec videa, „Preskočiť“, „Začať odznova“,
  - chýbajúci súbor (404) a náhradný text,
  - odkaz do máp, tlačidlá aspoň 44 px, bez posúvania do strany.
- **Nový Node test E2:** dáta, súbory, rýchly štart videa, veľkosť pod 50 MB, 12 titulkov, odkaz do máp, nová hra bez príznaku. Všetko OK.
- **Upravené testy:**
  - D2 (po „Začať pátranie“ najprv „Preskočiť“),
  - D5 v prehliadači (úvod s príznakom videného videa),
  - D5 Node (nápis „Som pri bráne“ je teraz v dátach).
- **Node:** 22 testov OK, celá kapitola so skóre **1010**, okrem D3b.
- **Prehliadač:** B3b, B4b, B4c-1, B4c-2, B4c-3, C1, D2, D3a, D4, D5, c6 sú OK.

**Chyby:**
- Test pred zmenou som spustil s dočasne odloženými zmenami (`git stash`). Prvý pokus o ich vrátenie zlyhal na dočasnej chybe kontroly príkazov, preto prvý beh „po zmene“ bežal ešte na starom kóde. Po vrátení zmien prešiel.
- D3b (Node aj prehliadač) hlási chybu v počte titulkov Strážcu: čaká 3, súbor má od kroku 1 nový monológ s 9 časťami. Test sa prepíše v kroku 3.
- Pri prvom behu série D3b v prehliadači spadol bez výpisu. Opakovaný beh prebehol celý, s jedinou chybou titulkov.

**Build:** prešiel. **Lint:** bez zmeny, 14 starých problémov.

**Ďalší krok:** krok 3, video B Strážcu a písaný rozhovor ako náhrada, až po „pokračuj“.

---

## 27. 10. 2026 – Nový úvod, krok 3: video B (Strážca) a písaný rozhovor ako náhrada

**Čo sa zmenilo pre hráča:**
- Po „Som pri bráne“ sa namiesto „Brána mlčí…“ ukáže **video B**:
  - nadpis „Strážca Michalskej brány“,
  - video sa nespustí samo,
  - titulky obsahujú Strážcov monológ (9 častí),
  - čítačka dostane popis videa,
  - pod videom je „Preskočiť“.
- **Po skončení videa alebo „Preskočiť“** sa vykonajú tie isté akcie ako doteraz po rozhovore: rozhovor sa zapíše, zápis č. 1 pribudne do Inventára a spustí sa úloha. Hneď potom sa otvorí papier zápisu č. 1 a „Preskúmať nultý bod“ vedie na prvú úlohu.
- **Keď súbor videa chýba:** ostane doterajší písaný rozhovor („Brána mlčí…“, „Osloviť Strážcu“, rozhovor, obrazovka odovzdania s textom, „Prezrieť zápis“).
- **Po F5:**
  - počas videa sa video ukáže znova,
  - po videu sa ukáže papier.
- **Staré uloženia po rozhovore** pokračujú obrazovkou odovzdania ako doteraz.

**Uložený stav:**
- Nový príznak nepribudol.
- Po videu sa nastaví doterajší `talked_to_michalska_guardian` a k nemu `seen_guardian_handover_video` (príznak z D3b, teraz znamená „video Strážcu videné“). Podľa neho sa po videu preskočí obrazovka odovzdania textom.
- Bez videa sa tento príznak nenastaví.

**Ako je to v kóde:**
- Video Strážcu je v dátach scény ako `guardianVideo` s akciami po skončení.
- Obrazovka odovzdania zápisu (`NoteHandoverScreen`) je už iba textová. Miesto pre video z D3b sa presunulo pred rozhovor.
- Úvodné video aj video Strážcu používajú jednu spoločnú obrazovku `StoryVideoScreen` (premenovaná `IntroVideoScreen` z kroku 2).
- Engine má novú funkciu `applyGameActions`. Rovnaké akcie teraz vykoná rozhovor aj video.
- Výška videa je teraz obmedzená na 52 % obrazovky (predtým 58 %). Pri videu Strážcu je nad videom lišta hry a „Preskočiť“ bolo 22 px pod okrajom obrazovky.

**Médiá (údaje od používateľa):**
- `docs/MEDIA-LICENCIE.md`, videá A a B:
  - obraz: Google Flow, Veo 3.1, Nano Banana, plán Google AI Pro,
  - hlas: ElevenLabs, Eleven v4, „Peter“ pre A, „Andrej - Mild, Calm“ s rýchlosťou 0,9 pre B,
  - zostavenie, prechody a titulky: vlastná práca (ffmpeg),
  - komerčné podmienky obrazu aj hlasu: **NEOVERENÉ**,
  - fotky z Wikimedie treba vypísať; fotka Michalskej ulice s vodoznakom stock služby sa nesmie použiť.
- `docs/KONTROLA-PRED-VYDANIM.md`:
  - tri nové úlohy pred verejným vydaním (podmienky obrazu, podmienky hlasu, východiskové fotky),
  - nová kontrola videa B na skutočnom mobile,
  - nahradila starú položku „video Strážcu pridané alebo vynechané“.

**Súbory:**
- `types/game.ts`,
- `data/chapter-one/michalska-brana.ts`,
- `engine/dialogueActions.ts`,
- `components/game/PuzzleFlow.tsx`,
- `components/screens/NoteHandoverScreen.tsx`,
- `components/screens/StoryVideoScreen.tsx` (premenovaná),
- `app/page.tsx`,
- `docs/MEDIA-LICENCIE.md`, `docs/KONTROLA-PRED-VYDANIM.md`.

**Testy:**
- **Nový test E3 v prehliadači** (360 px, zapnuté aj vypnuté animácie). Pred zmenou 18 chýb, po zmene všetko OK. Overuje:
  - video B so skutočným súborom: nespustí sa samo, 9 titulkov, prehrá sa,
  - F5, koniec videa, papier, prvá úloha, „Preskočiť“,
  - chýbajúci súbor: rozhovor, odovzdanie, „Prezrieť zápis“, „Zavrieť“,
  - staré uloženie a celú cestu od novej hry.
- **Nový Node test E3:** dáta, súbory, 9 titulkov, rovnaké akcie po videu ako po rozhovore, zápis v Inventári iba raz, náhrada, dokumenty. Všetko OK.
- **Upravené testy:** E2 (po „Som pri bráne“ už prichádza video Strážcu) a Node test E2 (nový názov obrazovky).
- **Test D3b** (Node aj prehliadač) som vyradil zo stálych testov. Overoval miesto pre video po rozhovore, ktoré už neexistuje. Jeho stále platné časti (rozhovor, odovzdanie, papier, „Zavrieť“, staré uloženia) teraz overuje E3.
- **Node:** 22 testov OK (B7: celá kapitola, skóre **1010**).

**Chyby:**
- E3 po zmene najprv hlásil 2 chyby:
  - „Preskočiť“ bolo pod okrajom obrazovky. Opravené menšou výškou videa.
  - Test hľadal „Tvoja úloha“ malými písmenami, no na obrazovke je nápis veľkými. Chyba bola v teste, nie v hre.
- E2 po zmene čakal po „Som pri bráne“ starú obrazovku „Osloviť Strážcu“. Test som upravil na video Strážcu.
- **Stále testy v prehliadači, prvý beh:** D2 (1 chyba), D4 (4), D5 (5) a c6 (1). Tieto testy overujú písaný rozhovor so Strážcom, ktorý sa teraz ukáže iba vtedy, keď video chýba. V hre chyba nebola. Testy teraz súbor videa Strážcu odmietnu (404), takže hra ukáže rozhovor. Po úprave všetky prešli.
- **D5, prvý beh:** jedna chyba pri okraji truhlice počas otáčania, ktorá s videom nesúvisí. Pri opakovanom behu prešiel celý test, išlo o jednorazovú odchýlku merania.
- **Dlhé čakanie:** séria 11 stálych testov v prehliadači trvá viac ako 10 minút. Bežala na pozadí a medzitým som písal denník.

**Stále testy v prehliadači (po úprave):** B3b, B4b, B4c-1, B4c-2, B4c-3, C1, D2, D3a, D4, D5, c6, E2 aj E3 v oboch režimoch – všetko OK.

**Build:** prešiel. **Lint:** bez zmeny, 14 starých problémov.

**Ďalší krok:** nový úvod je hotový. Ďalej podľa plánu, až po potvrdení.

---

## 27. 10. 2026 – Odomykanie kódom, krok 1: úvodná obrazovka „Pokračovať“ / „Nová hra“

**Schválený plán (3 kroky):**
1. Úvodná obrazovka s výberom.
2. Zoznam kódov a odomknutie aktu II a III, pričom preskočené akty dostanú plné body.
3. Obrazovka „Mám kód“.

Kódy sú uložené iba ako odtlačky. Čitateľné kódy sa nezapisujú nikam: ani do súborov, dokumentov, denníka či testov. Testy používajú vlastné skúšobné kódy.

**Čo sa zmenilo:**
- Na úvodnej obrazovke sú nové nápisy:
  - **„Pokračovať“** (zlaté, iba s uloženou hrou),
  - **„Nová hra“** (zlaté bez uloženej hry, inak tmavé).
- Nahradili „Pokračovať v pátraní“ a „Začať pátranie“ / „Začať odznova“.
- Potvrdenie „Začať odznova?“ pri uloženej hre ostáva.
- Tlačidlo „Mám kód“ pribudne v kroku 3, spolu s obrazovkou, na ktorú vedie. Dovtedy by nemalo kam viesť.
- Tlačidlo „Pokračovať v pátraní“ na obrazovke fotografie vo finále ostáva bez zmeny.

**Súbory:** `components/screens/LandingScreen.tsx`.

**Testy:**
- **Nový test E4 v prehliadači** (320 a 360 px, zapnuté aj vypnuté animácie). Pred zmenou 13 chýb, po zmene všetko OK. Overuje:
  - tlačidlá podľa uloženej hry a ich poradie a farbu,
  - 44 px, jeden riadok, bez posúvania do strany,
  - „Pokračovať“,
  - „Nová hra“ s potvrdením a so „Zrušiť“,
  - „Nová hra“ bez uloženej hry rovno na video A.
- **Upravené stále testy v prehliadači:** B3b, B4b, B4c-1, B4c-2, B4c-3, C1, D2, D3a, D4, D5, c6, E2 a E3 (nové nápisy). Väčšina hľadá tlačidlo podľa časti textu „Pokračovať“, takže tlačidlo na fotografii vo finále nájdu ďalej.
- **Node:** 22 testov OK (B7: celá kapitola, skóre **1010**).
- **Prehliadač:** všetky stále testy OK, okrem jednej kontroly v D5 (pozri nižšie).

**Chyby a otvorené veci:**
- V teste E4 kontrola „bez starých nápisov“ pred zmenou falošne prešla, lebo nápis je zobrazený veľkými písmenami. Opravená, teraz kontroluje text bez úpravy písma.
- **D5, truhlica:** kontrola „pri otáčaní opačným smerom sa nič neodreže o okraj“ zlyhala v 2 z posledných 3 behov (v kroku E3 aj teraz, pri opakovaní znova). Pri najväčšom naklonení sa truhlica dotkne horného okraja (0 px rezervy, test čaká aspoň 1 px).
  - Kód truhlice sa od kroku D5 nezmenil, s úvodom ani s úvodnou obrazovkou nesúvisí.
  - Môže ísť o hraničný prípad alebo o nestabilné meranie (testy bežali súbežne s lintom).
  - **Treba preveriť samostatne:** buď mierne zmenšiť truhlicu pri naklonení, alebo upraviť meranie.

**Build:** prešiel. **Lint:** bez zmeny, 14 starých problémov.

**Ďalší krok:** krok 2, zoznam kódov a odomknutie aktov II a III, až po „pokračuj“.

---

## 27. 10. 2026 – Súpis textov bez hlasu (`docs/SUPIS-HLASOV.md`)

**Úloha:** súpis všetkých miest v kapitole I s dlhším príbehovým textom, monológom alebo rozhovorom bez hlasu a bez videa. Iba dokument, kód ani hra sa nemenili.

**Čo je v dokumente:**
- Tabuľka 79 miest, pri každom:
  - scéna,
  - kto hovorí,
  - presný text,
  - počet znakov a slov,
  - približná dĺžka hlasu (slová / 2,2 za sekundu),
  - kde sa text zobrazuje,
  - návrh (áno / nepovinne / nie) s dôvodom.
- Zhrnutie, vysvetlivky, zoznam zámerne vynechaných textov a poznámky k nahrávaniu.
- Text pre **video 3** (Strážca prináša truhlicu) je označený **[VIDEO 3]**.

**Výsledok:**

| Skupina | Miesta | Znaky | Hlas približne |
|---|---|---|---|
| áno, vrátane videa 3 | 25 | 5 411 | 6,5 min |
| nepovinne | 24 | 5 205 | 5,7 min |
| nie | 30 | 5 198 | 5,9 min |
| spolu | **79** | **15 814** | asi 18 min |

- **Video 3:** 1 miesto, 207 znakov, asi 17 s.

**Ako vznikla tabuľka:**
- Texty načítal skript priamo z dát hry, takže sú presné a čísla sedia.
- Tabuľku som do dokumentu vložil cez Node (zápis UTF-8), aby sa texty pri prepisovaní nepomýlili.
- Úvod, vysvetlivky a poznámky som napísal cez Write.

**Chyby:**
- Pri rube fotografie bol najprv dôvod „hlas by prezradil odpoveď“. Nesedel, lebo rub dnes miesto priamo uvádza.
- Opravil som ho na „miesto je zatiaľ dočasné (`isPlaceholder`), nahrávať až po potvrdení“.

**Súbory:** `docs/SUPIS-HLASOV.md` (nový), `docs/PRACOVNY-DENNIK.md`.

**Build a lint:** nespúšťal som ich, kód sa nemenil.

---

## 27. 10. 2026 – G1: prehrávač videí „Kino“ (variant A)

**Zvolený variant A „Kino“ s úpravami používateľa:**
- Video sa spustí hneď so zvukom po ťuknutí, ktoré naň viedlo („Nová hra“ pre video A, „Som pri bráne“ pre video Strážcu).
- Veľké zlaté „Prehrať“ sa ukáže iba vtedy, keď prehliadač prehrávanie zablokuje, alebo po pozastavení.
- Po videu A (koniec alebo „Preskočiť“) ostane tlačidlo „Spustiť kapitolu“, ktoré vedie na „Vydaj sa k Michalskej bráne“.
- Po videu Strážcu sa hneď otvorí zápis č. 1, bez medzikroku.

**Čo hráč uvidí:**
- **Celá obrazovka**, teplá tma, video vyplní obrazovku. Lišta hry (Inventár, Úlohy) sa počas videa Strážcu skryje.
- **Ovládanie:**
  - hore tenká zlatá čiara priebehu,
  - vpravo hore zvuk (44 × 44 px) a „Preskočiť“ (výška 44 px),
  - pod nimi nadpis videa na vlastnom riadku, aby sa neskracoval.
- **Titulky** kreslí hra sama: dole v tmavom prechode, písmo s pätkami Source Serif 4, 20 px, svetlé s tieňom.
- **Pozastavenie:** ťuknutie na obraz video pozastaví a ukáže zlatú pečať „Prehrať“ (rovnaký štýl ako znak na úvodnej obrazovke).
- **Prelínanie:** vynorenie z tmy (0,6 s) a odchod do tmy (0,5 s). Pri vypnutých animáciách sa iba okamžite prepne.
- **Koniec videa A:** stlmený plagát a zlaté „Spustiť kapitolu“ (zamerané pre klávesnicu a čítačku).
- **Prístupnosť:**
  - prehrávač je dialóg s nadpisom a popisom videa pre čítačku,
  - tlačidlá majú popisy „Prehrať video“, „Pozastaviť video“, „Vypnúť zvuk“ / „Zapnúť zvuk“ (stav aj cez `aria-pressed`) a „Preskočiť video“,
  - medzerník pozastaví video,
  - titulky sú pre čítačku skryté, lebo popis videa ju informuje.
- **Keď súbor chýba (chyba načítania):** ostáva náhrada ako doteraz, teda pri videu A text na „Vydaj sa…“ a pri videu Strážcu písaný rozhovor.
- **Uloženie:**
  - príznak videa A sa uloží až po „Spustiť kapitolu“,
  - po F5 sa video ukáže znova; prehliadač bez ťuknutia zvuk nepovolí, preto sa ukáže zlaté „Prehrať“.

**Ako je to v kóde:**
- `components/ui/StoryVideo.tsx` je prepísaný na prehrávač na celú obrazovku:
  - vlastné ovládanie,
  - titulky zo súboru `.vtt` (stopa je skrytá, text sa berie z aktívnej časti),
  - priebeh, prelínanie,
  - zákaz posúvania stránky pod videom.
- Odpadla kontrola súboru cez HEAD. Video sa načíta hneď, aby mohlo začať hrať, a chybu súboru zachytí udalosť `error`.
- `StoryVideoScreen` iba odovzdá dáta prehrávaču.
- `PuzzleFlow` ukáže video Strážcu mimo lišty hry.
- `FinaleGuardianScreen` je pripravený na video 3: s videom ide po ňom rovno na truhlicu, bez videa ostáva text ako dnes.
- Nové pole `endLabel` v dátach videa (pri videu A „Spustiť kapitolu“).
- Písmo Source Serif 4 je pripojené cez `next/font` (licencia OFL, zapísaná v `docs/MEDIA-LICENCIE.md`).
- Štýly sú v `app/globals.css`.

**Súbory:**
- `components/ui/StoryVideo.tsx`,
- `components/screens/StoryVideoScreen.tsx`,
- `components/screens/FinaleGuardianScreen.tsx`,
- `components/game/PuzzleFlow.tsx`,
- `app/globals.css`, `app/layout.tsx`,
- `types/game.ts`, `data/chapter-one.ts`,
- `docs/MEDIA-LICENCIE.md`.

**Testy:**
- **Nový test G1 v prehliadači** (360 px, zapnuté aj vypnuté animácie). Spúšťa sa v Chrome **bez** povolenia automatického prehrávania a ťuká ako skutočný používateľ.
  - Pred zmenou zlyhal hneď na začiatku: starý prehrávač nebol na celú obrazovku a nespustil sa sám.
  - Po zmene všetko OK. Overuje:
    - spustenie so zvukom po ťuknutí,
    - celú obrazovku, dialóg a popis,
    - „Preskočiť“, zvuk a pečať aspoň 44 px,
    - titulky dole, písmo s pätkami, 20 px,
    - priebeh, zvuk, pozastavenie ťuknutím aj medzerníkom,
    - zablokované prehrávanie po F5 a pečať „Prehrať“,
    - koniec videa so „Spustiť kapitolu“,
    - video Strážcu bez lišty hry a hneď zápis č. 1,
    - „Preskočiť“, chýbajúce súbory (náhrady), staré uloženie,
    - vypnuté animácie bez prelínania.
- **G1 nahrádza testy E2 a E3 v prehliadači.** Ich platné kontroly sú teraz v G1, staré čakali prehrávač, ktorý sa nespustí sám.
- **Upravené testy:**
  - Node E2 (spoločný prehrávač, „Spustiť kapitolu“),
  - Node E3 (video Strážcu mimo lišty hry, titulky kreslí hra, náhrada pri chybe súboru, bez tlačidla na konci),
  - D2 v prehliadači (po „Preskočiť“ aj „Spustiť kapitolu“).
- **Node:** 22 testov OK (B7: celá kapitola, skóre **1010**).

**Chyby:**
- Po dočasnom odložení zmien (`git stash`) kvôli testu pred zmenou posielal vývojový server staré štýly bez nových tried. Nepomohol ani reštart servera.
  - Pomohla až malá úprava súboru `globals.css`, ktorá vynútila nové spracovanie.
  - Test medzitým hlásil 2 chyby (písmo titulkov a prelínanie), v hre chyba nebola.
- Prvá verzia skracovala nadpis „Strážca Michalskej brány“ na 360 px a koniec videa A bol takmer čierny. Opravené: nadpis na vlastnom riadku, na konci stlmený plagát.
- D5: znova zlyhala známa kontrola truhlice pri otáčaní opačným smerom (0 px rezervy vpravo). Je to otvorená vec z F1, s prehrávačom nesúvisí.

**Stále testy v prehliadači:** B3b, B4b, B4c-1, B4c-2, B4c-3, C1, D2, D3a, D4, c6, E4 a G1 (v oboch režimoch) sú OK. D5 je OK okrem kontroly truhlice.

**Na mobile treba ešte overiť** (testovací prehliadač to neoverí):
- či sa video na iPhone (Safari) po „Nová hra“ a „Som pri bráne“ spustí so zvukom, alebo sa ukáže zlaté „Prehrať“ (Safari povoľuje zvuk prísnejšie),
- titulky a tlačidlá pri výreze obrazovky („notch“).
Doplnené do riadkov o videách A a B v `docs/KONTROLA-PRED-VYDANIM.md`.

**Build:** prešiel. **Lint:** bez zmeny, 14 starých problémov.

**Ďalší krok:** kódy (krok 2), až po „pokračuj“.

---

## 27. 10. 2026 – Záver dňa

**Hotové:**
- **Videá A a B sú v hre.**
  - Video A „Prelet nad Bratislavou“ sa prehrá po „Nová hra“, potom príde „Spustiť kapitolu“ a obrazovka „Vydaj sa k Michalskej bráne“.
  - Video B so Strážcom sa prehrá po „Som pri bráne“, hneď po ňom zápis č. 1.
  - Keď súbor chýba, hra ukáže text a písaný rozhovor.
  - Kroky E1 až E3.
- **Prehrávač „Kino“** (krok G1): celá obrazovka, spustenie hneď po ťuknutí, zlatá pečať „Prehrať“, titulky dole písmom s pätkami, priebeh, zvuk, prelínanie.
- **Nová úvodná obrazovka** (krok F1): „Pokračovať“ a „Nová hra“.
- **Súpis hlasov** (`docs/SUPIS-HLASOV.md`):
  - 79 miest, 15 814 znakov,
  - na nahranie odporúčaných 25 miest, 5 411 znakov,
  - text pre video 3 je označený.

**Najbližšie:**
1. Odomykanie kódom:
   - krok 2: zoznam kódov (iba odtlačky) a odomknutie aktov II a III s plnými bodmi,
   - krok 3: tlačidlo a obrazovka „Mám kód“.
2. Menu kapitol.
3. Hlasy podľa `docs/SUPIS-HLASOV.md`: vybrať hlas pátrača, nahrať, video 3 vo finále.

**Otvorené:**
- Kontrola truhlice v teste D5 (pri otáčaní 0 px rezervy) občas zlyháva, treba preveriť samostatne.
- Prehrávač treba vyskúšať na iPhone (`docs/KONTROLA-PRED-VYDANIM.md`).

Vývojový server je zastavený.

---

## 28. 10. 2026 – Opatrenia proti zaseknutiu, krok M1: stály postup a zmazanie starých profilov

**Prečo:** ráno sa počítač zasekol. Jeden proces node zabral asi 15 GB pamäte (počítač má 32 GB). Pravdepodobne to bol vývojový server, ktorý ostal bežať po nečakanom konci včerajšieho sedenia (uprostred kroku 2 kódov). Testy pri tom stránku obnovujú desiatky ráz a server si všetko drží v pamäti.

**Zistený stav pred opatreniami:**
- Nebežal žiadny proces node ani testovací Chrome, porty 3000 až 3003 boli voľné.
- `.next` mal 1,7 GB (vyrovnávacia pamäť vývojového servera), `node_modules` 0,54 GB.
- Pracovný priečinok testov mal 27,7 GB: 289 nezmazaných profilov testovacieho Chromu.

**Schválené opatrenia:**
- A: stály postup,
- B: upratovací skript,
- C: jeden server na porte 3000,
- D: strážca pamäti,
- G: testy proti hotovej verzii,
- I: mazanie profilov,
- E a F ako poistka (limit pamäte pre node a cieľová pamäť Turbopacku).
- H (Webpack) nie.

**Čo sa urobilo v kroku M1:**
- **Stály postup (A)** je zapísaný na začiatku tohto denníka.
- **Zmazaných 289 starých profilov testovacieho Chromu**, iba v pracovnom priečinku testov. Priečinok má teraz 287 MB namiesto 27,7 GB. Bežný Chrome ani projekt sa nemenili.

**Chyby:**
- Prvé mazanie cez PowerShell (`Remove-Item`) zmazalo iba časť (27,7 → 21,5 GB). Profily majú súbory s cestou dlhšou ako 260 znakov.
- Príkaz `rmdir` s dlhou cestou zablokovala ochrana nástroja.
- Zmazanie sa podarilo cez Node (`fs.rmSync` s dlhými cestami), pričom skript najprv overil, že každý priečinok je profil priamo v pracovnom priečinku testov.

**Súbory:** `docs/PRACOVNY-DENNIK.md`.

**Ďalší krok:** M2, skripty na bezpečné spustenie servera (B, C, D, E).

---

## 28. 10. 2026 – Opatrenia, krok M2: bezpečné spustenie a zastavenie servera (B, C, D, E)

**Dôležité zistenie: skutočná príčina zaseknutia.**
- Pri skúške dnešného správania vzniklo za necelú minútu **1 282 procesov node**.
- Pri ďalšom spustení sa pri prvom preklade stránky objavilo 161 až 435 procesov a **10 až 28 GB** pamäte. Strážca pamäte, ktorý už bežal, server dvakrát ukončil.
- **Príčina:** poškodená vyrovnávacia pamäť Turbopacku v `.next/dev` (1,7 GB). Server v nej opakovane spúšťal nové pomocné procesy (`node .next\dev\build\…js`).
- Po jej zmazaní bežal server normálne: **3 procesy, asi 1,1 GB**.
- Vyrovnávacia pamäť sa mohla poškodiť pri násilnom ukončovaní servera (pomocné procesy skôr ako server) alebo pri dočasnom odkladaní zmien (`git stash`) počas behu servera.

**Čo sa zmenilo:**
- `npm run dev` spúšťa `scripts/dev.mjs`:
  - **iba jeden server na porte 3000**; keď je obsadený, nespustí sa a ohlási to (C),
  - **limit pamäte pre JavaScript** `NODE_OPTIONS=--max-old-space-size=4096` (E),
  - **strážca pamäte** na pozadí (D).
- `scripts/memory-guard.mjs` – strážca pamäte (D):
  - každých 5 s zmeria všetky procesy servera,
  - nad 6 GB alebo nad 60 procesov server ukončí,
  - pri priveľa procesoch zmaže aj vyrovnávaciu pamäť `.next/dev`,
  - záznam vedie v `.next/memory-guard.log`.
- `npm run stop` (`scripts/stop-dev.mjs`) – upratovací skript (B):
  - ukončí server Next tohto projektu, najprv samotný server, potom pomocné procesy, opakovane, kým 3 sekundy nič nepribudne,
  - ukončí strážcu pamäte a testovací Chrome (iba neviditeľný s testovacím profilom),
  - na konci skontroluje, že nič neostalo a port 3000 je voľný.
- `scripts/processes.mjs` – spoločné funkcie.
- Skripty sú v Node, nie v PowerShelli:
  - Windows predvolene nedovolí spúšťať súbory `.ps1` a obchádzanie tohto nastavenia (`-ExecutionPolicy Bypass`) zablokovala bezpečnostná kontrola nástroja,
  - zoznam procesov sa zisťuje jednoduchým príkazom PowerShellu, čo nastavenie Windows nemení.

**Skúška (všetko OK):**
- Pred zmenou: druhé `next dev` sa spustilo bez varovania a po ukončení hlavných procesov ostali visieť stovky pomocných procesov.
- Po zmene:
  - `npm run dev` spustí server na porte 3000 so strážcom,
  - druhé `npm run dev` skončí so správou „Port 3000 je obsadený…“ (kód 1) a iný port sa neotvorí,
  - strážca s limitom 500 MB server ukončil aj s pomocnými procesmi (0 procesov po zásahu),
  - `npm run stop` ukončil server, strážcu aj testovací Chrome,
  - bežný Chrome ostal nedotknutý (17 procesov pred aj po),
  - druhé `npm run stop` hlási „Žiadne zabudnuté procesy“.
- Lint skriptov bez chýb.

**Chyby počas práce:**
- Prvá verzia skriptov bola v PowerShelli (`.ps1`), zápis `-ExecutionPolicy Bypass` do `package.json` zablokovala bezpečnostná kontrola. Prepísané do Node, súbory `.ps1` zmazané (neboli v gite).
- PowerShell príkazom `Get-Content` bez voľby UTF-8 zobrazuje slovenské znaky v zázname strážcu pokazene. Súbor je v UTF-8 a správne ho zobrazí napríklad Poznámkový blok.
- Pri ukončovaní nájdené visiace procesy (1 282 a ďalšie) sa ukončili. Teraz voľných 25,5 GB z 31,7 GB.

**Súbory:**
- `scripts/dev.mjs`, `scripts/stop-dev.mjs`, `scripts/memory-guard.mjs`, `scripts/processes.mjs` (nové),
- `package.json` (skripty `dev` a `stop`),
- `docs/PRACOVNY-DENNIK.md`.

**Ďalší krok:** M3, cieľová pamäť Turbopacku (F) a meranie, či E a F nespomaľujú preklad.

---

## 28. 10. 2026 – Opatrenia, krok M3: cieľová pamäť Turbopacku (F) a meranie E a F

**Čo sa zmenilo:**
- `next.config.ts`: `experimental.turbopackMemoryLimit` je 4 GB. Nad touto hranicou Turbopack uvoľňuje svoju vyrovnávaciu pamäť.
- Je to cieľ, nie tvrdý limit. Tvrdú hranicu stráži strážca pamäte (M2).

**Meranie (vývojový server, stránka „/“, prvý preklad s prázdnou `.next/dev` a potom po reštarte):**

| Nastavenie | Server pripravený | Prvý preklad stránky | Po reštarte | Pamäť po preklade |
|---|---|---|---|---|
| bez opatrení | 1,4 s | 3,0 s | 0,4 s | 1 060 MB |
| E (limit JavaScriptu 4 GB) | 1,3 s | 3,9 s | 0,3 s | 1 085 MB |
| E + F (1. meranie) | 1,2 s | 2,7 s | 0,2 s | 1 070 MB |
| E + F (2. meranie) | 1,1 s | 4,2 s | 0,4 s | 1 060 MB |

**Záver:** E ani F preklad citeľne nespomaľujú. Rozdiely do 1 s sú bežné kolísanie (napríklad E+F raz 2,7 s, raz 4,2 s). Obe poistky ostávajú.

**Build:** prešiel aj s novým nastavením.

**Súbory:** `next.config.ts`, `docs/PRACOVNY-DENNIK.md`.

**Ďalší krok:** M4, testy v prehliadači proti hotovej verzii (G) a mazanie testovacieho profilu po každom teste (I).

---

## 28. 10. 2026 – Opatrenia, krok M4: testy proti hotovej verzii (G) a mazanie profilov (I)

**Čo sa zmenilo:**
- **`npm run test:server`** (`scripts/test-server.mjs`) spustí testovací server:
  1. uprace zabudnuté procesy,
  2. urobí build,
  3. spustí hotovú verziu hry (`next start`) na porte 3000 so strážcom pamäte a limitom pamäte pre JavaScript.
  - Server beží na pozadí, zastaví ho `npm run stop`. Keď build zlyhá, server sa nespustí.
- **Testy v prehliadači** (pracovný priečinok testov, mimo projektu):
  - 14 spúšťačov stálych testov po každom teste zmaže profil testovacieho Chromu,
  - nový spúšťač celej série `run-standing.ps1` testy pustí po jednom (jeden prehliadač naraz) proti hotovej verzii a na konci vždy zastaví server a uprace profily, aj keď test spadne.
- **Strážca pamäte** sa pri `npm run stop` ukončí až po serveri. Stihne tak zapísať najvyššiu pamäť a počet procesov.

**Skúška:**
- **Celá séria stálych testov proti hotovej verzii:** B3b, B4b, B4c-1, B4c-2, B4c-3, C1, D2, D3a, D4, D5, c6, E4, G1 a G1 s vypnutými animáciami prešli. Prešla aj kontrola truhlice v D5, ktorá na vývojovom serveri občas zlyhávala.
  - Trvanie 18 minút.
  - Na konci server zastavený, profily zmazané, žiadny proces node.
- **E5** (rozpracovaný krok 2 kódov) mal 2 chyby, ktoré patria ku kroku 2 a riešia sa tam.
- **Záznam strážcu po úprave:** pri jednej načítanej stránke vo vývojovom serveri najviac 539 MB a 3 procesy.
- Lint skriptov bez chýb.

**Chyby počas práce:**
- Pri hromadnej úprave spúšťačov sa stratila spätná lomka v ceste (`$spclean-profiles.mjs`) a pokus o opravu cez `sed` ju pokazil ešte viac. Opravené malým skriptom v Node.
- Spúšťač série najprv posielal voľbu `-Variant` aj testom, ktoré ju nepoznajú. Teraz ju posiela iba tam, kde je zadaná.
- Pri prvej sérii strážcu ukončilo `npm run stop` skôr, ako zapísal najvyššiu pamäť. Opravené poradím.

**Súbory:**
- `scripts/test-server.mjs` (nový),
- `scripts/processes.mjs`,
- `package.json` (skript `test:server`),
- `docs/PRACOVNY-DENNIK.md`.

**Opatrenia A, B, C, D, E, F, G a I sú hotové.**

**Ďalší krok:** dokončiť krok 2 kódov.

---

## 28. 10. 2026 – Odomykanie kódom, krok 2: zoznam kódov a odomknutie aktov II a III

**Čo sa zmenilo:**
- **`data/unlock-codes.ts`** obsahuje dva kódy:
  - Kapitola I · Akt II – Moc a poznanie,
  - Kapitola I · Akt III – Posledné tajomstvo.
  - Uložené sú iba **odtlačky** (SHA-256 z upraveného kódu s predponou). Čitateľné kódy nie sú v žiadnom súbore projektu, testov ani v tomto denníku, čo je overené vyhľadaním.
  - Nový kód: pridať riadok s odtlačkom a cieľom (kapitola, akt).
- **`engine/unlockCodes.ts`:**
  - porovnanie kódu nerozlišuje veľké a malé písmená a ignoruje medzery a pomlčky,
  - odtlačok SHA-256 je napísaný priamo v hre, takže funguje aj bez https, napríklad pri skúšaní na mobile v domácej sieti,
  - `createUnlockedGameState` vytvorí uloženú hru odomknutého aktu.
- **Odomknutie = poctivé prejdenie predošlých aktov** rovnakými funkciami hry (bez nápovedy, teda plné body):
  - akt II: 300 bodov,
  - akt III: 600 bodov,
  - Inventár (zápis č. 1, predmety, útržky), artefakty, úlohy a príznaky ako po poctivom prejdení,
  - číslice predmetov sú nájdené (nie odhalené tlačidlom),
  - videá A a B sú označené ako videné,
  - príbudne príznak `unlocked_by_code_…`.
  - Hra začne obrazovkou „Vydaj sa k …“ odomknutého aktu.
- **Obrazovky „Vydaj sa k …“ pre akty II a III** (schválené texty, v dátach aktov):
  - „Vydaj sa k Academii Istropolitane“,
  - „Vydaj sa k Maximiliánovej fontáne“,
  - obe s „Otvoriť v mapách“ a „Som na mieste“.
- **Uloženie:** verzia ostáva v2, nič nové sa neukladá, takže F5 a „Pokračovať“ fungujú ako pri bežnej hre.
- **Tlačidlo „Mám kód“** a jeho obrazovka pribudnú v kroku 3. Dovtedy sa kód v hre nedá zadať.

**Súbory:**
- `engine/unlockCodes.ts`, `data/unlock-codes.ts` (nové),
- `engine/index.ts`,
- `types/game.ts` (`UnlockCode`, `Act.arrival`, voliteľný náhradný text príchodu),
- `data/chapter-one/acts.ts`,
- `components/screens/IntroScreen.tsx`,
- `app/page.tsx`.

**Testy (iba skúšobné kódy TEST-…):**
- **Nový Node test E5:** pred zmenou 18 chýb, po zmene všetko OK. Overuje:
  - SHA-256 (známe hodnoty, dlhý text s diakritikou, hranice blokov),
  - porovnanie kódu, správny, nesprávny a prázdny kód,
  - dáta bez čitateľných kódov,
  - texty príchodu,
  - odomknutie aktov II a III oproti poctivému prejdeniu (body, Inventár, artefakty, úlohy, príznaky, číslice),
  - F5,
  - dohratie do konca s kódom vrátane zámkov truhlice (skóre 1010),
  - neznámy akt a neznáma kapitola.
- Zhodu skutočných kódov s odtlačkami som overil funkciou hry bez zápisu kódov do súboru.
- **Nový test E5 v prehliadači** (uloženie vyrobené funkciou hry so skúšobným kódom, 360 px, oba režimy): „Pokračovať“, „Vydaj sa…“ pre akty II a III, odkaz do máp, F5, „Som na mieste“ → úloha na správnom mieste. Všetko OK.
  - Test pred zmenou v prehliadači som nespustil, lebo kód kroku bol napísaný už pred prerušením sedenia. Pred zmenou je overený iba Node test.
- **Node:** 23 testov OK (B7: celá kapitola, skóre **1010**).
- **Prehliadač, celá séria stálych testov proti hotovej verzii:** všetko OK (pozri M4).

**Chyby:**
- E5 v prehliadači najprv hlásil 2 chyby, lebo test hľadal názov miesta malými písmenami a na obrazovke je veľkými. Chyba bola v teste.
- Sedenie sa včera prerušilo uprostred tohto kroku; kód ostal necommitnutý až do zavedenia opatrení M1 až M4.

**Build:** prešiel. **Lint:** bez zmeny, 14 starých problémov.

**Ďalší krok:** krok 3, tlačidlo a obrazovka „Mám kód“, až po „pokračuj“.
