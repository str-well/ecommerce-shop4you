export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: Rating;
}

export interface Category {
  name: string;
}

const API_URL = 'https://fakestoreapi.com';

export const api = {
  // Buscar todos os produtos
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error('Falha ao buscar produtos');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  // Buscar um produto pelo ID
  getProduct: async (id: number): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error(`Falha ao buscar produto com ID ${id}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar produto com ID ${id}:`, error);
      return null;
    }
  },

  // Buscar todas as categorias
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}/products/categories`);

      if (!response.ok) {
        throw new Error('Falha ao buscar categorias');
      }

      const categoryNames = await response.json();

      // Transforma os nomes das categorias em objetos Category
      return categoryNames.map((name: string) => ({ name }));
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  // Buscar produtos por categoria
  getProductsByCategory: async (categoryName: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products/category/${categoryName}`);

      if (!response.ok) {
        throw new Error(`Falha ao buscar produtos da categoria ${categoryName}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${categoryName}:`, error);
      return [];
    }
  },

  // Buscar produtos limitados (para destaques, por exemplo)
  getLimitedProducts: async (limit: number): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Falha ao buscar ${limit} produtos`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar ${limit} produtos:`, error);
      return [];
    }
  },
};
