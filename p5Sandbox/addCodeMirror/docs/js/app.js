import Editor from './editor.js';


let loadedSource;
const fsPath = './js/sketchBook/mainSketch.js';

/* -- load Source */
async function fetchSketchFile(path) {
  const res = await fetch(path);
  const sketchText = await res.text();
  return sketchText;
}


function getBlobURL(sourceCode) {
  const sourceBlob = new Blob([sourceCode], { type: 'text/html' });
  const blobURL = URL.createObjectURL(sourceBlob);
  return blobURL;
}


function mergeSource(top, fncCode, bottom) {
  return top + fncCode + bottom;
}

function reloadSketch(iframeElement, editorObject) {
  const sourceCode = mergeSource(topSource, editorObject.toString, bottomSource);
  console.log(sourceCode)
  // iframeElement.src = getBlobURL(sourceCode);
  iframeElement.srcdoc = sourceCode;
  // iframeElement.contentWindow.location.reload();
}



const topSource = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport"
    content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />


    <script type="module">
    import eruda from 'https://cdn.skypack.dev/eruda';
    eruda.init();
    </script>
    
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.5/lib/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/addons/p5.sound.min.js"></script>
    
  </head>
  <body>
    <script>`;

const bottomSource = `
    </script>
  </body>
</html>
`;


loadedSource = await fetchSketchFile(fsPath);



// sandbox
const sandbox = document.createElement('iframe');
sandbox.id = 'sandbox';
sandbox.loading = 'lazy';
sandbox.style.width = '100%';
sandbox.style.height = '50%';
sandbox.style.backgroundColor = 'maroon';
// sandbox.src = getBlobURL(mergeSource(topSource, loadedSource, bottomSource));
sandbox.srcdoc = mergeSource(topSource, loadedSource, bottomSource);


const runButton = document.createElement('button');
runButton.id = 'runButton'
runButton.textContent = 'runCode'
runButton.style.margin = '1rem';


const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';
editorDiv.style.backgroundColor = 'dodgerblue'

const editor = new Editor(editorDiv, loadedSource);

document.body.appendChild(runButton);
document.body.appendChild(sandbox);
document.body.appendChild(editorDiv);

document.body.style.backgroundColor = 'teal'

runButton.addEventListener('click', (e) => reloadSketch(sandbox, editor));



// document.addEventListener("readystatechange", (event) => {
//   if (event.target.readyState === "interactive") {
//     console.log('interactive');
//   } else if (event.target.readyState === "complete") {
//     console.log('complete');
//   }
// });
/*
document.onreadystatechange = () => {
  if (document.readyState === 'interactive') {
    console.log('document.readyState');
  }
};
*/

/*
document.addEventListener('DOMContentLoaded',  () => {
  console.log('DOMContentLoaded');
  
});

*/
