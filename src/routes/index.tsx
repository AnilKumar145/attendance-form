import { Routes, Route } from 'react-router-dom';
import AttendanceForm from '../components/AttendanceForm/AttendanceForm';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AttendanceForm />} />
      <Route path="/attendance" element={<AttendanceForm />} />
    </Routes>
  );
}







