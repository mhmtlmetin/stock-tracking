// src/features/stock/StockMovementList.tsx

import React, { useState } from 'react';
import { 
    Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, 
    Alert, CircularProgress
} from '@mui/material';
import GenericDataTable, { type ColumnConfig } from '../../../components/GenericDataTable';
import { useGetStockMovementsQuery, type StockMovement, type StockMovementFilter } from './stockMovementsApi';
import { useGetProductsQuery, type Product } from '../products/productsApi';

// Kolon Konfigürasyonu
const movementColumns: ColumnConfig<StockMovement>[] = [
    { label: 'Tarih', field: 'movementDate', render: (m) => new Date(m.movementDate).toLocaleDateString() },
    { label: 'Tip', field: 'movementType' },
    { label: 'Ürün', field: 'productName', render: (m) => `${m.productName}` },
    { label: 'Depo', field: 'storeName', render: (m) => `${m.storeName}` },
    { label: 'Miktar', field: 'quantity', align: 'right' },
];


const StockMovementList: React.FC = () => {
    // Filtre state'i
    const [filters, setFilters] = useState<StockMovementFilter>({});
    const [tempFilters, setTempFilters] = useState<StockMovementFilter>({}); // Formdaki geçici state

    // Ürün listesini çekme (Filtre combobox'u için)
    const { data: products = [] } = useGetProductsQuery();
    
    // Stok hareketlerini çekme (Filtre state'ini kullan)
    const { 
        data: movements = [], 
        isLoading, 
        isError,
        isFetching // Yeniden çekme durumunu da göstermek için
    } = useGetStockMovementsQuery(filters);


    const handleTempChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        
        setTempFilters(prev => ({
            ...prev,
            [name as string]: value === '' ? undefined : value, // Boş string yerine undefined
        }));
    };

    const handleApplyFilters = () => {
        // Geçici filtreleri kalıcı filtre state'ine ata, sorguyu tetikle
        setFilters(tempFilters);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Tüm Stok Hareketleri
            </Typography>

            {/* Filtre Formu */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                    name="startDate"
                    label="Başlangıç Tarihi"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={tempFilters.startDate || ''}
                    onChange={handleTempChange}
                />
                <TextField
                    name="endDate"
                    label="Bitiş Tarihi"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={tempFilters.endDate || ''}
                    onChange={handleTempChange}
                />

                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel id="product-filter-label">Ürün Filtresi</InputLabel>
                    <Select
                        labelId="product-filter-label"
                        name="productId"
                        value={tempFilters.productId || ''}
                        label="Ürün Filtresi"
                        onChange={handleTempChange}
                    >
                        <MenuItem value="">
                            <em>Tüm Ürünler</em>
                        </MenuItem>
                        {products.map((product: Product) => (
                            <MenuItem key={product.id} value={product.id}>{product.name} ({product.code})</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={handleApplyFilters} disabled={isLoading || isFetching}>
                    Filtrele
                </Button>
            </Box>

            {/* Stok Hareketleri Tablosu */}
            {isError ? (
                <Alert severity="error">Stok hareketleri yüklenirken hata oluştu.</Alert>
            ) : (
                <Box sx={{ position: 'relative' }}>
                     {(isLoading || isFetching) && (
                        <CircularProgress 
                            size={30} 
                            sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10, mt: 5 }} 
                        />
                    )}
                    <GenericDataTable<StockMovement>
                        data={movements}
                        columns={movementColumns}
                        // isFetching'i GenericDataTable'a göndermek yerine, burada üstte gösteriyoruz.
                        // isFetching ve isLoading durumunda tablonun kendisi yerine overlay gösterilir.
                        isLoading={false} 
                        onEdit={() => {}} 
                        onDelete={() => {}} 
                    />
                </Box>
            )}
        </Box>
    );
};

export default StockMovementList;