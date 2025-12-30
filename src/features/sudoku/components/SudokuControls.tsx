"use client";

import type { Difficulty } from "@/features/sudoku/lib/sudoku";
import { mergeClassNames } from "@/lib/mergeConditionalClasses";

type SudokuControlsProps = {
  difficulty: Difficulty;
  onNewGame: (difficulty: Difficulty) => void;
  onReset: () => void;
  isSolutionVisible: boolean;
  onToggleSolutionVisibility: () => void;
  isVerifyResultVisible: boolean;
  onToggleVerifyResultVisibility: () => void;
};

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export function SudokuControls({
  difficulty,
  onNewGame,
  onReset,
  isSolutionVisible,
  onToggleSolutionVisibility,
  isVerifyResultVisible,
  onToggleVerifyResultVisibility,
}: SudokuControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {DIFFICULTIES.map((difficultyOption) => (
        <button
          key={difficultyOption}
          className={mergeClassNames(
            "px-3 py-2 rounded border capitalize",
            difficulty === difficultyOption && "border-green-500"
          )}
          onClick={() => onNewGame(difficultyOption)}
        >
          {difficultyOption}
        </button>
      ))}

      <div className="mx-2 h-6 w-px bg-foreground/50" />

      <button className="px-3 py-2 rounded border" onClick={onReset}>
        Reset
      </button>

      <button
        className="px-3 py-2 rounded border"
        onClick={onToggleSolutionVisibility}
      >
        {isSolutionVisible ? "Hide Solution" : "Show Solution"}
      </button>

      <button
        className={mergeClassNames(
          "px-3 py-2 rounded border",
          isVerifyResultVisible && "border-green-500"
        )}
        onClick={onToggleVerifyResultVisibility}
      >
        Verify
      </button>
    </div>
  );
}
