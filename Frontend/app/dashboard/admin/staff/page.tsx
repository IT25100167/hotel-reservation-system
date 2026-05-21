'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, User } from 'lucide-react';

interface Staff {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const emptyForm: Omit<Staff, 'id'> & { id?: number } = {
  name: '',
  phoneNumber: '',
  email: '',
  password: '',
};

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/staff/all');
      if (res.ok) setStaffList(await res.json());
    } catch {
      // backend not running
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setForm({ ...emptyForm });
    setEditMode(false);
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEditForm = (staff: Staff) => {
    setForm({ ...staff });
    setEditMode(true);
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let res: Response;
      if (editMode) {
        res = await fetch('http://localhost:8080/staff', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch('http://localhost:8080/staff/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }

      if (res.ok) {
        setSuccess(editMode ? 'Staff updated successfully' : 'Staff added successfully');
        setShowForm(false);
        fetchStaff();
      } else {
        const msg = await res.text();
        setError(msg || 'Operation failed');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/staff/delete/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccess('Staff deleted successfully');
        fetchStaff();
      } else {
        setError('Failed to delete staff');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Staff Management</h1>
          <p className="text-stone-500 mt-1">Add and manage hotel staff members</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-500 text-white px-5 py-3 rounded-xl font-semibold hover:from-amber-800 hover:to-amber-600 transition shadow-md"
        >
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {/* Success / Error messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex justify-between">
          {success}
          <button onClick={() => setSuccess('')}><X size={16} /></button>
        </div>
      )}
      {error && !showForm && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 flex justify-between">
          {error}
          <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}

      {/* Add / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl border border-amber-100 shadow-lg p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-800">
                {editMode ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="staff@hotel.com"
                  required
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  placeholder="0771234567"
                  required
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">
                  Password {editMode && <span className="text-stone-400 normal-case font-normal">(leave blank to keep)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required={!editMode}
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              {error && (
                <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold py-3 rounded-xl hover:from-amber-800 hover:to-amber-600 transition disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editMode ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-amber-200 text-stone-600 rounded-xl hover:bg-amber-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-50 border-b border-amber-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Staff</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Phone</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-12 text-stone-400">Loading staff...</td></tr>
              ) : staffList.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-stone-400">No staff members added yet</td></tr>
              ) : (
                staffList.map((staff) => (
                  <motion.tr
                    key={staff.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-amber-50/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-stone-800">{staff.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">{staff.email}</td>
                    <td className="px-6 py-4 text-stone-600">{staff.phoneNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditForm(staff)}
                          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium px-3 py-2 rounded-lg transition"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(staff.id)}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-3 py-2 rounded-lg transition"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center"
            >
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Delete Staff Member?</h3>
              <p className="text-stone-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border border-stone-200 text-stone-600 font-semibold py-3 rounded-xl hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
