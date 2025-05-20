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

document.body.style.backgroundColor = 'black'

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(editorDiv);
  const editor = new Editor(editorDiv, sketchCode)
  
});
