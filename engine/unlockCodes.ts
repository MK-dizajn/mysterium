import type { Game, GameState, UnlockCode } from "../types/game";
import { markCodeDigitFound } from "./codeNotebook";
import { applyGameActions } from "./dialogueActions";
import {
  completeActEnding,
  continueAfterHistory,
  createNewGameState,
  solvePuzzle,
} from "./gameEngine";

/** Predpona pred kódom pri odtlačku (aby sa odtlačok nedal nájsť v bežných tabuľkách). */
const HASH_PREFIX = "mysterium-unlock:";

/** Príznak, že hra začala odomknutím kódom (napríklad „unlocked_by_code_kapitola-1-akt-2“). */
export function getUnlockedByCodeFlagId(code: UnlockCode) {
  return `unlocked_by_code_${code.id}`;
}

/** Kód bez rozlíšenia veľkých a malých písmen, bez medzier a pomlčiek. */
export function normalizeUnlockCode(input: string) {
  return input.toUpperCase().replace(/[\s\-‐‑‒–—]/g, "");
}

/** Odtlačok kódu, ktorý sa ukladá do dát namiesto samotného kódu. */
export function hashUnlockCode(input: string) {
  return sha256Hex(HASH_PREFIX + normalizeUnlockCode(input));
}

/** Nájde kód podľa zadaného textu; prázdny alebo neznámy kód nič nenájde. */
export function findUnlockCode(
  input: string,
  codes: UnlockCode[]
): UnlockCode | undefined {
  if (!normalizeUnlockCode(input)) {
    return undefined;
  }

  const hash = hashUnlockCode(input);

  return codes.find((code) => code.codeHash === hash);
}

/**
 * Uložená hra po odomknutí kódom: predošlé akty prejde rovnakými funkciami
 * ako hráč (bez nápovedy, teda s plnými bodmi), číslice predmetov označí
 * ako nájdené a hra začne obrazovkou „Vydaj sa k …“ odomknutého aktu.
 * Neznámu kapitolu alebo akt vráti ako null.
 */
export function createUnlockedGameState(
  game: Game,
  code: UnlockCode
): GameState | null {
  const chapterIndex = game.chapters.findIndex(
    (chapter) => chapter.id === code.target.chapterId
  );
  const chapter = game.chapters[chapterIndex];
  const targetAct = chapter?.acts.find(
    (act) => act.id === code.target.actId
  );

  if (!chapter || !targetAct) {
    return null;
  }

  const firstScene = chapter.scenes[0];
  let gameState: GameState = {
    ...createNewGameState(),
    currentChapterIndex: chapterIndex,
    screen: "puzzle",
  };

  // Začiatok kapitoly: Strážca odovzdal zápis a hráč si ho prečítal.
  if (firstScene?.guardianVideo) {
    gameState = applyGameActions(
      gameState,
      firstScene.guardianVideo.completeActions,
      chapter.quests
    );
  }

  const seenFlagIds = [
    chapter.introVideo?.seenFlagId,
    firstScene?.detectiveNote?.readFlagId,
  ].filter((flagId): flagId is string => Boolean(flagId));

  gameState = {
    ...gameState,
    flags: {
      ...gameState.flags,
      ...Object.fromEntries(seenFlagIds.map((flagId) => [flagId, true])),
    },
  };

  // Predošlé akty krok za krokom, kým hra nezačne odomknutý akt.
  for (let guard = 0; guard < 200; guard++) {
    if (
      gameState.screen === "puzzle" &&
      gameState.currentActId === targetAct.id
    ) {
      break;
    }

    if (gameState.screen === "puzzle") {
      gameState = solvePuzzle(
        gameState,
        chapter.scenes[gameState.currentSceneIndex],
        chapter.quests
      );
    } else if (gameState.screen === "history") {
      gameState = continueAfterHistory(gameState, chapter);
    } else if (gameState.screen === "actTransition") {
      gameState = completeActEnding(chapter, gameState);
    } else {
      return null;
    }
  }

  if (gameState.currentActId !== targetAct.id) {
    return null;
  }

  for (const item of gameState.inventory) {
    gameState = markCodeDigitFound(gameState, item.id);
  }

  return {
    ...gameState,
    screen: "intro",
    flags: {
      ...gameState.flags,
      [getUnlockedByCodeFlagId(code)]: true,
    },
  };
}

/**
 * SHA-256 vo vlastnom kóde: vstavaná funkcia prehliadača (crypto.subtle)
 * funguje iba cez https, pri skúšaní na mobile v domácej sieti by chýbala.
 */
export function sha256Hex(text: string) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];

  const bytes = new TextEncoder().encode(text);
  // Doplnenie: bajt 0x80, nuly a dĺžka v bitoch na konci (násobok 64 bajtov).
  const paddedLength = Math.ceil((bytes.length + 9) / 64) * 64;
  const data = new Uint8Array(paddedLength);
  data.set(bytes);
  data[bytes.length] = 0x80;
  const view = new DataView(data.buffer);
  const bitLength = bytes.length * 8;
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 2 ** 32));
  view.setUint32(paddedLength - 4, bitLength >>> 0);

  const rotate = (value: number, bits: number) =>
    (value >>> bits) | (value << (32 - bits));
  const words = new Uint32Array(64);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i++) {
      words[i] = view.getUint32(offset + i * 4);
    }

    for (let i = 16; i < 64; i++) {
      const s0 =
        rotate(words[i - 15], 7) ^ rotate(words[i - 15], 18) ^ (words[i - 15] >>> 3);
      const s1 =
        rotate(words[i - 2], 17) ^ rotate(words[i - 2], 19) ^ (words[i - 2] >>> 10);
      words[i] = (words[i - 16] + s0 + words[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;

    for (let i = 0; i < 64; i++) {
      const s1 = rotate(e, 6) ^ rotate(e, 11) ^ rotate(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + choice + K[i] + words[i]) >>> 0;
      const s0 = rotate(a, 2) ^ rotate(a, 13) ^ rotate(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + majority) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  return hash.map((value) => value.toString(16).padStart(8, "0")).join("");
}
