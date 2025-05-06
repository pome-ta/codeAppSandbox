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
sandbox.src = './js/sandboxes/sandbox.html'
sandbox.style.display = 'none'

const controller = document.createElement('div');
controller.id = 'controller'
controller.style.display = 'flex'
controller.style.justifyContent = 'space-between'
// controller.style.margin = '1rem';




const runCode = document.createElement('button');
runCode.id = 'runCode'
runCode.textContent = 'runCode'
runCode.style.margin = '1rem';

const clearConsole = document.createElement('button');
clearConsole.id = 'clearConsole'
clearConsole.textContent = 'clearConsole'
clearConsole.style.margin = '1rem';


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




const container = document.createElement('main');
container.id = 'container-main';
container.style.height = '100%';
//container.style.backgroundColor = 'maroon';

const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';
// editorDiv.style.height = '100%';
//editorDiv.style.backgroundColor = 'darkseagreen';



/* --- main */

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
  { dark: false }
);

const extensions = [
  ...initExtensions,
  myTheme,
];


const docStr = `const items = [1, 2, 3, 4];
for (let item of items) {
  console.log(item)
}
`;

// --- EditorView
const state = EditorState.create({
  extensions: extensions,
  doc: docStr,
});




/**
 * sandbox へ投げるメッセージ
 */
const postMessage = () => {
  //const src = editor.contentDOM.editContext.text;
  const src = editor.viewState.state.doc.toString();
  sandbox.contentWindow.postMessage(src, '*');
};

window.addEventListener('message', (e) => {
  if (e.data.isSandbox) {
    addTableRow(e.data.result);
  }
});




document.addEventListener('DOMContentLoaded', () => {
  editor = new EditorView({
    state,
    parent: editorDiv,
  });

  controller.appendChild(clearConsole)
  controller.appendChild(runCode)

  // document.body.appendChild(controller)
  // document.body.appendChild(sandbox)


  // document.body.appendChild(controller);
  document.body.appendChild(container);
  document.body.appendChild(container).appendChild(controller);
  container.appendChild(editorDiv);
  container.appendChild(boxConsole);
  container.appendChild(sandbox);

  setupTable();
  runCode.addEventListener('click', (e) => postMessage());
  clearConsole.addEventListener('click', (e) => removeTableRow());

});
