# Koncept kapitol – Mysterium

Tento dokument určuje pravidlá, podľa ktorých sa navrhuje každá kapitola Mysteria. Platí pre prvú kapitolu aj pre všetky ďalšie.

---

## 1. Dĺžka a rozsah kapitoly

- Jedna kapitola trvá **90 až 120 minút** hrania vrátane chôdze medzi miestami.
- Kapitola má **10 až 12 úloh**.
- Úlohy sú rozdelené do **aktov**. Kapitola má zvyčajne 3 akty.

## 2. Jedna truhlica na konci kapitoly

- Kapitola má **jednu truhlicu**, až vo **finále** (pozri kapitolu 5).
- Truhlica má **tri zámky**, jeden za každý akt. Odomykajú sa v poradí **I, II, III**.
- Kód každého zámku tvoria **tri číslice z predmetov úloh** daného aktu (pozri kapitolu 3).
- Po troch zámkoch sa do truhlice vloží **kľúč** z posledného aktu (v kapitole I Zlatý prešporský kľúč) a veko sa otvorí.
- Otvorená truhlica dá odmenu, ktorá posunie príbeh (v kapitole I štvrtý útržok fotografie).
- Hráč musí vždy vedieť, čo mu chýba: **Zápisník kódov** ukazuje nájdené aj chýbajúce číslice a pri truhlici sa dá predmet s chýbajúcou číslicou hneď „Prezrieť“.
- Kódy kontroluje iba hra (engine), v rozhraní sa nikde nezobrazujú.

## 3. Odmena po každej úlohe

- Po vyriešení úlohy dostane hráč **predmet**.
- Predmet má:
  - **vodidlo** – kam ísť ďalej,
  - **ukrytú číslicu** – jednu číslicu kódu zámku daného aktu.
- Číslicu treba objaviť v okne **„Prezrieť“**: predmet otočiť, obrátiť alebo spočítať jeho prvky. Po objavení sa sama zapíše do Zápisníka kódov.
- Posledná úloha kapitoly môže namiesto číslice dať kľúč do truhlice.

## 4. Koniec aktu

- Koniec aktu je **krátka scéna bez truhlice**, napríklad hlas Strážcu, pečať alebo zloženie kľúča.
- Hráč dostane **útržok fotografie**. Útržky sa vo finále zložia do jednej fotografie.

## 5. Finále

Poradie vo finále:

1. **Strážca** prinesie truhlicu.
2. **Truhlica** s tromi zámkami a kľúčom (kapitola 2). Vo vnútri je posledný útržok fotografie.
3. **Historická fotografia** zložená zo všetkých útržkov.
4. Hráč **zadá názov miesta** z fotografie.
5. Karta **„Ďalšie miesto“** s adresou a cestou.
6. **Záverečná obrazovka** so skóre.

## 6. Úloha musí byť spojená s miestom

- Každá úloha je pevne spojená s konkrétnym miestom v meste.
- Nejde iba o to, aby hráč niečo našiel. Úloha má využiť to, čo je pre miesto typické: nápis, erb, stavbu, sochu, príbeh, udalosť alebo postavu.
- Po vyriešení sa hráč o mieste niečo dozvie (krátka história) a pochopí, prečo ho tam pátrač poslal.
- Odpoveď musí byť jednoznačná a zistiteľná priamo na mieste, bez náhodného hádania.
- Nápovedy posúvajú hráča postupne a celé riešenie prezradia až na konci.

## 7. Trasa

- Trasa musí byť pešo prejditeľná a dávať zmysel v reálnom meste.
- Žiadne zbytočné návraty na už navštívené miesta bez príbehového dôvodu.
- Na každom mieste dostane hráč presný popis, kam ísť ďalej.
- **Bez povinného GPS.** Hra je riešiteľná cez herné rozhranie a indície. Prípadná lokalizácia môže byť iba dobrovoľná a musí rešpektovať ochranu súkromia (GDPR).

## 8. Ďalšie kapitoly

- Každá ďalšia kapitola sa odohráva v **inej časti Bratislavy**.
- Kapitoly na seba príbehovo nadväzujú (napríklad historická fotografia a karta „Ďalšie miesto“ na konci kapitoly I ukazujú na ďalší prípad), ale každá sa dá hrať samostatne.
- Konkrétne časti mesta pre ďalšie kapitoly ešte nie sú vybrané.

## 9. Predaj

- Kapitoly sa budú dať kúpiť **jednotlivo** alebo **v balíku** viacerých kapitol.
- Spôsob platby, ceny a technické riešenie predaja ešte nie sú navrhnuté.

## 10. Plánované rozšírenia (neskôr)

Nasledujúce prvky pribudnú až po dokončení a otestovaní prvej kapitoly:

- videá (napríklad filmové úvody aktov),
- zvuky a hudba,
- hlasy postáv a pátrača (namluvené texty),
- ďalšie NPC postavy s rozhovormi.

Každý použitý mediálny súbor sa musí zapísať do `docs/MEDIA-LICENCIE.md`, aby bolo jasné, odkiaľ pochádza a či sa smie použiť v predávanej hre.

---

## 11. Kapitola I v porovnaní s týmto konceptom

Stav k 25. 10. 2026 podľa súčasného kódu:

| Pravidlo | Kapitola I dnes | Spĺňa? |
|---|---|---|
| 90–120 minút | Trasa je kompaktná, odhad 60–75 minút. V teréne zatiaľ neoverené. | Pravdepodobne nie |
| 10–12 úloh | 10 úloh | Áno |
| Jedna truhlica vo finále s tromi zámkami a kľúčom | Truhlica vo finále, zámky I, II, III, Zlatý prešporský kľúč | Áno |
| Predmet s vodidlom a ukrytou číslicou po každej úlohe | Úlohy 1 až 9 dávajú predmet s vodidlom a číslicou, úloha 10 dáva zložený Zlatý prešporský kľúč | Áno |
| Koniec aktu bez truhlice, s útržkom fotografie | Akt I: hlas Strážcu, akt II: pečať, akt III: zloženie kľúča; po každom útržok fotografie | Áno |
| Finále (Strážca, truhlica, fotografia, ďalšie miesto, záver) | Všetky časti hotové | Áno |
| Úloha spojená s miestom | Áno, každá úloha využíva detail miesta (nápis, erb, dom, fontána…) | Áno |
| Bez GPS | Áno | Áno |

**Úlohy kapitoly I:**

| Akt | Úloha | Miesto | Predmet |
|---|---|---|---|
| I | 1. Bod, od ktorého sa meria svet | Michalská brána | Žetón nultého kilometra |
| I | 2. Dom, ktorý sa zmestil do medzery | Najužší dom pri Michalskej bráne | Kus mapy: staré mesto |
| I | 3. Mysli na koniec | Lekáreň U Salvátora | Pátračova strana z denníka |
| II | 4. Dom, v ktorom sa začalo vzdelanie | Academia Istropolitana | Pečať vzdelanosti |
| II | 5. Znak posledných pánov | Mirbachov palác | Kus mapy: námestie |
| II | 6. Stopa, ktorú mesto neodstránilo | Stará radnica | Nahrávka Strážcu |
| III | 7. Strážca nad vodou | Maximiliánova fontána | Prvý zub Zlatého kľúča |
| III | 8. Láskavosť a spravodlivosť | Primaciálny palác | Druhý zub Zlatého kľúča |
| III | 9. Miestnosť, ktorá zmenila Európu | Primaciálny palác | Tretí zub Zlatého kľúča |
| III | 10. Zlatý prešporský kľúč | Finále (Primaciálny palác) | Zlatý prešporský kľúč (zložený z troch zubov) |

Číslice kódov tu zámerne nie sú uvedené.

**Poznámka:** ďalšie miesto vo finále (Slovenské národné divadlo, Hviezdoslavovo námestie 1) je zatiaľ dočasné a pred vydaním sa musí nahradiť skutočným (pozri `docs/KONTROLA-PRED-VYDANIM.md`).

---

## 12. Zmeny konceptu

- **Pôvodné pravidlo „Truhlica po každom akte“:** na konci každého aktu bola truhlica s kódom z dôkazov daného aktu. Truhlicu nebolo možné otvoriť bez všetkých dôkazov z aktu a hráč musel dostať jasnú správu, čo mu chýba. Otvorená truhlica dala odmenu, ktorá posunula príbeh (napríklad útržok fotografie alebo časť mapy).
- **Nové pravidlá** pochádzajú z konceptu zážitku (`docs/KONCEPT-ZAZITKU.md`, krok 14, 22. 10. 2026): predmet s vodidlom po každej úlohe, jedna truhlica s tromi zámkami ako finále kapitoly a ľahké konce aktov bez truhlice. Naprogramované boli v krokoch B1 až B7 (konce aktov bez truhlice od kroku B2, truhlica vo finále od kroku B4, v 3D v krokoch B4c-1 až B4c-3).
- Útržok mapy na konci kapitoly sa už nepoužíva; na ďalší prípad ukazuje historická fotografia a karta „Ďalšie miesto“.
- Tento dokument bol zosúladený s dnešným stavom 25. 10. 2026 (krok C3). Kapitoly sa pri tom prečíslovali, lebo pribudli kapitoly 3 až 5.
