"use client";

import { type Board } from "@/features/sudoku/lib/sudoku";
import { mergeClassNames } from "@/lib/mergeConditionalClasses";
import type { Cell } from "../hooks/useSudokuState";

type SudokuBoardProps = {
  cells: Cell[][];
  selectedCellPosition: [number, number] | null;
  isVerifyResultVisible: boolean;
  solutionBoard: Board;
  onInput: (rowIndex: number, columnIndex: number, value: string) => void;
  onSelect: (rowIndex: number, columnIndex: number) => void;
};

export function SudokuBoard({
  cells,
  selectedCellPosition,
  isVerifyResultVisible,
  solutionBoard,
  onInput,
  onSelect,
}: SudokuBoardProps) {
  return (
    <div className="grid grid-cols-9 border-2 border-foreground select-none">
      {cells.map((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          const isSelected =
            selectedCellPosition &&
            selectedCellPosition[0] === rowIndex &&
            selectedCellPosition[1] === columnIndex;
          const isWrongVisible =
            isVerifyResultVisible &&
            cell.value !== 0 &&
            solutionBoard[rowIndex][columnIndex] !== cell.value &&
            !cell.fixed;
          const isCorrectVisible =
            isVerifyResultVisible &&
            cell.value !== 0 &&
            solutionBoard[rowIndex][columnIndex] === cell.value &&
            !cell.fixed;

          return (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className={mergeClassNames(
                "relative w-12 h-12 border border-foreground/50 flex items-center justify-center",
                rowIndex % 3 === 0 && "border-t-2",
                columnIndex % 3 === 0 && "border-l-2",
                rowIndex === 8 && "border-b-2",
                columnIndex === 8 && "border-r-2",
                isSelected && "ring ring-green-500",
                isWrongVisible && "bg-red-500/10",
                isCorrectVisible && "bg-green-500/10"
              )}
              onClick={() => onSelect(rowIndex, columnIndex)}
            >
              <input
                inputMode="numeric"
                pattern="[1-9]*"
                maxLength={1}
                className={mergeClassNames(
                  "w-full h-full text-center text-xl outline-none bg-transparent",
                  cell.fixed ? "font-bold" : "text-green-500"
                )}
                value={cell.value === 0 ? "" : String(cell.value)}
                onChange={(event) =>
                  onInput(rowIndex, columnIndex, event.target.value)
                }
                disabled={cell.fixed}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
