import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AttendanceForm from './components/AttendanceForm/AttendanceForm';
import QRScanner from './components/QRScanner/QRScanner';
import { Container, Paper, Box } from '@mui/material';

function App() {
    return (
        <BrowserRouter>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                    <Routes>
                        <Route path="/" element={
                            <Box sx={{ textAlign: 'center' }}>
                                <h1>QR Attendance System</h1>
                                <QRScanner />
                            </Box>
                        } />
                        <Route path="/attendance" element={
                            <Box sx={{ textAlign: 'center' }}>
                                <h1>Attendance Form</h1>
                                <AttendanceForm />
                            </Box>
                        } />
                    </Routes>
                </Paper>
            </Container>
        </BrowserRouter>
    );
}

export default App;

