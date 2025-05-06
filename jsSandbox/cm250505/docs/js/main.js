import {
  EditorView,
  highlightSpecialChars,
  EditorState,
  StateField,
  StateEffect,
  Decoration,
  initExtensions,
} from './modules/codemirror.bundle.js';


let editor;


// sandbox
const sandbox = document.createElement('iframe');
sandbox.id = 'sandbox'
sandbox.src = './sandboxes/sandbox.html'
sandbox.style.display = 'none'

const controller = document.createElement('div');
controller.id = 'controller'

const runCode = document.createElement('button');
runCode.id = 'runCode'
runCode.textContent = 'runCode'

const clearConsole = document.createElement('button');
clearConsole.id ='clearConsole'
clearConsole.textContent = 'clearConsole'

controller.appendChild(runCode)
controller.appendChild(clearConsole)





/**
 * boxConsole(実行結果table)
 */
const boxConsole = document.createElement('div');
boxConsole.id = 'boxConsole'

const tbl = document.createElement('table');
const tblBody = document.createElement('tbody');

const setupTable = () => {
  tbl.appendChild(tblBody);
  boxConsole.appendChild(tbl);
};

const addTableRow = (time_success_code) => {
  let issuccess = false;
  const row = document.createElement('tr');

  for (const [key, value] of Object.entries(time_success_code)) {
    const cell = document.createElement('td');
    const cellText = document.createElement('code');
    cellText.innerText = value;

    if (key === 'success') {
      issuccess = value;
      cellText.innerText = issuccess ? '🟢' : '❌';
    }
    cell.appendChild(cellText);
    row.appendChild(cell);
  }
  issuccess ? row.classList.add('success') : row.classList.add('noSuccess');
  tblBody.prepend(row);
};

const removeTableRow = () => {
  while (tblBody.firstChild) {
    tblBody.removeChild(tblBody.firstChild);
  }
};

document.body.appendChild(controller)
document.body.appendChild(sandbox)
document.body.appendChild(boxConsole)
setupTable();



/* --- main */
// --- wrap
const setupWrap = () => {


  const container = document.createElement('main');
  container.id = 'container-main';
  container.style.height = '100dvh';
  //container.style.backgroundColor = 'maroon';

  const editorDiv = document.createElement('div');
  editorDiv.id = 'editor-div';
  editorDiv.style.width = '100%';
  editorDiv.style.height = '100dvh';
  //editorDiv.style.backgroundColor = 'darkseagreen';
  

  document.body.appendChild(container).appendChild(editorDiv);
  return editorDiv;

}



const myTheme = EditorView.theme(
  {
    '&': {
      //fontSize: '0.72rem',
      fontSize: '1rem',
    },
    '.cm-scroller': {
      fontFamily:
        'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
    },
    '.cm-line': { padding: 0 },
  },
  { dark: true }
);

const extensions = [
  ...initExtensions,
  myTheme,
];

// --- EditorView
const viewEditor = () => {
  // document.body.appendChild(container).appendChild(editorDiv);
  const editorDiv = setupWrap();

  const state = EditorState.create({
    extensions: extensions,
    doc: 'ほげほげ',
  })
  editor = new EditorView({
    state,
    parent: editorDiv,
  })

}


document.addEventListener('DOMContentLoaded', () => {
  viewEditor();
  
  console.log(editor)

});
