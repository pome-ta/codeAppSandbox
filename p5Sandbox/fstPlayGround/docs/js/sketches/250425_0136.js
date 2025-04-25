import './p5Setup.js';
//import './modules/p5Sound.bundle.js';


const title = 'Getting started with WebGL in p5';

const sketch = (p) => {
  let w, h;
  let setupWidth, setupHeight;
  

  p.setup = () => {
    // put setup code here
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    windowFlexSize();
    
  };
  
  p.draw = () => {
    p.background(255);
    p.box()
    p.translate(100,100,-100); //moves our drawing origin to the top left corner
    p.box();
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

      const setupRatio = Math.min(widthRatio, heightRatio);
      w = setupWidth * setupRatio;
      h = setupHeight * setupRatio;
    }

    p.resizeCanvas(w, h);
  }

};

//console.log(document.ontouchstart)

document.addEventListener('DOMContentLoaded', () => {
  document.title = title;
  const canvasId = 'p5Canvas';
  const canvasTag = document.querySelector(`#${canvasId}`);
  canvasTag.style.backgroundColor = 'darkgray';
  
  // --- start
  new p5(sketch, canvasId);
  
});

