import { useState, useRef, useEffect } from 'react';
import { analyzeTextMeal, analyzeImageMeal, imageFileToBase64 } from '../utils/gemini';
import { getLocalDateString, getAILogsToday, incrementAILogsToday, AI_DAILY_LIMIT } from '../utils/storage';

const hasSpeechRecognition = typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);


function useSpeechRecognition(onResult) {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recRef.current = new SR();
    recRef.current.continuous = false;
    recRef.current.interimResults = false;
    recRef.current.lang = 'en-US';
    recRef.current.onresult = e => onResult(e.results[0][0].transcript);
    recRef.current.onend = () => setListening(false);
    recRef.current.onerror = () => setListening(false);
    recRef.current.start();
    setListening(true);
  };

  const stop = () => { recRef.current?.stop(); setListening(false); };

  useEffect(() => () => recRef.current?.abort(), []);

  return { listening, start, stop };
}

export default function AIFoodLogger({ onLog, onClose, onLogged }) {
  const [mode, setMode] = useState('photo'); // 'text' | 'photo'
  const [description, setDescription] = useState('');
  const [photoNote, setPhotoNote] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [results, setResults] = useState(null);
  const [editedResults, setEditedResults] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { listening, start: startListening, stop: stopListening } = useSpeechRecognition(
    text => setDescription(prev => prev ? `${prev} ${text}` : text)
  );

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    };
  }, [cameraStream]);

  // Countdown timer
  useEffect(() => {
    if (retryCountdown <= 0) return;
    if (retryCountdown === 1) {
      const timer = setTimeout(() => {
        setRetryCountdown(0);
        setError('Ready to retry — tap "Estimate nutrition" below.');
      }, 1000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setRetryCountdown(p => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [retryCountdown]);

  // Attach stream to video element when stream is ready
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
    } catch {
      setCameraError('Camera access denied. Please allow camera access in your browser settings, or use "Choose file" instead.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    setCameraStream(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setImageFile(file);
      setImagePreview(URL.createObjectURL(blob));
      stopCamera();
    }, 'image/jpeg', 0.92);
  };

  const clearPhoto = () => {
    setImagePreview(null);
    setImageFile(null);
    setPhotoNote('');
    stopCamera();
  };

  const handleImageSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleAnalyze = async () => {
    if (mode === 'text' && !description.trim()) { setError('Please describe your meal first.'); return; }
    if (mode === 'text' && description.length > 1000) { setError('Description is too long — please keep it under 1000 characters.'); return; }
    if (mode === 'photo' && !imageFile) { setError('Please select or take a photo first.'); return; }
    if (mode === 'photo' && imageFile.size > 4 * 1024 * 1024) { setError('Image is too large — please use an image under 4MB.'); return; }
    if (mode === 'photo' && !imageFile.type.startsWith('image/')) { setError('Invalid file type — please select an image.'); return; }
    if (photoNote.length > 500) { setError('Note is too long — please keep it under 500 characters.'); return; }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      let items;
      if (mode === 'text') {
        items = await analyzeTextMeal(description.trim());
      } else {
        const { base64, mimeType } = await imageFileToBase64(imageFile);
        items = await analyzeImageMeal(base64, mimeType, photoNote.trim() || null);
      }
      incrementAILogsToday();
      setResults(items);
      setEditedResults(items.map(item => ({ ...item })));
      setSelectedIndices(new Set(items.map((_, i) => i)));
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      if (err.retryAfter) setRetryCountdown(err.retryAfter);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (idx, field, value) => {
    setEditedResults(prev => prev.map((item, i) =>
      i === idx ? { ...item, [field]: field === 'name' ? value : Number(value) || 0 } : item
    ));
  };

  const toggleSelect = (idx) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const handleLogSelected = () => {
    const date = getLocalDateString();
    editedResults.forEach((item, idx) => {
      if (!selectedIndices.has(idx)) return;
      onLog({
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: 0, sodium: 0, sugar: 0, saturatedFat: 0,
        baseCalories: item.calories, baseProtein: item.protein,
        baseCarbs: item.carbs, baseFat: item.fat,
        baseFiber: 0, baseSodium: 0, baseSugar: 0, baseSaturatedFat: 0,
        servingSize: '1 serving (AI estimate)',
        quantity: 1,
        source: 'ai',
        timestamp: Date.now(),
        date,
      });
    });
    onLogged?.();
    onClose();
  };

  const modalScrollRef = useRef(null);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div ref={modalScrollRef} className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">✨ AI Food Logging</span>
              <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Estimates only — verify with packaging when accuracy matters
              <span className="ml-2 text-purple-500 dark:text-purple-400 font-medium">{getAILogsToday()} / {AI_DAILY_LIMIT} today</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl p-1">✕</button>
        </div>

        <div className="px-5 py-5 space-y-4">

          {!results && (
            <>
              {/* Mode toggle */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                {[
                  { id: 'photo', label: '📷 Photo' },
                  { id: 'text', label: '💬 Describe' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setMode(m.id); setError(''); stopCamera(); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === m.id ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Text mode */}
              {mode === 'text' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    More detail = better accuracy. Include portions, ingredients, cooking method, brand, and any sauces or toppings.
                  </p>
                  <textarea
                    value={description}
                    onChange={e => { setDescription(e.target.value); setError(''); }}
                    placeholder='e.g. "A bowl of spaghetti bolognese — about 1.5 cups pasta, beef and pork meat sauce with olive oil, topped with 2 tbsp parmesan"'
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
                  />
                  {hasSpeechRecognition && (
                    <button
                      onClick={listening ? stopListening : startListening}
                      className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${listening ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                      {listening ? '⏹ Stop listening' : '🎤 Tap to speak'}
                    </button>
                  )}
                </div>
              )}

              {/* Photo mode */}
              {mode === 'photo' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Clear, well-lit photos give better estimates.
                  </p>

                  {/* Hidden inputs */}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Live camera preview */}
                  {cameraStream && !imagePreview && (
                    <div className="space-y-2">
                      <div className="relative rounded-xl overflow-hidden bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-xl"
                          onCanPlay={() => {
                            if (modalScrollRef.current) {
                              modalScrollRef.current.scrollTop = modalScrollRef.current.scrollHeight;
                            }
                          }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={capturePhoto}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
                        >
                          📸 Capture
                        </button>
                        <button
                          onClick={stopCamera}
                          className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image preview */}
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Meal preview" className="w-full rounded-xl object-cover max-h-48" />
                      <button
                        onClick={clearPhoto}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >✕</button>
                    </div>
                  )}

                  {/* Upload buttons — shown when no image and camera not active */}
                  {!imagePreview && !cameraStream && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={startCamera}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-6 text-center hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
                      >
                        <div className="text-2xl mb-1">📷</div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Use camera</p>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-6 text-center hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
                      >
                        <div className="text-2xl mb-1">🖼️</div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Choose file</p>
                      </button>
                    </div>
                  )}

                  {/* Camera permission error */}
                  {cameraError && (
                    <p className="text-xs text-red-600 dark:text-red-400">{cameraError}</p>
                  )}

                  {/* Optional note — shown once image is selected */}
                  {imagePreview && (
                    <textarea
                      value={photoNote}
                      onChange={e => setPhotoNote(e.target.value)}
                      placeholder='Optional: add context to improve accuracy — e.g. "homemade, extra olive oil" or "restaurant portion, about 8oz"'
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
                    />
                  )}
                </div>
              )}

              {error && (
                <div className={`rounded-xl px-4 py-3 ${retryCountdown === 0 && error.startsWith('Ready') ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                  {retryCountdown > 0 ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-red-700 dark:text-red-400">Gemini is busy — ready to retry in</p>
                      <span className="text-sm font-bold text-red-700 dark:text-red-400 tabular-nums ml-2">{retryCountdown}s</span>
                    </div>
                  ) : (
                    <p className={`text-sm ${error.startsWith('Ready') ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>{error}</p>
                  )}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || retryCountdown > 0 || (mode === 'text' && !description.trim()) || (mode === 'photo' && !imageFile)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {loading ? 'Analyzing with Gemini AI…' : 'Estimate nutrition'}
              </button>
            </>
          )}

          {/* Results */}
          {results && editedResults && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-0.5">AI estimates</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">You can edit any value before logging. Tap a number to change it.</p>
              </div>

              <div className="space-y-3">
                {editedResults.map((item, idx) => (
                  <div key={idx} className={`rounded-xl p-4 space-y-3 border-2 transition-colors ${selectedIndices.has(idx) ? 'bg-gray-50 dark:bg-gray-700 border-emerald-400 dark:border-emerald-600' : 'bg-gray-50/50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIndices.has(idx)}
                        onChange={() => toggleSelect(idx)}
                        className="w-4 h-4 accent-emerald-600 flex-shrink-0"
                      />
                      <input
                        value={item.name}
                        onChange={e => updateField(idx, 'name', e.target.value)}
                        className="flex-1 text-sm font-semibold bg-transparent border-b border-gray-200 dark:border-gray-600 pb-1 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { field: 'calories', label: 'Cal', color: 'text-blue-600 dark:text-blue-400' },
                        { field: 'protein', label: 'Pro', color: 'text-emerald-600 dark:text-emerald-400' },
                        { field: 'carbs', label: 'Carb', color: 'text-orange-600 dark:text-orange-400' },
                        { field: 'fat', label: 'Fat', color: 'text-purple-600 dark:text-purple-400' },
                      ].map(({ field, label, color }) => (
                        <div key={field} className="text-center">
                          <input
                            type="number"
                            value={item[field]}
                            onChange={e => updateField(idx, field, e.target.value)}
                            className={`w-full text-center text-base font-bold bg-transparent border-b border-gray-200 dark:border-gray-600 focus:outline-none focus:border-emerald-500 ${color}`}
                            min="0"
                          />
                          <div className="text-xs text-gray-400 mt-0.5">{label}{field !== 'calories' ? ' g' : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  <strong>AI estimates can be significantly off</strong>, especially for mixed dishes, restaurant meals, and foods with hidden oils or sauces. Edit the values above if something looks wrong.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setResults(null); setEditedResults(null); setError(''); }}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Try again
                </button>
                <button
                  onClick={handleLogSelected}
                  disabled={selectedIndices.size === 0}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {selectedIndices.size === 0 ? 'Select items' : selectedIndices.size === editedResults.length ? `Log all ${editedResults.length}` : `Log ${selectedIndices.size} of ${editedResults.length}`}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
