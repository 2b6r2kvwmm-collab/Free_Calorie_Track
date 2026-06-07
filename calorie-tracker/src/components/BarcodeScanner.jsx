import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { getFoodByBarcode } from '../utils/openfoodfacts';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

const QUICK_SERVINGS = [0.5, 1, 1.5, 2, 2.5, 3];

export default function BarcodeScanner({ onAddFood, onClose }) {
  const scannerRef = useRef(null);
  const scanProcessedRef = useRef(false);
  const mediaStreamRef = useRef(null);
  const modalRef = useModalAccessibility(true, onClose);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [foundFood, setFoundFood] = useState(null);
  const [servings, setServings] = useState('1');

  useEffect(() => {
    startScanner();
    lockScroll();
    return () => {
      stopScanner();
      unlockScroll();
    };
  }, []);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode("barcode-scanner");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
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
      setManualEntry(true);
    }
  };

  const stopScanner = async () => {
    // Grab the stream BEFORE clear() — Html5Qrcode removes the video element
    // during cleanup, so we must capture srcObject first or we lose the reference.
    // This is the critical step for iOS Safari, which doesn't release the camera
    // indicator when the stream's consumer is removed without explicitly stopping tracks.
    const stream = document.querySelector('#barcode-scanner video')?.srcObject;

    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch (err) { /* ignore */ }
      try { await scannerRef.current.clear(); } catch (err) { /* ignore */ }
      scannerRef.current = null;
      setScanning(false);
    }

    // Stop all tracks on the captured stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Fallback: stop any remaining video elements (handles edge cases)
    document.querySelectorAll('video').forEach(video => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    });
  };

  const onScanSuccess = async (decodedText) => {
    if (loading || scanProcessedRef.current) return;
    scanProcessedRef.current = true;
    setLoading(true);

    // Stop camera and release all video tracks before any async work
    await stopScanner();

    const food = await getFoodByBarcode(decodedText);

    if (food) {
      setFoundFood(food);
      setServings('1');
      setLoading(false);
    } else {
      setError('Product not found in database. Try searching manually.');
      setLoading(false);
      setManualEntry(true);
      scanProcessedRef.current = false;
    }
  };

  const onScanError = () => { /* ignore — fires constantly during scanning */ };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    setLoading(true);
    await stopScanner();

    const food = await getFoodByBarcode(barcodeInput.trim());

    if (food) {
      setFoundFood(food);
      setServings('1');
      setLoading(false);
    } else {
      setError('Product not found in database. Try searching manually.');
      setLoading(false);
    }
  };

  const handleAddToLog = () => {
    const s = parseFloat(servings) || 1;
    const name = foundFood.brand
      ? `${foundFood.brand} - ${foundFood.name}`
      : foundFood.name;

    // Build serving size label: "2x 1 bar (40g)" or just the original if 1 serving
    const servingSizeDisplay = s === 1
      ? foundFood.servingSize
      : `${s}x ${foundFood.servingSize}`;

    onAddFood({
      name,
      calories: Math.round(foundFood.calories * s),
      protein: Math.round(foundFood.protein * s * 10) / 10,
      carbs: Math.round(foundFood.carbs * s * 10) / 10,
      fat: Math.round(foundFood.fat * s * 10) / 10,
      fiber: Math.round((foundFood.fiber || 0) * s * 10) / 10,
      sodium: Math.round((foundFood.sodium || 0) * s),
      sugar: Math.round((foundFood.sugar || 0) * s * 10) / 10,
      saturatedFat: Math.round((foundFood.saturatedFat || 0) * s * 10) / 10,
      servingSize: servingSizeDisplay,
      // Total grams for this log entry — lets the edit form scale correctly
      servingGrams: foundFood.servingGrams ? foundFood.servingGrams * s : null,
      barcode: foundFood.barcode,
    });
  };

  // Calories/macros preview based on current servings input
  const previewServings = parseFloat(servings) || 0;
  const previewCalories = Math.round((foundFood?.calories || 0) * previewServings);
  const previewProtein = Math.round((foundFood?.protein || 0) * previewServings * 10) / 10;
  const previewCarbs = Math.round((foundFood?.carbs || 0) * previewServings * 10) / 10;
  const previewFat = Math.round((foundFood?.fat || 0) * previewServings * 10) / 10;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-start justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {foundFood ? 'Confirm Serving' : 'Scan Barcode'}
          </h2>
          <button
            onClick={async () => { await stopScanner(); onClose(); }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close barcode scanner"
          >
            ×
          </button>
        </div>

        {/* ── Confirm screen ── */}
        {foundFood && (
          <>
            {/* Food info */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <div className="font-semibold text-lg leading-tight">
                {foundFood.brand && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-0.5">
                    {foundFood.brand}
                  </span>
                )}
                {foundFood.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                1 serving = {foundFood.servingSize}
                {foundFood.servingGrams && ` (${foundFood.servingGrams}g)`}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {foundFood.calories} cal · P {foundFood.protein}g · C {foundFood.carbs}g · F {foundFood.fat}g
              </div>
            </div>

            {/* Servings selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Servings</label>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {QUICK_SERVINGS.map(n => (
                  <button
                    key={n}
                    onClick={() => setServings(n.toString())}
                    className={`py-2 rounded-lg font-semibold border-2 text-sm transition-colors ${
                      parseFloat(servings) === n
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                    }`}
                  >
                    {n}×
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={servings}
                onChange={e => setServings(e.target.value)}
                className="input-field text-center"
                placeholder="Custom amount"
              />
            </div>

            {/* Live preview */}
            {previewServings > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg mb-6">
                <div className="font-bold text-2xl mb-1">{previewCalories} cal</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  P: {previewProtein}g · C: {previewCarbs}g · F: {previewFat}g
                </div>
              </div>
            )}

            <button
              onClick={handleAddToLog}
              disabled={previewServings <= 0}
              className="btn-primary w-full mb-3"
            >
              Add to Log
            </button>
            <button
              onClick={() => {
                setFoundFood(null);
                setServings('1');
                setError('');
                scanProcessedRef.current = false;
                startScanner();
              }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 w-full py-2"
            >
              Re-scan
            </button>
          </>
        )}

        {/* ── Scan / lookup screen ── */}
        {!foundFood && (
          <>
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
                      onClick={() => { stopScanner(); setManualEntry(true); }}
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
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck="false"
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

            <button
              onClick={async () => { await stopScanner(); onClose(); }}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
