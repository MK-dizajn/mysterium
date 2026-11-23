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

### Pravidlo: hráč sa nikdy nezasekne (záväzné pre všetky hry)

Platí pre každú úlohu a každú mini hru v kapitole I aj v budúcich scénach 2 až 8 a v kapitolách II a III (rozhodnutie z 20. 11. 2026, úprava 1 a 3).

- **Úloha s odpoveďou:** posledná nápoveda vždy povie odpoveď v tvare „Správna odpoveď je …“. Odpoveď musí byť presne jedna z odpovedí, ktoré hra pri úlohe prijme. Tlačidlo pred ňou sa volá „Ukázať odpoveď“.
- **Mini hra:**
  - má presne 3 nápovedy a tretia prezradí riešenie (napríklad „Nastav 26 · XII · 1805.“),
  - po 3. nápovede (alebo po 2 minútach) je vždy „Preskočiť (−10 bodov)“,
  - mini hry s ťahaním majú pre čítačku obrazovky aj bezplatné preskočenie.
- **Hľadanie číslice v okne „Prezrieť“:** po nápovedách vždy príde „Preskočiť (−10 bodov)“.
- **Strážny test** (Node test O1) to kontroluje pri všetkých kapitolách:
  - posledná nápoveda každej úlohy obsahuje prijatú odpoveď,
  - každá mini hra má 3 nápovedy a pre jej typ platí pravidlo „posledná nápoveda prezradí riešenie“,
  - rámec mini hier a okno „Prezrieť“ vždy ponúknu „Preskočiť (−10 bodov)“.
- **Nový typ mini hry** (napríklad posuvné puzzle) test zastaví, kým sa do neho nedoplní pravidlo pre posledné nápovedy tohto typu. Bez toho sa hra nedá dokončiť.

### Pravidlo: nápovedy k úlohám (záväzné aj pre kapitoly II a III)

Rozhodnutie z 21. 11. 2026.

- Každá úloha má **presne 3 nápovedy**:
  1. **smer**: kam sa pozerať, čo hľadať,
  2. **zúženie**: takmer vedie k odpovedi (forma, počet písmen, súvislosť), ale odpoveď nepovie,
  3. **odpoveď**: „Správna odpoveď je …“, tlačidlo pred ňou sa volá „Ukázať odpoveď“.
- **Ceny:**
  - nápoveda 1 stojí 5 bodov, nápoveda 2 stojí 5 bodov, „Ukázať odpoveď“ 10 bodov,
  - úloha dá 100 bodov bez nápovied a najmenej 80,
  - cena je napísaná na tlačidle, napríklad „Prečítať ďalšiu poznámku (−5 bodov)“.
- **Bez opakovania:** žiadna nápoveda neopakuje zadanie, riadok nad odpoveďou ani Radu pátrača (test hľadá štyri slová za sebou). Každá nápoveda prináša novú informáciu.
- **Odpoveď:** nápovedy 1 a 2 neobsahujú žiadnu z odpovedí, ktoré hra prijme (pozor aj na krátke prijaté odpovede, napríklad „znak“ alebo „mier“).
- **Fakty:** iba overené, z textov hry alebo z terénu. Neistý fakt treba označiť a overiť.
- **Hlasy:** texty s nahratým hlasom sa kvôli nápovedám nemenia.
- **Mini hry a okno „Prezrieť“** majú vlastné tri stupne nápovied a „Preskočiť (−10 bodov)“, toto pravidlo sa ich netýka.
- **Strážny test** (Node test O11) to kontroluje pri každej úlohe.

### Pravidlo: údaj z mini hry iba na mieste

Rozhodnutie z 21. 11. 2026.

- Údaj, ktorý hráč zadáva do mini hry (rok, dátum, počet, poradie, posun…), **nesmie byť napísaný v texte hry**: v zadaní, nápovedách úlohy, príbehu miesta, artefakte, opise predmetu ani v úvode mini hry.
- Je iba na reálnom mieste (tabuľa, fasáda) a v **3. nápovede mini hry**, ktorá prezradí riešenie, aby sa hráč nezasekol.
- Pred začatím každej mini hry treba prejsť texty jej scény a údaj z nich odstrániť (texty s hlasom sa nemenia; ak by údaj bol v nahratom texte, treba to riešiť s autorom).
- **Scéna 9 (hotová):**
  - deň a mesiac (26. XII.) boli zo zadania, otázky, nápovedy, príbehu miesta a artefaktu odstránené,
  - zadanie je teraz „Aký mier bol podpísaný v Primaciálnom paláci po bitke pri Slavkove?“,
  - **rok 1805 v príbehu a artefakte zatiaľ ostáva** (rozhodnutie autora: z príbehu vynechať deň a mesiac).

### Riziká pre plánované mini hry (vyriešiť pred ich začatím)

| Scéna | Mini hra a údaj | Kde je údaj dnes v texte hry | Návrh |
|---|---|---|---|
| 3 Lekáreň | **šifra**, posun = počet slov latinského nápisu | Celý latinský nápis je v príbehu miesta („Quidquid agis, prudenter agas et respice finem, 1658“) a od 21. 11. 2026 aj v nápovede 1 úlohy. Hráč spočíta slová z obrazovky. Slovenský preklad je aj v nahratom Hlase pátrača (#22), ten sa nemení, ale má iný počet slov. | Pred M4 skrátiť nápis v nápovede 1 a v príbehu iba na začiatok („Quidquid agis…“), alebo zvoliť iný kľúč šifry, ktorý je iba na fasáde. |
| 4 Academia | **kryptex**, rok založenia 1465 | Príbeh miesta („bola založená v roku 1465“) a krátky text artefaktu („bola založená v roku 1465“). Z nápovede 1 bol rok odstránený 21. 11. 2026. Nahraté texty scény rok nemajú. | Pred M3 vynechať rok z príbehu a artefaktu (napríklad „v 15. storočí“). |
| 5 Mirbachov palác | **hľadanie rozdielov** rytina a priečelie | Zadanie opisuje „výzdobu zakončenú korunou“, príbeh „erb pod grófskou korunou“, nápoveda 1 „ornament s dvoma farebnými medailónmi“. | Rozdiely voliť mimo erbu, koruny a medailónov (okná, nadokenice s mušľou, zábradlie balkóna, pilastre, mreže, portály). Inak text prezradí, kde rozdiel hľadať. |

### Podmienky pred stavbou mini hier

Rozhodnutia autora z 23. 11. 2026. Každá podmienka sa splní **v tom istom kroku**, v ktorom sa stavia daná mini hra, a jej test ju skontroluje.

- **Scéna 3 – šifra (krok M4):**
  - v príbehu miesta a v nápovede 1 úlohy sa latinský nápis skráti na „Quidquid agis…“ so slovenským prekladom,
  - celú vetu a jej slová (kľúč šifry) musí hráč nájsť na fasáde lekárne,
  - nahratý Hlas pátrača (#22) sa nemení.
- **Scéna 4 – kryptex (krok M3):**
  - v príbehu miesta a v artefakte bude „v 15. storočí“ namiesto roku 1465,
  - rok založenia je iba na pamätnej tabuli (a v 3. nápovede kryptexu).
- **Scéna 5 – hľadanie rozdielov (krok M8):**
  - rozdiely budú v oknách, balkóne, pilastroch, mrežiach a portáloch, nie na erbe (ani na korune a medailónoch),
  - stále platí: rozdiely na tvaroch a počte, nie na farbách.
- **Scéna 9 – dátum na číselníkoch (hotové):**
  - rok 1805 ostáva v texte hry (príbeh a artefakt),
  - deň a mesiac sú iba na tabuli (a v 3. nápovede mini hry).

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

- Úloha dá 100 bodov, nápovedy stoja 5, 5 a 10 bodov (od 21. 11. 2026, predtým −20 za každú). Najviac ostáva 1010 (kto nepreskočí ani jednu mini hru a nečíta nápovedy).
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

## Rozhodnutia (20. 11. 2026)

1. **Mapovanie** schválené. Scény 4 a 5 sa robia až na záver, lebo čakajú na overenie v teréne.
2. **„Preskočiť“ stojí −10 bodov.** Nahrádza dnešné „Ukáž číslicu“ a je vždy dostupné po nápovedách, aby sa hráč nikdy nezasekol.
3. **Čítačka obrazovky:** pri posuvnom puzzle a skladaní úlomkov je „Preskočiť“ bez pokuty.
   - Rieši sa samostatným tlačidlom, ktoré vidí iba čítačka obrazovky.
4. **Terén:** tabuľu Academie a priečelie Mirbachovho paláca overí Miloš naživo. Zatiaľ platia údaje z fotiek (nižšie).
5. **Zvuky** vyrobí Miloš podľa zoznamu nižšie. Hra má pre ne pripravené miesta a kým súbory nie sú, ostáva ticho.
6. **Postup:** M0 (rámec), potom scéna 9. Potom zastaviť a nechať vyskúšať na mobile.

## Terénne údaje z fotiek (zatiaľ neoverené naživo)

### Scéna 4 – tabuľa Academie Istropolitany

- **Text podľa fotky:** „Národná kultúrna pamiatka. Academia Istropolitana. Prvá vysoká škola na Slovensku založená v r. 1465 Matejom Korvínom. Gotická stavba zo polovice 15. storočia.“
- **Kľúčový údaj pre kryptex: rok 1465.**
- „15. storočie“ na tabuli je **zavádzač**: hráč, ktorý nastaví 15xx podľa storočia, ešte nemá celý rok.
- Miloš text pri obhliadke overí zblízka.

### Scéna 5 – Mirbachov palác

- **Tabuľa:** „Kultúrna pamiatka. Mirbachov palác. Rokoková stavba z r. 1768–1770.“ so znakom mesta.
- **Stále prvky priečelia** (podklad pre rozdiely):
  - štít s erbom (dva okrúhle medailóny),
  - tri oblúkové nadokenice s ornamentom v tvare mušle,
  - zábradlie balkóna nad portálom,
  - zväzky pilastrov medzi oknami,
  - mreže na oknách prízemia,
  - hlavný a bočný portál.
- **Rozdiely stavať na tvaroch a počte, nie na farbách ani zlatení.** Farby môžu byť z obnovy a rytina je čiernobiela.
- **Nepoužívať** transparenty a vlajky, menia sa.
- Starú rytinu paláca Miloš hľadá a overí jej licenciu. Kým nebude, kreslí sa vlastná rytina v kóde.

## Zoznam zvukov (vyrobí Miloš)

Súbory patria do `public/sounds/`, formát mp3, krátke a bez ticha na začiatku. Kým súbor chýba, hra ho nespúšťa (ticho). Licenciu zapísať do `docs/MEDIA-LICENCIE.md`.

| Súbor | Kedy sa spustí | Ako má znieť | Dĺžka |
|---|---|---|---|
| `dial-click.mp3` | otočenie číselníka, kolieska, ružice alebo šifrovacieho kolieska o jeden krok | suché mechanické cvaknutie kovu (ako zámok s kolieskami), tiché | 0,1–0,2 s |
| `tile-slide.mp3` | posun dielika v puzzle, položenie úlomku | krátke šúchnutie dreva alebo kameňa | 0,2–0,3 s |
| `minigame-correct-step.mp3` | správny čiastkový krok (správny symbol v poradí, nájdený rozdiel) | jemný jasný tón, „ťing“ | 0,3 s |
| `minigame-wrong.mp3` | nesprávny pokus (zlý dátum, zlé poradie) | tlmený tupý úder, nie nepríjemný bzučiak | 0,3–0,4 s |
| `compartment-open.mp3` | otvorenie tajnej schránky (zlomenie pečate, vysunutie krytu) | cvaknutie, škrípnutie pántu a krátke zvonenie, tajomné | 1,2–1,8 s |
| `digit-reveal.mp3` | číslica sa vynorí a vpíše do zápisníka | magický svetelný zvuk, trblietanie, končí čistým tónom | 1,0–1,5 s |
| `hint-open.mp3` | otvorenie nápovedy | šuchot papiera (otočenie strany zápisníka) | 0,3–0,5 s |

Existujúce prázdne súbory (0 B) z dnešnej hry (`artifact-unlock`, `chest-unlock`, `city-ambient`, `npc-message`, `puzzle-success`) ostávajú v zozname `docs/MEDIA-LICENCIE.md` ako „treba vytvoriť“.

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
