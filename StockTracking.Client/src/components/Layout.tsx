import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../features/auth/authSlice';

// MUI Bileşenleri
import { 
  AppBar, Toolbar, Typography, Button, IconButton, 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Box, Divider, useTheme, useMediaQuery
} from '@mui/material';

// MUI İkonları
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 240;

const navItems = [
  { name: 'Ürünler', path: '/products', icon: <InventoryIcon /> },
  { name: 'Depolar', path: '/stores', icon: <WarehouseIcon /> },
  { name: 'Stok Giriş/Çıkış', path: '/stock-io', icon: <DashboardIcon /> },
  { name: 'Stok Hareketleri', path: '/stock-movements', icon: <CompareArrowsIcon /> },
];

const Layout = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logOut());
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Stok Takip Sistemi
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
              component={NavLink} 
              to={item.path}
              // Active stilini NavLink ile kontrol ediyoruz
              sx={{ 
                '&.active': { 
                  backgroundColor: theme.palette.action.selected, 
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                } 
              }}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button 
          fullWidth 
          variant="outlined" 
          color="error" 
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
        >
          Çıkış Yap
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Üst Çubuk */}
      <AppBar 
        position="fixed"
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          ml: { md: `${drawerWidth}px` } 
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {/* Başlık */}
            Stok Takip Sistemi
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigasyon*/}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobil Navigasyon */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Masaüstü Sabit Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Ana İçerik Alanı */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px' // AppBar yüksekliği kadar boşluk bırak
        }}
      >
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default Layout;