import { baseApi } from "../../../app/api/baseApi";

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
}
// Yeni: Ürün ekleme/güncelleme tipi
export type ProductPayload = Omit<Product, "id">;
export type UpdateProductPayload = Product;
// 2. Products API Slice Tanımı
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Tüm ürünleri çekme endpoint'i
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      providesTags: (result) =>
        result
          ? [
              // Tek tek ürünler için ID bazlı etiketler
              ...result.map(({ id }) => ({ type: "Products" as const, id })),
              // TÜM LİSTE için kullanılan ana etiket
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    //Yeni ürün ekle
    createProduct: builder.mutation<Product, ProductPayload>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      // Ekleme sonrası listeyi yenile
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    //ürünü güncelle
    updateProduct: builder.mutation<Product, UpdateProductPayload>({
      query: (productData) => ({
        url: "/Products",
        method: "PUT",
        body: productData,
      }),
      // Güncelleme sonrası sadece ilgili ürünü yenile
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // Ürün sil
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      // Silme sonrası listeyi yenile
      invalidatesTags: (result, error, id) => [
        { type: "Products", id: "LIST" },
        { type: "Products", id },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;