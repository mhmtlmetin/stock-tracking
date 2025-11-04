import { baseApi } from '../../../app/api/baseApi';

// Ortak Stok Hareketi Payload'ı
export interface StockMovementPayload {
    productId: number;
    storeId: number;
    quantity: number;
    referenceNumber?:string
}

// 1. Stok Giriş/Çıkış endpoint'lerinin tanımlanması
export const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        
        // Stok Giriş (Stock In) Mutation'ı
        stockIn: builder.mutation<void, StockMovementPayload>({
            query: (movementData) => ({
                url: '/stocks/in', // API endpoint'i: /stock/in
                method: 'POST',
                body: movementData,
            }),
            // Giriş sonrası, stok hareketleri listesini yenilemek için
            invalidatesTags: [{ type: 'stokcmovements', id: 'LIST' }], 
        }),
        
        // Stok Çıkış (Stock Out) Mutation'ı
        stockOut: builder.mutation<void, StockMovementPayload>({
            query: (movementData) => ({
                url: '/stocks/out', // API endpoint'i: /stock/out
                method: 'POST',
                body: movementData,
            }),
            // Çıkış sonrası, stok hareketleri listesini yenilemek için
            invalidatesTags: [{ type: 'stokcmovements', id: 'LIST' }], 
        }),
    }),
    overrideExisting: false,
});

export const { useStockInMutation, useStockOutMutation } = stockApi;