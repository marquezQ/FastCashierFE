import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Prints a React component by rendering it to a standalone HTML document
 * and writing it to a new browser window.
 *
 * Why this approach?
 * - window.print() on main window: silently fails on Android
 * - Blob URL: Android's print engine can't re-fetch volatile Blob references
 * - Data URI: Chrome blocks data:text/html via window.open()
 * - New window + DOM write: content lives in the DOM, works everywhere ✓
 *
 * Platform behavior:
 * - Desktop: auto-triggers print dialog → auto-closes window after print/cancel
 * - Android Browser/PWA: opens ticket in Chrome tab for native share/print
 *
 * NOTE: This is a temporary frontend-only solution. The production-grade
 * approach is to generate the ticket PDF server-side (GET /orders/:id/ticket/pdf)
 * and open the blob directly.
 */

const PRINT_STYLES = `
  @page { margin: 0; size: auto; }
  html, body {
    margin: 0; padding: 0; background: #fff;
    font-family: 'Courier New', Courier, monospace;
    -webkit-print-color-adjust: exact;
  }
  * { box-sizing: border-box; }
`;

function buildPrintDocument(bodyHtml: string): string {
  return [
    '<!DOCTYPE html>',
    '<html lang="es">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '  <title>Ticket</title>',
    `  <style>${PRINT_STYLES}</style>`,
    '</head>',
    `<body>${bodyHtml}</body>`,
    '</html>',
  ].join('');
}

export const printComponent = <T,>(
  Component: React.ComponentType<T>,
  props: T
): void => {
  const markup = renderToStaticMarkup(<Component {...(props as any)} />);
  const html = buildPrintDocument(markup);

  const win = window.open('about:blank', '_blank');
  if (!win) return;

  // document.write on a blank window is the correct cross-platform API.
  // The TS deprecation refers to inline use during page load, not this pattern.
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  win.document.open();
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  win.document.write(html);
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  win.document.close();

  // Desktop: auto-trigger print after content renders, auto-close after dialog
  // Android: window.print() silently fails, user prints via native menu — that's fine
  win.onafterprint = () => win.close();
  setTimeout(() => {
    try { win.print(); } catch { /* Android: silently fails, expected */ }
  }, 400);
};
