// Calculate BMR using Mifflin-St Jeor Equation
export function calculateBMR(profile) {
  const { weight, height, age, sex } = profile;

  // weight in kg, height in cm
  const bmr = (10 * weight) + (6.25 * height) - (5 * age);

  if (sex === 'male') {
    return bmr + 5;
  } else {
    return bmr - 161;
  }
}

// Calculate TDEE (Total Daily Energy Expenditure)
// Note: Activity level reflects daily lifestyle activity (NEAT), NOT planned exercise
// Planned exercise should be logged separately to avoid double-counting
export function calculateTDEE(bmr, activityLevel) {
  const activityMultipliers = {
    sedentary: 1.2,      // Desk job, mostly sitting
    light: 1.375,        // Light activity (teacher, salesperson, light daily tasks)
    moderate: 1.55,      // Moderate activity (nurse, light construction, on feet most of day)
    active: 1.725,       // Very active job (heavy construction, athlete, farm work)
    veryActive: 1.9      // Extremely active (professional athlete, very physical job)
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
}

// Get baseline resting calories (sedentary TDEE to avoid double-counting exercise)
export function getBaselineTDEE(bmr) {
  return Math.round(bmr * 1.2); // Sedentary multiplier
}

// MET (Metabolic Equivalent of Task) values for common exercises
export const exercises = [
  { name: 'Walking (slow, 2 mph)', met: 2.5, category: 'Walking', speed: '2mph' },
  { name: 'Walking (moderate, 3 mph)', met: 3.5, category: 'Walking', speed: '3mph' },
  { name: 'Walking (brisk, 4 mph)', met: 5.0, category: 'Walking', speed: '4mph' },
  { name: 'Running', met: 8.3, category: 'Running', requiresDistance: true },
  { name: 'Cycling', met: 6.8, category: 'Cycling', requiresDistance: true },
  { name: 'Swimming (light)', met: 6.0, category: 'Swimming' },
  { name: 'Swimming (moderate)', met: 8.3, category: 'Swimming' },
  { name: 'Swimming (vigorous)', met: 10.0, category: 'Swimming' },

  // Weightlifting - Compound Lifts
  { name: 'Squats (barbell, heavy)', met: 6.0, category: 'Weightlifting' },
  { name: 'Squats (barbell, moderate)', met: 5.0, category: 'Weightlifting' },
  { name: 'Deadlifts (heavy)', met: 6.0, category: 'Weightlifting' },
  { name: 'Deadlifts (moderate)', met: 5.0, category: 'Weightlifting' },
  { name: 'Bench Press (heavy)', met: 6.0, category: 'Weightlifting' },
  { name: 'Bench Press (moderate)', met: 5.0, category: 'Weightlifting' },
  { name: 'Overhead Press (barbell)', met: 5.0, category: 'Weightlifting' },
  { name: 'Barbell Rows', met: 5.0, category: 'Weightlifting' },
  { name: 'Power Cleans', met: 6.0, category: 'Weightlifting' },

  // Weightlifting - Upper Body
  { name: 'Pull-ups / Chin-ups', met: 5.5, category: 'Weightlifting' },
  { name: 'Dumbbell Press (chest)', met: 5.0, category: 'Weightlifting' },
  { name: 'Dumbbell Press (shoulder)', met: 5.0, category: 'Weightlifting' },
  { name: 'Dumbbell Rows', met: 4.5, category: 'Weightlifting' },
  { name: 'Lat Pulldowns', met: 4.0, category: 'Weightlifting' },
  { name: 'Cable Rows', met: 4.0, category: 'Weightlifting' },
  { name: 'Dips (weighted or bodyweight)', met: 5.0, category: 'Weightlifting' },

  // Weightlifting - Lower Body
  { name: 'Lunges (weighted)', met: 5.0, category: 'Weightlifting' },
  { name: 'Leg Press', met: 5.0, category: 'Weightlifting' },
  { name: 'Romanian Deadlifts', met: 5.5, category: 'Weightlifting' },
  { name: 'Leg Curls', met: 3.5, category: 'Weightlifting' },
  { name: 'Leg Extensions', met: 3.5, category: 'Weightlifting' },
  { name: 'Calf Raises', met: 3.5, category: 'Weightlifting' },

  // Weightlifting - Isolation & Accessories
  { name: 'Bicep Curls', met: 3.0, category: 'Weightlifting' },
  { name: 'Tricep Extensions', met: 3.0, category: 'Weightlifting' },
  { name: 'Lateral Raises', met: 3.5, category: 'Weightlifting' },
  { name: 'Face Pulls', met: 3.5, category: 'Weightlifting' },
  { name: 'Shrugs', met: 3.5, category: 'Weightlifting' },
  { name: 'Cable Flyes', met: 3.5, category: 'Weightlifting' },

  // Bodyweight Exercises
  { name: 'Push-ups', met: 3.8, category: 'Bodyweight' },
  { name: 'Burpees', met: 8.0, category: 'Bodyweight' },
  { name: 'Mountain Climbers', met: 8.0, category: 'Bodyweight' },
  { name: 'Planks', met: 3.0, category: 'Bodyweight' },
  { name: 'Air Squats', met: 5.0, category: 'Bodyweight' },
  { name: 'Lunges (bodyweight)', met: 4.0, category: 'Bodyweight' },

  // General Strength Training
  { name: 'Weight Training (light circuit)', met: 3.0, category: 'Strength' },
  { name: 'Weight Training (moderate)', met: 5.0, category: 'Strength' },
  { name: 'Weight Training (vigorous)', met: 6.0, category: 'Strength' },
  { name: 'CrossFit / HIIT Weightlifting', met: 8.0, category: 'Strength' },

  { name: 'Yoga (Hatha)', met: 2.5, category: 'Flexibility' },
  { name: 'Yoga (Power)', met: 4.0, category: 'Flexibility' },
  { name: 'Pilates', met: 3.0, category: 'Flexibility' },
  { name: 'Dancing (ballroom)', met: 3.0, category: 'Dancing' },
  { name: 'Dancing (aerobic)', met: 7.3, category: 'Dancing' },
  { name: 'Elliptical (moderate)', met: 5.0, category: 'Cardio' },
  { name: 'Rowing (moderate)', met: 7.0, category: 'Cardio' },
  { name: 'Jump Rope', met: 12.3, category: 'Cardio' },
  { name: 'Stair Climbing', met: 8.8, category: 'Cardio' },
  { name: 'Hiking (hills)', met: 6.5, category: 'Outdoor' },
  { name: 'Rock Climbing', met: 8.0, category: 'Outdoor' },

  // Winter Sports
  { name: 'Skiing (downhill, moderate)', met: 5.3, category: 'Winter Sports' },
  { name: 'Skiing (downhill, vigorous)', met: 8.0, category: 'Winter Sports' },
  { name: 'Cross-country Skiing (light)', met: 7.0, category: 'Winter Sports' },
  { name: 'Cross-country Skiing (moderate)', met: 9.0, category: 'Winter Sports' },
  { name: 'Cross-country Skiing (vigorous)', met: 14.0, category: 'Winter Sports' },
  { name: 'Snowboarding (moderate)', met: 5.3, category: 'Winter Sports' },
  { name: 'Snowboarding (vigorous)', met: 8.0, category: 'Winter Sports' },
  { name: 'Ice Skating (recreational)', met: 5.5, category: 'Winter Sports' },
  { name: 'Ice Skating (vigorous)', met: 9.0, category: 'Winter Sports' },
  { name: 'Snowshoeing', met: 8.0, category: 'Winter Sports' },
  { name: 'Sledding/Tobogganing', met: 7.0, category: 'Winter Sports' },
  { name: 'Ice Hockey', met: 8.0, category: 'Winter Sports' },
  { name: 'Shoveling Snow (moderate)', met: 5.3, category: 'Winter Sports' },
  { name: 'Shoveling Snow (vigorous)', met: 7.5, category: 'Winter Sports' },

  // Sports
  { name: 'Basketball (game)', met: 8.0, category: 'Sports' },
  { name: 'Basketball (shooting around)', met: 4.5, category: 'Sports' },
  { name: 'Soccer (casual)', met: 7.0, category: 'Sports' },
  { name: 'Soccer (competitive)', met: 10.0, category: 'Sports' },
  { name: 'Tennis (singles)', met: 8.0, category: 'Sports' },
  { name: 'Tennis (doubles)', met: 6.0, category: 'Sports' },
  { name: 'Golf (walking, carrying clubs)', met: 4.8, category: 'Sports' },
  { name: 'Golf (walking, pulling cart)', met: 4.3, category: 'Sports' },
  { name: 'Golf (using cart)', met: 3.5, category: 'Sports' },
  { name: 'Volleyball (casual)', met: 3.0, category: 'Sports' },
  { name: 'Volleyball (competitive)', met: 6.0, category: 'Sports' },
  { name: 'Racquetball', met: 7.0, category: 'Sports' },
  { name: 'Squash', met: 12.0, category: 'Sports' },
  { name: 'Badminton (casual)', met: 4.5, category: 'Sports' },
  { name: 'Badminton (competitive)', met: 7.0, category: 'Sports' },
  { name: 'Pickleball (casual)', met: 4.0, category: 'Sports' },
  { name: 'Pickleball (competitive)', met: 6.0, category: 'Sports' },
  { name: 'Table Tennis', met: 4.0, category: 'Sports' },
  { name: 'Baseball/Softball (fielding)', met: 5.0, category: 'Sports' },
  { name: 'Football (casual)', met: 8.0, category: 'Sports' },
  { name: 'Football (competitive)', met: 9.0, category: 'Sports' },
  { name: 'Hockey (ice/field)', met: 8.0, category: 'Sports' },
  { name: 'Lacrosse', met: 8.0, category: 'Sports' },
  { name: 'Ultimate Frisbee', met: 5.5, category: 'Sports' },
  { name: 'Disc Golf', met: 4.0, category: 'Sports' },
  { name: 'Bowling', met: 3.0, category: 'Sports' },
  { name: 'Martial Arts (moderate)', met: 5.3, category: 'Sports' },
  { name: 'Boxing (sparring)', met: 7.8, category: 'Sports' },
  { name: 'Boxing (punching bag)', met: 5.5, category: 'Sports' },
];

// Calculate calories burned from exercise
// weight in kg, duration in minutes
export function calculateExerciseCalories(weight, met, duration) {
  return Math.round((met * weight * duration) / 60);
}

// Calculate resting calories burned throughout the day (based on time of day)
export function calculateRestingCaloriesBurned(tdee) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minutesElapsed = (now - startOfDay) / 1000 / 60;
  const minutesInDay = 24 * 60;

  return Math.round((tdee * minutesElapsed) / minutesInDay);
}

// Calculate adjusted MET for walking with weighted vest
export function calculateWeightedVestMET(baseMET, speed, vestWeight) {
  // MET adjustments based on vest weight and walking speed
  const adjustments = {
    '2mph': { '10-15': 0.5, '20': 0.8, '30': 1.2, '40+': 1.5 },
    '3mph': { '10-15': 0.8, '20': 1.2, '30': 1.8, '40+': 2.0 },
    '4mph': { '10-15': 1.3, '20': 1.7, '30': 2.3, '40+': 2.5 },
  };

  const adjustment = adjustments[speed]?.[vestWeight] || 0;
  return baseMET + adjustment;
}

// Calculate MET value for running based on pace (mph)
export function getRunningMET(mph) {
  if (mph <= 4) return 6.0;
  if (mph <= 5) return 8.3;
  if (mph <= 6) return 9.8;
  if (mph <= 7) return 11.0;
  if (mph <= 8) return 11.8;
  if (mph <= 9) return 12.8;
  if (mph <= 10) return 14.5;
  return 16.0; // 10+ mph
}

// Calculate MET value for cycling based on pace (mph)
export function getCyclingMET(mph) {
  if (mph < 10) return 4.0;
  if (mph < 12) return 6.8;
  if (mph < 14) return 8.0;
  if (mph < 16) return 10.0;
  if (mph < 20) return 12.0;
  return 15.8; // 20+ mph
}

// Calculate pace in mph from distance and duration
export function calculatePace(distance, duration, unit = 'miles') {
  // distance in miles or km, duration in minutes
  const distanceInMiles = unit === 'km' ? distance * 0.621371 : distance;
  const hours = duration / 60;
  return distanceInMiles / hours;
}
