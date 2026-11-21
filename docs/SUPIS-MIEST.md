# Súpis miest – Kapitola I

Všetky zastávky, ku ktorým hra hráča vedie, a ako ich dnes hľadá na mape. Slúži na zapísanie súradníc, ktoré Miloš odmeria v Google Maps.

Stav: 21. 11. 2026 (oprava 2, príprava).

## Ako hra dnes pracuje s miestami

- **Hra nezisťuje polohu telefónu.** Nemá žiadne GPS súradnice, polomery ani kontrolu polohy.
- **Kontrola polohy sa nepridáva** (rozhodnutie z 21. 11. 2026). Pri bráne ostáva ručné potvrdenie „Som pri bráne“.
- Hráča vedú texty: zadanie úlohy, cesta („Ukáž cestu“) a vodidlo na ďalšie miesto.
- **Na mapu dnes odkazuje hra iba na dvoch miestach**, hľadaním podľa názvu (`https://www.google.com/maps/search/?api=1&query=…`):
  - úvod („Vydaj sa k Michalskej bráne“): tlačidlo „Otvoriť v mapách“,
  - finále (karta „Ďalšie miesto“): tlačidlo „Otvoriť v mapách“.
- Pri hľadaní podľa názvu určuje bod Google. Pri SND môže špendlík padnúť do stredu Hviezdoslavovho námestia alebo k novej budove SND na Pribinovej ulici.

## Pole pre súradnice v dátach

- Každá zastávka (scény 1 až 9) má v dátach pole `mapPoint`, zatiaľ `null`. Súbory: `data/chapter-one/<scéna>.ts`.
- Ďalšie miesto vo finále (SND) má pole `nextPlace.mapPoint`, zatiaľ `null`. Súbor: `data/chapter-one/finale.ts`.
- Tvar po odmeraní: `mapPoint: { lat: 48.14xxxx, lng: 17.10xxxx }` (zemepisná šírka, dĺžka).
- Odkaz z neho bude mať tvar `https://www.google.com/maps?q=šírka,dĺžka`.
- Scéna 10 (Pátračov denník) nemá miesto, hráč ostáva pri Primaciálnom paláci.

## Ako odmerať súradnice

1. V Google Maps nájdi miesto a priblíž mapu čo najviac.
2. Podrž prst na presnom bode (napríklad pri vstupe alebo pod oblúkom brány), kým sa neukáže špendlík.
3. Hore sa ukážu čísla, napríklad `48.14466, 17.10652`. Ťukni na ne, skopírujú sa.
4. Zapíš ich do stĺpca **Odmerané súradnice** a pošli ich.

## Tabuľka

| Scéna | Miesto (čo hráč hľadá) | Presný bod (kam má odkaz viesť) | Odmerané súradnice (šírka, dĺžka) | Odkaz na mapu (po odmeraní) | Dnes v hre | Poznámka |
|---|---|---|---|---|---|---|
| Úvod a 1 | Michalská brána, bronzový kruh nultého kilometra v dlažbe | priechod pod oblúkom brány (kruh v dlažbe) | | | „Otvoriť v mapách“ hľadaním podľa názvu „Michalská brána, Michalská ulica, Bratislava“; „Som pri bráne“ potvrdzuje hráč | brána je veľká, bod má byť pod oblúkom, nie na veži alebo za bránou |
| 2 | Najužší dom pri Michalskej bráne (dom č. 15) | fasáda úzkeho domu hneď pri bráne | | | iba text (cesta a vodidlo) | dom je len pár krokov od brány, bod musí byť na správnej strane |
| 3 | Lekáreň U Salvátora (Panská ulica) | vchod lekárne s postavou Spasiteľa | | | iba text | v kontrole pred vydaním je aj overenie postavy nad vchodom |
| 4 | Academia Istropolitana (Ventúrska ulica) | fasáda s pamätnou tabuľou | | | iba text | budova má viac vchodov, bod pri tabuli |
| 5 | Mirbachov palác (Františkánske námestie) | hlavné priečelie paláca | | | iba text | |
| 6 | Stará radnica, veža (Hlavné námestie) | veža zo strany Hlavného námestia (gotické okno s delovou guľou) | | | iba text | bod na strane námestia, nie z nádvoria |
| 7 | Maximiliánova fontána (stred Hlavného námestia) | fontána | | | iba text | |
| 8 | Primaciálny palác (Primaciálne námestie) | hlavné priečelie paláca | | | iba text | scény 8 a 9 sú na tom istom mieste |
| 9 | Primaciálny palác – pamätná tabuľa Bratislavského mieru | vonkajšia stena s pamätnou tabuľou | | | iba text | ak je tabuľa na inej strane ako priečelie, bod pri tabuli |
| Finále | Slovenské národné divadlo, historická budova | **hlavný vstup historickej budovy z Hviezdoslavovho námestia** | | | „Otvoriť v mapách“ hľadaním podľa názvu „Slovenské národné divadlo, Hviezdoslavovo námestie 1, Bratislava“ | **známy problém:** bod dnes môže padnúť do stredu námestia alebo k novej budove SND; v dátach je ešte označené ako dočasné (`isPlaceholder`) |

## Návrh: „Otvoriť v mapách“ pri každej zastávke (až po odmeraní)

- Odkaz bude v tvare `https://www.google.com/maps?q=šírka,dĺžka` a otvorí sa v novom okne (v telefóne v aplikácii Mapy).
- Ukáže sa iba pri zastávke, ktorá má súradnice. Kým `mapPoint` je `null`, nič sa nezmení (pri bráne a SND ostáva dnešné hľadanie podľa názvu).
- Návrh umiestnenia je v pracovnom denníku (21. 11. 2026). Kontrola polohy sa nepridáva.
