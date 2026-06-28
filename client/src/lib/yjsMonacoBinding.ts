import * as Y from 'yjs';
import type { Awareness } from 'y-protocols/awareness';
import type { Monaco, OnMount } from '@monaco-editor/react';

/**
 * Lightweight Yjs <-> Monaco binding.
 *
 * Mirrors the proven delta-application logic of the `y-monaco` package, but uses
 * the SAME Monaco instance the app already loads via `@monaco-editor/react`
 * (passed in from `onMount`). This avoids bundling a second copy of Monaco or
 * relying on a version-matched CDN.
 *
 * Remote cursors/selections are exchanged as JSON-safe absolute offsets through
 * Yjs awareness (rather than RelativePositions), which serialize reliably across
 * the Socket.IO transport. Cursor offsets are ephemeral and self-correct on the
 * next cursor movement.
 */

type StandaloneEditor = Parameters<OnMount>[0];
type TextModel = NonNullable<ReturnType<StandaloneEditor['getModel']>>;

export interface CollabUser {
  name: string;
  color: string;
}

interface CursorState {
  anchor: number;
  head: number;
}

interface AwarenessUserState {
  user?: CollabUser;
  cursor?: CursorState | null;
}

/** Simple re-entrancy guard so the two sync directions never echo each other. */
function createMux() {
  let locked = false;
  return (fn: () => void) => {
    if (locked) return;
    locked = true;
    try {
      fn();
    } finally {
      locked = false;
    }
  };
}

/** Inject/update a per-client stylesheet so each collaborator gets their color. */
function applyCursorStyles(clientID: number, color: string) {
  const id = `yjs-cursor-style-${clientID}`;
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = `
    .yRemoteSelection-${clientID} { background-color: ${color}33; }
    .yRemoteCursor-${clientID} {
      border-left: 2px solid ${color};
      margin-left: -1px;
      pointer-events: none;
    }
    .yRemoteCursor-${clientID}::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${color};
    }
  `;
}

function removeCursorStyles(clientID: number) {
  document.getElementById(`yjs-cursor-style-${clientID}`)?.remove();
}

export class YjsMonacoBinding {
  private readonly mux = createMux();
  private decorationIds: string[] = [];
  private readonly disposers: Array<() => void> = [];
  private knownClients = new Set<number>();

  constructor(
    ytext: Y.Text,
    private readonly editor: StandaloneEditor,
    private readonly monaco: Monaco,
    private readonly awareness: Awareness,
  ) {
    const model = editor.getModel();
    if (!model) throw new Error('YjsMonacoBinding: editor has no model');

    // Seed the editor with the current shared document.
    const initial = ytext.toString();
    if (model.getValue() !== initial) {
      this.mux(() => model.setValue(initial));
    }

    // Yjs -> Monaco
    const ytextObserver = (event: Y.YTextEvent) => this.applyYjsDelta(model, event);
    ytext.observe(ytextObserver);
    this.disposers.push(() => ytext.unobserve(ytextObserver));

    // Monaco -> Yjs
    const changeHandler = model.onDidChangeContent((event) => {
      this.mux(() => {
        ytext.doc!.transact(() => {
          // Apply right-to-left so earlier offsets stay valid.
          [...event.changes]
            .sort((a, b) => b.rangeOffset - a.rangeOffset)
            .forEach((change) => {
              ytext.delete(change.rangeOffset, change.rangeLength);
              ytext.insert(change.rangeOffset, change.text);
            });
        }, this);
      });
    });
    this.disposers.push(() => changeHandler.dispose());

    // Local cursor -> awareness
    const cursorHandler = editor.onDidChangeCursorSelection(() => {
      const sel = editor.getSelection();
      if (!sel) {
        awareness.setLocalStateField('cursor', null);
        return;
      }
      awareness.setLocalStateField('cursor', {
        anchor: model.getOffsetAt(sel.getStartPosition()),
        head: model.getOffsetAt(sel.getEndPosition()),
      } as CursorState);
    });
    this.disposers.push(() => cursorHandler.dispose());

    // Remote awareness -> decorations
    const awarenessHandler = () => this.renderRemoteCursors(model);
    awareness.on('change', awarenessHandler);
    this.disposers.push(() => awareness.off('change', awarenessHandler));

    this.renderRemoteCursors(model);
  }

  private applyYjsDelta(model: TextModel, event: Y.YTextEvent) {
    this.mux(() => {
      let index = 0;
      event.delta.forEach((op) => {
        if (op.retain != null) {
          index += op.retain;
        } else if (op.insert != null) {
          const text = typeof op.insert === 'string' ? op.insert : '';
          const pos = model.getPositionAt(index);
          model.applyEdits([
            {
              range: new this.monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
              text,
            },
          ]);
          index += text.length;
        } else if (op.delete != null) {
          const start = model.getPositionAt(index);
          const end = model.getPositionAt(index + op.delete);
          model.applyEdits([
            {
              range: new this.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
              text: '',
            },
          ]);
        }
      });
    });
    this.renderRemoteCursors(model);
  }

  private renderRemoteCursors(model: TextModel) {
    const states = this.awareness.getStates() as Map<number, AwarenessUserState>;
    const newDecorations: Parameters<TextModel['deltaDecorations']>[1] = [];
    const seen = new Set<number>();

    states.forEach((state, clientID) => {
      if (clientID === this.awareness.clientID) return;
      const color = state.user?.color || '#22d3ee';
      const name = state.user?.name || 'Guest';
      applyCursorStyles(clientID, color);
      seen.add(clientID);
      this.knownClients.add(clientID);

      const cursor = state.cursor;
      if (!cursor) return;
      const total = model.getValueLength();
      const anchor = Math.min(cursor.anchor, total);
      const head = Math.min(cursor.head, total);
      const start = model.getPositionAt(Math.min(anchor, head));
      const end = model.getPositionAt(Math.max(anchor, head));

      if (anchor !== head) {
        newDecorations.push({
          range: new this.monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
          options: { className: `yRemoteSelection-${clientID}` },
        });
      }
      const caret = model.getPositionAt(head);
      newDecorations.push({
        range: new this.monaco.Range(caret.lineNumber, caret.column, caret.lineNumber, caret.column),
        options: {
          className: `yRemoteCursor-${clientID}`,
          hoverMessage: { value: name },
          stickiness: this.monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      });
    });

    // Clean up styles for clients that left.
    this.knownClients.forEach((clientID) => {
      if (!seen.has(clientID)) {
        removeCursorStyles(clientID);
        this.knownClients.delete(clientID);
      }
    });

    this.decorationIds = this.editor.deltaDecorations(this.decorationIds, newDecorations);
  }

  destroy() {
    this.disposers.forEach((d) => d());
    this.editor.deltaDecorations(this.decorationIds, []);
    this.knownClients.forEach(removeCursorStyles);
    this.knownClients.clear();
  }
}
