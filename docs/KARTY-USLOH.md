# Karty úloh – odmeny, kódy a truhlica (kapitola I)

Návrh odmien po úlohách pre kapitolu I. Zatiaľ ide iba o návrh: nič z toho ešte nie je naprogramované.

Súvisí s `docs/KONCEPT-ZAZITKU.md` (časti B, C, D a F).

---

## 1. Kódy zámkov

**Rozhodnutie:** kódy zámkov sú **jednociferné**. Každý predmet nesie **jednu číslicu** a každý zámok má **3 číslice**.

| Zámok | Scény | Kód |
|---|---|---|
| I | 1 až 3 | **3 – 8 – 1** |
| II | 4 až 6 | **6 – 0 – 4** |
| III | 7 až 9 | **9 – 2 – 7** |

**Starý dvojciferný systém sa nahrádza:** `00-15-58`, `65-70-09`, `72-81-05`.

**Dnes v hre:**
- dôkazy nesú dvojciferné kódy (`secretCode`: 00, 15, 58, 65, 70, 09, 72, 81, 05),
- truhlice sú dve, po akte I a II.
- Kódy zámku sa už odvodzujú z dát scén (funkcia `getActLockCodes`, kroky A1 a A2), takže zmena číslic sa urobí v dátach scén, nie v engine.

## 2. Odmeny po úlohách

| Scéna | Miesto | Odmena (predmet) | Číslica |
|---|---|---|---|
| 1 | Michalská brána | mosadzný žetón nultého kilometra | **3** |
| 2 | Najužší dom | kus starej mapy s vyznačeným domom č. 15 | **8** |
| 3 | Lekáreň U Salvátora | strana z denníka s latinskou vetou a rokom | **1** |
| 4 | Academia Istropolitana | pečať vzdelanosti | **6** |
| 5 | Mirbachov palác | druhý kus mapy | **0** |
| 6 | Stará radnica | hlasová nahrávka Strážcu (zatiaľ iba text) | **4** |
| 7 | Maximiliánova fontána | prvý zub Zlatého kľúča | **9** |
| 8 | Primaciálny palác | druhý zub Zlatého kľúča | **2** |
| 9 | Bratislavský mier | tretí zub Zlatého kľúča | **7** |
| 10 | Finále | Zlatý prešporský kľúč zložený z troch zubov | – |

- **Vodidlá na ďalšie miesto:** každá odmena nesie vodidlo na ďalšie miesto. Presné znenie doplní autor podľa terénu (pozri Otvorené veci).
- **Tlačidlo „Ukáž cestu“:** pri každej odmene je tlačidlo, ktoré ukáže dnešný text trasy (`nextInstruction` scény), **bez straty bodov**.

**Dnes v hre:**
- po každej úlohe hráč dostane dôkaz s dvojcifernou číslicou: žetón, mosadzný štítok, lekárnickú pečať, pečať Academie, pečať rodu Nyáry, úlomok delovej gule, rytiersku sponu, emblém C · I, pečať mieru,
- ďalšie miesto sa ukáže iba v texte „Ďalšia stopa“ na obrazovke histórie.

## 3. Konce aktov

Konce aktov sú ľahké momenty **bez truhlice**:

| Koniec | Moment | Útržok fotografie |
|---|---|---|
| akt I | hlas Strážcu | prvý väčší útržok fotky |
| akt II | pečať | druhý útržok |
| akt III | zloženie kľúča | tretí útržok |
| truhlica (finále) | – | **štvrtý útržok s adresou** |

**Dnes v hre:** po akte I a II je obrazovka prechodu aktu a truhlica s útržkom fotografie (`torn-photo-fragment-act-1` a `-act-2`). Po akte III nie je nič.

## 4. Truhlica na konci kapitoly

- Truhlica je **jedna, na konci kapitoly**.
- Má **tri zámky**, každý s **kolieskami 0 až 9** a **3 číslicami** na zámok.
- Po zadaní všetkých troch kódov hráč **vloží Zlatý kľúč do stredného zámku** a **veko sa otvorí**.
- V truhlici je štvrtý útržok fotografie s adresou ďalšieho miesta.

**Dnes v hre:** dve truhlice po akte I a II, každá s jedným zámkom na tri **dvojciferné** dvojice (kolieska pre dve číslice). 3D truhlica, priblíženie a mechanizmus už existujú.

## 5. Staré uložené hry

**Rozhodnutie:** po zmene na jednociferné kódy sa staré uložené hry **resetujú** (hráč začne odznova).

Poznámka k realizácii: je to zámerná výnimka z doterajšieho pravidla „uložený postup sa nemaže“. Pred zmenou treba rozhodnúť, ako sa reset spraví a ako sa o ňom hráč dozvie. Napríklad nová verzia kľúča uloženia a krátka správa na úvodnej obrazovke.

## 6. Otvorené veci

| Vec | Stav |
|---|---|
| Presné vodidlá na ďalšie miesto pri každej odmene (po terénnom overení) | doplní autor |
| Texty koncov aktov (hlas Strážcu, pečať, zloženie kľúča) | doplní autor |
| Adresa a názov ďalšieho miesta (štvrtý útržok v truhlici) | doplní autor |

---

## Na zosúladenie s ostatnými dokumentmi

- `docs/KONCEPT-ZAZITKU.md`, časť C, ešte uvádza staré kódy `00-15-58`, `65-70-09`, `72-81-05`.
- `docs/KONCEPT-KAPITOL.md` ešte uvádza „truhlica po každom akte“.
- Zápisy krokov A1 a A2 v `docs/PRACOVNY-DENNIK.md` overovali staré dvojciferné kódy. Pri zmene na jednociferné kódy sa test dát upraví na 3-8-1, 6-0-4, 9-2-7.
