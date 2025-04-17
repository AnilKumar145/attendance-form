import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { fetchLatestQR } from '../../api/qrService';
import QRDisplay from './QRDisplay';

const QRScanner = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [expiryTime, setExpiryTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQR = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchLatestQR();
            setQrCode(response.qr_code);
            setExpiryTime(response.expiry_time);
        } catch (err) {
            setError('Failed to fetch QR code');
            console.error('Error fetching QR:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQR();
        const intervalId = setInterval(fetchQR, 120000); // 2 minutes

        return () => clearInterval(intervalId);
    }, [fetchQR]);

    if (loading && !qrCode) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Scan QR Code to Mark Attendance
            </Typography>
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


