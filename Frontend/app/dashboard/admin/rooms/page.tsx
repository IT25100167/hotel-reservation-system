'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BedDouble, DollarSign, X, Pencil, Trash2, Check } from 'lucide-react';

interface Room {
  roomId: number;
  roomNumber: string;
  roomType: string;
  price: number;
  status: string;
  description: string;
  image: string;
}

const emptyForm = {
  roomNumber: '',
  roomType: 'SINGLE',
  price: '',
  status: 'AVAILABLE',
  description: '',
  image: '',
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/rooms');
      if (res.ok) setRooms(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm({ ...form, image: base64 });
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.roomNumber || !form.price) {
      setError('Room number and price are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:8080/api/rooms/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      if (res.ok) {
        setSuccess('Room added successfully');
        setForm(emptyForm);
        setImagePreview('');
        setShowForm(false);
        fetchRooms();
      } else {
        const msg = await res.text();
        setError(msg || 'Failed to add room');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editRoom) return;
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${editRoom.roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editRoom, price: parseFloat(editRoom.price.toString()) }),
      });
      if (res.ok) {
        setSuccess('Room updated successfully');
        setEditRoom(null);
        setEditImagePreview('');
        fetchRooms();
      } else {
        const msg = await res.text();
        setError(msg || 'Failed to update room');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccess('Room deleted successfully');
        setDeleteId(null);
        fetchRooms();
      } else {
        const msg = await res.text();
        setError(msg || 'Failed to delete room');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (editRoom) {
        setEditRoom({ ...editRoom, image: base64 });
        setEditImagePreview(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Rooms</h1>
          <p className="text-stone-500 mt-1">Manage hotel rooms</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(''); setSuccess(''); }}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-500 text-white px-5 py-3 rounded-xl font-semibold hover:from-amber-800 hover:to-amber-600 transition shadow-md"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">{success}</div>
      )}

      {/* Add Room Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-amber-100 shadow-lg p-8 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-800">Add New Room</h2>
            <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600">
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Room Number */}
            <div>
              <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Room Number</label>
              <input
                type="text"
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                placeholder="e.g. 101"
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Room Type</label>
              <select
                value={form.roomType}
                onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="DELUXE">Deluxe</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Price per Night ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 150"
                min="0"
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Room description..."
                rows={3}
                className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Room Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-amber-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="h-40 mx-auto rounded-lg object-cover" />
                ) : (
                  <div className="text-stone-400">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm">Click to upload room image</p>
                    <p className="text-xs mt-1">JPG, PNG supported</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
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
                {submitting ? 'Adding...' : 'Add Room'}
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

      {/* Edit Room Modal */}
      <AnimatePresence>
        {editRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-stone-800">Edit Room</h2>
                <button
                  onClick={() => {
                    setEditRoom(null);
                    setEditImagePreview('');
                  }}
                  className="p-2 rounded-lg hover:bg-stone-100 transition"
                >
                  <X size={18} className="text-stone-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Room Number */}
                <div>
                  <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Room Number</label>
                  <input
                    type="text"
                    value={editRoom.roomNumber}
                    onChange={(e) => setEditRoom({ ...editRoom, roomNumber: e.target.value })}
                    className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Room Type</label>
                  <select
                    value={editRoom.roomType}
                    onChange={(e) => setEditRoom({ ...editRoom, roomType: e.target.value })}
                    className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  >
                    <option value="SINGLE">Single</option>
                    <option value="DOUBLE">Double</option>
                    <option value="DELUXE">Deluxe</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Price per Night (Rs)</label>
                  <input
                    type="number"
                    value={editRoom.price}
                    onChange={(e) => setEditRoom({ ...editRoom, price: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 150"
                    min="0"
                    className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Status</label>
                  <select
                    value={editRoom.status}
                    onChange={(e) => setEditRoom({ ...editRoom, status: e.target.value })}
                    className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Description</label>
                  <textarea
                    value={editRoom.description}
                    onChange={(e) => setEditRoom({ ...editRoom, description: e.target.value })}
                    placeholder="Room description..."
                    rows={3}
                    className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-amber-800 uppercase tracking-wide block mb-2">Room Image</label>
                  <div
                    onClick={() => editFileRef.current?.click()}
                    className="w-full border-2 border-dashed border-amber-300 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition"
                  >
                    {editImagePreview ? (
                      <img src={editImagePreview} alt="preview" className="h-40 mx-auto rounded-lg object-cover" />
                    ) : (
                      <div className="text-stone-400">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-sm">Click to upload room image</p>
                        <p className="text-xs mt-1">JPG, PNG supported</p>
                      </div>
                    )}
                  </div>
                  <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                </div>

                {error && (
                  <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditRoom(null);
                    setEditImagePreview('');
                  }}
                  className="flex-1 py-3 border border-amber-200 text-stone-600 rounded-xl hover:bg-amber-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-amber-700 to-amber-500 text-white font-semibold py-3 rounded-xl hover:from-amber-800 hover:to-amber-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Check size={16} /> {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-stone-800 mb-2">Delete Room?</h2>
              <p className="text-stone-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId as number)}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rooms Table */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-50 border-b border-amber-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Image</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Room No</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Type</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Description</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-amber-800 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-stone-400">Loading rooms...</td></tr>
              ) : rooms.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-stone-400">No rooms added yet</td></tr>
              ) : (
                rooms.map((room) => (
                  <motion.tr
                    key={room.roomId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-amber-50/50 transition"
                  >
                    <td className="px-6 py-4">
                      {room.image ? (
                        <img src={room.image} alt="room" className="w-16 h-12 rounded-lg object-cover border border-amber-100" />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-400">
                          <BedDouble size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-800">{room.roomNumber}</td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {room.roomType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-700">Rs {room.price}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                        room.status === 'OCCUPIED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-sm max-w-xs truncate">{room.description || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditRoom(room);
                            setEditImagePreview(room.image);
                            setError('');
                            setSuccess('');
                          }}
                          className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(room.roomId)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
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
    </div>
  );
}
