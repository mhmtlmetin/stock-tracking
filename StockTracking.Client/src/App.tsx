import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./features/auth/LoginPage";
import Layout from "./components/Layout";
import ProductPage from "./features/pages/products/ProductPage";
import StorePage from "./features/pages/stores/StorePage";
import StockInOutPage from "./features/pages/stockInOut/StockInOutPage";
import StockMovementPage from "./features/pages/stockMovements/StockMovementPage";
import ProtectedRoutes from "./features/pages/ProtectedRoutes"
import ErrorBoundary from './components/ErrorBoundary';


const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        {/* Korumalı Route'lar */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path="/products" element={<ProductPage />} />
            <Route path="/stores" element={<StorePage />} />
            <Route path="/stock-io" element={<StockInOutPage />} /> 
            <Route path="/stock-movements" element={<StockMovementPage />} />
            
            {/* Varsayılan olarak /products'a yönlendir */}
            <Route path="/" element={<Navigate to="/products" replace />} />
          </Route>
        </Route>
        
        <Route path="*" element={<h2>404 - Sayfa Bulunamadı</h2>} />
      </Routes>
      </ErrorBoundary>
  );
};

export default App;