import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import StockInOutForm from './StockInOutForm';

// Tab başlıkları ve içeriği için yardımcı bileşen
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const StockInOutPage: React.FC = () => {
    const [value, setValue] = useState(0); // 0: Stok Giriş, 1: Stok Çıkış

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{  width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="stok giriş çıkış sekmeleri" centered>
                        <Tab label="Stok Giriş" />
                        <Tab label="Stok Çıkış" />
                    </Tabs>
                </Box>
                
                {/* Stok Giriş Sekmesi */}
                <TabPanel value={value} index={0}>
                    <StockInOutForm 
                        type="IN" 
                        buttonLabel="GİRİŞ YAP" 
                    />
                </TabPanel>

                {/* Stok Çıkış Sekmesi */}
                <TabPanel value={value} index={1}>
                    <StockInOutForm 
                        type="OUT" 
                        buttonLabel="ÇIKIŞ YAP" 
                    />
                </TabPanel>
        </Box>
    );
};

export default StockInOutPage;