# Kontrola pred vydaním hry

Zoznam vecí, ktoré treba overiť pred vydaním hry (alebo pred prvým externým testerom). Každá položka sa odškrtne až po overení.

| Hotové | Čo skontrolovať | Ako | Prečo |
|---|---|---|---|
| ☐ | V dátach nezostal žiadny dočasný údaj s `isPlaceholder` | Vyhľadať `isPlaceholder` v priečinku `data/` – nesmie sa nájsť žiadny výskyt. | Dočasné údaje (napríklad ďalšie miesto vo finále: Slovenské národné divadlo, Hviezdoslavovo námestie 1) sa musia pred vydaním nahradiť skutočnými. |
| ☐ | Vodidlá a cesty („Ukáž cestu“) sedia v teréne | Prejsť celú trasu s hrou a pri každej scéne overiť vodidlo aj cestu v `data/chapter-one/*.ts` (pole `clue` pri odmene a `route` pri scéne). Najmä: **scéna 1** – kde presne stojí najužší dom a ktorým smerom ísť „bránou“; **2 → 3** – či je nad vchodom Lekárne U Salvátora naozaj postava Spasiteľa; **3 → 4** – pamätná tabuľa na budove Academie Istropolitany; **4 → 5** – „pri františkánoch“ (Františkánske námestie, Mirbachov palác); **5 → 6** – veža Starej radnice; **6 → 7** – fontána v strede námestia a postava na jej vrchole; **7 → 8** – krátky priechod z Hlavného na Primaciálne námestie; **8 → 9** a **9 → 10** – všetko pri Primaciálnom paláci zvonku. | Vodidlá a cesty sú napísané podľa mapy, nie z terénu (krok C1). |
| ☐ | Dočasná fotografia vo finále je nahradená skutočnou historickou fotografiou | Vymeniť súbor `public/images/finale/historicka-fotografia.jpg` (alebo cestu `imageSrc` v `data/chapter-one/finale.ts`), pomer 4 : 3; zapísať zdroj a licenciu do `docs/MEDIA-LICENCIE.md`. | Dnešný obrázok je iba dočasná kresba (krok B5). |
