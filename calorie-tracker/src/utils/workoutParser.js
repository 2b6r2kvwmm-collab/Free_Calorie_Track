// Workout file parser for CSV, JSON, GPX, XML, TCX formats
import { getLocalDateString } from './storage';

/**
 * Parse workout file and return array of standardized workout objects
 * @param {File} file - The uploaded file
 * @returns {Promise<Array>} - Array of {name, duration, calories, date, distance?}
 */
export async function parseWorkoutFile(file) {
  try {
    const text = await file.text();
    const fileName = file.name.toLowerCase();

    console.log(`Attempting to parse workout file: ${fileName} (${text.length} chars)`);

    let workouts = [];

    // Detect format by extension and content
    if (fileName.endsWith('.csv')) {
      workouts = parseCSV(text);
    } else if (fileName.endsWith('.json')) {
      workouts = parseJSON(text);
    } else if (fileName.endsWith('.gpx')) {
      workouts = parseGPX(text);
    } else if (fileName.endsWith('.xml')) {
      // Could be Apple Health XML or GPX
      if (text.includes('<HealthData>') || text.includes('apple.com/health')) {
        workouts = parseAppleHealth(text);
      } else if (text.includes('<gpx')) {
        workouts = parseGPX(text);
      } else {
        workouts = parseAppleHealth(text); // Default to Apple Health
      }
    } else if (fileName.endsWith('.tcx')) {
      workouts = parseTCX(text);
    } else {
      // Auto-detect based on content
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        workouts = parseJSON(text);
      } else if (text.includes('<gpx')) {
        workouts = parseGPX(text);
      } else if (text.includes('<HealthData>')) {
        workouts = parseAppleHealth(text);
      } else if (text.includes('<TrainingCenterDatabase')) {
        workouts = parseTCX(text);
      } else {
        // Try CSV as fallback
        workouts = parseCSV(text);
      }
    }

    console.log(`Successfully parsed ${workouts.length} workouts from ${fileName}`);

    // Log sample of first workout for debugging
    if (workouts.length > 0) {
      console.log('Sample workout:', workouts[0]);
    }

    return workouts;
  } catch (error) {
    console.error('Critical error parsing workout file:', error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
}

/**
 * Parse CSV format (Strava, Garmin, generic exports)
 */
function parseCSV(text) {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Detect delimiter (comma or semicolon)
    const delimiter = lines[0].includes(';') && !lines[0].includes(',') ? ';' : ',';

    const headers = lines[0].toLowerCase().split(delimiter).map(h => h.trim().replace(/"/g, ''));
    const workouts = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i], delimiter);
        if (values.length < 2) continue;

        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.replace(/"/g, '').trim();
        });

        // Extract workout data with flexible field mapping (ACTUAL CONFIRMED FIELD NAMES)
        const workout = {
          name: findValue(row, [
            // Strava: "Activity Type", "Activity Name"
            'activity type', 'activity name', 'activitytype', 'activityname',
            // Garmin: "activity_type"
            'activity_type',
            // Generic
            'type', 'activity', 'exercise', 'name', 'workout type', 'workouttype', 'sport'
          ]) || 'Workout',
          duration: parseDuration(findValue(row, [
            // Strava: "Elapsed Time" (seconds), "Moving Time" (seconds)
            'elapsed time', 'elapsedtime', 'moving time', 'movingtime',
            // Garmin: "duration_min" (minutes)
            'duration_min', 'duration',
            // Generic
            'time', 'total time', 'totaltime', 'activity duration'
          ])),
          calories: parseInt(findValue(row, [
            // Strava/Garmin/Common: "Calories"
            'calories',
            // Alternatives
            'energy', 'kcal', 'kilocalories', 'cal',
            'calories burned', 'total calories', 'active calories'
          ]) || 0),
          date: parseDate(findValue(row, [
            // Strava: "Activity Date"
            'activity date', 'activitydate',
            // Garmin: "start_time"
            'start_time', 'starttime',
            // Generic
            'date', 'start time', 'timestamp', 'activity date',
            'start', 'begin time', 'created at', 'activity start time'
          ])),
          distance: parseDistance(findValue(row, [
            // Strava: "Distance" (meters)
            'distance',
            // Alternatives
            'total distance', 'totaldistance', 'total_distance'
          ])),
        };

        if (workout.duration > 0 || workout.calories > 0) {
          workouts.push(workout);
        }
      } catch (err) {
        console.warn('Error parsing CSV row:', err);
        // Continue to next row
      }
    }

    return workouts;
  } catch (err) {
    console.error('Error parsing CSV:', err);
    return [];
  }
}

/**
 * Helper: Find value from object using multiple possible keys
 */
function findValue(obj, keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return null;
}

/**
 * Parse CSV line handling quoted values with commas/semicolons
 */
function parseCSVLine(line, delimiter = ',') {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

/**
 * Parse JSON format (Google Fit, generic exports)
 */
function parseJSON(text) {
  try {
    const data = JSON.parse(text);
    const workouts = [];

    // Handle different JSON structures (more variations)
    let activities = [];
    if (Array.isArray(data)) {
      activities = data;
    } else if (data.activities) {
      activities = Array.isArray(data.activities) ? data.activities : [data.activities];
    } else if (data.workouts) {
      activities = Array.isArray(data.workouts) ? data.workouts : [data.workouts];
    } else if (data.sessions) {
      activities = Array.isArray(data.sessions) ? data.sessions : [data.sessions];
    } else if (data.data) {
      activities = Array.isArray(data.data) ? data.data : [data.data];
    } else if (data.results) {
      activities = Array.isArray(data.results) ? data.results : [data.results];
    }

    for (const activity of activities) {
      // Skip if not an object
      if (typeof activity !== 'object') continue;

      // Extract nested values if needed
      const getValue = (obj, paths) => {
        for (const path of paths) {
          const keys = path.split('.');
          let value = obj;
          for (const key of keys) {
            value = value?.[key];
            if (value === undefined) break;
          }
          if (value !== undefined && value !== null && value !== '') {
            return value;
          }
        }
        return null;
      };

      const workout = {
        name: getValue(activity, [
          'activityType', 'type', 'name', 'exercise', 'activity',
          'workoutActivityType', 'sport', 'activity_type',
          'metadata.activityType', 'workout.type'
        ]) || 'Workout',
        duration: parseDuration(getValue(activity, [
          'duration', 'durationMillis', 'time', 'activeTime',
          'elapsedTime', 'movingTime', 'totalTime',
          'metadata.duration', 'stats.duration'
        ])),
        calories: parseInt(getValue(activity, [
          'calories', 'energy', 'activeKilocalories', 'kcal',
          'totalCalories', 'energyBurned', 'caloriesBurned',
          'stats.calories', 'metadata.calories'
        ]) || 0),
        date: parseDate(getValue(activity, [
          'date', 'startTime', 'timestamp', 'start', 'created',
          'activityDate', 'startDate', 'start_time',
          'metadata.startTime', 'timestamp.start'
        ])),
        distance: parseDistance(getValue(activity, [
          'distance', 'totalDistance', 'distanceMeters',
          'stats.distance', 'metadata.distance'
        ])),
      };

      if (workout.duration > 0 || workout.calories > 0) {
        workouts.push(workout);
      }
    }

    return workouts;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
}

/**
 * Parse GPX format (GPS tracks)
 */
function parseGPX(text) {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const workouts = [];

    const tracks = xml.querySelectorAll('trk');
    tracks.forEach(track => {
      const name = track.querySelector('name')?.textContent || 'GPS Activity';
      const type = track.querySelector('type')?.textContent || '';

      // Calculate duration from track points
      const points = track.querySelectorAll('trkpt');
      let startTime = null;
      let endTime = null;
      let totalDistance = 0;

      if (points.length > 0) {
        const firstTime = points[0].querySelector('time')?.textContent;
        const lastTime = points[points.length - 1].querySelector('time')?.textContent;

        if (firstTime) startTime = new Date(firstTime);
        if (lastTime) endTime = new Date(lastTime);

        // Calculate distance between points (simplified)
        for (let i = 1; i < points.length; i++) {
          const lat1 = parseFloat(points[i-1].getAttribute('lat'));
          const lon1 = parseFloat(points[i-1].getAttribute('lon'));
          const lat2 = parseFloat(points[i].getAttribute('lat'));
          const lon2 = parseFloat(points[i].getAttribute('lon'));
          totalDistance += haversineDistance(lat1, lon1, lat2, lon2);
        }
      }

      const duration = startTime && endTime ? (endTime - startTime) / 1000 / 60 : 0;

      const workout = {
        name: type || name,
        duration: Math.round(duration),
        calories: estimateCalories(duration, totalDistance / 1000), // Convert m to km
        date: startTime ? getLocalDateString(startTime) : getLocalDateString(),
        distance: totalDistance > 0 ? (totalDistance / 1000).toFixed(2) : null,
      };

      if (workout.duration > 0) {
        workouts.push(workout);
      }
    });

    return workouts;
  } catch (error) {
    console.error('Error parsing GPX:', error);
    return [];
  }
}

/**
 * Parse Apple Health XML export
 * Schema confirmed from Apple Health export.xml DTD:
 * - workoutActivityType (REQUIRED): e.g., "HKWorkoutActivityTypeRunning"
 * - duration (IMPLIED): duration in minutes
 * - totalDistance (IMPLIED): distance in km or miles
 * - totalEnergyBurned (IMPLIED): calories burned
 * - startDate (REQUIRED): ISO date string
 * - endDate (REQUIRED): ISO date string
 */
function parseAppleHealth(text) {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const workouts = [];

    const workoutRecords = xml.querySelectorAll('Workout');
    workoutRecords.forEach(record => {
      // Using confirmed attribute names from Apple Health DTD
      const type = record.getAttribute('workoutActivityType') || 'Workout';
      const duration = parseFloat(record.getAttribute('duration')) || 0;
      const calories = parseFloat(record.getAttribute('totalEnergyBurned')) || 0;
      const startDate = record.getAttribute('startDate');
      const distance = parseFloat(record.getAttribute('totalDistance')) || null;

      // Convert Apple Health activity type names
      const activityName = convertAppleHealthActivityType(type);

      const workout = {
        name: activityName,
        duration: Math.round(duration),
        calories: Math.round(calories),
        date: startDate ? getLocalDateString(new Date(startDate)) : getLocalDateString(),
        distance: distance ? distance.toFixed(2) : null,
      };

      if (workout.duration > 0 || workout.calories > 0) {
        workouts.push(workout);
      }
    });

    return workouts;
  } catch (error) {
    console.error('Error parsing Apple Health XML:', error);
    return [];
  }
}

/**
 * Parse TCX format (Garmin)
 */
function parseTCX(text) {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const workouts = [];

    const activities = xml.querySelectorAll('Activity');
    activities.forEach(activity => {
      const sport = activity.getAttribute('Sport') || 'Workout';
      const laps = activity.querySelectorAll('Lap');

      let totalDuration = 0;
      let totalCalories = 0;
      let totalDistance = 0;
      let startTime = null;

      laps.forEach(lap => {
        if (!startTime) {
          startTime = lap.getAttribute('StartTime');
        }
        totalDuration += parseFloat(lap.querySelector('TotalTimeSeconds')?.textContent || 0);
        totalCalories += parseFloat(lap.querySelector('Calories')?.textContent || 0);
        totalDistance += parseFloat(lap.querySelector('DistanceMeters')?.textContent || 0);
      });

      const workout = {
        name: sport,
        duration: Math.round(totalDuration / 60),
        calories: Math.round(totalCalories),
        date: startTime ? getLocalDateString(new Date(startTime)) : getLocalDateString(),
        distance: totalDistance > 0 ? (totalDistance / 1000).toFixed(2) : null,
      };

      if (workout.duration > 0 || workout.calories > 0) {
        workouts.push(workout);
      }
    });

    return workouts;
  } catch (error) {
    console.error('Error parsing TCX:', error);
    return [];
  }
}

/**
 * Helper: Parse duration from various formats
 */
function parseDuration(value) {
  if (!value) return 0;

  try {
    const str = value.toString().trim().toLowerCase();

    // Handle text descriptions like "1 hour 30 minutes" or "45 min"
    if (str.includes('hour') || str.includes('min') || str.includes('sec')) {
      let totalMinutes = 0;

      const hourMatch = str.match(/(\d+\.?\d*)\s*h(our|r)?/);
      if (hourMatch) totalMinutes += parseFloat(hourMatch[1]) * 60;

      const minMatch = str.match(/(\d+\.?\d*)\s*m(in|inute)?/);
      if (minMatch) totalMinutes += parseFloat(minMatch[1]);

      const secMatch = str.match(/(\d+\.?\d*)\s*s(ec|econd)?/);
      if (secMatch) totalMinutes += parseFloat(secMatch[1]) / 60;

      if (totalMinutes > 0) return Math.round(totalMinutes);
    }

    // Format: "1:23:45" or "23:45" or "45" (HH:MM:SS or MM:SS or SS)
    if (str.includes(':')) {
      const parts = str.split(':').map(p => parseFloat(p));
      if (parts.length === 3) {
        // HH:MM:SS
        return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
      } else if (parts.length === 2) {
        // MM:SS or HH:MM (ambiguous - assume MM:SS for durations < 10 hours)
        if (parts[0] < 10) {
          return Math.round(parts[0] + parts[1] / 60);
        } else {
          // Assume HH:MM if first part is large
          return Math.round(parts[0] * 60 + parts[1]);
        }
      }
    }

    // Pure number - need to guess the unit
    const num = parseFloat(str);
    if (!isNaN(num)) {
      // If it's a very large number (> 10000), assume milliseconds
      if (num > 10000) return Math.round(num / 1000 / 60);
      // If it's moderate (> 200), assume seconds
      if (num > 200) return Math.round(num / 60);
      // Otherwise assume minutes
      return Math.round(num);
    }
  } catch (error) {
    console.warn('Error parsing duration:', value, error);
  }

  return 0;
}

/**
 * Helper: Parse date from various formats
 */
function parseDate(value) {
  if (!value) return getLocalDateString();

  try {
    // Try standard Date parsing first (handles ISO, most common formats)
    let date = new Date(value);
    if (!isNaN(date.getTime())) {
      return getLocalDateString(date);
    }

    // Try parsing common date formats manually
    const str = value.toString().trim();

    // Format: "MM/DD/YYYY" or "M/D/YYYY"
    const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (slashMatch) {
      date = new Date(slashMatch[3], slashMatch[1] - 1, slashMatch[2]);
      if (!isNaN(date.getTime())) {
        return getLocalDateString(date);
      }
    }

    // Format: "DD-MM-YYYY" or "YYYY-MM-DD" (already handled by Date constructor usually)
    const dashMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (dashMatch) {
      date = new Date(dashMatch[1], dashMatch[2] - 1, dashMatch[3]);
      if (!isNaN(date.getTime())) {
        return getLocalDateString(date);
      }
    }

    // Format: timestamp in milliseconds (if > year 2000 in seconds)
    const num = parseFloat(str);
    if (!isNaN(num) && num > 946684800) {
      // If number is in seconds (less than year 3000 in ms), convert to ms
      const timestamp = num < 10000000000 ? num * 1000 : num;
      date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return getLocalDateString(date);
      }
    }
  } catch (error) {
    console.warn('Error parsing date:', value, error);
  }

  // Fall back to today
  return getLocalDateString();
}

/**
 * Helper: Parse distance from various formats
 */
function parseDistance(value) {
  if (!value) return null;

  try {
    const str = value.toString().toLowerCase().trim();

    // Extract number from string like "5.2 km" or "3.1 miles"
    const numMatch = str.match(/(\d+\.?\d*)/);
    if (!numMatch) return null;

    const num = parseFloat(numMatch[1]);
    if (isNaN(num) || num === 0) return null;

    // Check for unit indicators
    if (str.includes('km') || str.includes('kilometer')) {
      return num.toFixed(2);
    }

    if (str.includes('mi') || str.includes('mile')) {
      return (num * 1.60934).toFixed(2);
    }

    if (str.includes('m') && !str.includes('km')) {
      // Meters - convert to km
      return (num / 1000).toFixed(2);
    }

    if (str.includes('yd') || str.includes('yard')) {
      return (num * 0.0009144).toFixed(2);
    }

    if (str.includes('ft') || str.includes('feet')) {
      return (num * 0.0003048).toFixed(2);
    }

    // No unit specified - guess based on magnitude
    // If > 1000, probably meters
    if (num > 1000) {
      return (num / 1000).toFixed(2);
    }

    // If < 100, probably kilometers or miles (assume km)
    if (num < 100) {
      return num.toFixed(2);
    }

    // Ambiguous - assume meters
    return (num / 1000).toFixed(2);
  } catch (error) {
    console.warn('Error parsing distance:', value, error);
    return null;
  }
}

/**
 * Helper: Convert Apple Health activity type to readable name
 */
function convertAppleHealthActivityType(type) {
  const conversions = {
    'HKWorkoutActivityTypeRunning': 'Running',
    'HKWorkoutActivityTypeWalking': 'Walking',
    'HKWorkoutActivityTypeCycling': 'Cycling',
    'HKWorkoutActivityTypeSwimming': 'Swimming',
    'HKWorkoutActivityTypeYoga': 'Yoga',
    'HKWorkoutActivityTypeStrengthTraining': 'Weight Training',
    'HKWorkoutActivityTypeElliptical': 'Elliptical',
    'HKWorkoutActivityTypeStairClimbing': 'Stair Climbing',
    'HKWorkoutActivityTypeHiking': 'Hiking',
    'HKWorkoutActivityTypeDance': 'Dancing',
    'HKWorkoutActivityTypeFunctionalStrengthTraining': 'Weight Training',
    'HKWorkoutActivityTypeTraditionalStrengthTraining': 'Weight Training',
  };

  return conversions[type] || type.replace('HKWorkoutActivityType', '').replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Helper: Estimate calories from duration and distance (rough approximation)
 */
function estimateCalories(durationMinutes, distanceKm) {
  if (!durationMinutes) return 0;

  // Rough estimate: 5 cal/min for moderate activity
  // Add distance bonus if available (assume running/cycling)
  const baseCalories = durationMinutes * 5;
  const distanceCalories = distanceKm ? distanceKm * 60 : 0;

  return Math.round(Math.max(baseCalories, distanceCalories));
}

/**
 * Helper: Calculate distance between two GPS coordinates (Haversine formula)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}
