import React from 'react';
import { 
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, 
    Typography, IconButton, Box, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// 1. Kolon Yapılandırma Tipi
export interface ColumnConfig<T> {
    label: string; // Tablo başlığında görünecek isim (örn: "Ürün Adı")
    field: keyof T | 'actions'; // Veri objesindeki alan adı veya 'actions'
    render?: (row: T) => React.ReactNode; // Özel render fonksiyonu (örn: fiyat formatlama)
    align?: 'left' | 'center' | 'right';
}

// 2. Props Tipi
interface GenericDataTableProps<T extends { id: number | string }> {
    data: T[];
    columns: ColumnConfig<T>[];
    isLoading: boolean;
    onEdit: (row: T) => void;
    onDelete: (row: T) => void;
}

// Tipi dışarıdan alan Generic Bileşen (Generic Function Component)
function GenericDataTable<T extends { id: number | string }>({ 
    data, 
    columns, 
    isLoading, 
    onEdit, 
    onDelete 
}: GenericDataTableProps<T>): React.ReactElement {

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="Veri Tablosu">
                
                {/* Tablo Başlık (Header) */}
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell key={String(col.field)} align={col.align || 'left'}>
                                <Typography variant="h6" fontWeight="bold">
                                    {col.label}
                                </Typography>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                
                {/* Tablo İçeriği (Body) */}
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center">
                                <Typography variant="subtitle1" sx={{ p: 2 }}>
                                    Gösterilecek veri bulunmamaktadır.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, index) => (
                            <TableRow 
                                key={row.id || index} // Unique key
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {columns.map((col) => (
                                    <TableCell key={String(col.field)} align={col.align || 'left'}>
                                        {/* Özel Render Fonksiyonu Kontrolü */}
                                        {col.render ? (
                                            col.render(row)
                                        ) : (
                                            // Aksiyon Kolonu
                                            col.field === 'actions' ? (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton onClick={() => onEdit(row)} color="primary" size="small">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => onDelete(row)} color="error" size="small">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            ) : (
                                                // Standart Alan (field)
                                                String(row[col.field as keyof T])
                                            )
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default GenericDataTable;