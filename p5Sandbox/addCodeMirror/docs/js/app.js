import Editor from './editor.js';

const sketchCode = `
function setup() {
  createCanvas(240, 240);
}

function draw() {
  background(random() * 255);
}`;



const sketchMain = document.createElement('main');
//const sketchMain = document.createElement('div');
sketchMain.id = 'sketchMain';
sketchMain.style.width = '100%';
sketchMain.style.height = '50%';
sketchMain.style.backgroundColor = 'maroon'

const scriptElement = document.createElement('script');
sketchMain.appendChild(scriptElement);


const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';

document.body.style.backgroundColor = 'teal'


document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(sketchMain);
  document.body.appendChild(editorDiv);
  const editor = new Editor(editorDiv, sketchCode);
  
  const jsBlob = new Blob([editor.doc], { type: 'text/javascript' })
  const blobURL = URL.createObjectURL(jsBlob);
  scriptElement.src = blobURL;

  
  console.log(editor.doc)
  
});
