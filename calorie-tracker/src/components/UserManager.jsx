import { useState } from 'react';
import { getAllUsers, getCurrentUserId, setCurrentUser, addUser, deleteUser, renameUser } from '../utils/users';
import { useModalAccessibility } from '../hooks/useModalAccessibility';
import ConfirmationModal from './ConfirmationModal';
import AlertModal from './AlertModal';

export default function UserManager({ onUserSwitch, onClose }) {
  const modalRef = useModalAccessibility(true, onClose);
  const [users, setUsers] = useState(getAllUsers());
  const [currentUserId, setCurrentUserIdState] = useState(getCurrentUserId());
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSwitchUser = (userId) => {
    setCurrentUser(userId);
    setCurrentUserIdState(userId);
    onUserSwitch(userId);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser = addUser(newUserName.trim());
    setUsers(getAllUsers());
    setNewUserName('');
    setShowAddUser(false);
    handleSwitchUser(newUser.id);
  };

  const performDelete = () => {
    if (!pendingDeleteUserId) return;

    const success = deleteUser(pendingDeleteUserId);

    if (!success) {
      // Failed to delete (probably default user)
      setShowDeleteConfirm(false);
      setPendingDeleteUserId(null);
      setAlertMessage('Cannot delete the default user. Create another user first, then try deleting this one.');
      setShowAlert(true);
      return;
    }

    setUsers(getAllUsers());
    setCurrentUserIdState(getCurrentUserId());
    if (pendingDeleteUserId === currentUserId) {
      onUserSwitch(getCurrentUserId());
    }

    setShowDeleteConfirm(false);
    setPendingDeleteUserId(null);
  };

  const handleDeleteUser = (userId) => {
    setPendingDeleteUserId(userId);
    setShowDeleteConfirm(true);
  };

  const handleRenameUser = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingUser) return;

    renameUser(editingUser, editName.trim());
    setUsers(getAllUsers());
    setEditingUser(null);
    setEditName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto" role="dialog" aria-modal="true" ref={modalRef}>
      <div className="card max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
            aria-label="Close user manager"
          >
            ×
          </button>
        </div>

        {!showAddUser ? (
          <>
            <button
              onClick={() => setShowAddUser(true)}
              className="btn-primary w-full mb-6"
            >
              + Add New User
            </button>

            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`border-2 rounded-lg p-4 ${
                    user.id === currentUserId
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {editingUser === user.id ? (
                    <form onSubmit={handleRenameUser} className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck="false"
                      />
                      <button type="submit" className="btn-primary">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setEditName('');
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        {user.id === currentUserId && (
                          <span className="text-sm text-emerald-600 dark:text-emerald-400">
                            Current User
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {user.id !== currentUserId && (
                          <button
                            onClick={() => handleSwitchUser(user.id)}
                            className="btn-primary"
                          >
                            Switch
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingUser(user.id);
                            setEditName(user.name);
                          }}
                          className="btn-secondary"
                        >
                          Rename
                        </button>
                        {user.id !== 'default' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn-secondary text-red-600 dark:text-red-400"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-3">New User Name</label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g., John, Mom, Partner"
                className="input-field"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddUser(false);
                  setNewUserName('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">
                Create User
              </button>
            </div>
          </form>
        )}

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onConfirm={performDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setPendingDeleteUserId(null);
          }}
          title="Delete User"
          message="Delete this user and all their data? This cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          danger={true}
        />

        <AlertModal
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          title="Cannot Delete User"
          message={alertMessage}
          type="error"
        />
      </div>
    </div>
  );
}
