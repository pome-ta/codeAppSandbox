export class EventWrapper {
  constructor() {
    [this._click, this._start, this._move, this._end, this._isTouch] =
      /iPhone|iPad|iPod|Android/.test(navigator.userAgent)
        ? ['click', 'touchstart', 'touchmove', 'touchend', true,]
        : ['click', 'mousedown', 'mousemove', 'mouseup', false,];
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

  get isTouch() {
    return this._isTouch
  }
}
