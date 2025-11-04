import { baseApi } from "../../../app/api/baseApi"; 

// 1. Ürün Veri Modeli
export interface Product {
    id: number;
    name: string;
    code: string;
  
}

// 2. Products API Slice Tanımı
export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Tüm ürünleri çekme endpoint'i
        getProducts: builder.query<Product[], void>({
            query: () => '/products',
        }),
        
        // Yeni ürün ekleme endpoint'i
        createProduct: builder.mutation<Product, Omit<Product, 'id'>>({
            query: (newProduct) => ({
                url: '/products',
                method: 'POST',
                body: newProduct,
            }),
            // invalidateTags: ['Products'], // Ekleme sonrası listeyi yenilemek için
        }),
    }),
    overrideExisting: false,
});

export const { useGetProductsQuery, useCreateProductMutation } = productsApi;