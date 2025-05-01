import  {p5}  from './lib/p5.bundle.js';
import './lib/addons/p5.sound.bundle.js';
import { EventWrapper } from './EventWrapper.js';

const title = 'sound test';
const eventWrap = new EventWrapper();



const sketch = (p) => {
  let w, h;
  let setupWidth, setupHeight, setupRatio;

  const div = 256;
  const mul = 0.01;
  const amp = 100;
  let bgColor;
  let osc;

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
    osc = new p5.SinOsc();
    osc.start();
    
  };

  p.draw = () => {
    // put drawing code here

  };
  
  p.touchStarted = (e) => {
  }
  

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
  
  canvasTag.addEventListener(eventWrap.move, (e) => e.preventDefault(), {
    passive: false,
  });

  document.body.style.backgroundColor = '#121212';
  
  // --- start
  const myp5 = new p5(sketch, canvasTag);
  myp5.getAudioContext().resume().then(() => {
        wrapDiv.style.backgroundColor = isRunningColor;
      });
  
  const wrapDiv = document.querySelector('#wrap');
  const isRunningColor = wrapDiv.style.backgroundColor
  const isSuspendedColor = 'maroon';
  wrapDiv.style.backgroundColor = isSuspendedColor;
  
  
  // todo: wake up AudioContext
  function initAudioContext() {
    //console.log(myp5.getAudioContext().state)
    if (myp5.getAudioContext().state !== 'running') {
      myp5.getAudioContext().resume().then(() => {
        wrapDiv.style.backgroundColor = isRunningColor;
      });
      return;
    }
    //document.removeEventListener(eventWrap.start, initAudioContext);
  }
  document.addEventListener(eventWrap.end, initAudioContext);
});

