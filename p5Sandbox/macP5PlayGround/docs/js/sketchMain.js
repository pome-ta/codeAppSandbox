import p5 from './lib/p5.esm.js';


const title = 'Perlin noise';

const sketch = (p) => {
  let w, h;
  let setupWidth, setupHeight, setupRatio;

  const div = 128;
  const mul = 0.01;
  const amp = 100;
  let bgColor;

  p.setup = () => {
    // put setup code here
    // p.createCanvas(p.windowHeight,p.windowHeight);
    windowFlexSize(true);
    //p.background(211); // lightgray
    p.colorMode(p.HSB, 1.0, 1.0, 1.0, 1.0);
    bgColor = p.color(0, 0, 211 / 255);

    // p.background(bgColor);
    p.noFill();
    // p.noStroke();
    p.noLoop();
  };

  p.draw = () => {
    // put drawing code here
    p.background(bgColor);

    const cx = w / 2;
    const cy = h / 2;

    const steps = Math.max(w, h) / div;

    const sizeMul = 0.5;
    const size = steps / sizeMul;


    const s = p.millis() / 100;

    for (let _y = 0; _y <= div; _y++) {
      for (let _x = 0; _x <= div; _x++) {
        const x = _x * steps;
        const y = _y * steps;

        //const hNoise = p.noise((_x + s) * mul, (_y + s) * mul, s * mul);
        //const hNoise = p.noise(_x * mul, _y * mul, s * mul);
        const hNoise = p.noise((_x + s) * mul, (_y + s) * mul, s * mul);

        //p.fill(hNoise);
        p.fill(hNoise, 1, 1);
        p.ellipse(x, y, size, size);
        //p.ellipse(x, y, size * hNoise, size * hNoise);
      }
    }
  };

  // p.windowResized = (e) => {
  // }
  function windowResized(e) {
    windowFlexSize(true);
    
  }


  function windowFlexSize(isFullSize = false) {
    const isInitialize =
      typeof setupWidth === 'undefined' || typeof setupHeight === 'undefined';

    [setupWidth, setupHeight] = isInitialize
      ? [p.width, p.height]
      : [setupWidth, setupHeight];

    const sizeRatio = 0.92;
    const windowWidthSize = p.windowWidth * sizeRatio;
    const windowHeightSize = p.windowHeight * sizeRatio;

    if (isFullSize) {
      w = windowWidthSize;
      h = windowHeightSize;
    } else {
      const widthRatio =
        windowWidthSize < setupWidth ? windowWidthSize / setupWidth : 1;
      const heightRatio =
        windowHeightSize < setupHeight ? windowHeightSize / setupHeight : 1;

      setupRatio = Math.min(widthRatio, heightRatio);
      w = setupWidth * setupRatio;
      h = setupHeight * setupRatio;
    }
    p.resizeCanvas(w, h);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.title = title ? title : document.title;

  const canvasId = 'p5Canvas';
  const canvasTag = document.querySelector(`#${canvasId}`);
  canvasTag.style.backgroundColor = 'darkgray';

  //document.body.style.backgroundColor = '#121212';

  canvasTag.addEventListener('touchmove', (e) => e.preventDefault(), {
    passive: false,
  });
  // --- start
  const myp5 = new p5(sketch, canvasTag);
});
