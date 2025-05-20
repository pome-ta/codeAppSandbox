import {
  EditorView,
  highlightSpecialChars,
  EditorState,
  StateField,
  StateEffect,
  Decoration,
  initExtensions,
  //editorDiv,
} from './modules/codemirror.bundle.js';


/**
 * backGround Rectangle span
 */
const bgRectangleClassName = 'cm-bgRectangle';
const bgRectangleMark = Decoration.mark({ class: bgRectangleClassName });
const bgRectangleTheme = EditorView.baseTheme({
  // '.cm-bgRectangle': { backgroundColor: '#232323aa' },
  '.cm-bgRectangle': { backgroundColor: '#232323dd' },
});

const bgRectEffect = {
  add: StateEffect.define({ from: 0, to: 0 }),
  remove: StateEffect.define({ from: 0, to: 0 }),
};

const bgRectangleField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(bgRectangles, tr) {
    bgRectangles = bgRectangles.map(tr.changes);
    for (const ef of tr.effects) {
      if (ef.is(bgRectEffect.add)) {
        bgRectangles = bgRectangles.update({
          add: [bgRectangleMark.range(ef.value.from, ef.value.to)],
        });
      } else if (ef.is(bgRectEffect.remove)) {
        bgRectangles = bgRectangles.update({
          // filter: (from, to, value) => {
          //   let shouldRemove =
          //     from === e.value.from &&
          //     to === e.value.to &&
          //     value.spec.class === bgRectangleClassName;
          //   return !shouldRemove;
          // },
          filter: (f, t, value) => !(value.class === bgRectangleClassName),
        });
      }
    }
    return bgRectangles;
  },
  provide: (f) => EditorView.decorations.from(f),
});

function bgRectangleSet(view) {
  const { state, dispatch } = view;
  const { from, to } = state.selection.main.extend(0, state.doc.length);
  if (!from && !to) {
    return;
  }
  const decoSet = state.field(bgRectangleField, false);

  const addFromTO = (from, to) => bgRectEffect.add.of({ from, to });
  const removeFromTO = (from, to) => bgRectEffect.remove.of({ from, to });

  let effects = [];
  effects.push(
    !decoSet ? StateEffect.appendConfig.of([bgRectangleField]) : null
  );
  decoSet?.between(from, to, (decoFrom, decoTo) => {
    if (from === decoTo || to === decoFrom) {
      return;
    }
    effects.push(removeFromTO(from, to));
    effects.push(removeFromTO(decoFrom, decoTo));
    effects.push(decoFrom < from ? addFromTO(decoFrom, from) : null);
    effects.push(decoTo > to ? addFromTO(to, decoTo) : null);
  });
  effects.push(addFromTO(from, to));
  if (!effects.length) {
    return false;
  }
  dispatch({ effects: effects.filter((ef) => ef) });
  return true;
}

/**
 * whitespaceShow
 */
const u22c5 = '⋅'; // DOT OPERATOR
const ivory = '#abb2bf44'; // todo: oneDark から拝借
const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.classList.add('cm-whoteSpace');
    node.style.color = ivory;
    node.innerText = u22c5;
    node.title = '\\u' + code.toString(16);
    return node;
  },
  // specialChars: /\x20/g,
  addSpecialChars: /\x20/g,
});

const resOutlineTheme = EditorView.baseTheme({
  '&.cm-editor': {
    '&.cm-focused': {
      outline: '0px dotted #212121',
    },
  },
});

const fontSizeTheme = EditorView.theme({
  '&': {
    fontSize: hasTouchScreen ? '0.72rem' : '1.0rem',
  },
});



const _extensions = [
  fontSizeTheme,
  ...initExtensions,
  //whitespaceShow,
  resOutlineTheme,
  bgRectangleTheme,
  updateCallback,
];


class Editor {
  constructor(editorDiv, doc='', extensions=null) {
    this.editorDiv = editorDiv
    this.doc = doc
    //this.extensions = extensions ? [..._extensions, ...extensions] : _extensions;
    this.extensions = _extensions;
    
    
    
    this.state = EditorState.create({
      doc: this.doc,
      extensions: this.extensions,
    });
    this.editor = new EditorView({
      this.state,
      parent: this.editorDiv,
    });
    
    bgRectangleSet(this.editor);
  }
}


export default Editor;
