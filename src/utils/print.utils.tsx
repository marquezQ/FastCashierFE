import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Prints a React component by rendering it to a standalone HTML document
 * and opening it in a new browser window/tab.
 *
 * Platform behavior:
 * - Desktop: auto-triggers print dialog → auto-closes window after print/cancel
 * - Android Browser/PWA: opens ticket in Chrome tab for native share/print
 *
 * NOTE: This is a temporary frontend-only solution. The production-grade
 * approach is to generate the ticket PDF server-side (GET /orders/:id/ticket/pdf)
 * and open the blob URL directly. See CloseSessionDialog.handleDownloadPdf
 * for the reference pattern.
 */

const PRINT_STYLES = `@page{margin:0;size:auto}html,body{margin:0;padding:0;background:#fff;font-family:'Courier New',Courier,monospace;-webkit-print-color-adjust:exact}*{box-sizing:border-box}`;

const PRINT_SCRIPT = `window.onafterprint=function(){window.close()};setTimeout(function(){try{window.print()}catch(e){}},400)`;

function buildPrintDocument(bodyHtml: string): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Ticket</title><style>${PRINT_STYLES}</style></head><body>${bodyHtml}<script>${PRINT_SCRIPT}</script></body></html>`;
}

export const printComponent = <T,>(
  Component: React.ComponentType<T>,
  props: T
): void => {
  const markup = renderToStaticMarkup(<Component {...(props as any)} />);
  const html = buildPrintDocument(markup);

  // Use Blob URL — avoids deprecated document.write() and works cross-platform
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');

  // Free the Blob from memory after 30s (enough time for print dialog)
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
};
