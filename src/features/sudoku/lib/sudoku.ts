export type Board = number[][];

const GRID_SIZE = 9;
const BOX_SIZE = 3;

const createZeroBasedIndices = (length: number) =>
  Array.from({ length }, (_, index) => index);

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function emptyBoard(): Board {
  return createZeroBasedIndices(GRID_SIZE).map(() =>
    createZeroBasedIndices(GRID_SIZE).map(() => 0)
  );
}

function isSafe(
  board: Board,
  rowIndex: number,
  columnIndex: number,
  value: number
): boolean {
  for (let index = 0; index < GRID_SIZE; index++) {
    if (board[rowIndex][index] === value) return false;
    if (board[index][columnIndex] === value) return false;
  }
  const boxRow = Math.floor(rowIndex / BOX_SIZE) * BOX_SIZE;
  const boxColumn = Math.floor(columnIndex / BOX_SIZE) * BOX_SIZE;
  for (let rowOffset = 0; rowOffset < BOX_SIZE; rowOffset++) {
    for (let columnOffset = 0; columnOffset < BOX_SIZE; columnOffset++) {
      if (board[boxRow + rowOffset][boxColumn + columnOffset] === value)
        return false;
    }
  }
  return true;
}

function findEmpty(board: Board): [number, number] | null {
  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
    for (let columnIndex = 0; columnIndex < GRID_SIZE; columnIndex++) {
      if (board[rowIndex][columnIndex] === 0) return [rowIndex, columnIndex];
    }
  }
  return null;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function solve(board: Board): boolean {
  const empty = findEmpty(board);
  if (!empty) return true;
  const [rowIndex, columnIndex] = empty;
  for (const candidate of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (isSafe(board, rowIndex, columnIndex, candidate)) {
      board[rowIndex][columnIndex] = candidate;
      if (solve(board)) return true;
      board[rowIndex][columnIndex] = 0;
    }
  }
  return false;
}

function isUniqueSolution(board: Board): boolean {
  const countSolutionPaths = (current: Board, limit: number): number => {
    const empty = findEmpty(current);
    if (!empty) return 1;
    const [rowIndex, columnIndex] = empty;
    let count = 0;
    for (let candidate = 1; candidate <= 9; candidate++) {
      if (isSafe(current, rowIndex, columnIndex, candidate)) {
        current[rowIndex][columnIndex] = candidate;
        count += countSolutionPaths(current, limit);
        if (count >= limit) {
          current[rowIndex][columnIndex] = 0;
          return count;
        }
        current[rowIndex][columnIndex] = 0;
      }
    }
    return count;
  };

  return countSolutionPaths(board, 2) === 1;
}

function generateFullBoard(): Board {
  const board = emptyBoard();
  const firstRowSeed = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let columnIndex = 0; columnIndex < GRID_SIZE; columnIndex++) {
    board[0][columnIndex] = firstRowSeed[columnIndex];
  }
  solve(board);
  return board;
}

export type Difficulty = "easy" | "medium" | "hard";

function removalCountForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 40;
    case "medium":
      return 50;
    case "hard":
      return 58;
  }
}

export function generatePuzzle(difficulty: Difficulty = "easy"): {
  puzzle: Board;
  solution: Board;
} {
  const full = generateFullBoard();
  const puzzle = cloneBoard(full);
  const toRemove = removalCountForDifficulty(difficulty);

  const cellPositions = shuffle(createZeroBasedIndices(81));
  let removed = 0;
  for (const positionIndex of cellPositions) {
    if (removed >= toRemove) break;
    const rowIndex = Math.floor(positionIndex / 9);
    const columnIndex = positionIndex % 9;
    const backup = puzzle[rowIndex][columnIndex];
    if (backup === 0) continue;
    puzzle[rowIndex][columnIndex] = 0;
    const copy = cloneBoard(puzzle);
    const hasUniqueSolution = isUniqueSolution(copy);
    if (!hasUniqueSolution) {
      puzzle[rowIndex][columnIndex] = backup;
    } else {
      removed++;
    }
  }

  return { puzzle, solution: full };
}
