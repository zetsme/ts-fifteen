import { Coords } from './types';

export class CellButton extends HTMLButtonElement {
  constructor(public cellNumber: number) {
    super();
    this.cellNumber = cellNumber;
    this.init();
  }

  private init() {
    const data = this.cellNumber.toString();
    this.classList.add('cell');
    this.dataset['cell'] = data;
    const cellSpan = document.createElement('span');
    cellSpan.textContent = data;
    this.appendChild(cellSpan);
    return this;
  }

  setPosition(coords: Coords) {
    const { x, y } = coords;
    const shiftPs = 100;
    const cellPosition = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
    this.style.transform = cellPosition;
  }
}

customElements.define('cell-button', CellButton, { extends: 'button' });
