import type { Chapter } from "../types/game";

export const chapterOne: Chapter = {
  id: "bratislava-chapter-1",
  city: "Bratislava",
  title: "Stratený denník starého pátrača",
  subtitle: "Kapitola I: Zlatý prešporský kľúč",
  introLines: [
    "Mesto si pamätá všetko.",
    "Niektoré tajomstvá čakali celé stáročia.",
    "Ak toto čítaš, znamená to, že som zlyhal.",
  ],
  scenes: [
    {
      id: "michalska-brana",
      location: "Michalská brána",
      title: "1. Nultý bod",
      cinematicText:
        "Pod klenbou Michalskej brány sa dlažba leskne po daždi. Turisti prechádzajú okolo bez zastavenia, no ty vieš, že starý pátrač by prvú stopu nikdy nenechal na očiach.",
      voiceLine:
        "Začni tam, kde králi vstupovali do mesta. Pozri sa pod nohy. Nie všetko, čo je vyryté v kove, je iba ozdoba.",
      puzzle: {
        id: "puzzle-michalska-brana",
        question:
          "Na kovovom kruhu nultého kilometra nájdi mesto s najmenšou vzdialenosťou od Bratislavy. Zadaj jeho názov.",
        acceptedAnswers: ["vieden", "viedeň", "vienna"],
        hints: [
          "Hľadaj mesto s najmenším číslom kilometrov.",
          "Je to hlavné mesto Rakúska.",
        ],
      },
      history: {
        id: "history-michalska-brana",
        title: "Michalská brána",
        shortText:
          "Jediná zachovaná brána stredovekého opevnenia Bratislavy.",
        fullText:
          "Michalská brána patrí medzi najvýraznejšie symboly historického jadra Bratislavy. Kedysi bola súčasťou mestského opevnenia a tvorila jeden z hlavných vstupov do mesta. Kovový nultý kilometer pod bránou ukazuje vzdialenosti viacerých svetových miest.",
      },
      artifact: {
        id: "artifact-michalska-brana",
        title: "Michalská brána",
        icon: "🏰",
        shortFact:
          "Brána, kadiaľ do mesta vstupovali kupci, stráže aj králi.",
        fullText:
          "Michalská brána je poslednou zachovanou mestskou bránou Bratislavy. V príbehu slúži ako symbolický vstup do sveta starého pátrača.",
      },
      nextInstruction:
        "Keď vyslovíš správne mesto, v jednej z rýh kovového kruhu si všimneš drobnú značku v tvare kľúča.",
      events: [
        {
          trigger: "puzzleSolved",
          conditions: [
            {
              type: "flag",
              id: "michalska_brana_solved",
              value: false,
            },
          ],
          actions: [
            {
              type: "startQuest",
              questId: "quest-golden-key",
            },
            {
              type: "setFlag",
              flagId: "michalska_brana_solved",
            },
          ],
        },
      ],
      branches: [
        {
          targetSceneId: "tajna-stopa-michalska",
          conditions: [
            {
              type: "flag",
              id: "michalska_brana_solved",
            },
          ],
        },
      ],
    },

    {
      id: "tajna-stopa-michalska",
      location: "Michalská ulica",
      title: "2. Značka starého pátrača",
      cinematicText:
        "Keď sa odkloníš od ruchu ulice, všimneš si na okraji kamennej steny vyrytú drobnú značku. Nie je nová. Niekto ju tu nechal dávno pred tebou.",
      voiceLine:
        "Dobre. Prvý zámok sa otvoril. Ale kľúč ešte nemáš. Hľadaj znamenie tam, kde sa mesto mení z brány na ulicu.",
      puzzle: {
        id: "puzzle-tajna-stopa-michalska",
        question: "Aký symbol si našiel po vyriešení prvej stopy?",
        acceptedAnswers: [
          "kluc",
          "kľúč",
          "zlty kluc",
          "zlaty kluc",
          "zlatý kľúč",
        ],
        hints: [
          "Objavil sa v ryhe kovového kruhu.",
          "Je to predmet, ktorým sa odomyká zámok.",
        ],
      },
      history: {
        id: "history-tajna-stopa",
        title: "Skryté mestské značky",
        shortText:
          "Niektoré detaily historického mesta si všimne iba ten, kto ich hľadá.",
        fullText:
          "Staré mestá sú plné drobných značiek, nápisov, erbov a symbolov. V hre tieto detaily slúžia ako most medzi históriou a hádankami.",
      },
      artifact: {
        id: "artifact-znamka-patraca",
        title: "Značka starého pátrača",
        icon: "🗝️",
        shortFact:
          "Prvý dôkaz, že pátračova cesta bola skutočná.",
        fullText:
          "Vyrytá značka kľúča naznačuje, že starý pátrač pripravoval cestu pre niekoho ďalšieho. Možno pre teba.",
      },
      nextInstruction:
        "Značka ukazuje smerom nadol po Michalskej ulici. Ďalšia stopa ťa vedie k miestu, kde sa obchod, liečivá a tajomstvá stretávali za jedným pultom.",
      events: [
        {
          trigger: "puzzleSolved",
          conditions: [
            {
              type: "flag",
              id: "tajna_stopa_solved",
              value: false,
            },
          ],
          actions: [
            {
              type: "setFlag",
              flagId: "tajna_stopa_solved",
            },
            {
              type: "addInventoryItem",
              item: {
                id: "golden-pressburg-key",
                title: "Zlatý prešporský kľúč",
                icon: "🗝️",
                description:
                  "Drobný symbolický kľúč nájdený po vyriešení značky starého pátrača. Neotvára obyčajné dvere — otvára ďalšiu časť príbehu.",
              },
            },
          ],
        },
      ],
      branches: [
        {
          targetSceneId: "lekaren-u-salvatora",
          conditions: [
            {
              type: "flag",
              id: "tajna_stopa_solved",
            },
          ],
        },
      ],
    },

    {
      id: "lekaren-u-salvatora",
      location: "Lekáreň U Salvátora",
      title: "3. Miesto liekov a jedov",
      cinematicText:
        "Pred fasádou starej lekárne sa zastavíš. Výklady mlčia, no v ich odraze na okamih zbadáš siluetu muža v dlhom kabáte. Keď sa otočíš, ulica je prázdna.",
      voiceLine:
        "Tu sa kedysi vážili lieky aj jedy. Pátrač vedel, že pravda býva ako liek — v malej dávke zachráni, vo veľkej zmení všetko.",
      puzzle: {
        id: "puzzle-lekaren-salvator",
        question:
          "Aké slovo najviac vystihuje miesto, kde sa miešali lieky, recepty a tajomstvá?",
        acceptedAnswers: ["lekaren", "lekáreň", "apoteka", "apotheka"],
        hints: [
          "Si pred historickou budovou spojenenou s liečivami.",
          "Staršie slovo môže byť apotéka.",
        ],
      },
      history: {
        id: "history-lekaren-salvator",
        title: "Lekáreň U Salvátora",
        shortText:
          "Jedna z najznámejších historických lekární v centre Bratislavy.",
        fullText:
          "Lekárne v starých mestách neboli iba miestom predaja liekov. Boli aj miestom poznania, receptúr, symbolov a dôvery. V tejto kapitole predstavuje lekáreň prechod od vonkajších mestských stôp k hlbšiemu tajomstvu pátrača.",
      },
      artifact: {
        id: "artifact-stary-recept",
        title: "Starý recept",
        icon: "📜",
        shortFact:
          "Útržok receptu so zvláštnym symbolom kľúča v rohu.",
        fullText:
          "Na útržku starého receptu je rukou dopísaná veta: 'Zlatý kľúč neotvára dvere. Otvára spomienku.'",
      },
      nextInstruction:
        "Na zadnej strane útržku receptu je napísané jediné slovo: Ventúrska.",
      events: [
        {
          trigger: "puzzleSolved",
          conditions: [
            {
              type: "flag",
              id: "lekaren_solved",
              value: false,
            },
          ],
          actions: [
            {
              type: "setFlag",
              flagId: "lekaren_solved",
            },
            {
              type: "completeQuest",
              questId: "quest-golden-key",
            },
            {
              type: "addScore",
              value: 10,
            },
          ],
        },
      ],
      branches: [
        {
          targetSceneId: "venturska-brana-spomienok",
          conditions: [
            {
              type: "inventoryItem",
              itemId: "golden-pressburg-key",
            },
          ],
        },
      ],
    },

    {
      id: "venturska-brana-spomienok",
      location: "Ventúrska ulica",
      title: "4. Brána spomienok",
      cinematicText:
        "Ventúrska ulica je tichšia než Michalská. Medzi fasádami starých domov zbadáš nenápadný reliéf v tvare zámku. Zlatý prešporský kľúč v tvojom inventári akoby na okamih zahrial dlaň.",
      voiceLine:
        "Nie všetky zámky sú zo železa. Niektoré sa otvoria až vtedy, keď si pripravený niesť príbeh ďalej.",
      puzzle: {
        id: "puzzle-venturska-brana",
        question:
          "Aký predmet ti umožnil nájsť Bránu spomienok?",
        acceptedAnswers: [
          "kluc",
          "kľúč",
          "zlaty kluc",
          "zlatý kľúč",
          "zlaty presporsky kluc",
          "zlatý prešporský kľúč",
        ],
        hints: [
          "Získal si ho po vyriešení značky starého pátrača.",
          "Nachádza sa v inventári.",
        ],
      },
      history: {
        id: "history-venturska",
        title: "Ventúrska ulica",
        shortText:
          "Jedna z historických ulíc starého mesta, spojená s meštianskym životom Bratislavy.",
        fullText:
          "Ventúrska ulica patrí medzi ulice historického jadra Bratislavy. V hre slúži ako prvé miesto, kde hráč použije predmet z inventára ako podmienku ďalšieho postupu.",
      },
      artifact: {
        id: "artifact-brana-spomienok",
        title: "Brána spomienok",
        icon: "🚪",
        shortFact:
          "Prvá stopa, ktorá sa otvorila iba vďaka predmetu z inventára.",
        fullText:
          "Brána spomienok potvrdzuje, že Zlatý prešporský kľúč nie je obyčajný predmet. Je to nosič príbehu a symbol postupu hráča.",
      },
      nextInstruction:
        "Za reliéfom sa ukrýva ďalšia veta pátračovho denníka. Cesta sa začína meniť na skutočné pátranie.",
      events: [
        {
          trigger: "puzzleSolved",
          conditions: [
            {
              type: "flag",
              id: "venturska_solved",
              value: false,
            },
          ],
          actions: [
            {
              type: "setFlag",
              flagId: "venturska_solved",
            },
          ],
        },
      ],
    },
  ],
};