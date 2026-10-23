# Kontrola pred vydaním hry

Zoznam vecí, ktoré treba overiť pred vydaním hry (alebo pred prvým externým testerom). Každá položka sa odškrtne až po overení.

| Hotové | Čo skontrolovať | Ako | Prečo |
|---|---|---|---|
| ☐ | V dátach nezostal žiadny dočasný údaj s `isPlaceholder` | Vyhľadať `isPlaceholder` v priečinku `data/` – nesmie sa nájsť žiadny výskyt. | Dočasné údaje (napríklad ďalšie miesto vo finále: Slovenské národné divadlo, Hviezdoslavovo námestie 1) sa musia pred vydaním nahradiť skutočnými. |
| ☐ | Dočasná fotografia vo finále je nahradená skutočnou historickou fotografiou | Vymeniť súbor `public/images/finale/historicka-fotografia.jpg` (alebo cestu `imageSrc` v `data/chapter-one/finale.ts`), pomer 4 : 3; zapísať zdroj a licenciu do `docs/MEDIA-LICENCIE.md`. | Dnešný obrázok je iba dočasná kresba (krok B5). |
