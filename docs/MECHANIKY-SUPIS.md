# Súpis mechaník – ako hra dnes dáva číslice a kódy (kapitola I)

Stav k 20. 11. 2026. Dokument opisuje, čo hra **robí dnes**. Návrh zmien je v `docs/NAVRH-MINIHIER.md`.

## Ako to funguje v skratke

1. Hráč príde na miesto a vyrieši **úlohu**: zapíše odpoveď (napríklad „Viedeň“). Odpoveď vidí na mieste.
2. Za vyriešenie dostane **body** a **predmet** (napríklad žetón, kus mapy, zub kľúča).
3. V predmete je ukrytá **jedna číslica**. Hráč ju objaví v okne **„Prezrieť“**: otáča predmetom, ťuká na detaily alebo na slovo.
4. Číslica sa sama zapíše do **zápisníka kódov**.
5. Po troch scénach (jeden **akt**) má hráč tri číslice, teda kód jedného **zámku truhlice**.
6. Vo finále otvorí truhlicu: tri zámky (I, II, III) po tri číslice a nakoniec vloží **Zlatý kľúč** zložený z troch zubov.

Číslicu dáva 9 scén (1 až 9). **Scéna 10 číslicu nedáva.** Dá celý Zlatý kľúč, ktorý sa vkladá do truhlice po troch zámkoch.

## Scény 1 až 10

### Scéna 1 – Michalská brána (Akt I)

| | |
|---|---|
| Čo hráč robí na mieste | Stojí pod bránou pri bronzovom kruhu v dlažbe so vzdialenosťami do miest sveta. |
| Úloha a odpoveď | „Zapíš názov mesta, ku ktorému vedie najkratšia cesta.“ → **Viedeň** (aj „Vienna“, „Wien“) |
| Predmet | Žetón nultého kilometra |
| Mechanika číslice | **Otáčanie a hľadanie (hotspot):** žetón treba otočiť a nájsť vyrytú číslicu na hrane. |
| Číslica | **3** (zámok I, 1. miesto) |
| Kde sa ukáže | na hrane žetónu (v 3D po otočení, v 2D po prepnutí strany) |
| Nápovedy v okne „Prezrieť“ | po 20 s nečinnosti nápoveda „Skús predmet otočiť a pozrieť si ho zblízka.“ a miesto sa rozžiari, po 40 s tlačidlo „Ukáž číslicu“ |
| Nápovedy k úlohe | 3 (posledná prezradí odpoveď) |
| Body | 100 za úlohu, každá prečítaná nápoveda −20 (najmenej 20) |

### Scéna 2 – Najužší dom (Akt I)

| | |
|---|---|
| Čo hráč robí na mieste | Hľadá najužší dom pri bráne a jeho číslo. |
| Úloha a odpoveď | „Zapíš orientačné číslo najužšieho domu.“ → **15** |
| Predmet | Kus mapy: staré mesto |
| Mechanika číslice | **Počítanie ťukaním (count):** ťukať na každú vežu na mape; počet veží = číslica. |
| Číslica | **8** (zámok I, 2. miesto) |
| Kde sa ukáže | po označení všetkých 8 veží |
| Nápovedy v okne „Prezrieť“ | 20 s: „Skús ťuknúť na to, čo ťa v meste zaujme.“; 40 s: „Označ každý detail, ktorý vidíš…“; 60 s: „Ukáž číslicu“ |
| Nápovedy k úlohe | 3 |
| Body | 100 / −20 za nápovedu |

### Scéna 3 – Lekáreň U Salvátora (Akt I)

| | |
|---|---|
| Čo hráč robí na mieste | Hľadá latinský nápis na fasáde lekárne. |
| Úloha a odpoveď | „Zadaj rok, ktorým sa končí latinský nápis.“ → **1658** |
| Predmet | Pátračova strana z denníka |
| Mechanika číslice | **Otočenie (hotspot):** otočiť list, na zadnej strane je podčiarknutá číslica. |
| Číslica | **1** (zámok I, 3. miesto) |
| Nápovedy v okne „Prezrieť“ | 20 s: „Aj druhá strana listu môže niečo skrývať…“; 40 s: „Ukáž číslicu“ |
| Nápovedy k úlohe | 2 |
| Body | 100 / −20 |

### Scéna 4 – Academia Istropolitana (Akt II)

| | |
|---|---|
| Čo hráč robí na mieste | Hľadá pamätnú tabuľu na Ventúrskej ulici. |
| Úloha a odpoveď | „Zadaj meno panovníka, ktorý školu založil.“ → **Matej Korvín** |
| Predmet | Pečať vzdelanosti |
| Mechanika číslice | **Počítanie ťukaním:** lúče okolo koruny na pečati. |
| Číslica | **6** (zámok II, 1. miesto) |
| Nápovedy v okne „Prezrieť“ | 20 s / 40 s / 60 s ako pri scéne 2 |
| Nápovedy k úlohe | 2 |
| Body | 100 / −20 |

### Scéna 5 – Mirbachov palác (Akt II)

| | |
|---|---|
| Čo hráč robí na mieste | Pozerá na erb pod korunou hore na priečelí. |
| Úloha a odpoveď | „Zadaj, čo sa nachádza pod korunou.“ → **erb** (aj „znak“) |
| Predmet | Kus mapy: námestie |
| Mechanika číslice | **Otočenie (hotspot):** zadná strana mapy, číslica pri kompase. |
| Číslica | **0** (zámok II, 2. miesto) |
| Nápovedy v okne „Prezrieť“ | 20 s nápoveda, 40 s „Ukáž číslicu“ |
| Nápovedy k úlohe | 2 |
| Body | 100 / −20 |

### Scéna 6 – Stará radnica (Akt II)

| | |
|---|---|
| Čo hráč robí na mieste | Hľadá delovú guľu zamurovanú vo veži radnice. |
| Úloha a odpoveď | „Zadaj, aký predmet zostal v stene veže.“ → **delová guľa** |
| Predmet | Nahrávka Strážcu (prepis jeho slov) |
| Mechanika číslice | **Slovo v prepise (transcript):** v texte je zvýraznené slovo „štyri“; ťuknutím naň hráč objaví číslicu. |
| Číslica | **4** (zámok II, 3. miesto) |
| Nápovedy v okne „Prezrieť“ | 20 s: „Prečítaj si slová Strážcu ešte raz. Jedno z nich vyslovil dôraznejšie…“; 40 s: „Ukáž číslicu“ |
| Nápovedy k úlohe | 2 |
| Body | 100 / −20 |

### Scéna 7 – Maximiliánova fontána (Akt III)

| | |
|---|---|
| Čo hráč robí na mieste | Pozerá na rytiera na vrchole fontány. |
| Úloha a odpoveď | „Zadaj, čo má postava oblečené na ochranu v boji.“ → **brnenie** (aj „zbroj“) |
| Predmet | Prvý zub Zlatého kľúča |
| Mechanika číslice | **Počítanie ťukaním:** zárezy na hranách zubu. |
| Číslica | **9** (zámok III, 1. miesto) |
| Nápovedy v okne „Prezrieť“ | 20 s / 40 s / 60 s |
| Nápovedy k úlohe | 2 |
| Body | 100 / −20 |

### Scéna 8 – Primaciálny palác (Akt III)

| | |
|---|---|
| Čo hráč robí na mieste | Hľadá na fasáde dve detské postavy s písmenami. |
| Úloha a odpoveď | „Zadaj obe písmená v poradí zľava doprava.“ → **C I** |
| Predmet | Druhý zub Zlatého kľúča |
| Mechanika číslice | **Počítanie ťukaním:** zárezy na zube. |
| Číslica | **2** (zámok III, 2. miesto) |
| Nápovedy v okne „Prezrieť“ | 20 s / 40 s / 60 s |
| Nápovedy k úlohe | 2 |
| Body | 100 / −20 |

### Scéna 9 – Primaciálny palác, Bratislavský mier (Akt III)

| | |
|---|---|
| Čo hráč robí na mieste | Číta pamätnú tabuľu na stene paláca (26. XII. 1805). |
| Úloha a odpoveď | „Zapíš, aký mier sa v tomto paláci podpísal.“ → **Bratislavský mier** (pri „Slavkovský mier“ vlastná hláška) |
| Predmet | Tretí zub Zlatého kľúča |
| Mechanika číslice | **Počítanie ťukaním:** zárezy na zube. |
| Číslica | **7** (zámok III, 3. miesto) |
| Nápovedy v okne „Prezrieť“ | 20 s / 40 s / 60 s |
| Nápovedy k úlohe | 2 |
| Body | 100 / −20 |

### Scéna 10 – Pátračov denník (Akt III)

| | |
|---|---|
| Čo hráč robí na mieste | Ostáva pri Primaciálnom paláci a spája všetky stopy. |
| Úloha a odpoveď | „Zadaj dvoma slovami, čo všetky stopy spoločne uchovávajú.“ → **pamäť mesta** |
| Predmet | Celý Zlatý prešporský kľúč (bez číslice) |
| Mechanika | **Skladanie kľúča:** na konci aktu III sa tri zuby animovane zložia do kľúča. |
| Body | 100 / −20 a navyše **10** za splnenú úlohu (quest) „Zlatý kľúč“ |

**Najviac bodov:** 10 × 100 + 10 = **1010**.

## Spoločné časti

### Dátový model (kde je čo zapísané)

- **Scéna** (`data/chapter-one/<miesto>.ts`):
  - úvodný text a hlas,
  - zadanie úlohy (`investigation`),
  - úloha (`puzzle`: pole na odpoveď, prijaté odpovede, nápovedy, blízke odpovede),
  - príbeh miesta, artefakt, cesta na ďalšie miesto,
  - **udalosti**: po vyriešení úlohy pribudne predmet.
- **Predmet** (v udalosti scény):
  - názov, opis,
  - **`secretCode`** – číslica,
  - **`evidenceOrder`** – poradie v kóde,
  - `actId` – zámok,
  - **`inspect`** – ako sa číslica hľadá v okne „Prezrieť“:
    - `kind`: `hotspot` (miesto na predmete), `count` (počítanie prvkov) alebo `transcript` (slovo v texte),
    - `art`: ktorý obrázok predmetu sa nakreslí (žetón, strana denníka, mapa, pečať, zub kľúča),
    - texty: úvod, nápoveda, druhá nápoveda, text po objavení,
    - `timing`: kedy sa ukážu nápovedy a „Ukáž číslicu“,
    - `countPoints`: kde ležia prvky na počítanie (ich počet = číslica).
- **Obrázky predmetov** sú nakreslené v kóde (SVG v `components/items/art/`), nie ako súbory.

### Okno „Prezrieť“ (`components/items/ItemInspector.tsx`)

- Otvorí sa po vyriešení úlohy (obrazovka príbehu miesta, „Nový predmet“), z Inventára alebo zo zápisníka pri truhlici.
- **3D:** predmet sa dá otáčať prstom (knižnica Three.js, ktorú hra už má).
- **2D záloha:** ak prehliadač nevie 3D (WebGL), ak 3D spadne alebo pri skrytom prepínači `?bez3d` sa ukáže kreslený obrázok s tlačidlom na otočenie strany.
- **Vypnuté animácie:** bez pohybu a zábleskov.
- **Čítačka obrazovky:** každé miesto a prvok má popis, okno je dialóg.
- **Nápovedy podľa nečinnosti:** časovač sa spustí pri otvorení a po každom ťuknutí začne odznova.
- **„Ukáž číslicu“** odhalí číslicu bez hľadania. Hra si to zapamätá (`revealedCodeItemIds`), **ale skóre to neznižuje**.

### Zápisník kódov (`components/ui/CodeNotebook.tsx`, `engine/codeNotebook.ts`)

- Tri riadky: Zámok I, II, III. V každom sú tri miesta podľa `evidenceOrder`.
- Nájdená číslica sa zapíše sama (`foundCodeItemIds`). Nenájdená ostáva „?“ a pri truhlici má tlačidlo „Prezrieť“.
- Kód zámku tvoria číslice troch predmetov aktu v poradí `evidenceOrder`. Celé kódy zámkov sa do dokumentov nepíšu, vyplývajú z dát hry.

### Truhlica a zámky (`components/screens/FinaleChestScreen.tsx`, `components/finale/chest3d/`)

- Jedna truhlica s tromi zámkami, ktoré sa otvárajú v poradí I → II → III.
- Každý zámok má tri kolieska. Hráč nastaví číslice zo zápisníka a ťukne na „Odomknúť zámok“.
- Zlý kód: zámok sa zatrasie, nič sa neuloží. Dobrý kód: zámok sa otvorí a uloží sa.
- Po troch zámkoch: „Vložiť Zlatý kľúč“, animácia otvorenia, štvrtý útržok fotografie.
- 3D truhlica s 2D zálohou a ovládaním pre klávesnicu a čítačku.

### Skóre

- Za úlohu 100 bodov, každá prečítaná nápoveda −20, najmenej 20.
- Úloha „Zlatý kľúč“ +10. Najviac 1010.
- Hľadanie číslice v okne „Prezrieť“ ani „Ukáž číslicu“ skóre neovplyvní.

### Uloženie

- Kľúč `mysterium-progress-v2` v prehliadači.
- Ukladá sa: obrazovka, scéna, akt, body, predmety, artefakty, úlohy, príznaky, prečítané nápovedy, nájdené a odhalené číslice.
- Stav hľadania v okne „Prezrieť“ (koľko veží je už označených) sa **neukladá**. Po F5 alebo zatvorení okna hráč začína odznova.
- Pred prvým testerom je plánovaný prechod na v3 (`docs/KONTROLA-PRED-VYDANIM.md`).

### Testy

- Node testy overujú dáta (číslice, poradie, nápovedy, časy, popisy pre čítačku) a celú kapitolu so skóre 1010.
- Testy v prehliadači (proti hotovej verzii) overujú okno „Prezrieť“:
  - 3D aj 2D, otáčanie, ťukanie, nápovedy po čase, „Ukáž číslicu“,
  - zápisník, truhlicu, kolieska, zlý a dobrý kód, skladanie kľúča.

## Čo je dobré a čo nefunguje

| Mechanika (scény) | Čo je dobré | Čo nefunguje |
|---|---|---|
| **Otáčanie a hľadanie číslice na hrane** (1 žetón) | 3D otáčanie je pekné a prekvapí. Žetón súvisí s miestom (nultý kilometer). | Číslica sa nájde náhodným otáčaním, s miestom ani s odpoveďou nesúvisí. Hráč na mieste nemusí nič pozorovať. |
| **Otočiť list alebo mapu** (3 strana denníka, 5 mapa námestia) | Jednoduché, zrozumiteľné. | **Príliš ľahké:** jeden ťuk a je hotovo. Dvakrát rovnaký trik. Nesúvisí s miestom. |
| **Počítanie ťukaním** (2 veže, 4 lúče, 7–9 zárezy) | Jasné pravidlo „koľko je X“, dá sa to aj s čítačkou. | **Päťkrát rovnaká hra, z toho trikrát za sebou (zuby 7–9).** Mechanické ťukanie bez logiky. Na 360 px malé ciele (9 zárezov na malom zube). Výsledok nesúvisí so skutočným detailom na budove. Hráča nepobaví. |
| **Slovo v prepise** (6 Strážca) | Príbehové, číslica je „vyslovená“ Strážcom. | Zvýraznené slovo prezrádza odpoveď hneď. Slovo je síce súčasťou príbehu, no hľadanie je príliš ľahké. |
| **Skladanie kľúča** (koniec aktu III) | Silný moment, pekná animácia. | Bez zmeny. |
| **Truhlica so zámkami** (finále) | Wow efekt, kolieska, 3D, logika troch zámkov. | Bez zmeny. Náročnejšia na výkon (3D), má však 2D zálohu. |
| **Nápovedy v okne „Prezrieť“** | Prichádzajú samy podľa nečinnosti, nevtieravo. | Po 40 až 60 s je „Ukáž číslicu“ **bez pokuty**, takže hľadanie sa dá úplne obísť. |
| **Celkovo** | Každý predmet má jednu číslicu, zápisník a truhlica sú prehľadné. | Číslice nevyžadujú byť na mieste (stačí obrazovka). Hľadanie trvá zväčša 10 až 30 sekúnd. Chýba prekvapenie a stupňovanie, hra je skôr kontrola než zábava. |
