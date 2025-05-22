import Editor from './editor.js';




/* -- loadSource */
async function fetchSketchFile(path) {
  const res = await fetch(path);
  const sketchText = await res.text();
  return sketchText;
}



let loadedSource;
const fsPath = './sketchBook/mainSketch.js'


/*
const fsPath =
  `${location.protocol}` === 'file:'
    ? './shaders/fs/fsDev300es.js'
    : './shaders/fs/fsMain300es.js';
*/
//const fsPaths = ['./shaders/fs/fsMain.js', './shaders/fs/fsMain300es.js'];
// xxx: 読み込み方法が雑
//const fsPath = initMode ? fsPaths[1] : fsPaths[0];
loadedSource = await fetchSketchFile(fsPath);



const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';

document.body.style.backgroundColor = 'teal'


const editor = new Editor(editorDiv, loadedSource);



// sandbox
const sandbox = document.createElement('iframe');
sandbox.id = 'sandbox';


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


//postMessage()

document.addEventListener('DOMContentLoaded', () => {
  //document.body.appendChild(sketchMain);
  document.body.appendChild(sandbox);
  
  sandbox.src = './js/sandboxes/sandbox.html';
//sandbox.style.display = 'none';
sandbox.style.width = '100%';
sandbox.style.height = '50%';
sandbox.style.backgroundColor = 'maroon';

sandbox.contentWindow.postMessage('goheeee', '*');
  
  
  
  document.body.appendChild(runButton);
  document.body.appendChild(editorDiv);
  sandbox.contentWindow.postMessage(blobURL, '*');
  postMessage()
  
  
  
  
  
  
  
  runButton.addEventListener('click', (e) => postMessage());
  //postMessage()
  

  
  //console.log(editor)
  
});

window.addEventListener('load', ()=>{
  console.log('ページの読み込みが完了しました。');
  postMessage()
  sandbox.contentWindow.postMessage(blobURL, '*');
});
