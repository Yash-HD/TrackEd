import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { scanAttendance } from '../../api/studentService';

export default function QRCodeScannerModal({ isOpen, onClose }) {
  const [scanState, setScanState] = useState('scanning'); // 'scanning', 'processing', 'success', 'error'
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleVerifyAttendance = async (qrToken) => {
    setScanState('processing');
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      // Retrieve location if enabled, but don't fail if timed out/denied
      let location = null;
      try {
          const position = await Promise.race([
              new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject)),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
          ]);
          location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
          };
      } catch (e) {
          console.warn('Geolocation failed or timed out. Proceeding without location.', e);
      }

      const response = await scanAttendance(qrToken, location);
      
      setFeedbackMessage(response.message || 'Attendance Marked!');
      setScanState('success');
    } catch (err) {
      setFeedbackMessage(err.message || 'An unknown error occurred.');
      setScanState('error');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setScanState('scanning'), 300);
      return;
    }

    if (scanState === 'scanning') {
      const scanner = new Html5QrcodeScanner(
        'qr-reader', 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        if (scanner && scanner.getState() === 2) {
          scanner.clear();
        }
        handleVerifyAttendance(decodedText);
      };
      
      scanner.render(onScanSuccess, () => {});

      return () => {
        if (scanner && scanner.getState() === 2) {
          scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        }
      };
    }
  }, [isOpen, scanState]);

  if (!isOpen) return null;
  
  const renderContent = () => {
    switch (scanState) {
      case 'processing':
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold">Verifying attendance...</p>
            </div>
        );
      case 'success':
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaCheckCircle className="text-7xl text-accent-green mb-4" />
                <h3 className="text-2xl font-bold">Success!</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{feedbackMessage}</p>
                <button onClick={onClose} className="mt-6 w-full bg-primary text-white py-2 rounded-lg font-semibold">Done</button>
            </div>
        );
      case 'error':
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaTimesCircle className="text-7xl text-accent-red mb-4" />
                <h3 className="text-2xl font-bold">Error</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{feedbackMessage}</p>
                <button onClick={() => setScanState('scanning')} className="mt-6 w-full bg-primary text-white py-2 rounded-lg font-semibold">Try Again</button>
            </div>
        );
      case 'scanning':
      default:
        return (
          <>
            <h3 className="text-xl font-bold text-center  dark:text-black">Scan QR Code</h3>
            <div id="qr-reader" className="w-full mt-4"></div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-400 rounded-xl shadow-lg p-6 w-full max-w-sm h-[700px]">
        {scanState !== 'processing' && (
          <button onClick={onClose} className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
        )}
        {renderContent()}
      </div>
    </div>
  );
}