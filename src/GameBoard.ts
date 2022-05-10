import { CellButton } from './CellButton';
import { Coords } from './types';
import { divideArrOnEqualParts, createEmptyArr } from './utils';

export class GameBoard {
  readonly rowSize;
  readonly blankCellNumber;
  readonly correctOrderArr;
  private gameCells;
  private matrix;
  private blockedCoords: null | Coords;
  constructor(public gameContainer: HTMLElement, public gameBoardSize: number) {
    this.gameBoardSize = gameBoardSize;
    this.blankCellNumber = gameBoardSize;
    this.rowSize = Math.sqrt(this.gameBoardSize);
    this.gameContainer = gameContainer;
    this.matrix = this.createMatrix(createEmptyArr(this.gameBoardSize));
    this.gameCells = this.init();
    this.correctOrderArr = createEmptyArr(this.gameBoardSize);
    this.blockedCoords = null;
  }

  private init() {
    const gameCells = this.createCells();
    this.gameContainer.append(...gameCells);
    return gameCells;
  }

  private createMatrix(arr: number[]) {
    const emptyArr = Array.from({ length: this.rowSize }, () => []);
    return divideArrOnEqualParts<number>(arr, emptyArr.length);
  }

  private createCells() {
    return this.matrix.flatMap((row, y) =>
      row.map((cell, x) => {
        const cellBtn = new CellButton(cell);
        cellBtn.setPosition({ x, y });
        return cellBtn;
      })
    );
  }

  findCoordinates(cellNumber: number) {
    return this.matrix.reduce((acc, cur, index) => {
      if (cur.includes(cellNumber)) {
        acc.y = index;
        acc.x = cur.indexOf(cellNumber);
      }
      return acc;
    }, {} as Coords);
  }

  findBlankCellCoords() {
    return this.findCoordinates(this.blankCellNumber);
  }

  isValidForSwap(coords1: Coords, coords2: Coords) {
    const { x: x1, y: y1 } = coords1;
    const { x: x2, y: y2 } = coords2;
    const diffX = Math.abs(x1 - x2);
    const diffY = Math.abs(y1 - y2);

    return (diffX === 1 || diffY === 1) && (x1 === x2 || y1 === y2);
  }

  swap(coords1: Coords, coords2: Coords) {
    const { x: x1, y: y1 } = coords1;
    const { x: x2, y: y2 } = coords2;
    [this.matrix[y1][x1], this.matrix[y2][x2]] = [this.matrix[y2][x2], this.matrix[y1][x1]];

    this.checkForResult();
  }

  setCellsPosition() {
    for (let y = 0; y < this.matrix.length; y++) {
      for (let x = 0; x < this.matrix[y].length; x++) {
        const cellNumber = this.matrix[y][x];
        const cellBtn = this.gameCells[cellNumber - 1];
        cellBtn.setPosition({ x, y });
      }
    }
  }

  private checkForResult() {
    const isEqual = this.correctOrderArr.every((num, index) => num === this.matrix.flat()[index]);
    if (isEqual) {
      this.gameContainer.classList.add('gameboard-correct');
      setTimeout(() => this.gameContainer.classList.remove('gameboard-correct'), 1000);
    }
  }

  private findCoordsForSwap(blankCoords: Coords) {
    return this.matrix.reduce((acc, cur, indexY) => {
      const y = indexY;
      cur.forEach((_, x) => {
        if (this.isValidForSwap({ y, x }, blankCoords)) {
          if (!this.blockedCoords || !(this.blockedCoords.x === x && this.blockedCoords.y === y)) {
            acc.push({ x, y });
          }
        }
      });
      return acc;
    }, [] as Coords[]);
  }

  randomSwap() {
    const blankCoords = this.findBlankCellCoords();
    const validCoords = this.findCoordsForSwap(blankCoords);

    const coords = validCoords[Math.floor(Math.random() * validCoords.length)];
    this.swap(blankCoords, coords);
    this.blockedCoords = blankCoords;
  }
}
