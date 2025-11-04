import React from 'react';
import { 
    Box, Typography, Button, CircularProgress, Alert, 
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// RTK Query Hook'unu import ediyoruz
import { useGetProductsQuery, type Product } from './productsApi'; 

const tableHeaders = [
    { label: 'Ürün Adı', field: 'name' },
    { label: 'Stok Kodu', field: 'code' },
    { label: 'İşlemler', field: 'actions' },
];

const ProductsScreen: React.FC = () => {
    // Ürünleri çekmek için RTK Query hook'unu kullanma
    const { data: products, isLoading, isError, error } = useGetProductsQuery();

    // Yeni Ürün Ekle işlemi
    const handleNewProductClick = () => {
        alert('Yeni Ürün Ekleme Formu açılacak...');
    };

    // Düzenleme işlemi
    const handleEdit = (product: Product) => {
        alert(`Ürün Düzenle: ${product.name}`);
    };

    // Silme işlemi
    const handleDelete = (product: Product) => {
        alert(`Ürün Sil: ${product.name}`);
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
                    Ürünler Yönetimi ({products?.length || 0} Ürün)
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleNewProductClick}
                >
                    Yeni Ürün Ekle
                </Button>
            </Box>

            {/* Material-UI Tablo Yapısı */}
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="Ürünler Tablosu">
                    
                    {/* Tablo Başlık (Header) */}
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((header) => (
                                <TableCell key={header.field}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {header.label}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    
                    {/* Tablo İçeriği (Body) */}
                    <TableBody>
                        {products && products.map((product:any) => (
                            <TableRow 
                                key={product.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{product.name}</TableCell>
                                <TableCell>{product.code}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(product)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(product)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        
                        {/* Veri Yoksa Mesaj */}
                        {(!products || products.length === 0) && !isLoading && !isError && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="subtitle1" sx={{ p: 2 }}>
                                        Sistemde kayıtlı ürün bulunmamaktadır.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProductsScreen;