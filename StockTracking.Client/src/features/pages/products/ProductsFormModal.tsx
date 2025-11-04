import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Box, CircularProgress, Alert
} from '@mui/material';

import type { Product, ProductPayload } from './productsApi';
import { useCreateProductMutation, useUpdateProductMutation } from './productsApi';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    // Eğer düzenleme yapılıyorsa, mevcut ürün verisini alır.
    currentProduct: Product | null; 
}

// Formun başlangıç durumu
const initialFormData = {
    name: '',
    code: '',
    description:''
   
};

const ProductFormModal: React.FC<ProductFormModalProps> = ({ open, onClose, currentProduct }) => {
    const [formData, setFormData] = useState<ProductPayload>(initialFormData);
    
    // RTK Query hook'ları
    const [createProduct, { isLoading: isCreating, isError: isCreateError, error: createError }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] = useUpdateProductMutation();

    const isEditMode = !!currentProduct;
    const isLoading = isCreating || isUpdating;
    const isError = isCreateError || isUpdateError;
    const error = createError || updateError;

    // Düzenleme modunda, modal açıldığında form verisini doldur
    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: currentProduct.name,
                code: currentProduct.code,
                description: currentProduct.description || '',
            });
        } else {
            setFormData(initialFormData);
        }
    }, [isEditMode, currentProduct]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
           [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (isEditMode && currentProduct) {
                // Güncelleme
                await updateProduct({ ...formData, id: currentProduct.id }).unwrap();
            } else {
                // Ekleme
                await createProduct(formData).unwrap();
            }
            // Başarılı olursa modalı kapat
            onClose();
            setFormData(initialFormData); // Formu sıfırla
        } catch (err) {
            // Hata RTK Query tarafından konsola basılacaktır.
            console.error(isEditMode ? 'Güncelleme hatası' : 'Oluşturma hatası', err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">
                {isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
            </DialogTitle>
            
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    {isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {/* Hata gösterimi için basit tip kontrolü */}
                            { (error as any)?.data?.message || 'Bir hata oluştu.' } 
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Ürün Adı"
                        type="text"
                        fullWidth
                        required
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="code"
                        name="code"
                        label="Stok Kodu"
                        type="text"
                        fullWidth
                        required
                        variant="outlined"
                        value={formData.code}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Ürün Açıklaması"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.description}
                        onChange={handleChange}
                        sx={{ mt: 2 }}
                    />
                  {/*   <TextField
                        margin="dense"
                        id="stock"
                        name="stock"
                        label="Mevcut Stok Miktarı"
                        type="number"
                        fullWidth
                        required
                        variant="outlined"
                        value={formData.stock === 0 ? '' : formData.stock} // 0 ise boş göster
                        onChange={handleChange}
                    /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error" disabled={isLoading}>
                        İptal
                    </Button>
                    <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}>
                        {isLoading ? (isEditMode ? 'Güncelleniyor...' : 'Ekleniyor...') : (isEditMode ? 'Kaydet' : 'Ekle')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ProductFormModal;