import { EditorView, minimalSetup } from 'codemirror';
import {
  EditorState,
  EditorSelection,
  StateField,
  StateEffect,
  Compartment,
} from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightActiveLine,
  highlightSpecialChars,
  Decoration,
} from '@codemirror/view';
import {
  undo,
  redo,
  selectAll,
  selectLine,
  indentSelection,
  cursorLineUp,
  cursorLineDown,
  cursorCharLeft,
  cursorCharRight,
  toggleComment,
} from '@codemirror/commands';
import { closeBrackets, autocompletion } from '@codemirror/autocomplete';
import { bracketMatching } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
//import { cpp } from '@codemirror/lang-cpp';
//import { oneDark } from './theme-custom-dark.js';

// const editorDiv = document.createElement('div');
// editorDiv.id = 'editor-div';
// editorDiv.style.width = '100%';

// const myTheme = EditorView.theme(
//   {
//     '&': {
//       // fontSize: '0.72rem',
//       fontSize: '1rem',
//     },
//     '.cm-scroller': {
//       fontFamily:
//         'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
//     },
//     '.cm-line': { padding: 0 },
//   },
//   { dark: true }
// );

const tabSize = new Compartment();

const initExtensions = [
  minimalSetup,
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightActiveLine(),
  autocompletion(),
  closeBrackets(),
  bracketMatching(),
  EditorView.lineWrapping, // 改行
  tabSize.of(EditorState.tabSize.of(2)),
  javascript(),
  //cpp(),
  //oneDark,
  // myTheme,
];

export {
  EditorView,
  highlightSpecialChars,
  EditorState,
  EditorSelection,
  StateField,
  StateEffect,
  Decoration,
  undo,
  redo,
  selectAll,
  selectLine,
  indentSelection,
  cursorLineUp,
  cursorLineDown,
  cursorCharLeft,
  cursorCharRight,
  toggleComment,
  initExtensions,
  // editorDiv,
};
