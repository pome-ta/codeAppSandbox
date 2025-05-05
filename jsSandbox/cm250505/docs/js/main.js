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

/* --- main */
// --- wrap
const setupWrap = () => {


  const container = document.createElement('main');
  container.id = 'container-main';
  container.style.height = '100dvh';
  container.style.backgroundColor = 'maroon';

  const editorDiv = document.createElement('div');
  editorDiv.id = 'editor-div';
  editorDiv.style.width = '100%';
  editorDiv.style.height = '100dvh';
  editorDiv.style.backgroundColor = 'darkseagreen';

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

});
