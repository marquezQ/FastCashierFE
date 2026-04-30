// ============================================
// TIPOS PARA MENÚ DIGITAL (DISPLAY)
// ============================================

export type TransitionType = 'slide' | 'fade' | 'zoom';

// Config como la devuelve el backend (admin CRUD)
export interface DisplayConfig {
  idDisplayConfig: number;
  name: string;
  accessToken: string;
  categoryId: number | null;
  rotationInterval: number;
  transitionType: TransitionType;
  showPrices: boolean;
  showDescriptions: boolean;
  productsPerSlide: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO para crear una nueva config
export interface CreateDisplayConfigDto {
  name: string;
  categoryId?: number | null;
  rotationInterval?: number;
  transitionType?: TransitionType;
  showPrices?: boolean;
  showDescriptions?: boolean;
  productsPerSlide?: number;
}

// DTO para actualizar
export type UpdateDisplayConfigDto = Partial<CreateDisplayConfigDto> & {
  isActive?: boolean;
};

// Producto simplificado (lo que devuelve el endpoint público)
export interface DisplayProduct {
  idProduct: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
}

// Respuesta del endpoint público GET /display/:token
export interface DisplayData {
  config: {
    idDisplayConfig: number;
    name: string;
    rotationInterval: number;
    transitionType: TransitionType;
    showPrices: boolean;
    showDescriptions: boolean;
    productsPerSlide: number;
  };
  categoryName: string;
  products: DisplayProduct[];
}
