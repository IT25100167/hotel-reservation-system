'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, UserPlus, X, Check } from 'lucide-react';

interface User {
  userId: number;
  name: string;
  email: string;
  phoneNum: string;
  password: string;
  role: string;
}

const emptyNew = { name: '', email: '', password: '', phoneNum: '', role: 'CUSTOMER' };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState(emptyNew);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/users/all');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async () => {
    try {
      const res = await fetch('http://localhost:8080/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        const msg = await res.text();
        alert('Error: ' + msg);
        return;
      }
      setShowAdd(false);
      setNewUser(emptyNew);
      await fetchUsers();
    } catch (e) {
      alert('Failed to add user. Check backend.');
    }
  };

  const handleEdit = async () => {
    if (!editUser) return;
    await fetch('http://localhost:8080/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser),
    });
    setEditUser(null);
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8080/users/delete/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    fetchUsers();
  };

  const inputClass = "w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="space-y-6 pt-4">

      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-foreground">Users Management</h1>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-amber-800 hover:to-amber-600 transition">
          <UserPlus size={16} /> Add User
        </button>
      </div>

      <Card className="bg-card border-border p-6">
        {loading && <p className="text-foreground/60 text-center py-8">Loading...</p>}
        {error && <p className="text-destructive text-center py-8">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['ID', 'Name', 'Email', 'Phone', 'Role', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-foreground/70 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-foreground/50">No users found</td></tr>
                ) : users.map((user) => (
                  <motion.tr key={user.userId} whileHover={{ x: 2 }}
                    className="border-b border-border/50 hover:bg-secondary/40 transition">
                    <td className="py-4 px-4 text-foreground/70">{user.userId}</td>
                    <td className="py-4 px-4 font-medium text-foreground">{user.name}</td>
                    <td className="py-4 px-4 text-foreground/70">{user.email}</td>
                    <td className="py-4 px-4 text-foreground/70">{user.phoneNum ?? '-'}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN' ? 'bg-red-500/15 text-red-500' :
                        user.role === 'STAFF' ? 'bg-blue-500/15 text-blue-500' :
                        'bg-emerald-500/15 text-emerald-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditUser({ ...user })}
                          className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(user.userId)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-stone-800">Add New User</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 rounded-lg hover:bg-stone-100 transition">
                  <X size={18} className="text-stone-500" />
                </button>
              </div>
              <div className="space-y-4">
                {([['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phoneNum', 'text'], ['Password', 'password', 'password']] as const).map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>
                    <input type={type} value={newUser[key as keyof typeof newUser]}
                      onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                      className={inputClass} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleAdd}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white hover:from-amber-800 hover:to-amber-600 transition text-sm font-medium flex items-center justify-center gap-2">
                  <UserPlus size={16} /> Add User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-stone-800">Edit User</h2>
                <button onClick={() => setEditUser(null)} className="p-2 rounded-lg hover:bg-stone-100 transition">
                  <X size={18} className="text-stone-500" />
                </button>
              </div>
              <div className="space-y-4">
                {([['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phoneNum', 'text'], ['Password', 'password', 'password']] as const).map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>
                    <input type={type} value={(editUser as any)[key] ?? ''}
                      onChange={(e) => setEditUser({ ...editUser, [key]: e.target.value })}
                      className={inputClass} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleEdit}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-500 text-white hover:from-amber-800 hover:to-amber-600 transition text-sm font-medium flex items-center justify-center gap-2">
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-stone-800 mb-2">Delete User?</h2>
              <p className="text-stone-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition text-sm font-medium">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId as number)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
