import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  Typography,
  Grid as MuiGrid,
  CircularProgress,
} from '@mui/material';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
import Webcam from 'react-webcam';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitAttendance } from '../../api/attendanceService';

interface CustomGridProps {
  children: React.ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  spacing?: number;
  sx?: SxProps<Theme>;
}

const Grid: React.FC<CustomGridProps> = ({ children, ...props }) => (
  <MuiGrid component="div" {...props}>
    {children}
  </MuiGrid>
);

export default function AttendanceForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    branch: '',
    section: '',
    roll_number: '',
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selfieData, setSelfieData] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  // const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    // Validate URL parameters when component mounts
    const sessionId = searchParams.get('sessionId');
    const expiryTime = searchParams.get('expiryTime');
    
    if (!sessionId || !expiryTime) {
      setError('Invalid attendance URL');
      return;
    }

    // Check if the session is expired
    const expiry = new Date(expiryTime);
    const now = new Date();
    
    if (expiry <= now) {
      setError('This QR code has expired. Please scan a new QR code.');
      return;
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCameraStart = async () => {
    setError(null);
    setShowCamera(true); // Show camera immediately
  };

  const handleCaptureSelfie = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setSelfieData(imageSrc);
      setShowCamera(false); // Hide camera after capturing
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfieData) {
      setError('Please take a selfie first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        session_id: searchParams.get('sessionId') || '',
        device_info: navigator.userAgent,
        selfie_data: selfieData
      };

      await submitAttendance(payload);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Attendance Form
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Attendance recorded successfully!</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="full_name"
                label="Full Name"
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="phone_number"
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                name="branch"
                label="Branch"
                value={formData.branch}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                name="section"
                label="Section"
                value={formData.section}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                name="roll_number"
                label="Roll Number"
                value={formData.roll_number}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              {!showCamera && !selfieData && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCameraStart}
                  fullWidth
                >
                  Open Camera
                </Button>
              )}
            </Grid>

            {showCamera && (
              <Grid item xs={12}>
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ width: '100%' }}
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "user"
                    }}
                    onUserMedia={() => {
                      setIsCameraReady(true);
                    }}
                    onUserMediaError={(err) => {
                      console.error('Webcam error:', err);
                      setShowCamera(false);
                      if (err instanceof DOMException && err.name === 'NotAllowedError') {
                        setError('Please allow camera access when prompted');
                      } else {
                        setError('Failed to access camera. Please try again.');
                      }
                    }}
                  />
                  {isCameraReady && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCaptureSelfie}
                      sx={{ 
                        position: 'absolute', 
                        bottom: 10, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(25, 118, 210, 0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(21, 101, 192, 0.9)'
                        }
                      }}
                    >
                      Capture Selfie
                    </Button>
                  )}
                </Box>
              </Grid>
            )}

            {selfieData && (
              <Grid item xs={12}>
                <Box sx={{ 
                  textAlign: 'center',
                  position: 'relative' 
                }}>
                  <img 
                    src={selfieData} 
                    alt="selfie" 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      borderRadius: '4px'
                    }} 
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSelfieData(null);
                      handleCameraStart();
                    }}
                    sx={{ mt: 1 }}
                  >
                    Retake Selfie
                  </Button>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || !selfieData}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Attendance'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}















