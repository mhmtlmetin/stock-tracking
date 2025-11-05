// src/features/stock/ProductStockSummary.tsx

import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Alert, CircularProgress } from '@mui/material';
import GenericDataTable, { type ColumnConfig } from '../../../components/GenericDataTable';
import { useGetProductsQuery, type Product } from '../products/productsApi';
import { useGetProductStocksQuery, type StoreStock } from './/stockMovementsApi';

// Kolon Konfigürasyonu
const stockColumns: ColumnConfig<StoreStock>[] = [
    { label: 'Depo Kodu', field: 'storeCode' },
    { label: 'Depo Adı', field: 'storeName' },
    { label: 'Mevcut Stok', field: 'currentStock', align: 'right' },
];

const ProductStockSummary: React.FC = () => {
    const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
    
    // Ürün listesini çekme
    const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
    
    // Seçilen ürünün stoklarını çekme
    const { 
        data: stocks = [], 
        isLoading: stocksLoading, 
        isError: stocksError,
    } = useGetProductStocksQuery(selectedProductId as number, {
        skip: !selectedProductId, // Ürün seçilmediyse sorguyu atla
    });

    const handleProductChange = (e: any) => {
        setSelectedProductId(e.target.value as number);
    };

    return (
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom>
                Ürün Bazında Anlık Depo Stokları
            </Typography>

            {/* Ürün Seçimi Combobox */}
            <FormControl sx={{ minWidth: 250, mb: 3 }} size="small" required>
                <InputLabel id="product-select-label">Ürün Seçiniz</InputLabel>
                <Select
                    labelId="product-select-label"
                    value={selectedProductId}
                    label="Ürün Seçiniz"
                    onChange={handleProductChange}
                    disabled={productsLoading}
                >
                    <MenuItem value="">
                        <em>Ürün Seçiniz</em>
                    </MenuItem>
                    {products.map((product: Product) => (
                        <MenuItem key={product.id} value={product.id}>{product.name} ({product.code})</MenuItem>
                    ))}
                </Select>
                {productsLoading && <CircularProgress size={20} sx={{ position: 'absolute', right: 10, top: 10 }} />}
            </FormControl>

            {/* Stok Listesi Tablosu */}
            {selectedProductId ? (
                stocksError ? (
                    <Alert severity="error">Stok bilgileri yüklenirken hata oluştu.</Alert>
                ) : (
                    <GenericDataTable<StoreStock>
                        data={stocks}
                        columns={stockColumns}
                        isLoading={stocksLoading}
                        // Bu tablo sadece listeleme olduğu için aksiyonlar boş kalır
                        onEdit={() => {}} 
                        onDelete={() => {}} 
                    />
                )
            ) : (
                <Typography color="textSecondary">
                    Lütfen bir ürün seçerek depo stoklarını görüntüleyin.
                </Typography>
            )}
        </Box>
    );
};

export default ProductStockSummary;