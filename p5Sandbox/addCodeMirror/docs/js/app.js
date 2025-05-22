import Editor from './editor.js';



const sketchCode = `
function setup() {
  createCanvas(240, 240);
}

function draw() {
  background(random() * 255);
}`;



const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';

document.body.style.backgroundColor = 'teal'


const editor = new Editor(editorDiv, sketchCode);



// sandbox
const sandbox = document.createElement('iframe');
sandbox.id = 'sandbox';
sandbox.src = './js/sandboxes/sandbox.html';
//sandbox.style.display = 'none';
sandbox.style.width = '100%';
sandbox.style.height = '50%';
sandbox.style.backgroundColor = 'maroon';
document.body.appendChild(sandbox);

let jsBlob = new Blob([sketchCode], { type: 'text/javascript' });
let blobURL = URL.createObjectURL(jsBlob);
sandbox.contentWindow.postMessage(blobURL, '*');

//postMessage()

/**
 * sandbox へ投げるメッセージ
 */
const postMessage = () => {
  const src = editor.doc
  jsBlob = new Blob([src], { type: 'text/javascript' });
  blobURL = URL.createObjectURL(jsBlob);
  sandbox.contentWindow.postMessage(blobURL, '*');
  
  //sandbox.contentWindow.postMessage(src, '*');
  console.log(src)
};



/*
const sketchMain = document.createElement('main');
//const sketchMain = document.createElement('div');
sketchMain.id = 'sketchMain';
sketchMain.style.width = '100%';
sketchMain.style.height = '50%';
sketchMain.style.backgroundColor = 'maroon'


const scriptElement = document.createElement('script');
sketchMain.appendChild(scriptElement);
*/


const runButton = document.createElement('button');
runButton.id = 'runButton'
runButton.textContent = 'runCode'
runButton.style.margin = '1rem';




document.addEventListener('DOMContentLoaded', () => {
  //document.body.appendChild(sketchMain);
  
  document.body.appendChild(runButton);
  document.body.appendChild(editorDiv);
  
  
  
  
  const jsBlob = new Blob([editor.doc], { type: 'text/javascript' })
  const blobURL = URL.createObjectURL(jsBlob);
  //scriptElement.src = blobURL;
  //console.log(blobURL)
  
  
  runButton.addEventListener('click', (e) => postMessage());
  //postMessage()
  

  
  //console.log(editor)
  
});
