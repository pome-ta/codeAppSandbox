import Editor from './editor.js';


const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';

document.addEventListener('DOMContentLoaded', () => {
  
  document.body.appendChild(editorDiv);
  const editor = new Editor(editorDiv)
  
});
