# Calorie Tracker

A simple, mobile-first web app for tracking NET calories (food eaten minus calories burned).

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

### Dashboard
- **Big NET Calorie Display**: See your net calories at a glance
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

## Data Storage

All data is stored locally in your browser's localStorage:
- No account required
- No data sent to servers (except Open Food Facts API searches)
- Data persists between sessions
- Clearing browser data will delete your logs

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
