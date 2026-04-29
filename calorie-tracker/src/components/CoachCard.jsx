import { useState } from 'react';
import { Sparkles, X, RefreshCw } from 'lucide-react';
import {
  getProfile, getCustomCalorieGoal, getCustomMacros,
  getCoachTermsAccepted, setCoachTermsAccepted,
  getCoachResult, saveCoachResult, getLastCoachDate,
  getDaysLoggedLastWeek, getWeeklyLogsForCoach,
  getLocalDateString, COACH_MIN_DAYS,
} from '../utils/storage';
import { calculateMacroTargets } from '../utils/macros';
import { calculateBMR, getBaselineTDEE } from '../utils/calculations';

function buildProfilePayload() {
  const profile = getProfile();
  if (!profile) return null;

  const bmr = calculateBMR(profile);
  const tdee = getBaselineTDEE(bmr, profile.activityLevel);
  const customCalorie = getCustomCalorieGoal();
  const customMacros = getCustomMacros();
  const calorieGoal = customCalorie || Math.round(tdee);
  const macros = customMacros || calculateMacroTargets(profile, calorieGoal);

  return {
    goal: profile.goal,
    activityLevel: profile.activityLevel,
    age: profile.age,
    weight: profile.weight,
    units: profile.units,
    calorieGoal,
    proteinTarget: macros.protein,
    carbTarget: macros.carbs,
    fatTarget: macros.fat,
  };
}

function PrivacyModal({ onAccept, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-700">
          <span className="font-bold text-gray-900 dark:text-gray-100">What gets sent to AI</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            To generate your coaching insight, the following is sent to Google's Gemini AI:
          </p>
          <ul className="space-y-1.5">
            {['Your food logs from the last 7 days (totals and food names)', 'Your calorie and macro targets', 'Your profile (goal, activity level, age, weight)'].map(item => (
              <li key={item} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-emerald-500 flex-shrink-0">•</span>{item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            We never store or see this data — it goes directly to Google for analysis, and the result is saved only on your device.
          </p>
          <div className="flex gap-4">
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 underline">Google Privacy Policy</a>
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 underline">Google Terms of Service</a>
          </div>
          <button
            onClick={onAccept}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Got it — analyze my week
          </button>
          <button onClick={onClose} className="w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-1">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultSection({ icon, title, items, color }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className={`text-xs font-bold uppercase tracking-wide ${color}`}>{icon} {title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-gray-600">{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CoachCard() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(getCoachResult());

  const daysLogged = getDaysLoggedLastWeek();
  const hasEnough = daysLogged >= COACH_MIN_DAYS;
  const today = getLocalDateString();
  const lastDate = getLastCoachDate();
  const ranToday = lastDate === today;

  const runCoach = async () => {
    setLoading(true);
    setError('');
    try {
      const profile = buildProfilePayload();
      const logs = getWeeklyLogsForCoach();
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, logs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      saveCoachResult(data);
      setResult(getCoachResult());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!getCoachTermsAccepted()) {
      setShowPrivacy(true);
    } else {
      runCoach();
    }
  };

  const handleAcceptAndRun = () => {
    setCoachTermsAccepted();
    setShowPrivacy(false);
    runCoach();
  };

  return (
    <>
      {showPrivacy && <PrivacyModal onAccept={handleAcceptAndRun} onClose={() => setShowPrivacy(false)} />}

      <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-purple-500" />
            <span className="font-bold text-gray-900 dark:text-gray-100">Nutrition Coach</span>
            <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            AI-generated insights based on your logs — estimates only, not medical advice.
          </p>
        </div>

        <div className="px-5 py-4 space-y-4">

          {/* No result yet — show description + CTA */}
          {!result && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Get a personalized read on your week — what you're nailing, where you might improve, and specific things to try. Based on your last 7 days of logs.
              </p>

              {!hasEnough ? (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Log at least <strong>{COACH_MIN_DAYS} days</strong> this week to unlock coaching.
                    You've logged <strong>{daysLogged} of {COACH_MIN_DAYS} days</strong> needed.
                  </p>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: COACH_MIN_DAYS }).map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full ${i < daysLogged ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Remember meals from earlier this week? You can log past days in the <strong>History</strong> tab.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><RefreshCw size={16} className="animate-spin" /> Analyzing your week…</>
                  ) : (
                    <><Sparkles size={16} /> Analyze my week</>
                  )}
                </button>
              )}
            </>
          )}

          {/* Has result */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Based on your last 7 days · {result.date === today ? 'Updated today' : `Updated ${result.date}`}
                </p>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="text-xs text-gray-400 dark:text-gray-500 underline hover:text-gray-600"
                >
                  What gets sent?
                </button>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                AI-generated estimates — may not be accurate. Not a substitute for professional nutrition advice.
              </p>

              <ResultSection
                icon="✅"
                title="What's working"
                items={result.sections?.whatsWorking}
                color="text-emerald-600 dark:text-emerald-400"
              />
              <ResultSection
                icon="⚠️"
                title="Needs attention"
                items={result.sections?.needsAttention}
                color="text-amber-600 dark:text-amber-400"
              />
              <ResultSection
                icon="💡"
                title="This week, try"
                items={result.sections?.thisTry}
                color="text-blue-600 dark:text-blue-400"
              />

              {result.sections?.trajectory && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">📈 Trajectory</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.sections.trajectory}</p>
                </div>
              )}

              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

              <button
                onClick={handleAnalyze}
                disabled={loading || ranToday}
                className="w-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 font-medium py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><RefreshCw size={14} className="animate-spin" /> Analyzing…</>
                ) : ranToday ? (
                  'Updated today · Available tomorrow'
                ) : (
                  <><RefreshCw size={14} /> Refresh analysis</>
                )}
              </button>
            </div>
          )}

          {error && !result && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

        </div>
      </div>
    </>
  );
}
