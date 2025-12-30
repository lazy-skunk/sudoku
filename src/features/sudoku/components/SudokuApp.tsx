"use client";

import { SudokuBoard } from "./SudokuBoard";
import { SudokuControls } from "./SudokuControls";
import { SudokuSolution } from "./SudokuSolution";
import { useSudokuState } from "../hooks/useSudokuState";

export function SudokuApp() {
  const {
    cells,
    difficulty,
    hasUserEditsSinceStart,
    applyDigitInput,
    startNewGame,
    resetToInitialPuzzle,
    selectCellPosition,
    selectedCellPosition,
    isVerifyResultVisible,
    isSolutionVisible,
    solutionBoard,
    toggleVerifyResultVisibility,
    toggleSolutionVisibility,
  } = useSudokuState();

  const handleNewGame = (nextDifficulty: typeof difficulty) => {
    if (
      hasUserEditsSinceStart &&
      !window.confirm("Current entries will be lost. Start a new puzzle?")
    ) {
      return;
    }
    startNewGame(nextDifficulty);
  };

  const handleReset = () => {
    if (
      hasUserEditsSinceStart &&
      !window.confirm("Current entries will be lost. Reset the puzzle?")
    ) {
      return;
    }
    resetToInitialPuzzle();
  };

  return (
    <main className="flex flex-col items-center p-5 gap-5">
      <h1 className="text-3xl font-bold">Sudoku</h1>

      <SudokuControls
        difficulty={difficulty}
        onNewGame={handleNewGame}
        onReset={handleReset}
        isSolutionVisible={isSolutionVisible}
        onToggleSolutionVisibility={toggleSolutionVisibility}
        isVerifyResultVisible={isVerifyResultVisible}
        onToggleVerifyResultVisibility={toggleVerifyResultVisibility}
      />

      <SudokuBoard
        cells={cells}
        onInput={applyDigitInput}
        onSelect={selectCellPosition}
        selectedCellPosition={selectedCellPosition}
        isVerifyResultVisible={isVerifyResultVisible}
        solutionBoard={solutionBoard}
      />

      {isSolutionVisible && (
        <SudokuSolution solutionBoard={solutionBoard} />
      )}
    </main>
  );
}
