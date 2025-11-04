import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const customTheme = createTheme({ /* ... tema ayarları ... */ });

interface AppProviderProps {
    children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={customTheme}>
                <CssBaseline />
                <BrowserRouter> 
                    {children}
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
};

export default AppProvider;