// User management utilities
import { sanitizeInput } from './sanitize';

const USER_STORAGE_KEY = 'calorieTracker_users';
const CURRENT_USER_KEY = 'calorieTracker_currentUser';

// Get all users
export function getAllUsers() {
  try {
    const users = localStorage.getItem(USER_STORAGE_KEY);
    return users ? JSON.parse(users) : [{ id: 'default', name: 'Default User', createdAt: Date.now() }];
  } catch (error) {
    console.error('Error reading users:', error);
    return [{ id: 'default', name: 'Default User', createdAt: Date.now() }];
  }
}

// Get current user ID
export function getCurrentUserId() {
  return localStorage.getItem(CURRENT_USER_KEY) || 'default';
}

// Set current user
export function setCurrentUser(userId) {
  localStorage.setItem(CURRENT_USER_KEY, userId);
}

// Add new user
export function addUser(name) {
  const users = getAllUsers();
  const newUser = {
    id: `user_${Date.now()}`,
    name: sanitizeInput(name),
    createdAt: Date.now(),
  };
  users.push(newUser);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  return newUser;
}

// Delete user (and all their data)
export function deleteUser(userId) {
  if (userId === 'default') {
    return false;
  }

  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(filteredUsers));

  // Delete all user data
  const keysToDelete = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes(`_${userId}_`)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => localStorage.removeItem(key));

  // Switch to default user if deleting current user
  if (getCurrentUserId() === userId) {
    setCurrentUser('default');
  }

  return true;
}

// Rename user
export function renameUser(userId, newName) {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.name = sanitizeInput(newName);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    return true;
  }
  return false;
}

// Get storage key with user prefix
export function getUserStorageKey(baseKey) {
  const userId = getCurrentUserId();
  return `calorieTracker_${userId}_${baseKey}`;
}
