import { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

interface QRDisplayProps {
  qrCode: string;
  expiryTime: string;
}

export default function QRDisplay({ qrCode, expiryTime }: QRDisplayProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const calculateTimeLeft = useCallback(() => {
    try {
      const expiry = new Date(expiryTime).getTime();
      const now = new Date().getTime();
      return Math.max(0, Math.floor((expiry - now) / 1000));
    } catch (e) {
      console.error('Error calculating time:', e);
      return 0;
    }
  }, [expiryTime]);

  useEffect(() => {
    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    // Only start timer if there's time remaining
    if (initialTimeLeft > 0) {
      const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [calculateTimeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <img 
        src={qrCode} 
        alt="QR Code"
        style={{ 
          maxWidth: '100%',
          width: '300px',
          height: 'auto'
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 2,
          color: timeLeft < 30 ? 'error.main' : 'text.primary',
          fontWeight: 'bold'
        }}
      >
        {timeLeft > 0 ? (
          `Time remaining: ${formatTime(timeLeft)}`
        ) : (
          'QR Code expired'
        )}
      </Typography>
    </Box>
  );
}






