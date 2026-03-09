import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Prints a React component in a hidden iframe
 * @param Component The React component to print
 * @param props Props for the component
 */
export const printComponent = <T,>(
  Component: React.ComponentType<T>,
  props: T
) => {
  // Create a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden';

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;

  // Add basic styles for the ticket
  const style = iframeDoc.createElement('style');
  style.textContent = `
    @page {
      margin: 0;
      size: auto;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Courier New', Courier, monospace;
      width: 80mm;
      -webkit-print-color-adjust: exact;
    }
    * {
      box-sizing: border-box;
    }
    @media print {
      body {
        width: 80mm;
      }
    }
  `;
  iframeDoc.head.appendChild(style);

  // Create a container for the React app
  const container = iframeDoc.createElement('div');
  container.id = 'print-root';
  iframeDoc.body.appendChild(container);

  // Render the component
  const root = createRoot(container);
  root.render(<Component {...(props as any)} />);

  // Wait for rendering and images to load
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Cleanup after printing (with a delay to ensure print dialog opened)
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};
