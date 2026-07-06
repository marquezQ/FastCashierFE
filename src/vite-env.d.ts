/// <reference types="vite/client" />

// Variables de entorno tipadas
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_MODE: 'demo' | 'production';
  readonly VITE_BUSINESS_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Inyectado por Vite en build time desde package.json
declare const __APP_VERSION__: string;
