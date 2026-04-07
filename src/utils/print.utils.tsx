import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Prints a React component by temporarily mounting it to the DOM
 * and using CSS media queries to hide the rest of the application
 * during the print process. This ensures compatibility with Android PWA.
 * @param Component The React component to print
 * @param props Props for the component
 */
export const printComponent = <T,>(
  Component: React.ComponentType<T>,
  props: T
) => {
  // Create a container for the React app
  const container = document.createElement('div');
  container.id = 'print-root';
  
  // Add print-specific styles to hide the main app and format the ticket
  const style = document.createElement('style');
  style.id = 'print-ticket-style';
  style.textContent = `
    @media print {
      body > :not(#print-root) {
        display: none !important;
      }
      #print-root {
        display: block !important;
        width: 80mm;
      }
      body {
        margin: 0;
        padding: 0;
        background: white;
        font-family: 'Courier New', Courier, monospace;
        -webkit-print-color-adjust: exact;
      }
      @page {
        margin: 0;
        size: auto;
      }
      * {
        box-sizing: border-box;
      }
    }
    @media screen {
      #print-root {
        display: none !important;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(container);

  // Render the component
  const root = createRoot(container);
  root.render(<Component {...(props as any)} />);

  // Wait for rendering and images to load
  setTimeout(() => {
    window.print();

    // Cleanup after printing (with a delay to ensure print dialog opened)
    setTimeout(() => {
      root.unmount();
      document.body.removeChild(container);
      document.head.removeChild(style);
    }, 1000);
  }, 500);
};
