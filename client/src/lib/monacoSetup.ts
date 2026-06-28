/**
 * Self-host Monaco instead of loading it from a CDN.
 *
 * `@monaco-editor/react` defaults to fetching Monaco from a CDN at runtime,
 * which is a production single-point-of-failure: if the CDN is blocked, slow,
 * or down, the IDE and the live collaboration editor break. Here we bundle
 * Monaco locally and register its web workers via Vite, then point the loader
 * at the bundled instance.
 *
 * This module is imported at the top of the editor route chunks (IDE,
 * Collaborate) only, so Monaco is code-split out of the initial app bundle and
 * loaded lazily when a user actually opens an editor.
 */
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

// Vite bundles these as separate worker chunks (loaded on demand).
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    switch (label) {
      case 'json':
        return new JsonWorker();
      case 'css':
      case 'scss':
      case 'less':
        return new CssWorker();
      case 'html':
      case 'handlebars':
      case 'razor':
        return new HtmlWorker();
      case 'typescript':
      case 'javascript':
        return new TsWorker();
      default:
        return new EditorWorker();
    }
  },
};

loader.config({ monaco });

export default monaco;
