import { useState, useEffect } from 'react';

const FAQ_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      {
        q: 'Is Free Calorie Track really free?',
        a: 'Yes. All core features in the app are free to use. There is currently no premium tier, no upgrade wall, and no free-trial period that expires. Barcode scanning, macro tracking, trends, history editing, exercise logging — all of it is included. The app is funded by optional donations, not by gating features behind a paywall. While the core features will remain free, optional features may be introduced in the future.',
      },
      {
        q: 'Do I need to create an account or sign up?',
        a: 'No. There is no account, no email, no password. You open the app and start tracking immediately. Your data is stored locally on your device, so there\'s nothing to sign into. If you use multiple devices, you can export and import your data as a backup file.',
      },
      {
        q: 'How do I get started?',
        a: 'Open the app on any device with a modern web browser. You\'ll be walked through a quick profile setup — just enter your age, sex, height, weight, and activity level. The app calculates your TDEE and calorie goal from there. Then start logging food. That\'s it.',
      },
      {
        q: 'What devices does Free Calorie Track work on?',
        a: 'Any device with a modern web browser: iPhone, Android phones, iPad, tablets, Windows PCs, Macs, and Linux. It\'s a Progressive Web App (PWA), which means you can install it on your home screen and use it like a native app — with offline support and no app store required.',
      },
      {
        q: 'How do I add Free Calorie Track to my home screen?',
        a: null, // rendered as custom multi-step block
        type: 'homescreen',
      },
    ],
  },
  {
    title: 'Compared to Other Apps',
    items: [
      {
        q: 'How is Free Calorie Track different from other popular calorie trackers?',
        a: 'Most popular calorie tracking apps require account creation and limit essential features — like barcode scanning, macro tracking, and trend insights — behind premium subscriptions. They may also show ads to free-tier users. Free Calorie Track includes these features at no cost, requires no account, shows no ads, and stores your data locally on your device rather than requiring cloud storage.',
      },
      {
        q: 'Why is this app free when others charge for the same features?',
        a: 'Free Calorie Track is a single-developer project with no investors, no ad network, and no company overhead to fund. It runs as a Progressive Web App, which means no app store fees. It\'s kept alive by optional donations from people who find it useful. The goal was never to build a business — it was to build the calorie tracker that the developer wished existed.',
      },
      {
        q: 'Is a free calorie tracker as good as a paid one?',
        a: 'For core calorie and macro tracking, yes. The features that matter most — accurate food logging, barcode scanning, macro goals, trends, and history editing — are all here and free to use. What paid apps often add on top is social features, coaching, and meal planning services. If you want a reliable tool for tracking nutrition, Free Calorie Track covers the fundamentals.',
      },
    ],
  },
  {
    title: 'Tracking & Logging',
    items: [
      {
        q: 'How do I log food?',
        a: 'There are several ways, designed to fit how you actually eat. Scan a barcode with your camera for branded products. Pick from thousands of common foods like eggs, chicken breast, or oatmeal — no internet needed. Search a database of branded foods. Add from your favorites or recent foods for quick re-logging. Create custom foods or recipes. Or copy all of yesterday\'s meals in one tap.',
      },
      {
        q: 'How does barcode scanning work, and is it really free?',
        a: 'Yes, barcode scanning is completely free with no daily or monthly limit. Point your camera at any product barcode and the app looks it up instantly using the Open Food Facts database, which contains over 220,000 products. If a product isn\'t in the database, you can manually enter the nutrition info and save it as a custom food.',
      },
      {
        q: 'Can I track macros (protein, carbs, and fat) for free?',
        a: 'Yes. Macro tracking is fully included. The app shows real-time progress bars for protein, carbs, and fat alongside your calorie count. You can use the automatically calculated macro targets based on your fitness goal, or set your own custom macro goals in settings. No paywall, no premium required.',
      },
      {
        q: 'Can I create custom foods and recipes?',
        a: 'Yes. You can create custom foods by manually entering the name and nutrition information. The recipe builder lets you combine multiple ingredients — from the common foods list, barcode scans, or database searches — and automatically calculates the nutrition per serving. Save recipes to log them again quickly later.',
      },
      {
        q: 'Can I copy yesterday\'s meals?',
        a: 'Yes. There\'s a one-tap "Copy Yesterday\'s Meals" option in the food logging menu. It copies every food entry from the previous day into today\'s log. Useful for people who eat similar meals day to day and don\'t want to re-enter everything from scratch.',
      },
      {
        q: 'Can I edit or delete food entries after logging them?',
        a: 'Yes. You can edit or delete any food entry at any time, including entries from past days. There are no restrictions, no streak penalties, and no guilt mechanics. If you made a mistake or forgot something, just fix it.',
      },
    ],
  },
  {
    title: 'Calories & Nutrition Science',
    items: [
      {
        q: 'What are NET calories, and why do they matter?',
        a: 'NET calories represent your true energy balance for the day: the calories you ate, minus the calories your body burned at rest (TDEE), minus the calories you burned exercising. A NET of zero means maintenance — your weight stays the same. Negative NET means a deficit — you\'ll lose weight over time. Positive NET means a surplus — you\'ll gain weight. Most apps show gross calories eaten without factoring in what your body burns, which makes the number misleading. Free Calorie Track shows you the real picture.',
      },
      {
        q: 'What is the difference between BMR and TDEE?',
        a: 'BMR (Basal Metabolic Rate) is how many calories your body burns doing absolutely nothing — just keeping you alive. TDEE (Total Daily Energy Expenditure) is your total daily burn, which includes BMR plus the energy spent on daily movement, activity, and digestion. TDEE is the number that actually matters for tracking, because it\'s the baseline your food intake gets compared against. Free Calorie Track calculates both using the widely used Mifflin-St Jeor equation.',
      },
      {
        q: 'How does the app calculate my calorie goal?',
        a: 'During profile setup, you enter your age, sex, height, weight, and activity level. The app calculates your BMR using the Mifflin-St Jeor equation, then multiplies it by an activity factor to get your TDEE. From there, your fitness goal (fat loss, muscle gain, maintenance, or athletic performance) determines your daily calorie target. You can also override the calculated goal and set a custom calorie target if you prefer.',
      },
      {
        q: 'How much protein do I need per day?',
        a: 'It depends on your goals. The app sets automatic macro targets based on sports nutrition research: higher protein for fat loss and muscle gain phases, moderate for maintenance. As a general guideline, most people benefit from 0.7–1.0g of protein per pound of body weight per day, with the higher end of that range during cutting or building phases. You can see your auto-calculated target in the app, or set a custom protein goal in settings.',
      },
      {
        q: 'Will tracking calories actually help me lose weight?',
        a: 'Research suggests that calorie awareness is a useful tool for many people managing their weight. That said, tracking is a tool — it works best when it\'s sustainable. Free Calorie Track is designed to make tracking fast and low-friction so you\'ll actually stick with it. No ads interrupting you, no paywalls forcing upgrades, and full history editing so one missed day doesn\'t derail your streak. Individual results vary.',
      },
      {
        q: 'Can I use this app for muscle gain, not just fat loss?',
        a: 'Yes. The app supports muscle gain as a fitness goal. It sets a calorie surplus target and higher protein macro goals appropriate for building. You can log strength training from 80+ exercises, track weight gain over time with progress charts, and monitor your weekly calorie averages to make sure you\'re consistently in a surplus. The NET calorie system works the same way in either direction.',
      },
    ],
  },
  {
    title: 'Trends, History & Insights',
    items: [
      {
        q: 'What does the Trends page show me?',
        a: 'Trends gives you a bigger-picture view of how your nutrition and fitness are actually going over time. You\'ll see weekly and monthly averages for NET calories, protein, carbs, fat, and exercise calories burned. There\'s also a 7-day rolling average line that smooths out the day-to-day noise — so one bad day doesn\'t make your week look terrible. Weight progress is charted over time so you can see the actual trajectory, not just a single number.',
      },
      {
        q: 'How are weekly and monthly averages calculated?',
        a: 'The app looks at every day you logged food during the period and calculates the mean. Weekly averages cover the last 7 days, monthly averages cover the last 30. If you missed a day, it\'s not counted in the average — the app only averages days you actually tracked. This keeps your averages honest and avoids penalizing you for days you didn\'t log.',
      },
      {
        q: 'What is the 7-day rolling average and why is it useful?',
        a: 'Weight and calorie intake fluctuate naturally day to day — water retention, meal timing, stress, and dozens of other factors cause the number to bounce around. The 7-day rolling average smooths all of that out. If your rolling average NET calories are consistently negative over weeks, you\'re in a real deficit, regardless of what any single day looked like. It\'s one of the most useful numbers in the app for making informed decisions about your intake.',
      },
      {
        q: 'How does the app estimate my weight change?',
        a: 'The app calculates estimated weight change based on your cumulative NET calorie balance over time. Roughly 3,500 calories of deficit equals about one pound of fat lost (and vice versa for surplus). The app uses this relationship alongside your actual logged weight entries to show both estimated and actual weight trends. The estimate is a guide — actual results depend on many factors — but it gives you a grounded expectation based on your own data.',
      },
      {
        q: 'How do I view my food and exercise history?',
        a: 'Tap "History" in the bottom navigation. You\'ll see a list of past days with a summary of what you logged — food entries, exercise, and calorie totals for each day. Tap any day to expand it and see the full detail. You can scroll back as far as you have data.',
      },
      {
        q: 'How far back does my history go?',
        a: 'Your history goes back to the very first day you logged anything in the app. There\'s no cutoff or automatic deletion. All of your food logs, exercise entries, and weight entries are kept indefinitely on your device until you manually delete them or clear your data.',
      },
      {
        q: 'Can I add or edit food entries on a past day?',
        a: 'Yes. Open any past day in History, and you can add new entries, edit existing ones, or delete them — same as you would for today. There\'s no lock on past days and no penalty for making changes. If you forgot to log lunch three days ago, just go back and add it.',
      },
      {
        q: 'What insights does the dashboard show me?',
        a: 'The dashboard is your daily command center. At the top you\'ll see your NET calorie balance for today — how far above or below maintenance you are. Below that are macro progress bars for protein, carbs, and fat, updating in real time as you log food. You\'ll also see your food and exercise entries for today, a water tracker (if enabled), and an achievements bar that tracks your streaks and milestones.',
      },
      {
        q: 'How do streaks and achievements work?',
        a: 'The app tracks light gamification — streaks for consecutive days of logging, and achievements for milestones like logging your first meal, hitting a protein goal, or reaching 30 days of tracking. These are meant to be encouraging, not anxiety-inducing. There are no punishments for breaking a streak, and achievements are purely celebratory. You can view all your achievements from the dashboard.',
      },
    ],
  },
  {
    title: 'Privacy & Data',
    items: [
      {
        q: 'Where is my data stored?',
        a: 'Your nutrition data and personal information are stored locally on your device using browser storage (localStorage). No cloud account is required and no syncing takes place. Your meal logs, exercise history, weight entries, and profile information stay entirely on the device you\'re using.',
      },
      {
        q: 'Does the app work without an internet connection?',
        a: 'Yes. Once installed, the app works fully offline. The thousands of common foods in the database, your saved favorites, recipes, and all logged data are available without internet. The only feature that requires a connection is searching the branded food database or scanning barcodes for products not already cached on your device.',
      },
      {
        q: 'How do I back up my data?',
        a: 'The app has a built-in export feature in Settings. It exports all of your data — food logs, exercise logs, weight entries, custom foods, recipes, and profile — as a single JSON file you can save to your device. You can import that file later on the same or a different device to restore everything. This is especially important since data is stored locally and isn\'t backed up to a cloud automatically.',
      },
      {
        q: 'Is my personal and nutrition data safe?',
        a: 'Yes. Because data never leaves your device, there\'s no server to hack, no database breach to worry about, and no third party with access to your information. The only way your data leaves your device is if you explicitly export it yourself. No account means no email address or password to compromise either.',
      },
    ],
  },
];

const HOMESCREEN_STEPS = [
  {
    platform: 'iPhone — Safari',
    steps: [
      'Tap the Share button (box with an arrow pointing up) at the bottom center of the screen.',
      'Scroll down in the menu that appears and tap "Add to Home Screen."',
      'Tap "Add" in the top right to confirm.',
    ],
  },
  {
    platform: 'iPhone — Chrome',
    steps: [
      'Tap the three-dot menu (⋮) in the top right corner.',
      'Tap "Add to Home Screen."',
      'Tap "Add" to confirm.',
    ],
  },
  {
    platform: 'iPhone — Firefox',
    steps: [
      'Tap the three-line menu at the bottom of the screen.',
      'Tap "Add to Home Screen."',
    ],
  },
  {
    platform: 'Android — Chrome',
    steps: [
      'You may see an "Install" banner appear automatically at the top — tap it to install.',
      'If it doesn\'t appear, tap the three-dot menu (⋮) in the top right.',
      'Tap "Install app" or "Add to Home Screen."',
    ],
  },
  {
    platform: 'Android — Other browsers',
    steps: [
      'Tap the menu icon and look for "Add to Home Screen" or "Install."',
    ],
  },
  {
    platform: 'Desktop — Chrome or Edge',
    steps: [
      'Look for a small install icon in the address bar (a monitor or download arrow).',
      'If it\'s not there, open the three-dot menu and look for "Install Free Calorie Track."',
      'Safari on Mac does not support PWA install, but the app works fully in the browser tab.',
    ],
  },
];

const COMPARISON_ROWS = [
  { feature: 'Barcode scanning', fct: '✅', other: '💰 Requires subscription' },
  { feature: 'Macro tracking', fct: '✅', other: '⚠️ Free tier limited' },
  { feature: 'Trends & insights', fct: '✅', other: '⚠️ Free tier limited' },
  { feature: 'Ad-free', fct: '✅', other: '💰 Requires subscription' },
  { feature: 'Account required', fct: '❌ No', other: '✓ Yes' },
  { feature: 'Data storage', fct: 'Stored locally', other: 'Cloud-based' },
];

function FAQAccordion({ sections }) {
  const [openSection, setOpenSection] = useState(0);
  const [openItems, setOpenItems] = useState({});

  const toggleSection = (i) => setOpenSection(openSection === i ? -1 : i);

  const toggleItem = (sectionIdx, itemIdx) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-3">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {/* Section header */}
          <button
            onClick={() => toggleSection(sIdx)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <span className="text-base font-bold text-gray-800 dark:text-gray-100">{section.title}</span>
            <span className={`text-emerald-600 dark:text-emerald-400 text-xl transition-transform ${openSection === sIdx ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </button>

          {/* Items */}
          {openSection === sIdx && (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {section.items.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}`;
                const isOpen = openItems[key];
                return (
                  <div key={iIdx}>
                    <button
                      onClick={() => toggleItem(sIdx, iIdx)}
                      className="w-full flex items-start justify-between px-5 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 pr-4">{item.q}</span>
                      <span className={`text-emerald-600 dark:text-emerald-400 text-sm flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4">
                        {item.type === 'homescreen' ? (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              The steps are slightly different depending on your device and browser:
                            </p>
                            {HOMESCREEN_STEPS.map((group, gIdx) => (
                              <div key={gIdx}>
                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1">{group.platform}</p>
                                <ol className="list-decimal list-inside space-y-1">
                                  {group.steps.map((step, sIdx2) => (
                                    <li key={sIdx2} className="text-sm text-gray-600 dark:text-gray-300">{step}</li>
                                  ))}
                                </ol>
                              </div>
                            ))}
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Once installed, it opens full screen like a native app and works offline.
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.a}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage({ onGetStarted }) {
  // Hide the universal footer from index.html when landing page is shown
  useEffect(() => {
    const footer = document.querySelector('.app-footer');
    if (footer) {
      footer.style.display = 'none';
    }
    return () => {
      if (footer) {
        footer.style.display = 'block';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 pt-24 md:pt-16 pb-20 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Left: Text */}
            <div className="flex-1 text-center md:text-left max-w-xl">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-100">Free Calorie Track</h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Track calories & macros with <span className="font-bold text-emerald-600 dark:text-emerald-400">no paywalls, no ads, no account.</span>
              </p>
              <button
                onClick={onGetStarted}
                className="bg-emerald-600 text-white font-bold text-lg py-4 px-12 rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-700 transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                aria-label="Start tracking calories and macros now"
              >
                Start Tracking Now
              </button>
            </div>

            {/* Right: App Screenshot */}
            <div className="flex-1 w-full max-w-sm md:max-w-3xl">
              <picture>
                {/* Desktop: Multi-phone composite */}
                <source
                  srcSet="/hero-screenshot.webp"
                  type="image/webp"
                  media="(min-width: 768px)"
                />
                <source
                  srcSet="/hero-screenshot.png"
                  type="image/png"
                  media="(min-width: 768px)"
                />

                {/* Mobile: Single phone */}
                <source
                  srcSet="/hero-mobile.webp"
                  type="image/webp"
                  media="(max-width: 767px)"
                />
                <source
                  srcSet="/hero-mobile.png"
                  type="image/png"
                  media="(max-width: 767px)"
                />

                {/* Fallback */}
                <img
                  src="/hero-screenshot.png"
                  alt="Free Calorie Track app dashboard showing NET calorie circle in green, macro tracking, and food logging interface"
                  className="w-full h-auto rounded-xl shadow-2xl"
                  loading="eager"
                  style={{
                    imageRendering: 'high-quality',
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                  decoding="sync"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">How it works</h2>
        <div className="space-y-6">
          {[
            { step: '1', title: 'Set up your profile', desc: 'Enter your age, height, weight, and activity level. We calculate your TDEE automatically.*', note: true },
            { step: '2', title: 'Log your food and exercise', desc: 'Scan barcodes, pick from thousands of common foods, search branded products, build custom recipes, and track workouts from 250+ exercises.' },
            { step: '3', title: 'See your NET calories and macros', desc: 'Food eaten minus your body\'s burn minus exercise. Plus real-time tracking for protein, carbs, and fat.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {item.step}
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{item.desc}</p>
                {item.note && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">*Estimates only. Consult a healthcare provider for medical advice.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">Free Forever Core Features</h2>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">100% free to use. All essential tracking features included.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '📷', title: 'Barcode Scanning', desc: 'Scan any product instantly. 220,000+ items in the database.' },
              { icon: '🥩', title: 'Macro Tracking', desc: 'Protein, carbs, fat. Real-time progress bars, auto or custom targets.' },
              { icon: '🏋️', title: '250+ Exercises', desc: 'Cardio, strength, sports, HIIT. MET-based calorie calculations.' },
              { icon: '✏️', title: 'Edit Anything', desc: 'Fix yesterday. Fix last week. No streak penalties, no guilt.' },
              { icon: '📈', title: 'Trends & Insights', desc: 'Weekly and monthly averages. Weight progress charts. All free.' },
              { icon: '📶', title: 'Works Offline', desc: 'Install on any device.' },
            ].map((f) => (
              <div key={f.title} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">See how we compare</h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Core features. 100% free to use.</p>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="text-left px-4 py-3 font-semibold">Features*</th>
                <th className="text-left px-4 py-3 font-semibold">Free Calorie Track</th>
                <th className="text-left px-4 py-3 font-semibold">Other Leading Apps</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'} border-t border-gray-200 dark:border-gray-700`}>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{row.feature}</td>
                  <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">{row.fct}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4">
          <strong>*Disclaimer:</strong> Comparison based on typical free-tier features available from leading subscription-based calorie tracking apps as of February 2026. Feature availability may change over time. No specific apps or trademarks are referenced to avoid trademark concerns.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-emerald-600 dark:bg-emerald-700 px-4 py-12">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p className="text-lg text-emerald-100 mb-4">No sign-up. No credit card. No catch.</p>
          <button
            onClick={onGetStarted}
            className="bg-white text-emerald-700 font-bold text-lg py-3 px-10 rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50"
            aria-label="Start tracking calories and macros now"
          >
            Start Tracking Now
          </button>
          <p className="text-emerald-100 text-sm mt-3">No download required</p>
        </div>
      </div>

      {/* FAQ */}
      <div id="install-instructions" className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">Everything you need to know</h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">Tap a section to expand.</p>
        <FAQAccordion sections={FAQ_SECTIONS} />
      </div>

      {/* Landing Page Footer */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Medical Disclaimer - Prominent */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong className="text-yellow-800 dark:text-yellow-400">Medical Disclaimer:</strong> Free Calorie Track is for informational purposes only and is not intended for medical diagnosis, treatment, or professional health advice. TDEE and calorie estimates are approximations based on standard formulas and may not be accurate for all individuals. Always consult a qualified healthcare provider before making changes to your diet, exercise, or health routine. Free Calorie Track is provided "as is" without warranties of any kind and is not liable for any damages, data loss, or inaccuracies.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <a href="/privacy-policy.html" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service.html" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Free Calorie Track. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
}
