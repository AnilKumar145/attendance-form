export interface WebcamConfig {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
}

export const defaultWebcamConfig: WebcamConfig = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

export const captureImage = async (videoRef: any): Promise<string> => {
  if (!videoRef.current) {
    throw new Error('Video reference not found');
  }

  const canvas = document.createElement('canvas');
  canvas.width = videoRef.current.video.videoWidth;
  canvas.height = videoRef.current.video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(videoRef.current.video, 0, 0);
  return canvas.toDataURL('image/jpeg');
};

export const getWebcamPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    return false;
  }
};