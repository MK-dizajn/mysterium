# Súpis miest – Kapitola I

Všetky zastávky, ku ktorým hra hráča vedie, ich odmerané súradnice a odkazy do máp.

Stav: 21. 11. 2026 (oprava 2: súradnice odmeral Miloš v Google Maps, odkazy sú v hre).

## Ako hra pracuje s miestami

- **Hra nezisťuje polohu telefónu.** Nemá polomery ani kontrolu polohy cez GPS.
- **Kontrola polohy sa nepridáva** (rozhodnutie z 21. 11. 2026). Pri bráne ostáva ručné potvrdenie „Som pri bráne“.
- Hráča vedú texty: zadanie úlohy, cesta („Ukáž cestu“) a vodidlo na ďalšie miesto.
- **Odkaz „Otvoriť v mapách“** vedie na odmeraný bod v tvare `https://www.google.com/maps?q=šírka,dĺžka` a otvorí sa v novom okne (v telefóne v aplikácii Mapy):
  - **úloha:** v rozbalenom „Ukáž cestu“ pod textom cesty, na bod tejto zastávky (scény 2 až 9),
  - **karta „Ďalšia stopa“** po histórii: v rozbalenom „Ukáž cestu“, na bod nasledujúcej zastávky (scény 1 až 8; po scéne 9 nasleduje denník bez miesta, odkaz sa neukáže),
  - **úvod „Vydaj sa k …“** (začiatok a po odomknutí aktu II a III): tlačidlo „Otvoriť v mapách“ na bod prvej zastávky aktu (scéna 1, 4, 7),
  - **finále, karta „Ďalšie miesto“:** tlačidlo „Otvoriť v mapách“ na hlavný vstup SND.
- Zastávka bez súradníc odkaz nemá. V úvode a vo finále sa vtedy použije hľadanie podľa názvu (`https://www.google.com/maps/search/?api=1&query=…`).

## Pole pre súradnice v dátach

- Každá zastávka (scény 1 až 9) má v dátach pole `mapPoint`. Súbory: `data/chapter-one/<scéna>.ts`.
- Ďalšie miesto vo finále (SND) má pole `nextPlace.mapPoint`. Súbor: `data/chapter-one/finale.ts`.
- Tvar: `mapPoint: { lat: 48.14xxxx, lng: 17.10xxxx }` (zemepisná šírka, dĺžka). Zmazaním (`null`) sa odkaz pri zastávke skryje.
- Scéna 10 (Pátračov denník) nemá miesto, hráč ostáva pri Primaciálnom paláci.

## Ako odmerať súradnice (pre ďalšie kapitoly alebo opravu bodu)

1. V Google Maps nájdi miesto a priblíž mapu čo najviac.
2. Podrž prst na presnom bode (napríklad pri vstupe alebo pod oblúkom brány), kým sa neukáže špendlík.
3. Hore sa ukážu čísla, napríklad `48.14466, 17.10652`. Ťukni na ne, skopírujú sa.
4. Zapíš ich do stĺpca **Odmerané súradnice** a pošli ich.

## Tabuľka

| Scéna | Miesto (čo hráč hľadá) | Presný bod (kam má odkaz viesť) | Odmerané súradnice (šírka, dĺžka) | Odkaz na mapu | Kde je odkaz v hre | Poznámka |
|---|---|---|---|---|---|---|
| Úvod a 1 | Michalská brána, bronzový kruh nultého kilometra v dlažbe | priechod pod oblúkom brány (kruh v dlažbe) | 48.145136, 17.106789 | https://www.google.com/maps?q=48.145136,17.106789 | úvod „Vydaj sa k Michalskej bráne“ („Otvoriť v mapách“); „Som pri bráne“ potvrdzuje hráč | |
| 2 | Najužší dom pri Michalskej bráne (dom č. 15) | fasáda úzkeho domu hneď pri bráne | 48.145179, 17.106679 | https://www.google.com/maps?q=48.145179,17.106679 | „Ďalšia stopa“ po scéne 1, „Ukáž cestu“ v úlohe 2 | dom je len pár krokov od brány |
| 3 | Lekáreň U Salvátora (Panská ulica) | vchod lekárne s postavou Spasiteľa | 48.141446, 17.105571 | https://www.google.com/maps?q=48.141446,17.105571 | „Ďalšia stopa“ po scéne 2, „Ukáž cestu“ v úlohe 3 | v kontrole pred vydaním je aj overenie postavy nad vchodom |
| 4 | Academia Istropolitana (Ventúrska ulica) | fasáda s pamätnou tabuľou | 48.1423873, 17.1063151 | https://www.google.com/maps?q=48.1423873,17.1063151 | „Ďalšia stopa“ po scéne 3, úvod aktu II, „Ukáž cestu“ v úlohe 4 | |
| 5 | Mirbachov palác (Františkánske námestie) | hlavné priečelie paláca | 48.1448137, 17.1078713 | https://www.google.com/maps?q=48.1448137,17.1078713 | „Ďalšia stopa“ po scéne 4, „Ukáž cestu“ v úlohe 5 | |
| 6 | Stará radnica, veža (Hlavné námestie) | veža zo strany Hlavného námestia (gotické okno s delovou guľou) | 48.1438731, 17.1086841 | https://www.google.com/maps?q=48.1438731,17.1086841 | „Ďalšia stopa“ po scéne 5, „Ukáž cestu“ v úlohe 6 | |
| 7 | Maximiliánova fontána (stred Hlavného námestia) | fontána | 48.143377, 17.108169 | https://www.google.com/maps?q=48.143377,17.108169 | „Ďalšia stopa“ po scéne 6, úvod aktu III, „Ukáž cestu“ v úlohe 7 | |
| 8 | Primaciálny palác (Primaciálne námestie) | hlavné priečelie paláca | 48.1439145, 17.1096556 | https://www.google.com/maps?q=48.1439145,17.1096556 | „Ďalšia stopa“ po scéne 7, „Ukáž cestu“ v úlohe 8 | scény 8 a 9 sú na tom istom mieste |
| 9 | Primaciálny palác – pamätná tabuľa Bratislavského mieru | ten istý bod ako scéna 8 | 48.1439145, 17.1096556 | https://www.google.com/maps?q=48.1439145,17.1096556 | „Ďalšia stopa“ po scéne 8, „Ukáž cestu“ v úlohe 9 | |
| Finále | Slovenské národné divadlo, historická budova | **hlavný vstup historickej budovy z Hviezdoslavovho námestia** | 48.142235, 17.109815 | https://www.google.com/maps?q=48.142235,17.109815 | karta „Ďalšie miesto“ („Otvoriť v mapách“) | odkaz už nevedie na hľadanie podľa názvu; cesta (text) je v dátach stále označená ako dočasná (`isPlaceholder`) |
