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
      const difference = expiry - now;
      
      // Debug logs
      console.log('Expiry time:', new Date(expiryTime).toISOString());
      console.log('Current time:', new Date().toISOString());
      console.log('Time difference (seconds):', Math.floor(difference / 1000));
      
      // Add a 5-second buffer to prevent premature expiration
      return Math.max(0, Math.floor(difference / 1000) + 5);
    } catch (e) {
      console.error('Error calculating time:', e);
      console.error('Received expiryTime:', expiryTime);
      return 0;
    }
  }, [expiryTime]);

  useEffect(() => {
    // Log when new expiry time is received
    console.log('New QR code received with expiry:', expiryTime);
    
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, expiryTime]);

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








