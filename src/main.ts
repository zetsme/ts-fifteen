import './style.css';
import { GameBoard } from './GameBoard';
import { Coords, Direction } from './types';

const shuffleBtn = <HTMLButtonElement>document.getElementById('shuffle-btn');
const gameBoardDiv = <HTMLDivElement>document.getElementById('gameboard');

const gameBoard = new GameBoard(gameBoardDiv, 16);

gameBoardDiv.addEventListener('click', (e) => {
  if (shuffled) return;
  const cell = (e.target as HTMLDivElement).closest('button');
  if (!cell) return;

  const cellNumber = Number(cell.dataset.cell);
  const cellCoords = gameBoard.findCoordinates(cellNumber);
  const blankCoords = gameBoard.findBlankCellCoords();
  if (!cellCoords || !blankCoords) return;

  const isValidForSwap = gameBoard.isValidForSwap(cellCoords, blankCoords);
  if (!isValidForSwap) return;

  gameBoard.swap(cellCoords, blankCoords);
  gameBoard.setCellsPosition();
});

window.addEventListener('keydown', (e) => {
  if (shuffled) return;
  if (!e.key.includes('Arrow')) return;

  const blankCellCoords = gameBoard.findBlankCellCoords();

  const direction = e.key.split('Arrow')[1].toLowerCase() as Direction;
  const maxIndex = gameBoard.rowSize;

  const cellCoords = changeCoordsOnArrowClick(direction, blankCellCoords);

  if (cellCoords.y >= maxIndex || cellCoords.y < 0 || cellCoords.x >= maxIndex || cellCoords.x < 0)
    return;

  gameBoard.swap(cellCoords, blankCellCoords);
  gameBoard.setCellsPosition();
});

const maxShuffleCount = 50;
let timer: number | undefined;
let shuffled = false;
shuffleBtn.addEventListener('click', () => {
  if (shuffled) return;
  shuffled = true;
  let shuffleCount = 0;
  clearInterval(timer);
  gameBoardDiv.classList.add('disabled');

  timer = setInterval(() => {
    gameBoard.randomSwap();
    gameBoard.setCellsPosition();

    shuffleCount += 1;

    if (shuffleCount >= maxShuffleCount) {
      gameBoardDiv.classList.remove('disabled');
      clearInterval(timer);
      shuffled = false;
    }
  }, 50);
});

const changeCoordsOnArrowClick = (direction: Direction, cellCoords: Coords) => {
  const coords = { ...cellCoords };
  switch (direction) {
    case 'up':
      coords.y += 1;
      break;
    case 'down':
      coords.y -= 1;
      break;
    case 'left':
      coords.x += 1;
      break;
    case 'right':
      coords.x -= 1;
      break;
    default:
      break;
  }
  return coords;
};
