# Zoznam zvukov hry

Spoločný zoznam všetkých zvukov hry (kapitola I): kedy zaznejú a ako majú znieť, aby ich Miloš mohol pripraviť. Stav k 23. 11. 2026 (krok T5c).

**Hra má 23 zvukov.** Žiadny zvukový súbor zatiaľ nie je hotový, hra je tichá. Každý zvuk má v hre pripravené tiché miesto: kým súbor chýba alebo je prázdny, zvuk sa nespúšťa a nič sa nesťahuje.

## Spoločné pravidlá

- **Formát:** mp3, súbor do priečinka `public/sounds/` s presne takým názvom ako v tabuľke.
- **Začiatok:** bez ticha na začiatku (zvuk musí začať hneď, inak nesedí s pohybom na obrazovke).
- **Hlasitosť:** súbor normalizovať na rovnakú úroveň; jemnú hlasitosť v hre nastavuje stĺpec „Hlasitosť“ (0 až 1).
- **Licencia:** každý zvuk zapísať do `docs/MEDIA-LICENCIE.md` (zdroj, autor, licencia, či je povolené komerčné použitie).
- **Prepínač zvuku v lište:** všetky zvuky ho rešpektujú. Pri vypnutom zvuku nehrá nič, ani zvuk mesta.
- **Nahraté hlasy:** krátke zvuky nesmú znieť súčasne s nahratým hlasom (rozprávač, pátrač, Strážca). Zvuk pred videom Strážcu zaznie tesne pred ním a video začne až po ňom.
- **Vypnuté animácie:** zvuky a vibrácie ostávajú, iba sa nehýbe obraz.
- **Po dodaní súboru:** v `lib/soundManager.ts` pri danom zvuku odstrániť `ready: false` (alebo o to požiadať) a vyskúšať na mobile.
- **Rovnaký súbor pre 2D aj 3D truhlicu:** obe verzie púšťajú zvuky v rovnakých chvíľach.

## Hra a úlohy

| Súbor | Kedy zaznie | Ako má znieť | Dĺžka | Hlasitosť | Stav súboru | Zapojenie |
|---|---|---|---|---|---|---|
| `puzzle-success.mp3` | správna odpoveď v úlohe („Odpoveď potvrdená…“) | krátky jasný pozitívny tón, ako cvaknutie zámku s ťingom; nie fanfára | 0,4–0,7 s | 0,65 | prázdny (0 B) | zapojený (krok T5c) |
| `npc-message.mp3` | každá nová replika v písanom rozhovore so Strážcom; tesne pred videom Strážcu pri bráne (video začne 0,5 s po ňom, nie súčasne s hlasom) | tichý šuchot pergamenu alebo jemné cinknutie, „niekto prehovorí“ | 0,2–0,4 s | 0,45 | prázdny (0 B) | zapojený (krok T5c) |
| `digit-found.mp3` | v okne „Prezrieť“ sa objaví číslica (hľadanie číslice na predmete) | krátke svetlé cinknutie, objav | 0,4–0,8 s | 0,5 | chýba | zapojený |
| `city-ambient.mp3` | zvuk mesta v pozadí počas hry (okrem úvodnej obrazovky, artefaktu a rozhovoru), plynulé zosilnenie a zoslabenie | tiché staré mesto: kroky na dlažbe, vzdialené hlasy, holuby, bez hudby a bez áut; bez výrazných udalostí | 30–60 s, plynulá slučka (koniec nadväzuje na začiatok) | 0,3 | prázdny (0 B) | zapojený |
| `button-click.mp3` | ťuknutie na tlačidlo | veľmi krátke tiché ťuknutie | 0,05–0,1 s | 0,35 | chýba | voliteľný, nezapojený (pri každom ťuknutí by rušil; rozhodnutie z 23. 11. 2026) |
| `artifact-unlock.mp3` | odomknutie artefaktu v starej truhlici konca aktu | magické zažiarenie, trblietanie | 1,0–1,5 s | 0,7 | prázdny (0 B) | dnes nezapojený: stará truhlica (`components/ui/chest/Chest.tsx`) sa v hre nepoužíva a finále ho od kroku T5a nepúšťa |
| `chest-unlock.mp3` | odomknutie starej truhlice konca aktu | cvaknutie zámku a škrípnutie veka | 0,8–1,2 s | 0,55 | prázdny (0 B) | dnes nezapojený (rovnako ako riadok vyššie) |

## Mini hry (scéna 9 a ďalšie)

| Súbor | Kedy zaznie | Ako má znieť | Dĺžka | Hlasitosť | Stav súboru | Zapojenie |
|---|---|---|---|---|---|---|
| `dial-click.mp3` | otočenie číselníka v mini hre o jeden krok (scéna 9, neskôr ružica, kryptex, šifrovacie koliesko) | suché mechanické cvaknutie kovu, ako zámok s kolieskami, tiché | 0,1–0,2 s | 0,5 | chýba | zapojený (scéna 9) |
| `minigame-wrong.mp3` | nesprávny pokus v mini hre (zlý dátum, zlé poradie) | tlmený tupý úder, nie nepríjemný bzučiak | 0,3–0,4 s | 0,5 | chýba | zapojený (scéna 9) |
| `hint-open.mp3` | otvorenie nápovedy v mini hre | šuchot papiera (otočenie strany zápisníka) | 0,3–0,5 s | 0,4 | chýba | zapojený |
| `compartment-open.mp3` | otvorenie tajnej schránky (pečať praskne, veko sa odklopí) | cvaknutie, škrípnutie pántu a krátke zvonenie, tajomné | 1,2–1,8 s | 0,7 | chýba | zapojený (scéna 9) |
| `digit-reveal.mp3` | číslica sa vynorí zo schránky a vpíše do zápisníka | magický svetelný zvuk, trblietanie, končí čistým tónom | 1,0–1,5 s | 0,6 | chýba | zapojený (scéna 9) |
| `tile-slide.mp3` | posun dielika v puzzle, položenie úlomku (budúce mini hry scén 2 a 7) | krátke šúchnutie dreva alebo kameňa | 0,2–0,3 s | 0,5 | chýba | pripravený pre budúce mini hry, zatiaľ nezapojený |
| `minigame-correct-step.mp3` | správny čiastkový krok (správny symbol v poradí, nájdený rozdiel; budúce mini hry) | jemný jasný tón, „ťing“ | 0,3 s | 0,5 | chýba | pripravený pre budúce mini hry, zatiaľ nezapojený |

## Finále: fotografia

| Súbor | Kedy zaznie | Ako má znieť | Dĺžka | Hlasitosť | Stav súboru | Zapojenie |
|---|---|---|---|---|---|---|
| `photo-piece-snap.mp3` | útržok fotografie zapadne na svoje miesto pri skladaní (4×) | suché cvaknutie kartónu, ako keď sa fotka zasunie do rámika | 0,2–0,3 s | 0,5 | chýba | zapojený |

## Finále: truhlica (3D aj 2D)

Časy sú v sekundách od ťuknutia (otvorenie zámku trvá 1,1 s, otvorenie truhlice 4,5 s).

| Súbor | Kedy zaznie | Ako má znieť | Dĺžka | Hlasitosť | Stav súboru | Zapojenie |
|---|---|---|---|---|---|---|
| `chest-dial-click.mp3` | správny kód: kolieska zámku postupne zapadnú (0,08 / 0,18 / 0,28 s, spolu 3×) | jemné kovové cvaknutie kolieska | 0,05–0,1 s | 0,4 | chýba | zapojený |
| `chest-lock-open.mp3` | pružina zámku cvakne a oblúk vyskočí (0,3 s); pri vypnutých animáciách hneď | výrazné kovové cvaknutie mosadzného zámku | 0,3–0,5 s | 0,7 | chýba | zapojený |
| `chest-lock-wrong.mp3` | zlý kód zámku (zámok sa zatrasie) | tupé zadrhnutie, zámok nepovolí | 0,3–0,4 s | 0,6 | chýba | zapojený |
| `chest-shine.mp3` | zlatý odlesk po otvorení zámku (0,6 s) a odlesk po útržku pri otvorení truhlice (3,9 s) | krátke jemné trblietanie | 0,5–0,8 s | 0,5 | chýba | zapojený |
| `chest-hasp-release.mp3` | po treťom zámku sa odklopia železné spony (asi 1,1 s po otvorení posledného zámku) | ťažké železné cvaknutie a krátke vŕzganie | 0,5–0,8 s | 0,6 | chýba | zapojený |
| `chest-key-insert.mp3` | Zlatý kľúč sa zasunie do dierky (0,6 s po ťuknutí na „Vložiť Zlatý kľúč“) | kovové šúchnutie kľúča do zámku | 0,4–0,6 s | 0,5 | chýba | zapojený |
| `chest-key-turn.mp3` | kľúč sa otočí a cvakne (1,8 s) | ťažké cvaknutie starého zámku | 0,3–0,5 s | 0,6 | chýba | zapojený |
| `chest-lid-creak.mp3` | veko sa začne dvíhať (2,1 s); pri vypnutých animáciách hneď po vložení kľúča | pomalé vŕzganie dreveného veka a pántov | 1,0–1,5 s | 0,6 | chýba | zapojený |

## Prehľad stavu

- **Prázdne súbory (0 B):** `artifact-unlock`, `chest-unlock`, `city-ambient`, `npc-message`, `puzzle-success`.
- **Chýbajú úplne:** ostatných 18 zvukov.
- **Zapojené v hre:** 18 zvukov (z toho nové v kroku T5c: `puzzle-success` a `npc-message`).
- **Nezapojené:** `button-click` (voliteľný), `tile-slide` a `minigame-correct-step` (budúce mini hry), `artifact-unlock` a `chest-unlock` (stará truhlica sa nepoužíva).
