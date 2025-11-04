import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Button, Box, CircularProgress, Alert
} from '@mui/material';

import type { Store, StorePayload } from './storesApi';
import { useCreateStoreMutation, useUpdateStoreMutation } from './storesApi';

interface StoreFormModalProps {
    open: boolean;
    onClose: () => void;
    currentStore: Store | null; 
}

// Formun başlangıç durumu
const initialFormData: StorePayload = {
    name: '',
    location: '',
    code: '',
};

const StoreFormModal: React.FC<StoreFormModalProps> = ({ open, onClose, currentStore }) => {
    const [formData, setFormData] = useState<StorePayload>(initialFormData);
    
    // RTK Query hook'ları
    const [createStore, { isLoading: isCreating, isError: isCreateError, error: createError }] = useCreateStoreMutation();
    const [updateStore, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] = useUpdateStoreMutation();

    const isEditMode = !!currentStore;
    const isLoading = isCreating || isUpdating;
    const isError = isCreateError || isUpdateError;
    const error = createError || updateError;

    // Düzenleme modunda veriyi doldur
    useEffect(() => {
        if (isEditMode && currentStore) {
            setFormData({
                name: currentStore.name,
                location: currentStore.location,
                code: currentStore.code,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [isEditMode, currentStore]);

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
            if (isEditMode && currentStore) {
                // Güncelleme: ID ve form verisini body'de gönderiyoruz.
                await updateStore({ ...formData, id: currentStore.id }).unwrap();
            } else {
                // Ekleme
                await createStore(formData).unwrap();
            }
            onClose();
            setFormData(initialFormData); 
        } catch (err) {
            console.error(isEditMode ? 'Depo Güncelleme hatası' : 'Depo Oluşturma hatası', err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">
                {isEditMode ? 'Depoyu Düzenle' : 'Yeni Depo Ekle'}
            </DialogTitle>
            
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    {isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            { (error as any)?.data?.message || 'Bir hata oluştu.' } 
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Depo Adı"
                        type="text"
                        fullWidth
                        required
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="code"
                        label="Depo Kodu"
                        type="text"
                        fullWidth
                        required
                        variant="outlined"
                        value={formData.code}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="location"
                        label="Konum/Adres"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={formData.location}
                        onChange={handleChange}
                    />
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

export default StoreFormModal;