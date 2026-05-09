"use client";

import {
  Board,
  Difficulty,
  cloneBoard,
  generatePuzzle,
} from "@/features/sudoku/lib/sudoku";
import { useCallback, useMemo, useState } from "react";

export type Cell = {
  value: number;
  fixed: boolean;
};

type InternalState = {
  cells: Cell[][];
  initial: Board;
  solution: Board;
  difficulty: Difficulty;
};

function toCells(board: Board): Cell[][] {
  return board.map((row) =>
    row.map((value) => ({ value, fixed: value !== 0 })),
  );
}

function createGameState(difficulty: Difficulty): InternalState {
  const { puzzle, solution } = generatePuzzle(difficulty);
  return {
    cells: toCells(puzzle),
    initial: puzzle,
    solution,
    difficulty,
  };
}

export function useSudokuState() {
  const defaultDifficulty: Difficulty = "easy";
  const [state, setState] = useState<InternalState>(() =>
    createGameState(defaultDifficulty),
  );
  const { cells, difficulty, solution: solutionBoard } = state;

  const [selectedCellPosition, setSelectedCellPosition] = useState<
    [number, number] | null
  >(null);
  const [isVerifyResultVisible, setIsVerifyResultVisible] = useState(false);
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);

  const hasUserEditsSinceStart = useMemo(() => {
    return cells.some((row, rowIndex) =>
      row.some(
        (cell, columnIndex) =>
          !cell.fixed && cell.value !== state.initial[rowIndex][columnIndex],
      ),
    );
  }, [cells, state.initial]);

  const startNewGame = useCallback((nextDifficulty: Difficulty) => {
    setState(createGameState(nextDifficulty));
    setSelectedCellPosition(null);
    setIsVerifyResultVisible(false);
    setIsSolutionVisible(false);
  }, []);

  const resetToInitialPuzzle = useCallback(() => {
    setState((previousState) => ({
      ...previousState,
      cells: toCells(cloneBoard(previousState.initial)),
    }));
    setSelectedCellPosition(null);
    setIsVerifyResultVisible(false);
    setIsSolutionVisible(false);
  }, []);

  const selectCellPosition = useCallback(
    (rowIndex: number, columnIndex: number) => {
      setSelectedCellPosition([rowIndex, columnIndex]);
    },
    [],
  );

  const applyDigitInput = useCallback(
    (rowIndex: number, columnIndex: number, rawInput: string) => {
      const digit = rawInput.replace(/[^1-9]/g, "").slice(0, 1);
      const value = digit ? parseInt(digit, 10) : 0;

      setIsVerifyResultVisible(false);
      setState((previousState) => {
        if (previousState.cells[rowIndex][columnIndex].fixed) {
          return previousState;
        }
        const nextCells = previousState.cells.map((cellRow, rowIndexValue) =>
          cellRow.map((cell, columnIndexValue) =>
            rowIndexValue === rowIndex && columnIndexValue === columnIndex
              ? { ...cell, value }
              : cell,
          ),
        );
        return { ...previousState, cells: nextCells };
      });
    },
    [],
  );

  const toggleVerifyResultVisibility = useCallback(() => {
    setIsVerifyResultVisible((previousValue) => !previousValue);
  }, []);

  const toggleSolutionVisibility = useCallback(() => {
    setIsSolutionVisible((previousValue) => !previousValue);
  }, []);

  return {
    cells,
    difficulty,
    hasUserEditsSinceStart,
    selectedCellPosition,
    isVerifyResultVisible,
    isSolutionVisible,
    solutionBoard,
    applyDigitInput,
    startNewGame,
    resetToInitialPuzzle,
    selectCellPosition,
    toggleVerifyResultVisibility,
    toggleSolutionVisibility,
  };
}
