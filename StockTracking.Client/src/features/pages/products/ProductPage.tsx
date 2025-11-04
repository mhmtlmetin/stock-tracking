import React, {useState} from 'react';
import { 
    Box, Typography, Button, CircularProgress, Alert, 
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import GenericDataTable,{ type ColumnConfig } from '../../../components/GenericDataTable';
import ProductFormModal from './ProductsFormModal';

// RTK Query Hook'unu import ediyoruz
import { useGetProductsQuery,
    useDeleteProductMutation,
     type Product,
    } from './productsApi'; 

const productColumns: ColumnConfig<Product>[] = [
        { label: 'Ürün Adı', field: 'name' },
        { label: 'Stok Kodu', field: 'code' },
         { label: 'Açıklama', field: 'description' },
        { label: 'İşlemler', field: 'actions', align: 'left' },
    ];

const ProductsScreen: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Düzenlenecek ürün
    const [productToDelete, setProductToDelete] = useState<Product | null>(null); // Silinecek ürün

      // Ürünleri çekmek için RTK Query hook'unu kullanma
    const { data: products, isLoading, isError, error } = useGetProductsQuery();
    //ürünleri silmek için RTK Query hook'unu kullanma
    const [deleteProduct, { isLoading: isDeleting, isError: isDeleteError, error: deleteError }] = useDeleteProductMutation();
    
    

    // MODAL İŞLEMLERİ (Ekleme ve Düzenleme)
    const handleNewProductClick = () => {
        setSelectedProduct(null); // Yeni ürün modu
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product); // Düzenlenecek ürünü ayarla
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };


    
   // 1. Silme Butonuna Basıldığında Onay Kutusu Açılır
    const handleDeleteConfirmation = (product: Product) => {
        setProductToDelete(product); 
    };

    // 2. İptal Butonuna Basıldığında Onay Kutusu Kapanır
    const handleCancelDelete = () => {
        setProductToDelete(null); 
    };

    // 3. Silme Onaylandığında İşlem Başlatılır
    const handleConfirmDelete = async () => {
        if (productToDelete) {
            try {
                // Silme işlemini başlat (ID'yi gönder)
                await deleteProduct(productToDelete.id).unwrap();
                
                // Başarılı olursa onay diyalogunu kapat
                setProductToDelete(null);
                // RTK Query Cache Invalidasyon sayesinde tablo otomatik yenilenecek.

            } catch (err) {
                // Hata oluşursa konsola yaz ve diyalogu kapat (Hata Alert'ı JSX'te görünecek)
                console.error('Silme işlemi başarısız', err);
                setProductToDelete(null); 
            }
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        // Hata durumunda ekranda uyarı gösterme
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Ürünler yüklenirken bir hata oluştu: 
                    {error && JSON.stringify(error)}
                </Alert>
            </Box>
        );
    }
    
    // Veri başarılı bir şekilde yüklendiğinde tabloyu göster
    return (
        <Box sx={{ p: 3 }}>
            
            {/* Sayfa Başlığı ve Yeni Ürün Ekle Butonu */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Ürünler  ({products?.length || 0} Ürün)
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleNewProductClick}
                >
                    Yeni Ürün Ekle
                </Button>
            </Box>
            {/* Silme Hatası Gösterimi */}
            {isDeleteError && (
                 <Alert severity="error" sx={{ mb: 2 }}>
                    Silme işlemi başarısız oldu: 
                    {(deleteError as any)?.data?.message || 'Lütfen tekrar deneyin.'}
                </Alert>
            )}

        <GenericDataTable<Product>
                data={products || []}
                columns={productColumns}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteConfirmation}
            />

            {/* Ürün Ekle/Düzenle Modal'ı */}
            <ProductFormModal
                open={isModalOpen}
                onClose={handleCloseModal}
                currentProduct={selectedProduct}
            />

            {/* SİLME ONAYI DIALOG'U */}
            <Dialog
                open={!!productToDelete} // productToDelete varsa dialogu aç
                onClose={handleCancelDelete}
            >
                <DialogTitle id="alert-dialog-title">{"Ürün Silme Onayı"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        **{productToDelete?.name}** ({productToDelete?.code}) adlı ürünü silmek istediğinizden emin misiniz?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} disabled={isDeleting}>
                        İptal
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        variant="contained" 
                        disabled={isDeleting}
                        autoFocus
                    >
                        {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Evet, Sil'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductsScreen;