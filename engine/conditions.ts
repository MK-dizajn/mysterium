import type { GameState } from "../types/game";

export type ConditionOperator = "==" | "!=" | ">" | ">=" | "<" | "<=";

export type Condition =
  | {
      type: "score";
      operator: ConditionOperator;
      value: number;
    }
  | {
      type: "artifact";
      id: string;
    }
  | {
      type: "screen";
      value: GameState["screen"];
    }
  | {
      type: "currentChapter";
      index: number;
    }
  | {
      type: "currentScene";
      index: number;
    };

function compareNumbers(
  currentValue: number,
  operator: ConditionOperator,
  targetValue: number
): boolean {
  switch (operator) {
    case "==":
      return currentValue === targetValue;
    case "!=":
      return currentValue !== targetValue;
    case ">":
      return currentValue > targetValue;
    case ">=":
      return currentValue >= targetValue;
    case "<":
      return currentValue < targetValue;
    case "<=":
      return currentValue <= targetValue;
    default:
      return false;
  }
}

export function evaluateCondition(
  condition: Condition,
  gameState: GameState
): boolean {
  switch (condition.type) {
    case "score":
      return compareNumbers(
        gameState.score,
        condition.operator,
        condition.value
      );

    case "artifact":
      return gameState.artifacts.some(
        (artifact) => artifact.id === condition.id
      );

    case "screen":
      return gameState.screen === condition.value;

    case "currentChapter":
      return gameState.currentChapterIndex === condition.index;

    case "currentScene":
      return gameState.currentSceneIndex === condition.index;

    default:
      return false;
  }
}

export function evaluateConditions(
  conditions: Condition[] | undefined,
  gameState: GameState
): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  return conditions.every((condition) =>
    evaluateCondition(condition, gameState)
  );
}