import React, { useState, useEffect } from 'react';
import { 
    Box, TextField, Button, CircularProgress, Alert, 
    FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import { useStockInMutation, useStockOutMutation, type StockMovementPayload } from './stockApi';
import { useGetProductsQuery, type Product } from '../products/productsApi';
import { useGetStoresQuery, type Store } from '../stores/storesApi';

// Props Tipleri
interface StockInOutFormProps {
    type: 'IN' | 'OUT'; // Hangi işlemi yaptığımızı belirtir
    buttonLabel: string; // Buton etiketi (Giriş Yap / Çıkış Yap)
}

const initialFormData: StockMovementPayload = {
    productId: 0,
    storeId: 0,
    quantity: 0,
    referenceNumber:''
};

const StockInOutForm: React.FC<StockInOutFormProps> = ({ type, buttonLabel }) => {
    const [formData, setFormData] = useState<StockMovementPayload>(initialFormData);
    const [success, setSuccess] = useState('');

    // RTK Query Hook'ları (Koşullu olarak tanımlanır)
    const [stockIn, { isLoading: isIncoming, isError: isInError, error: inError }] = useStockInMutation();
    const [stockOut, { isLoading: isOutgoing, isError: isOutError, error: outError }] = useStockOutMutation();

    // Ürün ve Depo verilerini çekme
    const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();
    const { data: stores = [], isLoading: storesLoading } = useGetStoresQuery();

    const isLoading = productsLoading || storesLoading || isIncoming || isOutgoing;
    const isError = type === 'IN' ? isInError : isOutError;
    const error = type === 'IN' ? inError : outError;

    // Hata veya başarı durumunda mesajları temizleme
    useEffect(() => {
        if (isError || success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isError, success]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData((prev) => ({
            ...prev,
            // ID ve Quantity alanlarını sayıya çevir
            [name!]: (name === 'productId' || name === 'storeId' || name === 'quantity') 
                ? parseInt(String(value), 10) 
                : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');

        if (formData.productId === 0 || formData.storeId === 0 || formData.quantity <= 0) {
            alert('Lütfen tüm alanları doğru şekilde doldurun.');
            return;
        }

        try {
            if (type === 'IN') {
                await stockIn(formData).unwrap();
            } else {
                await stockOut(formData).unwrap();
            }
            setFormData(initialFormData); // Başarılıysa formu sıfırla
            setSuccess(`Stok ${type === 'IN' ? 'Giriş' : 'Çıkış'} işlemi başarılı!`);
        } catch (err) {
            console.error(`${type} işlemi başarısız oldu`, err);
        }
    };

    if (productsLoading || storesLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3, maxWidth: 450, mx: 'auto' }}
        >
            <Typography variant="h5" sx={{ mb: 1, textAlign: 'center' }}>
                {type === 'IN' ? 'Stok Giriş İşlemi' : 'Stok Çıkış İşlemi'}
            </Typography>

            {/* Hata ve Başarı Mesajları */}
            {isError && (
                <Alert severity="error">
                    { (error as any)?.data?.message || `Stok ${type} işlemi sırasında bir hata oluştu.` } 
                </Alert>
            )}
            {success && <Alert severity="success">{success}</Alert>}


            {/* 1. Ürün Seçimi Combobox */}
            <FormControl fullWidth required>
                <InputLabel id="product-label">Ürün</InputLabel>
                <Select
                    labelId="product-label"
                    name="productId"
                    value={formData.productId || ''} // MUI Select için 0 yerine boş string
                    label="Ürün"
                    onChange={handleChange}
                    disabled={isLoading}
                >
                    <MenuItem value={0} disabled>Ürün Seçiniz</MenuItem>
                    {products.map((product: Product) => (
                        <MenuItem key={product.id} value={product.id}>{product.name} ({product.code})</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* 2. Depo Seçimi Combobox */}
            <FormControl fullWidth required>
                <InputLabel id="store-label">Depo (Store)</InputLabel>
                <Select
                    labelId="store-label"
                    name="storeId"
                    value={formData.storeId || ''}
                    label="Depo (Store)"
                    onChange={handleChange}
                    disabled={isLoading}
                >
                    <MenuItem value={0} disabled>Depo Seçiniz</MenuItem>
                    {stores.map((store: Store) => (
                        <MenuItem key={store.id} value={store.id}>{store.name} ({store.code})</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* 3. Miktar Inputu */}
            <TextField
                name="quantity"
                label="Miktar"
                type="number"
                fullWidth
                required
                variant="outlined"
                inputProps={{ min: 1 }} // En az 1 olmalı
                value={formData.quantity === 0 ? '' : formData.quantity}
                onChange={handleChange}
                disabled={isLoading}
            />

            {/* 5. İşlem Butonu */}
            <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={isLoading || formData.quantity <= 0 || formData.productId === 0 || formData.storeId === 0}
                startIcon={(isIncoming || isOutgoing) ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {buttonLabel}
            </Button>
        </Box>
    );
};

export default StockInOutForm;