'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState
      ? this.cloneBoard(initialState)
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  cloneBoard(matrix) {
    return matrix.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  slideLeft(row) {
    let filtered = row.filter((val) => val !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
        i++;
      }
    }

    filtered = filtered.filter((val) => val !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  moveLeft() {
    if (this.status !== 'playing' && this.status !== 'idle') {
      return false;
    }

    if (this.status === 'idle') {
      this.status = 'playing';
    }

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const oldRow = [...this.board[i]];
      const newRow = this.slideLeft(this.board[i]);

      this.board[i] = newRow;

      if (oldRow.some((val, idx) => val !== newRow[idx])) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateGameStatus();
    }

    return moved;
  }

  moveRight() {
    this.reverseRows();

    const moved = this.moveLeft();

    this.reverseRows();

    return moved;
  }

  moveUp() {
    this.transpose();

    const moved = this.moveLeft();

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();
    this.reverseRows();

    const moved = this.moveLeft();

    this.reverseRows();
    this.transpose();

    return moved;
  }

  reverseRows() {
    this.board.forEach((row) => row.reverse());
  }

  transpose() {
    this.board = this.board[0].map((_, colIndex) => {
      return this.board.map((row) => row[colIndex]);
    });
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  updateGameStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
