// src/screens/StockMovementsScreen.tsx

import React from 'react';
import { Box } from '@mui/material';
import ProductStockSummary from './ProductStockSummary';
import StockMovementList from './StockMovementList';

const StockMovementPage: React.FC = () => {
    return (
        <Box sx={{ p: 3, width: '100%' }}>
            {/*Ürün bazında depo stokları */}
            <ProductStockSummary />

            {/* Tüm stok hareketleri listesi*/}
            <StockMovementList />
        </Box>
    );
};

export default StockMovementPage;