import React, { Component} from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';


interface Props {
  children: ReactNode;
}


interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // İlk state: Hata yok
  public state: State = {
    hasError: false,
  };

  /**
   * Bir alt bileşen hata verdiğinde bu static method çağrılır.
   * State'i güncelleyerek bir sonraki render döngüsünde yedek UI'ın görünmesini sağlar.
   */
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  /**
   * Hata yakalandığında loglama yapmak için kullanılır.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Hata detaylarını loglayabiliriz (Örn: Sentry, LogRocket vb. servislere gönderme)
    console.error("ErrorBoundary tarafından yakalanan yakalanmamış hata:", error, errorInfo);
  }

  // Hata durumunda gösterilecek yedek arayüz
  private renderFallback = () => {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '80vh', 
          p: 4 
        }}
      >
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Ops! Bir Hata Oluştu.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Uygulamanın bu bölümünü görüntülerken beklenmedik bir hata ile karşılaşıldı.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()} // Sayfayı yenilemeyi teklif et
          >
            Sayfayı Yenile
          </Button>
        </Paper>
      </Box>
    );
  };

  public render() {
    if (this.state.hasError) {
      // Hata varsa yedek arayüzü göster
      return this.renderFallback();
    }

    // Hata yoksa normal çocuk bileşenleri render et
    return this.props.children;
  }
}

export default ErrorBoundary;