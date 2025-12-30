"use client";

import type { Board } from "@/features/sudoku/lib/sudoku";
import { mergeClassNames } from "@/lib/mergeConditionalClasses";

type SudokuSolutionProps = {
  solutionBoard: Board;
};

export function SudokuSolution({ solutionBoard }: SudokuSolutionProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-lg font-semibold">Solution</h2>
      <div className="grid grid-cols-9 border-2 border-foreground select-none">
        {solutionBoard.map((row, rowIndex) =>
          row.map((value, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className={mergeClassNames(
                "relative w-12 h-12 border border-foreground/40 flex items-center justify-center",
                rowIndex % 3 === 0 && "border-t-2",
                columnIndex % 3 === 0 && "border-l-2",
                rowIndex === 8 && "border-b-2",
                columnIndex === 8 && "border-r-2"
              )}
            >
              <span className="text-xl font-bold">
                {value === 0 ? "" : String(value)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
