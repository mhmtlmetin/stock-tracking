import { baseApi } from "../../../app/api/baseApi";

export interface Store {
    id: number;
    name: string;
    location: string; 
    code: string;     
}

// Payload Tipleri
export type StorePayload = Omit<Store, 'id'>;
export type UpdateStorePayload = Store; 

// 2. Stores API Slice Tanımı
export const storesApi = baseApi.injectEndpoints({ 
    endpoints: (builder) => ({
        // Tüm depoları çekme endpoint'i
        getStores: builder.query<Store[], void>({
            query: () => '/stores',
            // LIST etiketini tanımlıyoruz
            providesTags: (result) => 
                result 
                    ? [
                        ...result.map(({ id }) => ({ type: 'Stores' as const, id })), 
                        { type: 'Stores', id: 'LIST' },
                      ]
                    : [{ type: 'Stores', id: 'LIST' }],
        }),
        
        // Yeni depo ekleme endpoint'i
        createStore: builder.mutation<Store, StorePayload>({
            query: (newStore) => ({
                url: '/stores',
                method: 'POST',
                body: newStore,
            }),
            invalidatesTags: [{ type: 'Stores', id: 'LIST' }],
        }),
        
        // Depo güncelleme endpoint'i
        updateStore: builder.mutation<Store, UpdateStorePayload>({
            query: (storeData) => ({
                url: `/stores`,
                method: 'PUT',
                body: storeData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Stores', id },
                { type: 'Stores', id: 'LIST' },
            ],
        }),

        // Depo silme endpoint'i
        deleteStore: builder.mutation<void, number>({
            query: (id) => ({
                url: `/stores/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Stores', id: 'LIST' },
                { type: 'Stores', id },
            ],
        }),
    }),
    overrideExisting: false,
});

export const { 
    useGetStoresQuery, 
    useCreateStoreMutation, 
    useUpdateStoreMutation, 
    useDeleteStoreMutation 
} = storesApi;
