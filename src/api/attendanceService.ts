import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from './config';

export interface AttendancePayload {
  session_id: string;
  full_name: string;
  phone_number: string;
  email: string;
  branch: string;
  section: string;
  roll_number: string;
  device_info: string;
  selfie_data: string;
}

export const submitAttendance = async (data: AttendancePayload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.ATTENDANCE.SUBMIT}`,
      data,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(errorMessage);
    }
    throw new Error('Failed to submit attendance');
  }
};








