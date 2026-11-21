# Pravidlá testovania

Schválené 21. 11. 2026. Celá séria testov v prehliadači trvá asi 45 minút a pri zaťažení počítača občas zlyhá bez chyby v hre, preto sa nespúšťa po každom kroku.

## Pri každom kroku

1. Test pred zmenou a po nej: nový alebo rozšírený test najprv ukáže chybu, po zmene prejde.
2. Kontrola typov (`npx tsc --noEmit`).
3. Lint: v upravených súboroch žiadny nový problém.
4. Všetky Node testy.
5. Build (`npm run test:server`, potom `npm run stop`).
6. V prehliadači iba testy dotknutej časti (tabuľka nižšie). Testy s režimom bez animácií bežia v oboch režimoch.
7. Záznam v denníku (`docs/PRACOVNY-DENNIK.md`), aj s chybami, a commit iba dotknutých súborov. Žiadny push.

**Strážne Node testy bežia vždy**, lebo sú súčasťou všetkých Node testov:
- skóre 1010 za celú kapitolu,
- nápovedy a pravidlo „hráč sa nikdy nezasekne“ (každá úloha končí nápovedou s odpoveďou alebo „Preskočiť (−10 bodov)“),
- texty (schválené znenie, súpis hlasov),
- súradnice zastávok a odkazy „Otvoriť v mapách“.

## Celá séria v prehliadači

- Spúšťa sa iba:
  - po väčšom celku (napríklad po kroku T5),
  - každý tretí krok,
  - pred odovzdaním testerom a pred vydaním.
- Beží na pozadí. Po skončení dám vedieť, ako dopadla.
- Uloží sa celý výpis (výsledok každého behu), nie iba koniec.
- **Počítadlo:** každý záznam v denníku má riadok „Krokov od poslednej celej série: N z 3“. Po celej sérii začína od nuly.
- **Náhodné zlyhania pri zaťažení** (doteraz B4c2 a N1): test sa zopakuje samostatne. Ak dvakrát za sebou prejde, zapíše sa ako zaťaženie počítača, nie chyba hry. Ak zlyhá znova, hľadá sa príčina.

## Časť hry → testy v prehliadači

| Časť hry | Testy v prehliadači |
|---|---|
| Truhlica vo finále | B4b, B4c1, B4c2, B4c3, O4, O5, O6, O7 |
| Fotografia a útržky | O3 |
| Finále (Strážca, ďalšie miesto, záver) | I1, B3b, O1, H3 |
| Scéna 9 a mini hra | L1, N1 |
| Cesty, vodidlá, mapy, „Vydaj sa…“ | C1, E5, O9 |
| Kódy, kapitoly, „Mám kód“ | F3, K2, K3, E5 |
| Hlasy a videá | H2, H3, G1, I1 |
| Vzhľad a ovládanie celej hry (hlavička, Inventár, kontrast) | D2, D3a, D4, D5, C6 |

Ak krok zasahuje do viacerých častí, spustia sa testy všetkých dotknutých častí. Pri zmene spoločnej súčasti celej hry (napríklad uloženie hry alebo herný engine) sa spustí celá séria.
