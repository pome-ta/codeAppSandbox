import { p5 } from './lib/p5.bundle.js';
import './lib/addons/p5.sound.bundle.js';
import { EventWrapper } from './EventWrapper.js';

const title = 'sound test';
const eventWrap = new EventWrapper();

const sketch = (p) => {
  let w, h;
  let setupWidth, setupHeight, setupRatio;

  let bgColor;
  let sinOsc;
  let fft;

  p.setup = () => {
    // put setup code here
    windowFlexSize(true);
    p.colorMode(p.HSB, 1.0, 1.0, 1.0, 1.0);
    bgColor = p.color(0, 0, 64 / 255);
    p.background(bgColor);
    
    sinOsc = new p5.SinOsc();
    // sinOsc.start();

    fft = new p5.FFT();

    // p.frameRate(0.5);
    // p.noLoop();
  };

  p.draw = () => {
    // put drawing code here
    p.background(bgColor);

    let spectrum = fft.analyze();
    p.noStroke();
    p.fill(0.2, 0.5, 0.8);
    for (let i = 0; i < spectrum.length; i++) {
      let x = p.map(i, 0, spectrum.length, 0, p.width);
      let h = -p.height + p.map(spectrum[i], 0, 255, p.height, 0);
      p.rect(x, p.height, p.width / spectrum.length, h);
    }

    let waveform = fft.waveform();
    p.noFill();
    p.beginShape();
    p.stroke(0.8, 0.5, 0.8);
    for (let i = 0; i < waveform.length; i++) {
      let x = p.map(i, 0, waveform.length, 0, p.width);
      let y = p.map(waveform[i], -1, 1, 0, p.height);
      p.vertex(x, y);
    }
    p.endShape();

    p.noStroke();
    p.fill(0.0, 0.0, 0.8);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(32);
    p.text('on tap play', p.width / 2, p.height / 2)
  };

  p.touchStarted = (e) => {
    sinOsc.started ? sinOsc.stop() : sinOsc.start();
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
  // todo: set up for sound
  const wrapDiv = document.querySelector('#wrap');
  const isRunningColor = wrapDiv.style.backgroundColor
  const isSuspendedColor = 'maroon';

  const ctx = myp5.getAudioContext();
  ctx.addEventListener('statechange', (e) => ctx.state !== 'running' ? notResume() : null);


  const isResume = () => {
    ctx.resume().then(() => {
      wrapDiv.style.backgroundColor = isRunningColor;
    });
    document.removeEventListener(eventWrap.end, isResume);
  }
  const notResume = () => {
    wrapDiv.style.backgroundColor = isSuspendedColor;
    document.addEventListener(eventWrap.end, isResume);
  };

  ctx.suspend().then(() => notResume());


});
