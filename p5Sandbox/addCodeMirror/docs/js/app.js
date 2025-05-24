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

/*
loadedSource = `function setup() {
  createCanvas(240, 240);
}

function draw() {
  background(random() * 255);
}`;

*/

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

/*
function getBlobURL(sourceCode) {
  const sourceBlob = new Blob([sourceCode], { type: 'text/html' });
  const blobURL = URL.createObjectURL(sourceBlob);
  return blobURL;
}
*/
const getBlobURL = (sourceCode) => {
  const sourceBlob = new Blob([sourceCode], { type: 'text/html' });
  const blobURL = URL.createObjectURL(sourceBlob);
  return blobURL;
}



// sandbox
const sandbox = document.createElement('iframe');
sandbox.id = 'sandbox';
//sandbox.loading = 'lazy'
sandbox.style.width = '100%';
sandbox.style.height = '50%';
sandbox.style.backgroundColor = 'maroon';


const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';

editorDiv.style.backgroundColor = 'dodgerblue'


document.body.style.backgroundColor = 'teal'


const editor = new Editor(editorDiv, loadedSource);



const runButton = document.createElement('button');
runButton.id = 'runButton'
runButton.textContent = 'runCode'
runButton.style.margin = '1rem';




const reloadSketch = (iframeElement, editorObject) => {
  const sourceCode = topSource + editorObject.toString + bottomSource;
  iframeElement.src = getBlobURL(sourceCode);
  iframeElement.contentWindow.location.reload()
}


runButton.addEventListener('click', (e) => reloadSketch(sandbox, editor));



function domContentInit() {
  console.log('hoge');
  sandbox.src = getBlobURL(topSource + editor.toString + bottomSource);
  
  document.body.appendChild(runButton);
  document.body.appendChild(sandbox);
  document.body.appendChild(editorDiv);
}



function eventHandler() {
  document.removeEventListener('DOMContentLoaded', eventHandler);
  domContentInit();
}

if (document.readyState !== 'loading') {
  // DOM解析が完了している場合は即実行
  doSomething();
} else {
  document.addEventListener('DOMContentLoaded', domContentInit);
}



/*
window.addEventListener('load', (event) => {
  sandbox.src = getBlobURL(topSource + editor.toString + bottomSource);
  
  document.body.appendChild(runButton);
  document.body.appendChild(sandbox);
  document.body.appendChild(editorDiv);

});
*/
