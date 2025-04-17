import { useState, useEffect, useCallback } from 'react';
import { fetchLatestQR } from '../../api/qrService';
import QRDisplay from './QRDisplay';
import { Box, Typography } from '@mui/material';

interface QRScannerProps {
    className?: string;
}

const QRScanner: React.FC<QRScannerProps> = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [expiryTime, setExpiryTime] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchQR = useCallback(async () => {
        try {
            console.log('Fetching QR code...');
            setLoading(true);
            setError(null);
            const response = await fetchLatestQR();
            console.log('QR Response:', response);
            setQrCode(response.qr_code);
            setExpiryTime(response.expiry_time);
        } catch (err) {
            console.error('QR fetch error:', err);
            setError('Failed to fetch QR code');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('QRScanner component mounted');
        fetchQR();

        const intervalId = setInterval(fetchQR, 120000); // 2 minutes

        return () => {
            console.log('QRScanner component unmounted');
            clearInterval(intervalId);
        };
    }, [fetchQR]);

    if (loading && !qrCode) {
        return (
            <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography>Loading QR Code...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ textAlign: 'center', p: 2 }}>
            {qrCode && expiryTime ? (
                <QRDisplay 
                    qrCode={qrCode}
                    expiryTime={expiryTime}
                />
            ) : (
                <Typography>No QR code available</Typography>
            )}
        </Box>
    );
};

export default QRScanner;

