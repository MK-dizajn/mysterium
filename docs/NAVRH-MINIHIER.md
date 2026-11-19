# Návrh mini hier – nové spôsoby získavania číslic (kapitola I a ďalšie)

Stav k 20. 11. 2026. **Návrh na schválenie, nič z toho ešte nie je v hre.** Dnešný stav opisuje `docs/MECHANIKY-SUPIS.md`.

## Cieľ

- Hľadanie číslice má byť **malá hra na 2 až 4 minúty**, ktorá baví a stupňuje napätie, nie iba ťukanie.
- Hráč sa musí **pozrieť na skutočný detail na mieste**: obrazovka sama odpoveď nedá.
- Každá scéna 1 až 9 dá ako dnes **jednu číslicu**. Zápisník, truhlica, poradie aj kódy zámkov sa nemenia.
- Pri dôležitých chvíľach **wow efekt**: tajná schránka, svetlo, zvuk, vibrácia.
- **Jeden rámec pre všetky mini hry**, ktorý použijeme aj v kapitolách II a III.

## Pravidlá pre každú mini hru

| Pravidlo | Ako ho splníme |
|---|---|
| Mobil, 360 px, jedna ruka | Hracia plocha v dolných dvoch tretinách obrazovky, ovládanie palcom, všetko aspoň 44 × 44 px, bez posúvania do strany. |
| Skutočný detail na mieste | Kľúč k riešeniu je na budove: rok, počet, poradie, tvar, rozdiel. Obrazovka ho nikdy neukáže priamo (iba v 3. nápovede). |
| Trvanie 2 až 4 minúty | Viac krokov alebo dve fázy: najprv nájsť na mieste, potom vyriešiť na obrazovke. |
| Nápovedy v troch stupňoch | Tlačidlo „Nápoveda“ (1. kam sa pozrieť, 2. čo hľadať, 3. takmer riešenie). Po 30 s nečinnosti sa samo jemne ponúkne. |
| „Preskočiť“ s pokutou | Po 3. nápovede alebo po 2 minútach. Odhalí číslicu a strhne **10 bodov** (navrhujem, na rozhodnutie). Dnešné „Ukáž číslicu“ bez pokuty nahradí. |
| 2D záloha bez 3D | Každá mini hra je postavená v 2D (HTML a SVG). 3D je iba ozdoba, napríklad 3D schránka s 2D náhradou. |
| Čítačka obrazovky | Každý prvok je tlačidlo s popisom. Mini hry s ťahaním majú aj tlačidlá („Posunúť doľava“…). |
| Vypnuté animácie | Bez pohybu a zábleskov, zmeny sa iba okamžite prepnú. Vibrácia ostáva (nie je to animácia). |
| Stav po F5 | Rozohraná mini hra sa uloží (napríklad poloha dielikov) a po F5 pokračuje. |
| Bez veľkých knižníc | Všetko vlastným kódom (React, SVG, CSS). Three.js už v hre je a použije sa iba na voliteľné 3D ozdoby. Zvuk cez existujúci `soundManager`, vibrácia cez vstavané `navigator.vibrate`. |

## Typy mini hier

| Typ | Ako sa hrá | Väzba na miesto | Nápovedy (3 stupne) | Kde v kapitole I |
|---|---|---|---|---|
| **Otočná ružica** (vylepšené otáčanie) | Na žetóne je otočný prstenec s menami miest. Hráč ho otočí tak, aby šípka ukazovala na mesto s najkratšou cestou. Žetón cvakne a na hrane sa rozžiari číslica. | Bronzový kruh v dlažbe: smer a vzdialenosti. | 1. Pozri sa na kruh v dlažbe. 2. Hľadaj najkratšie číslo. 3. Otoč šípku na Viedeň. | scéna 1 |
| **Posuvné puzzle + tajná schránka** | Mapa je rozbitá na 3 × 3 dieliky (jeden chýba), hráč ich posúva. Po zložení sa na obrázku otvorí tajná schránka s číslicou. | Obrázok je pohľad na úzky dom; kontrolné miesto: číslo domu na dieliku musí sedieť so skutočným. | 1. Začni rohom s bránou. 2. Úzky dom patrí doprava od brány. 3. Ukáže sa obrys zloženého obrázka. | scéna 2 |
| **Šifra (posun písmen)** | Na zadnej strane listu je zašifrovaný riadok. Hráč otáča šifrovacím kolieskom (posun abecedy), kým nevznikne čitateľné slovo, ktoré je číslica slovom. | Posun = počet slov latinského nápisu na lekárni. | 1. Pátrač šifroval podľa nápisu. 2. Spočítaj slová nápisu. 3. Posuň o daný počet. | scéna 3 |
| **Kryptex / číselníky** | Pečať je valec so 4 krúžkami číslic. Nastaviť správny rok, potom sa valec otvorí a vnútri je pergamen s číslicou. | Rok založenia z pamätnej tabule. | 1. Na tabuli je rok. 2. Je to 15. storočie. 3. Prvé dve číslice. | scéna 4 |
| **Hľadanie rozdielov** | Stará rytina priečelia vedľa prázdneho rámu. Hráč porovnáva so skutočnou budovou a ťuká na miesta, kde sa rytina líši (3 rozdiely). Po treťom sa erb otvorí. | Priečelie paláca; rozdiely sú viditeľné iba na mieste. | 1. Pozri sa hore na štít. 2. Porovnaj okná a sochy. 3. Rozsvietia sa oblasti. | scéna 5 |
| **Slovo v prepise** (ponechané, vylepšené) | Ako dnes, iba bez zvýraznenia. Hráč nájde slovo, ktoré Strážca „povedal dôraznejšie“, podľa otázky o veži. | Delová guľa vo veži; otázka sa pýta na to, čo videl na mieste. | ako dnes plus 3. stupeň zvýrazní vetu | scéna 6 |
| **Skladanie dielikov v schránke** | Po vyriešení úlohy sa otvorí tajná schránka a v nej 3 úlomky zubu kľúča. Hráč ich otáča a skladá do obrysu. Po zložení sa rozsvietia zárezy (číslica). | Tvar úlomkov kopíruje tvar zbroje rytiera (pancier, prilba, štít). | 1. Začni najväčším kusom. 2. Otoč ho hrotom nahor. 3. Obrys ukáže miesto. | scéna 7 |
| **Poradie podľa príbehu** | Na zube sú symboly (koruna, váhy, srdce, meč…). Hráč ich ťuká v poradí, ako idú na fasáde zľava doprava (C – láskavosť, I – spravodlivosť). Správne poradie odkryje zárezy. | Poradie postáv a písmen na fasáde paláca. | 1. Pozri sa na dve detské postavy. 2. Ľavá drží C. 3. Prvé dva symboly sa rozžiaria. | scéna 8 |
| **Dátum na číselníkoch (rímske číslice)** | Pečať mierovej listiny má tri číselníky: deň, mesiac (rímsky) a rok. Nastaviť dátum z tabule, pečať sa zlomí a v nej je zub so zárezmi. | Pamätná tabuľa: „26. XII. 1805“. | 1. Dátum je na tabuli. 2. Mesiac je rímskou číslicou. 3. XII je december. | scéna 9 |
| **Spájanie bodov** (rezerva) | Spojiť body (hviezdy, veže) v správnom poradí; vznikne tvar. | Poradie veží na panoráme mesta. | – | pre kapitolu II alebo III |
| **Zvuková alebo rytmická hádanka** (rezerva) | Zopakovať rytmus zvonov alebo úderov. | Hodiny na veži (treba nahrávku). | – | neskôr, treba zvuky (dnes sú zvukové súbory prázdne) |

## Mapovanie na scény (kapitola I)

| Scéna | Dnes | Návrh | Zmena |
|---|---|---|---|
| 1 Michalská brána | otočiť žetón, nájsť číslicu | **otočná ružica** na žetóne (3D ostáva) | zmeniť |
| 2 Najužší dom | ťukať 8 veží | **posuvné puzzle + tajná schránka** | zmeniť (nové) |
| 3 Lekáreň | otočiť list | **šifra** na zadnej strane listu | zmeniť (nové) |
| 4 Academia | ťukať 6 lúčov | **kryptex** s rokom z tabule | zmeniť (nové) |
| 5 Mirbachov palác | otočiť mapu | **hľadanie rozdielov** rytina a priečelie | zmeniť (nové) |
| 6 Stará radnica | ťuknúť na zvýraznené slovo | **slovo v prepise bez zvýraznenia** | ponechať, vylepšiť |
| 7 Fontána | ťukať 9 zárezov | **skladanie úlomkov v tajnej schránke** | zmeniť (nové) |
| 8 Primaciálny palác | ťukať 2 zárezy | **poradie podľa príbehu** | zmeniť (nové) |
| 9 Bratislavský mier | ťukať 7 zárezov | **dátum na číselníkoch** (rímske číslice) | zmeniť (nové) |
| 10 Pátračov denník | skladanie kľúča | bez zmeny | ponechať |
| Finále | truhlica so zámkami | bez zmeny | ponechať |

Výsledok: 9 rôznych zážitkov namiesto 5× počítania. **Tajná schránka** sa objaví trikrát (scény 2, 7, 9) ako stupňujúci sa motív.

## Wow efekty

- **Tajná schránka:**
  - predmet sa rozsvieti, ozve sa cvaknutie, kryt sa vysunie alebo odklopí,
  - zvnútra vyjde svetlo a prach, potom sa vznesie číslica a „vletí“ do zápisníka,
  - 2D verzia: CSS a SVG. 3D (voliteľne): rovnaký Three.js ako truhlica.
- **Vibrácia (haptika):** krátke ťuknutie pri správnom kroku, dlhší vzor pri otvorení schránky (`navigator.vibrate`). Funguje na Androide, **Safari na iPhone vibráciu nepodporuje**, vtedy sa vynechá.
- **Zvuk:** cvaknutie, škrípanie, otvorenie schránky. **Zvukové súbory hry sú dnes prázdne (0 B)**, treba ich vyrobiť alebo kúpiť (licencia do `docs/MEDIA-LICENCIE.md`).
- **Odhalenie:** číslica sa „vpíše“ rukopisom pátrača a zápisník na chvíľu zažiari na správnom mieste zámku.
- **Vypnuté animácie:** iba okamžité zobrazenie číslice, bez letu a zábleskov. Zvuk a vibrácia ostávajú.

## Rámec pre všetky mini hry (aj kapitoly II a III)

### Komponent

- **`MiniGameShell`** (spoločný rám): nadpis, krátky pokyn, hracia plocha, tlačidlo „Nápoveda“ (3 stupne), „Preskočiť“ (s potvrdením a pokutou), oznámenia pre čítačku, ukladanie stavu, záverečné odhalenie.
- **`SecretCompartment`**: tajná schránka a odhalenie číslice (2D, voliteľne 3D).
- **Jeden súbor pre každý typ hry** (`components/minigames/<typ>.tsx`) s čistou logikou v `engine/minigames/<typ>.ts`. Logika je testovateľná v Node, bez prehliadača.
- **`useHaptics`** a zvuky cez `soundManager` (vibrácia iba ak ju prehliadač vie, iba keď nie je vypnutý zvuk).
- Okno „Prezrieť“ ostane pre predmety bez mini hry a na prezeranie predmetu po objavení číslice.

### Dátový popis v súbore scény

Pri predmete pribudne voliteľné pole `minigame`. Bez neho ostáva dnešné `inspect`.

```ts
minigame: {
  type: "dials",                       // ružica, puzzle, šifra, kryptex, rozdiely, poradie, skladanie…
  intro: "Pečať mierovej listiny sa otvorí iba dátumom, ktorý pozná mesto.",
  config: { dials: [{ values: "1-31", answer: 26 }, { values: "I-XII", answer: "XII" }, { values: "1800-1810", answer: 1805 }] },
  hints: ["…", "…", "…"],
  compartment: true,                   // po vyriešení tajná schránka
  skipPenalty: 10,
}
```

- **Číslica** ostáva v `secretCode` predmetu. Mini hra iba rozhoduje, kedy sa odhalí, takže zápisník a truhlica sa nemenia.
- Nová kapitola = nové dáta, bez nového kódu (pokiaľ stačia existujúce typy).

### Uloženie

- **Verzia v2 stačí.** Pribudne voliteľné pole `minigameState` (stav rozohranej mini hry pre každý predmet) a `skippedCodeItemIds` (preskočené).
- Staré uloženia ho nemajú, hra doplní prázdne (ako pri `revealedCodeItemIds`).
- Plánovaný prechod na v3 pred prvým testerom ostáva nezávisle od mini hier (dá sa urobiť naraz, nie je nutný kvôli nim).

### Skóre

- Úlohy ostávajú 100 / −20. Najviac ostáva 1010 (kto nepreskočí ani jednu mini hru).
- „Preskočiť“ −10 (návrh). Nápovedy v mini hre bez pokuty, aby sa hráč nebál skúšať.

## Obmedzenia a riziká

- **Hlasy:** nahraté texty (úvodný odsek, Hlas pátrača, zápis č. 1, koniec aktu I, záver) sa nemenia. Mini hry majú vlastné nenahraté texty.
  - **Pozor, scéna 6:** Hlas pátrača hovorí o „rane v múre“ a Strážcov prepis nie je nahratý, takže je bez rizika.
  - **Pozor, scéna 9:** hlasy #57 a #58 spomínajú „miestnosť, ktorá znásobuje každý obraz“, čo s mini hrou o dátume nesúvisí, ale nekoliduje.
- **Výkon:** mini hry v 2D (SVG a CSS) sú ľahké. 3D iba pri schránke a voliteľne, s 2D zálohou. Pamäť testov pri tom stráži strážca pamäte.
- **Dostupnosť:** posuvné puzzle a skladanie sú pre čítačku náročné. Ovládanie tlačidlami sa dá, ale je pomalé. Návrh: pri čítačke „Preskočiť“ bez pokuty, alebo jednoduchšia otázka (na rozhodnutie).
- **Čas hráča:** 9 mini hier × 2 až 4 min = **18 až 36 min navyše** k dnešným asi 2 hodinám. Odporúčam terénnu skúšku po prvých troch.
- **Terén:** každá mini hra stojí na skutočnom detaile (rok, poradie, rozdiely, tvar). Detaily treba **overiť na mieste** pred dokončením (napríklad rozdiely na Mirbachovom paláci a rok na tabuli Academie). Pri scéne 9 je dátum 26. XII. 1805 už overený fotkou tabule.
- **Obrázky:** rytina na hľadanie rozdielov a obrázok na puzzle budú nakreslené v kóde (SVG) podľa vlastných fotiek, nie prevzaté, aby nebol problém s licenciou.
- **Testy:** každá mini hra pridá jeden Node test (logika) a jeden test v prehliadači. Celá séria potrvá dlhšie (dnes 30 min). Navrhujem pri každej mini hre spúšťať iba jej testy a súvisiace, celú sériu pri každej tretej.

## Postup po schválení (po jednej mini hre)

Každý krok bude mať test pred a po zmene, build, lint, denník a commit iba dotknutých súborov, bez pushu.

| Krok | Obsah | Odhad |
|---|---|---|
| M0 | Rámec: `MiniGameShell`, nápovedy, „Preskočiť“ s pokutou, uloženie stavu, tajná schránka 2D, vibrácia, dáta `minigame` | 1 väčší krok |
| M1 | Scéna 9: dátum na číselníkoch + schránka (používa logiku koliesok z truhlice, overený detail) | 1 krok |
| M2 | Scéna 2: posuvné puzzle + schránka | 1 krok |
| M3 | Scéna 4: kryptex (rok z tabule, treba overiť) | 1 krok |
| M4 | Scéna 3: šifra | 1 krok |
| M5 | Scéna 1: otočná ružica (3D žetón ostáva) | 1 krok |
| M6 | Scéna 8: poradie podľa príbehu | 1 krok |
| M7 | Scéna 7: skladanie úlomkov v schránke | 1 krok |
| M8 | Scéna 5: hľadanie rozdielov (po overení priečelia) | 1 krok |
| M9 | Scéna 6: prepis bez zvýraznenia | malý krok |
| M10 | Zvuky (keď budú súbory), voliteľná 3D schránka, celková séria testov a terénna skúška | 1 krok |
