# Calorie Tracker

A simple, mobile-first web app for tracking net calories (food eaten minus calories burned).

## Privacy Notice

**Your Data Stays Local:** All your personal tracking data (food logs, weight, exercise, etc.) is stored only in your browser's localStorage and never sent to any servers.

**Anonymous Analytics:** This app uses Vercel Analytics to collect anonymous usage statistics (page views, feature usage) to help improve the app. No personal tracking data is sent to analytics. See our [Privacy Policy](/privacy-policy.html) for full details.

## Workout Import Feature (Implemented with Legal Mitigations)

**Note:** This feature is fully implemented but not yet deployed. It allows users to import workout history from fitness apps (Strava, Apple Health, Garmin, Google Fit).

**Legal Disclaimers Included:**
- ⚠️ Mandatory acceptance of legal disclaimer before first use
- 📊 Accuracy warnings (imported data may contain errors)
- 💾 Storage warnings (data stored unencrypted on device)
- 📋 Third-party terms compliance reminder
- ⚕️ Medical disclaimer (not for medical decisions)

**Supported Formats:**
- CSV (Strava, Garmin exports)
- JSON (Google Fit exports)
- GPX (GPS tracking files)
- XML (Apple Health export.xml)
- TCX (Garmin Training Center format)

**Import Privacy:**
All file parsing happens client-side in the browser. Workout data never leaves the user's device. The parser extracts: exercise type, duration, calories burned, date, and distance (if available).

**Liability Considerations:**
Users must accept legal disclaimer acknowledging:
- Data accuracy not guaranteed
- User responsibility to review imported data
- Compliance with export source's terms of service
- No reliance on data for medical decisions

## Features

### Food Input
- **Search**: Search foods using the free Open Food Facts API
- **Barcode Scanner**: Scan product barcodes with your camera
- **Quick Add**: Manually enter calorie amounts
- **Favorites**: Save frequently eaten foods
- **Recent Foods**: Quick access to recently logged items

### Calorie Burn Tracking
- **BMR/TDEE Calculator**: Based on age, sex, height, weight, and activity level
- **Resting Calories**: Automatic calculation of calories burned throughout the day
- **Exercise Logging**: Choose from 30+ exercises with scientifically-based MET values
- **Duration & Intensity**: Log exercise duration for accurate calorie burn estimates
- **Workout Import**: Import workout history from Strava, Apple Health, Garmin, Google Fit (with legal disclaimers)

### Dashboard
- **Big Net Calorie Display**: See your net calories at a glance
- **Color Coding**: Green (under goal), yellow (close), red (over)
- **Daily Breakdown**: View calories eaten, resting burn, and exercise burn
- **Goal Setting**: Set and adjust your daily calorie goal

### Trends
- **Weekly & Monthly Charts**: Visualize your progress over time
- **7-Day Rolling Average**: Smooth out daily fluctuations
- **Calories In vs Out**: Compare consumption to expenditure
- **Weight Tracking**: Optional weight logging with trend visualization

### Design
- **Mobile-First**: Optimized for phone use
- **Large Touch Targets**: Easy to tap buttons and controls
- **Dark Mode**: Toggle between light and dark themes
- **PWA**: Install on your home screen like a native app

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Open Food Facts API** - Free food database (no API key needed)
- **html5-qrcode** - Barcode scanning
- **localStorage** - Data persistence (all data stored locally)
- **PWA** - Progressive Web App support
- **Vercel Analytics** - Anonymous usage analytics (no personal data sent)

## Getting Started

### Prerequisites

- Node.js 16+ installed on your computer
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The terminal will show a URL (usually `http://localhost:5173`)
   - Open that URL in your browser
   - The app will open and guide you through initial setup

4. **For mobile testing:**
   - Find your computer's local IP address
   - On the same WiFi network, visit `http://YOUR_IP:5173` on your phone
   - This allows you to test the camera/barcode scanner

### Building for Production

```bash
npm run build
```

This creates optimized files in the `dist` folder ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## PWA Installation

### On Mobile (iOS/Android):
1. Open the app in your mobile browser
2. Tap the browser menu (⋮ or share icon)
3. Select "Add to Home Screen" or "Install App"
4. The app will appear on your home screen like a native app

### On Desktop:
1. Look for the install icon in your browser's address bar
2. Click to install
3. The app will open in its own window

## Customization

### Icons
The app currently uses placeholder PWA icons. To create proper icons:
1. Create a 512x512 PNG logo
2. Use https://realfavicongenerator.net/ to generate all sizes
3. Replace files in the `/public` folder

### Daily Calorie Goal
- Set your goal in the Dashboard by clicking "Edit" next to the goal display
- Default is 2000 calories

### Profile Updates
- Update your weight, activity level, and other details in Settings
- BMR and TDEE are automatically recalculated

## Data Storage & Privacy

All your personal data is stored locally in your browser's localStorage:
- No account required
- Your food logs, weight, and exercise data never leave your device
- Data persists between sessions
- Clearing browser data will delete your logs

**Analytics:** This app uses Vercel Analytics to collect anonymous usage statistics (page views, feature usage) to help improve the app. This data is aggregated and does not identify individual users. No personal information (food logs, weight, etc.) is sent to analytics. See our [Privacy Policy](/privacy-policy.html) for details.

**External APIs:**
- Open Food Facts API - Used only for food database searches when you search for foods
- No tracking or user data is sent to Open Food Facts

## Offline Support

- App works offline after first visit (PWA caching)
- Food database searches require internet connection
- All logged data is stored locally and accessible offline

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with camera access for barcode scanning

## Troubleshooting

### Barcode scanner not working:
- Ensure browser has camera permission
- Use HTTPS or localhost (cameras don't work on HTTP)
- Try a different browser

### Food search returns no results:
- Check internet connection
- Try simpler search terms (e.g., "apple" instead of "granny smith apple")
- Some foods may not be in the Open Food Facts database

### Data disappeared:
- Check if browser data was cleared
- Ensure you're using the same browser and device
- Data is stored per-browser (not synced across devices)

## License

Free to use and modify for personal projects.

## Credits

- Food data from [Open Food Facts](https://world.openfoodfacts.org/) (open database)
- MET values from [Compendium of Physical Activities](https://sites.google.com/site/compendiumofphysicalactivities/)
- BMR calculation using Mifflin-St Jeor Equation
