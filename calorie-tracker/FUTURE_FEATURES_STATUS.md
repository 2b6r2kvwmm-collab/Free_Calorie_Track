# Future Features - Implementation Status

This document tracks fully implemented features that are ready for deployment but not yet released.

---

## 🔄 Workout Import Feature

**Status:** ✅ **FULLY IMPLEMENTED - READY FOR DEPLOYMENT**

**Implementation Date:** February 7, 2025

**Decision:** Set aside for future deployment pending legal/risk assessment

### What's Built:

✅ Complete workout file parser (CSV, JSON, GPX, XML, TCX)
✅ Strava, Apple Health, Garmin, Google Fit support
✅ Comprehensive legal disclaimer modal (mandatory acceptance)
✅ Import instructions modal with export guides
✅ Preview screen with accuracy warnings
✅ All legal mitigations implemented
✅ Documentation complete (`WORKOUT_IMPORT_FEATURE.md`)
✅ Build verified successful

### Legal Mitigations Included:

- Mandatory legal disclaimer (cannot bypass)
- Accuracy warnings (3 places: disclaimer, instructions, preview)
- Storage warnings (unencrypted localStorage)
- Third-party terms compliance reminder
- Medical disclaimer
- Limitation of liability

### To Deploy:

1. Read `WORKOUT_IMPORT_FEATURE.md` for full deployment checklist
2. Test with real export files from Strava/Apple Health/Garmin
3. Optional: Legal review of disclaimer wording
4. Optional: Consider liability insurance
5. Update Privacy Policy to mention import feature
6. Commit changes to git
7. Deploy to production

### Files Included:

**New:**
- `src/components/ImportDisclaimerModal.jsx`
- `src/utils/workoutParser.js`
- `src/components/ImportInstructionsModal.jsx`
- `src/components/WorkoutImporter.jsx`
- `WORKOUT_IMPORT_FEATURE.md`

**Modified:**
- `src/utils/storage.js`
- `src/components/ExerciseLog.jsx`
- `README.md`

### Why Not Deployed Yet:

Awaiting decision on risk tolerance:
- Feature increases legal liability (handling comprehensive health data)
- Strong mitigations implemented, but some residual risk remains
- User decision whether benefit outweighs legal considerations

### Future Options:

1. **Deploy as-is** with all legal mitigations (recommended)
2. **Get legal review** before deployment (conservative)
3. **Don't deploy** - keep manual logging only (safest)
4. **Limited release** - beta test with small group first

---

## 📋 Voice Input with LLM Parsing

**Status:** 🟡 **RESEARCHED - NOT IMPLEMENTED**

**Research Date:** February 7, 2025

**Decision:** Documented for future consideration

### What Would Be Built:

- Web Speech API for voice-to-text
- Gemini Flash/GPT-4o-mini for parsing natural language
- "Log a salad with 1 cup arugula, 2 eggs, 2 tbsp pistachios" → auto-creates recipe
- For missing foods: LLM estimates nutrition (user confirms)

### Cost Analysis:

- $0.0001-0.0005 per request
- ~$1-5/month for 1000 active users (10 voice logs/month)
- Affordable for donation-supported app

### Feasibility:

✅ Technically feasible
✅ Cost acceptable
⚠️ Requires serverless function (Vercel/Netlify)
⚠️ API key management needed

### Why Not Implemented:

- Feature prioritization - import took precedence
- Requires backend infrastructure (serverless)
- Can implement later if demand exists

---

## 📷 OCR for Nutrition Labels

**Status:** 🟡 **RESEARCHED - NOT IMPLEMENTED**

**Research Date:** February 7, 2025

**Decision:** Documented for future consideration

### What Would Be Built:

- Tesseract.js OCR (free, client-side)
- Photo nutrition label → auto-fill Custom Food form
- Use case: Packaged foods not in Open Food Facts

### Feasibility:

✅ Technically feasible
✅ Completely free ($0 cost)
✅ Privacy-preserving (client-side)
⚠️ Tesseract.js adds ~60KB gzipped

### Why Not Implemented:

- Barcode scanner already covers most packaged foods
- OCR accuracy concerns (parsing structured text)
- Bundle size consideration
- Lower priority than import feature

---

## 📝 Notes for Future Features

### Before Implementing New Features:

1. ✅ Assess legal implications (health data = higher scrutiny)
2. ✅ Implement appropriate disclaimers/mitigations
3. ✅ Document thoroughly before deploying
4. ✅ Consider impact on bundle size
5. ✅ Test on mobile devices (primary use case)
6. ✅ Verify PWA offline functionality maintained

### Guiding Principles:

- **Privacy first:** Keep data local whenever possible
- **Legal protection:** Add disclaimers for health-related features
- **Simple UX:** Don't overwhelm users with features
- **Free forever:** Avoid features requiring expensive APIs
- **Mobile-first:** Test on phones before deploying

---

**Last Updated:** February 7, 2025
