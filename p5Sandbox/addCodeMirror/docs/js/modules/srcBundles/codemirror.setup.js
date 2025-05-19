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
};

