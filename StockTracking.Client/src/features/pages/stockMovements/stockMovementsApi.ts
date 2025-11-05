
import { baseApi } from "../../../app/api/baseApi";

// Stok Durumu Modeli (Anlık Stoklar için)
export interface StoreStock {
    storeId: number;
    storeName: string;
    storeCode: string;
    currentStock: number; 
}

// Stok Hareketi Modeli (Geçmiş Hareketler için)
export interface StockMovement {
    id: number;
    movementDate: string; 
    movementType: 'IN' | 'OUT'; 
    productName: string;
    productCode: string;
    storeName: string;
    storeCode: string;
    quantity: number;
    description: string | null;
}

// Stok Hareketi Filtre Parametreleri
export interface StockMovementFilter {
    startDate?: string;
    endDate?: string;
    productId?: number;
}


// Stok Hareketleri API Slice Tanımı
export const stockMovementsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // 1. Ürün Bazında Depo Stoklarını Çekme
        getProductStocks: builder.query<StoreStock[], number>({
            query: (productId) => `/Stocks/product/${productId}`,
        }),

        // 2. Filtrelenmiş Stok Hareketlerini Çekme 
        getStockMovements: builder.query<StockMovement[], StockMovementFilter>({
            query: (filters) => {
                const params = new URLSearchParams();
                if (filters.startDate) params.append('startDate', filters.startDate);
                if (filters.endDate) params.append('endDate', filters.endDate);
                if (filters.productId) params.append('productId', String(filters.productId));
                
                return `/Stocks/history?${params.toString()}`;
            },
            // Stock In/Out mutation'ları bu listeyi yenileyecek (LIST etiketi)
            providesTags: [{ type: 'stokcmovements', id: 'LIST' }],
        }),
    }),
    overrideExisting: false,
});

export const { 
    useGetProductStocksQuery, 
    useGetStockMovementsQuery  
} = stockMovementsApi;