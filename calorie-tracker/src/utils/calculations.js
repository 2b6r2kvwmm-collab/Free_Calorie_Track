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
  {"name":"Walking (slow, 2 mph)","met":2.5,"category":"Walking","speed":"2mph"},
  {"name":"Walking (moderate, 3 mph)","met":3.5,"category":"Walking","speed":"3mph"},
  {"name":"Walking (brisk, 4 mph)","met":5,"category":"Walking","speed":"4mph"},
  {"name":"Hiking (flat terrain)","met":4.5,"category":"Outdoor"},
  {"name":"Hiking (hills)","met":6.5,"category":"Outdoor"},
  {"name":"Backpacking","met":7,"category":"Outdoor"},
  {"name":"Trail Running","met":9,"category":"Outdoor"},
  {"name":"Running","met":8.3,"category":"Running","requiresDistance":true},
  {"name":"Jogging","met":7,"category":"Running"},
  {"name":"Sprinting","met":16,"category":"Running"},
  {"name":"Treadmill Running","met":8.3,"category":"Running"},
  {"name":"Cycling","met":6.8,"category":"Cycling","requiresDistance":true},
  {"name":"Stationary Bike","met":6.8,"category":"Cycling"},
  {"name":"Mountain Biking","met":8.5,"category":"Cycling"},
  {"name":"Spinning Class","met":8.5,"category":"Cycling"},
  {"name":"Swimming (freestyle)","met":8.3,"category":"Swimming"},
  {"name":"Swimming (breaststroke)","met":10,"category":"Swimming"},
  {"name":"Swimming (backstroke)","met":7,"category":"Swimming"},
  {"name":"Swimming (butterfly)","met":13.8,"category":"Swimming"},
  {"name":"Water Aerobics","met":4,"category":"Swimming"},
  {"name":"Treading Water","met":3.5,"category":"Swimming"},
  {"name":"Squats (barbell)","met":5.5,"category":"Weightlifting"},
  {"name":"Deadlifts","met":5.5,"category":"Weightlifting"},
  {"name":"Bench Press","met":5.5,"category":"Weightlifting"},
  {"name":"Overhead Press","met":5,"category":"Weightlifting"},
  {"name":"Barbell Rows","met":5,"category":"Weightlifting"},
  {"name":"Power Cleans","met":6,"category":"Weightlifting"},
  {"name":"Front Squats","met":5.5,"category":"Weightlifting"},
  {"name":"Sumo Deadlifts","met":5.5,"category":"Weightlifting"},
  {"name":"Incline Bench Press","met":5,"category":"Weightlifting"},
  {"name":"Decline Bench Press","met":5,"category":"Weightlifting"},
  {"name":"Clean and Jerk","met":6,"category":"Weightlifting"},
  {"name":"Snatch","met":6,"category":"Weightlifting"},
  {"name":"Pull-ups","met":5.5,"category":"Weightlifting"},
  {"name":"Chin-ups","met":5.5,"category":"Weightlifting"},
  {"name":"Dumbbell Bench Press","met":5,"category":"Weightlifting"},
  {"name":"Dumbbell Shoulder Press","met":5,"category":"Weightlifting"},
  {"name":"Dumbbell Rows","met":4.5,"category":"Weightlifting"},
  {"name":"Lat Pulldowns","met":4,"category":"Weightlifting"},
  {"name":"Cable Rows","met":4,"category":"Weightlifting"},
  {"name":"Dips","met":5,"category":"Weightlifting"},
  {"name":"Chest Flyes","met":3.5,"category":"Weightlifting"},
  {"name":"Pec Deck","met":3.5,"category":"Weightlifting"},
  {"name":"Cable Crossovers","met":3.5,"category":"Weightlifting"},
  {"name":"T-Bar Rows","met":5,"category":"Weightlifting"},
  {"name":"Pendlay Rows","met":5,"category":"Weightlifting"},
  {"name":"Bent Over Rows","met":5,"category":"Weightlifting"},
  {"name":"Lunges (weighted)","met":5,"category":"Weightlifting"},
  {"name":"Walking Lunges","met":5,"category":"Weightlifting"},
  {"name":"Leg Press","met":5,"category":"Weightlifting"},
  {"name":"Romanian Deadlifts","met":5.5,"category":"Weightlifting"},
  {"name":"Leg Curls","met":3.5,"category":"Weightlifting"},
  {"name":"Leg Extensions","met":3.5,"category":"Weightlifting"},
  {"name":"Calf Raises","met":3.5,"category":"Weightlifting"},
  {"name":"Bulgarian Split Squats","met":5,"category":"Weightlifting"},
  {"name":"Goblet Squats","met":5,"category":"Weightlifting"},
  {"name":"Hack Squats","met":5,"category":"Weightlifting"},
  {"name":"Hip Thrusts","met":4.5,"category":"Weightlifting"},
  {"name":"Glute Bridges","met":4,"category":"Weightlifting"},
  {"name":"Bicep Curls","met":3,"category":"Weightlifting"},
  {"name":"Hammer Curls","met":3,"category":"Weightlifting"},
  {"name":"Preacher Curls","met":3,"category":"Weightlifting"},
  {"name":"Tricep Extensions","met":3,"category":"Weightlifting"},
  {"name":"Tricep Pushdowns","met":3,"category":"Weightlifting"},
  {"name":"Skull Crushers","met":3.5,"category":"Weightlifting"},
  {"name":"Lateral Raises","met":3.5,"category":"Weightlifting"},
  {"name":"Front Raises","met":3.5,"category":"Weightlifting"},
  {"name":"Rear Delt Flyes","met":3.5,"category":"Weightlifting"},
  {"name":"Face Pulls","met":3.5,"category":"Weightlifting"},
  {"name":"Shrugs","met":3.5,"category":"Weightlifting"},
  {"name":"Cable Flyes","met":3.5,"category":"Weightlifting"},
  {"name":"Wrist Curls","met":2.5,"category":"Weightlifting"},
  {"name":"Farmer's Walks","met":5,"category":"Weightlifting"},
  {"name":"Push-ups","met":3.8,"category":"Bodyweight"},
  {"name":"Burpees","met":8,"category":"Bodyweight"},
  {"name":"Mountain Climbers","met":8,"category":"Bodyweight"},
  {"name":"Planks","met":3,"category":"Bodyweight"},
  {"name":"Side Planks","met":3,"category":"Bodyweight"},
  {"name":"Air Squats","met":5,"category":"Bodyweight"},
  {"name":"Lunges (bodyweight)","met":4,"category":"Bodyweight"},
  {"name":"Jumping Jacks","met":7.3,"category":"Bodyweight"},
  {"name":"High Knees","met":8,"category":"Bodyweight"},
  {"name":"Box Jumps","met":8,"category":"Bodyweight"},
  {"name":"Step-ups","met":6,"category":"Bodyweight"},
  {"name":"Bear Crawls","met":7,"category":"Bodyweight"},
  {"name":"Crab Walks","met":5,"category":"Bodyweight"},
  {"name":"Wall Sits","met":3.5,"category":"Bodyweight"},
  {"name":"Bicycle Crunches","met":4,"category":"Bodyweight"},
  {"name":"Sit-ups","met":3.8,"category":"Bodyweight"},
  {"name":"Crunches","met":3.5,"category":"Bodyweight"},
  {"name":"Leg Raises","met":4,"category":"Bodyweight"},
  {"name":"Russian Twists","met":4,"category":"Bodyweight"},
  {"name":"V-ups","met":4.5,"category":"Bodyweight"},
  {"name":"Flutter Kicks","met":4,"category":"Bodyweight"},
  {"name":"Superman Holds","met":3,"category":"Bodyweight"},
  {"name":"Elliptical","met":5,"category":"Cardio"},
  {"name":"Rowing Machine","met":7,"category":"Cardio"},
  {"name":"StairMaster","met":8.8,"category":"Cardio"},
  {"name":"Stair Climbing","met":8.8,"category":"Cardio"},
  {"name":"Jump Rope","met":12.3,"category":"Cardio"},
  {"name":"VersaClimber","met":9,"category":"Cardio"},
  {"name":"Assault Bike","met":10,"category":"Cardio"},
  {"name":"SkiErg","met":9,"category":"Cardio"},
  {"name":"HIIT (High Intensity Interval Training)","met":8,"category":"HIIT"},
  {"name":"Tabata","met":12,"category":"HIIT"},
  {"name":"CrossFit","met":8,"category":"HIIT"},
  {"name":"Circuit Training","met":6,"category":"Strength"},
  {"name":"Bootcamp Class","met":7,"category":"HIIT"},
  {"name":"Yoga (Hatha)","met":2.5,"category":"Flexibility"},
  {"name":"Yoga (Vinyasa)","met":4,"category":"Flexibility"},
  {"name":"Yoga (Power)","met":4,"category":"Flexibility"},
  {"name":"Yoga (Hot/Bikram)","met":5,"category":"Flexibility"},
  {"name":"Yoga (Restorative)","met":2,"category":"Flexibility"},
  {"name":"Yoga (Ashtanga)","met":4.5,"category":"Flexibility"},
  {"name":"Pilates","met":3,"category":"Flexibility"},
  {"name":"Pilates (Reformer)","met":4,"category":"Flexibility"},
  {"name":"Tai Chi","met":3,"category":"Flexibility"},
  {"name":"Stretching","met":2.3,"category":"Flexibility"},
  {"name":"Foam Rolling","met":2,"category":"Flexibility"},
  {"name":"Meditation (Seated)","met":1,"category":"Flexibility"},
  {"name":"Dancing (ballroom)","met":3,"category":"Dancing"},
  {"name":"Dancing (aerobic)","met":7.3,"category":"Dancing"},
  {"name":"Zumba","met":6.5,"category":"Dancing"},
  {"name":"Dancing (ballet)","met":4.8,"category":"Dancing"},
  {"name":"Dancing (hip-hop)","met":5,"category":"Dancing"},
  {"name":"Dancing (jazz)","met":4.8,"category":"Dancing"},
  {"name":"Salsa Dancing","met":4.5,"category":"Dancing"},
  {"name":"Swing Dancing","met":5.5,"category":"Dancing"},
  {"name":"Skiing (downhill)","met":5.3,"category":"Winter Sports"},
  {"name":"Cross-country Skiing","met":9,"category":"Winter Sports"},
  {"name":"Snowboarding","met":5.3,"category":"Winter Sports"},
  {"name":"Ice Skating","met":5.5,"category":"Winter Sports"},
  {"name":"Snowshoeing","met":8,"category":"Winter Sports"},
  {"name":"Sledding","met":7,"category":"Winter Sports"},
  {"name":"Ice Hockey","met":8,"category":"Winter Sports"},
  {"name":"Shoveling Snow","met":5.3,"category":"Winter Sports"},
  {"name":"Figure Skating","met":7,"category":"Winter Sports"},
  {"name":"Speed Skating","met":9,"category":"Winter Sports"},
  {"name":"Basketball (game)","met":8,"category":"Sports"},
  {"name":"Basketball (shooting around)","met":4.5,"category":"Sports"},
  {"name":"Soccer","met":7,"category":"Sports"},
  {"name":"Football","met":8,"category":"Sports"},
  {"name":"Baseball/Softball","met":5,"category":"Sports"},
  {"name":"Volleyball","met":3,"category":"Sports"},
  {"name":"Hockey (field)","met":8,"category":"Sports"},
  {"name":"Lacrosse","met":8,"category":"Sports"},
  {"name":"Ultimate Frisbee","met":5.5,"category":"Sports"},
  {"name":"Rugby","met":10,"category":"Sports"},
  {"name":"Water Polo","met":10,"category":"Sports"},
  {"name":"Tennis (singles)","met":8,"category":"Sports"},
  {"name":"Tennis (doubles)","met":6,"category":"Sports"},
  {"name":"Racquetball","met":7,"category":"Sports"},
  {"name":"Squash","met":12,"category":"Sports"},
  {"name":"Badminton","met":4.5,"category":"Sports"},
  {"name":"Pickleball","met":4,"category":"Sports"},
  {"name":"Table Tennis","met":4,"category":"Sports"},
  {"name":"Golf (walking with clubs)","met":4.8,"category":"Sports"},
  {"name":"Golf (using cart)","met":3.5,"category":"Sports"},
  {"name":"Disc Golf","met":4,"category":"Sports"},
  {"name":"Bowling","met":3,"category":"Sports"},
  {"name":"Karate","met":10,"category":"Martial Arts"},
  {"name":"Taekwondo","met":10,"category":"Martial Arts"},
  {"name":"Judo","met":10,"category":"Martial Arts"},
  {"name":"Jiu-Jitsu","met":10,"category":"Martial Arts"},
  {"name":"Kickboxing","met":10,"category":"Martial Arts"},
  {"name":"Boxing (sparring)","met":7.8,"category":"Martial Arts"},
  {"name":"Boxing (bag work)","met":5.5,"category":"Martial Arts"},
  {"name":"Muay Thai","met":10,"category":"Martial Arts"},
  {"name":"MMA Training","met":10,"category":"Martial Arts"},
  {"name":"Wrestling","met":6,"category":"Martial Arts"},
  {"name":"Surfing","met":3,"category":"Water Sports"},
  {"name":"Paddleboarding","met":6,"category":"Water Sports"},
  {"name":"Kayaking","met":5,"category":"Water Sports"},
  {"name":"Canoeing","met":3.5,"category":"Water Sports"},
  {"name":"Rowing","met":7,"category":"Water Sports"},
  {"name":"Water Skiing","met":6,"category":"Water Sports"},
  {"name":"Wakeboarding","met":6,"category":"Water Sports"},
  {"name":"Jet Skiing","met":4,"category":"Water Sports"},
  {"name":"Snorkeling","met":5,"category":"Water Sports"},
  {"name":"Scuba Diving","met":7,"category":"Water Sports"},
  {"name":"Rock Climbing (indoor)","met":8,"category":"Outdoor"},
  {"name":"Rock Climbing (outdoor)","met":8,"category":"Outdoor"},
  {"name":"Bouldering","met":8,"category":"Outdoor"},
  {"name":"Horseback Riding","met":4,"category":"Outdoor"},
  {"name":"Fishing (from boat)","met":2.5,"category":"Outdoor"},
  {"name":"Fishing (wade/stream)","met":6,"category":"Outdoor"},
  {"name":"Hunting","met":5,"category":"Outdoor"},
  {"name":"Camping","met":3.5,"category":"Outdoor"},
  {"name":"Mowing Lawn (push mower)","met":5.5,"category":"Household"},
  {"name":"Mowing Lawn (riding mower)","met":2.5,"category":"Household"},
  {"name":"Raking Leaves","met":4,"category":"Household"},
  {"name":"Gardening","met":3.5,"category":"Household"},
  {"name":"Weeding","met":4.5,"category":"Household"},
  {"name":"Digging","met":5,"category":"Household"},
  {"name":"Chopping Wood","met":6,"category":"Household"},
  {"name":"Carrying/Stacking Wood","met":5.5,"category":"Household"},
  {"name":"House Cleaning (general)","met":3.5,"category":"Household"},
  {"name":"Vacuuming","met":3.5,"category":"Household"},
  {"name":"Mopping Floors","met":3.5,"category":"Household"},
  {"name":"Washing Car","met":3,"category":"Household"},
  {"name":"Painting (house)","met":4.5,"category":"Household"},
  {"name":"Carpentry","met":6,"category":"Household"},
  {"name":"Moving Furniture","met":6,"category":"Household"},
  {"name":"Carrying Boxes (up stairs)","met":8,"category":"Household"},
  {"name":"Playing with Kids (moderate)","met":3.5,"category":"Recreational"},
  {"name":"Playing with Kids (vigorous)","met":5.8,"category":"Recreational"},
  {"name":"Walking Dog","met":3,"category":"Recreational"},
  {"name":"Frisbee (casual)","met":3,"category":"Recreational"},
  {"name":"Skateboarding","met":5,"category":"Recreational"},
  {"name":"Rollerblading","met":7,"category":"Recreational"},
  {"name":"Roller Skating","met":7,"category":"Recreational"},
  {"name":"Trampoline Jumping","met":4.5,"category":"Recreational"},
  {"name":"Hula Hooping","met":4,"category":"Recreational"},
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
