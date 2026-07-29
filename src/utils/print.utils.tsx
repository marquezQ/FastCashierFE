/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Prints a React component by rendering it to a standalone HTML document
 * and writing it to a new browser window.
 *
 * Platform-aware behavior:
 * - Desktop: opens window → auto-triggers print → auto-closes after print/cancel
 * - Android: opens ticket in Chrome tab with a visible "Imprimir" button.
 *   Android's print engine crashes if window.print() is called programmatically
 *   from a non-real-URL window, so we let the user trigger print manually via
 *   a button inside the page (preserving the user gesture).
 *
 * NOTE: Temporary frontend-only solution. Production-grade approach is
 * server-side PDF generation (GET /orders/:id/ticket/pdf).
 */

const IS_ANDROID = /android/i.test(navigator.userAgent);

const PRINT_STYLES = `
  @page { margin: 0; size: auto; }
  html, body {
    margin: 0; padding: 0; background: #fff;
    font-family: 'Courier New', Courier, monospace;
    -webkit-print-color-adjust: exact;
  }
  * { box-sizing: border-box; }
  .print-actions {
    text-align: center;
    padding: 24px 16px;
    border-top: 1px dashed #ccc;
    margin-top: 15px;
  }
  .print-actions button {
    font-size: 28px;
    font-weight: bold;
    padding: 24px 32px;
    border: 2px solid #000;
    background: #000;
    color: #fff;
    border-radius: 12px;
    cursor: pointer;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
  @media print {
    .print-actions { display: none !important; }
  }
`;

const ANDROID_PRINT_BUTTON = `
  <div class="print-actions">
    <button onclick="window.print()">🖨️ IMPRIMIR TICKET</button>
  </div>
`;

function buildPrintDocument(bodyHtml: string, forAndroid: boolean): string {
  const actions = forAndroid ? ANDROID_PRINT_BUTTON : '';
  return [
    '<!DOCTYPE html>',
    '<html lang="es">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width,initial-scale=1.0">',
    '  <title>Ticket</title>',
    `  <style>${PRINT_STYLES}</style>`,
    '</head>',
    `<body>${bodyHtml}${actions}</body>`,
    '</html>',
  ].join('');
}

export const printComponent = <T,>(
  Component: React.ComponentType<T>,
  props: T
): void => {
  const markup = renderToStaticMarkup(<Component {...(props as any)} />);
  const html = buildPrintDocument(markup, IS_ANDROID);

  const win = window.open('about:blank', '_blank');
  if (!win) return;

   
  win.document.open();
   
  win.document.write(html);
   
  win.document.close();

  if (!IS_ANDROID) {
    // Desktop: auto-trigger print and auto-close window after dialog is dismissed
    win.onafterprint = () => win.close();
    setTimeout(() => {
      try { win.print(); } catch { /* noop */ }
    }, 400);
  }
  // Android: no auto-print, no auto-close.
  // The user taps the "IMPRIMIR TICKET" button inside the page,
  // which preserves the user gesture and lets Android's print engine work.
};
