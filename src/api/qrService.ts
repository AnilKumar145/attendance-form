import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './config';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const QR_UPDATE_INTERVAL = 120000; // 2 minutes in milliseconds

interface QRResponse {
    qr_code: string;
    session_id: string;
    expiry_time: string;
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: true, // Important for CORS
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export const fetchLatestQR = async (): Promise<QRResponse> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            console.log(`Attempting to fetch QR code (attempt ${attempt + 1})`);
            console.log(`Requesting from: ${API_BASE_URL}${API_ENDPOINTS.QR.GENERATE}`);
            
            const response = await axiosInstance.get(
                API_ENDPOINTS.QR.GENERATE,
                {
                    responseType: 'arraybuffer',
                    headers: {
                        'Accept': 'image/png',
                    }
                }
            );

            const sessionId = response.headers['session-id'];
            const expiryTime = response.headers['expiry-time'];
            
            console.log('Response headers:', response.headers);
            console.log('Response status:', response.status);

            if (!sessionId || !expiryTime) {
                throw new Error('Missing session ID or expiry time in response headers');
            }

            const base64 = arrayBufferToBase64(response.data);
            
            return {
                qr_code: `data:image/png;base64,${base64}`,
                session_id: sessionId,
                expiry_time: expiryTime
            };
        } catch (error) {
            console.error('QR fetch attempt failed:', error);
            lastError = error as Error;
            
            if (attempt === MAX_RETRIES - 1) {
                throw new Error(`Failed to fetch QR code after ${MAX_RETRIES} attempts: ${lastError.message}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }

    throw new Error('Failed to fetch QR code after maximum retries');
};

export const startQRPolling = (
  onUpdate: (qr: QRResponse) => void,
  onError: (error: Error) => void
) => {
  let isPolling = true;
  
  const poll = async () => {
    while (isPolling) {
      try {
        const qr = await fetchLatestQR();
        onUpdate(qr);
      } catch (error) {
        onError(error as Error);
      }
      await new Promise(resolve => setTimeout(resolve, QR_UPDATE_INTERVAL));
    }
  };

  poll();
  return () => {
    isPolling = false;
  };
};

export const checkQRStatus = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.QR.CHECK_STATUS}/${sessionId}/status`,
      {
        withCredentials: true,
        timeout: 5000
      }
    );
    return response.data.valid;
  } catch (error) {
    console.error('QR Status Check Error:', error);
    return false;
  }
};














































