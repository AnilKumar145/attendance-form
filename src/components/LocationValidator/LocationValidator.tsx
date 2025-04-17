import { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { validateLocation } from '../../api/attendanceService';

interface LocationValidatorProps {
  onLocationValidated: (location: { latitude: number; longitude: number }) => void;
}

export default function LocationValidator({ onLocationValidated }: LocationValidatorProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const isValid = await validateLocation(latitude, longitude);

        if (isValid) {
          onLocationValidated({ latitude, longitude });
        } else {
          setError('You are not within the allowed campus area.');
        }
      } catch (err: unknown) {
        setError(`Failed to get your location: ${err instanceof Error ? err.message : 'Please enable location services.'}`);
      } finally {
        setLoading(false);
      }
    };

    checkLocation();
  }, [onLocationValidated]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return null;
}

