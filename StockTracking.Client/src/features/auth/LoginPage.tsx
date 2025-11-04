import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from './authApi'; 
import { 
  Box, Container, Typography, TextField, Button, 
  CircularProgress, Card, CardContent, Alert 
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await login({ username, password }).unwrap(); 
      navigate('/products', { replace: true });
    } catch (err) {
      // Hata burada ele alınır.
    }
  };

 const getErrorMessage = (error:any) => {
  // 'status' property'sinin olup olmadığını kontrol et
  if (typeof error === 'object' && error !== null && 'status' in error) {
    // TypeScript, bu noktada objenin 'FetchBaseQueryError' benzeri bir yapıda olduğunu anlar.
    
    // Eğer 'data' property'si varsa ve bir mesaj içeriyorsa onu döndür.
    if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
      // Güvenli bir şekilde 'error.data.message'e erişiyoruz
      return error.data.message; 
    }

    // HTTP durum kodu varsa ve hata detayını bilmiyorsak, durumu göster
    if (error.status === 'FETCH_ERROR') {
         return 'Sunucuya erişilemedi. Ağ bağlantınızı kontrol edin.';
    }
  } 
  
  // Tüm diğer durumlar (SerializedError, ağ kesintisi, bilinmeyen hata)
  return 'Giriş Başarısız. Bilinmeyen bir hata oluştu.'; 
};

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh' }}>
      <Box 
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
        <Card elevation={10} sx={{ width: '100%' }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
              }}
            >
              <LockOpenIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography component="h1" variant="h5" gutterBottom>
               Giriş Yap
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Kullanıcı Adı"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Şifre"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                
                {isError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                   {getErrorMessage(error)}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginScreen;