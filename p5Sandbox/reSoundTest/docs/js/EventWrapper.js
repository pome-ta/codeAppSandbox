export class EventWrapper {
  constructor() {
    [this._click, this._start, this._move, this._end] =
      /iPhone|iPad|iPod|Android/.test(navigator.userAgent)
        ? ['click', 'touchstart', 'touchmove', 'touchend']
        : ['click', 'mousedown', 'mousemove', 'mouseup'];
  }

  get click() {
    return this._click;
  }

  get start() {
    return this._start;
  }

  get move() {
    return this._move;
  }

  get end() {
    return this._end;
  }
}
