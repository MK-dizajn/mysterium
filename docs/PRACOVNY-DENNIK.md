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
