import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { getFoodByBarcode } from '../utils/openfoodfacts';

export default function BarcodeScanner({ onAddFood, onClose }) {
  const scannerRef = useRef(null);
  const scanProcessedRef = useRef(false); // Track if a scan has been processed
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode("barcode-scanner");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );

      setScanning(true);
      setError('');
    } catch (err) {
      console.error('Scanner error:', err);

      let errorMessage = 'Unable to access camera. ';

      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        errorMessage += 'Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.message?.includes('camera')) {
        errorMessage += 'No camera found on this device.';
      } else if (err.message?.includes('secure')) {
        errorMessage += 'Camera requires a secure connection (HTTPS).';
      } else {
        errorMessage += 'Try using manual barcode entry below.';
      }

      setError(errorMessage);
      setManualEntry(true); // Show manual entry on camera error
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        // Always try to stop, regardless of scanning state
        await scannerRef.current.stop();

        // Clear the scanner completely
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
        // Try to force clear even if stop failed
        try {
          await scannerRef.current.clear();
        } catch (clearErr) {
          console.error('Error clearing scanner:', clearErr);
        }
      } finally {
        // Always cleanup references and state
        scannerRef.current = null;
        setScanning(false);
      }
    }
  };

  const onScanSuccess = async (decodedText) => {
    // Prevent multiple scans - check both loading state and ref
    if (loading || scanProcessedRef.current) return;

    // Immediately mark as processed to prevent race conditions
    scanProcessedRef.current = true;
    setLoading(true);

    // CRITICAL: Stop scanner IMMEDIATELY before any async operations
    // This ensures camera turns off right away
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
        setScanning(false);
      }
    } catch (err) {
      console.error('Error stopping camera:', err);
    }

    // Look up the barcode
    const food = await getFoodByBarcode(decodedText);

    if (food) {
      // Camera is now off, add the food and close
      onAddFood({
        name: food.brand ? `${food.brand} - ${food.name}` : food.name,
        calories: food.calories,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        servingSize: food.servingSize,
        barcode: food.barcode,
      });
      // Note: onAddFood will trigger onClose which unmounts this component
    } else {
      setError('Product not found in database. Try searching manually.');
      setLoading(false);
      setManualEntry(true); // Show manual entry form
      // Reset the flag if product not found so user can try again
      scanProcessedRef.current = false;
    }
  };

  const onScanError = (err) => {
    // Ignore scan errors (they happen constantly during scanning)
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    setLoading(true);
    await stopScanner();

    const food = await getFoodByBarcode(barcodeInput.trim());

    if (food) {
      onAddFood({
        name: food.brand ? `${food.brand} - ${food.name}` : food.name,
        calories: food.calories,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        servingSize: food.servingSize,
        barcode: food.barcode,
      });
    } else {
      setError('Product not found in database. Try searching manually.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50">
      <div className="card max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Scan Barcode</h2>
          <button
            onClick={async () => {
              await stopScanner();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="text-lg">Looking up product...</div>
          </div>
        )}

        {!loading && (
          <>
            {!manualEntry && !error && (
              <>
                <div id="barcode-scanner" className="w-full rounded-lg overflow-hidden mb-4"></div>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  Point your camera at a barcode to scan
                </p>
                <p className="text-xs text-center text-gray-500 mb-4">
                  Tip: Make sure the barcode is well-lit and centered in the frame
                </p>
                <button
                  onClick={() => {
                    stopScanner();
                    setManualEntry(true);
                  }}
                  className="btn-secondary w-full mb-4"
                >
                  Enter Barcode Manually
                </button>
              </>
            )}

            {manualEntry && (
              <form onSubmit={handleManualSubmit} className="mb-4">
                <label className="block text-lg font-semibold mb-3">
                  Enter Barcode Number
                </label>
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="e.g., 012345678910"
                  className="input-field mb-4"
                  autoFocus
                />
                <div className="flex gap-3 mb-4">
                  {!error && (
                    <button
                      type="button"
                      onClick={() => {
                        setManualEntry(false);
                        setError('');
                        setBarcodeInput('');
                        startScanner();
                      }}
                      className="btn-secondary flex-1"
                    >
                      Back to Camera
                    </button>
                  )}
                  <button type="submit" className="btn-primary flex-1">
                    Look Up
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        <button onClick={async () => {
          await stopScanner();
          onClose();
        }} className="btn-secondary w-full">
          Close
        </button>
      </div>
    </div>
  );
}
