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


function getBlobURL(sourceCode) {
  const sourceBlob = new Blob([sourceCode], { type: 'text/html' });
  const blobURL = URL.createObjectURL(sourceBlob);
  return blobURL;
}



// sandbox
const sandbox = document.createElement('iframe');
sandbox.id = 'sandbox';
sandbox.loading = 'lazy'
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

function pushRun() {
  const sourceCode = topSource + editor.doc + bottomSource;
  console.log(sourceCode)
  sandbox.src = getBlobURL(sourceCode);
  sandbox.contentWindow.location.reload(true)
}


runButton.addEventListener('click', (e) => pushRun());




document.addEventListener('DOMContentLoaded', () => {
  console.log('hoge');
  sandbox.src = getBlobURL(topSource + editor.doc + bottomSource);
  document.body.appendChild(runButton);
  document.body.appendChild(sandbox);
  document.body.appendChild(editorDiv);
  
});

