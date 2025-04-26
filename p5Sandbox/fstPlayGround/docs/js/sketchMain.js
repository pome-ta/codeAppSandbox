//import './p5Setup.js';
//import './modules/p5Sound.bundle.js';
import { p5 } from './modules/p5.bundle.js';


const title = '下部に余白あり？';

const sketch = (p) => {
  let w, h;
  let setupWidth, setupHeight, setupRatio;

  p.setup = () => {
    // put setup code here
    //p.createCanvas(128, 128);
    p.resizeCanvas(256, 256);
    
    p.background(1);
    p.noLoop();
  };

  p.draw = () => {
    // put drawing code here
    
  };

  function windowFlexSize(isFullSize = false) {
    const isInitialize =
      typeof setupWidth === 'undefined' || typeof setupHeight === 'undefined';
    
    [setupWidth, setupHeight] = isInitialize
      ? [p.width, p.height]
      : [setupWidth, setupHeight];

    const sizeRatio = 0.5;
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
/*
  canvasTag.addEventListener('touchmove', (e) => e.preventDefault(), {
    passive: false,
  });
*/
  // --- start
  const myp5 = new p5(sketch, canvasTag);
  //canvasTag.appendChild(myp5)
  //console.log(myp5)
  //p5.disableFriendlyErrors = true;
  //console.log(myp5);
  //console.log(p5);
});

