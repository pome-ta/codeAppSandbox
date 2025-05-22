let sketchCode = '';
let loadedSource;
const fsPath = '../sketchBook/mainSketch.js';

/* -- load Source */
async function fetchSketchFile(path) {
  const res = await fetch(path);
  const sketchText = await res.text();
  return sketchText;
}

/*
function getBlobURL(sourceStr) {
  const jsBlob = new Blob([sourceStr], { type: 'text/javascript' });
  const blobURL = URL.createObjectURL(jsBlob);
  return blobURL;
}

*/


//loadedSource = await fetchSketchFile(fsPath);


//const scriptElement = document.createElement('script');
//scriptElement.id = 'scriptElement';

window.addEventListener('message', (e) => {
  console.log(e.data);
});


document.addEventListener('DOMContentLoaded', () => {
  console.log(`DOMContentLoaded`);
  //loadedSource = await fetchSketchFile(fsPath);
  //scriptElement.src = fsPath;//getBlobURL(loadedSource);
  //document.head.appendChild(scriptElement);
  //document.body.appendChild(scriptElement);
  
});

window.addEventListener('load', () => {
  console.log(`load`);
});


