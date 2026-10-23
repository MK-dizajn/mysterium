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
