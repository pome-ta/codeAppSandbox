import Editor from './editor.js';


let loadedSource;

/* -- load Source */
async function fetchSketchFile(path) {
  const res = await fetch(path);
  const sketchText = await res.text();
  return sketchText;
}

const fsPath = './js/sketchBook/mainSketch.js';
loadedSource = await fetchSketchFile(fsPath);


// sandbox
const sandbox = document.createElement('iframe');
sandbox.id = 'sandbox';
sandbox.loading = 'lazy'
sandbox.src = './js/sandboxes/sandbox.html';
sandbox.style.width = '100%';
sandbox.style.height = '50%';
sandbox.style.backgroundColor = 'maroon';
document.body.appendChild(sandbox);


document.addEventListener('DOMContentLoaded', () => {
  console.log(`DOMContentLoaded`);
  
  sandbox.contentWindow.postMessage(loadedSource, '*');
  //loadedSource = await fetchSketchFile(fsPath);
  //scriptElement.src = fsPath;//getBlobURL(loadedSource);
  //document.head.appendChild(scriptElement);
  //document.body.appendChild(scriptElement);
  
});






