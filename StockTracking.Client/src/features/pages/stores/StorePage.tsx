import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import {
  useGetStoresQuery,
  useDeleteStoreMutation,
  type Store,
} from "./storesApi";

import GenericDataTable, {
  type ColumnConfig,
} from "../../../components/GenericDataTable";
import StoreFormModal from "./StoreFormModal";


const StorePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(
    null
  );
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(
    null
  );

  // RTK Query Hook'ları
  const {
    data: stores,
    isLoading,
    isError,
    error,
  } = useGetStoresQuery();

  const [
    deleteStore,
    { isError: isDeleteError, error: deleteError, isLoading: isDeleting },
  ] = useDeleteStoreMutation();


  // CRUD Handler'ları
  const handleNewStoreClick = () => {
    setSelectedStore(null);
    setIsModalOpen(true);
  };

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  const handleDeleteConfirmation = (store: Store) => {
    setStoreToDelete(store);
  };

  const handleCancelDelete = () => {
    setStoreToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (storeToDelete) {
      try {
        await deleteStore(storeToDelete.id).unwrap();
        setStoreToDelete(null);
      } catch (err) {
        console.error("Silme işlemi başarısız", err);
        setStoreToDelete(null);
      }
    }
  };

  // TABLO KOLON TANIMLAMASI
  const storeColumns: ColumnConfig<Store>[] = [
    { label: "Depo Kodu", field: "code" },
    { label: "Depo Adı", field: "name" },
    {
      label: "Konum",
      field: "location",
      render: (w) => <>{w.location.substring(0, 50)}...</>,
    },
    { label: "İşlemler", field: "actions", align: "left" },
  ];

  // Sayfa Yükleniyor ve Hata Durumları
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Depolar yüklenirken bir hata oluştu.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Başlık ve Ekle Butonu */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Depolar ({stores?.length || 0} Depo)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewStoreClick}
        >
          Yeni Depo Ekle
        </Button>
      </Box>

      {/* Silme Hatası Gösterimi */}
      {isDeleteError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Silme işlemi başarısız oldu:
          {(deleteError as any)?.data?.message || "Lütfen tekrar deneyin."}
        </Alert>
      )}

      {/* Veri Tablosu */}
      <GenericDataTable<Store>
        data={stores || []}
        columns={storeColumns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirmation}
      />

      {/* Depo Ekle/Düzenle Modal'ı */}
      <StoreFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        currentStore={selectedStore}
      />

      {/* Silme Onayı Dialog'u */}
      <Dialog open={!!storeToDelete} onClose={handleCancelDelete}>
        <DialogTitle>{"Depo Silme Onayı"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            **{storeToDelete?.name}** ({storeToDelete?.code}) adlı
            depoyu silmek istediğinizden emin misiniz?
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
            {isDeleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Evet, Sil"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StorePage;
