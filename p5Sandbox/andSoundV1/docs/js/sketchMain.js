import { p5 } from './lib/p5.bundle.js';
import './lib/addons/p5sound.bundle.js';

//console.log(window.p5)


const title = 'sound test';

// 着火のおまじない
function initAudioContext() {
  document.removeEventListener(tapEnd, initAudioContext);
  // wake up AudioContext
  console.log('g');
  actx.resume();
}

const tapStart =
  typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';
const tapEnd =
  typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(tapEnd, initAudioContext);

const AudioContext = window.AudioContext || window.webkitAudioContext;
const actx = new AudioContext();


const sketch = (p) => {
  let w, h;
  let setupWidth, setupHeight, setupRatio;

  const div = 256;
  const mul = 0.01;
  const amp = 100;
  let bgColor;

  p.setup = () => {
    // put setup code here
    windowFlexSize(true);
    //p.background(211); // lightgray
    p.colorMode(p.HSB, 1.0, 1.0, 1.0, 1.0);
    bgColor = p.color(0, 0, 211 / 255);

    p.background(bgColor);
    //p.noFill();
    p.noStroke();
    
    
    //const osc = new p5sound.Oscillator('sine')
    //p.noLoop();
    //console.log(p.Oscillator)
    const osc = new p5.Oscillator('sine');
    osc.start();
    console.log(osc)
    
  };

  p.draw = () => {
    // put drawing code here

  };

  p.windowResized = (event) => {
    windowFlexSize(true);
  };


  function windowFlexSize(isFullSize = false) {
    const isInitialize =
      typeof setupWidth === 'undefined' || typeof setupHeight === 'undefined';

    [setupWidth, setupHeight] = isInitialize
      ? [p.width, p.height]
      : [setupWidth, setupHeight];

    const sizeRatio = 0.92;
    const windowWidth = p.windowWidth * sizeRatio;
    const windowHeight = p.windowHeight * sizeRatio;

    if (isFullSize) {
      w = windowWidth;
      h = windowHeight;
    } else {
      const widthRatio =
        windowWidth < setupWidth ? windowWidth / setupWidth : 1;
      const heightRatio =
        windowHeight < setupHeight ? windowHeight / setupHeight : 1;

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
  new p5(sketch, canvasTag);
});
