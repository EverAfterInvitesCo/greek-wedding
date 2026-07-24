import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Search, Download, Trash2, Users, CheckCircle, XCircle, Clock, Camera, Plus, RefreshCw, X, AlertCircle } from 'lucide-react';
import { RSVP, PhotoItem } from '../types';
import { fetchRSVPs, deleteRSVP, fetchPhotos, deletePhoto, submitRSVP } from '../lib/supabase';

interface OrganizerPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizerPortal: React.FC<OrganizerPortalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState(false);

  // Admin Data State
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'photos' | 'add-rsvp'>('rsvps');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'yes' | 'no'>('all');

  // Manual RSVP Add Form
  const [newRsvp, setNewRsvp] = useState<RSVP>({
    guest_name: '',
    phone_number: '',
    email: '',
    number_of_guests: 1,
    attendance: 'yes',
    dietary_notes: 'None',
    message: 'Organizer Manual Entry',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'FarahSeif2027' || password === 'admin' || password === 'everafter') {
      setIsAuthenticated(true);
      setPassError(false);
      loadAdminData();
    } else {
      setPassError(true);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    // Pass 'greek-wedding' to scope admin records to this specific event
    const [rData, pData] = await Promise.all([fetchRSVPs('greek-wedding'), fetchPhotos('greek-wedding')]);
    setRsvps(rData);
    setPhotos(pData);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAdminData();
    }
  }, [isOpen, isAuthenticated]);

  const handleDeleteRSVP = async (id?: string) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this guest RSVP?')) {
      await deleteRSVP(id);
      setRsvps((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await deletePhoto(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRsvp.guest_name || !newRsvp.phone_number) return;
    // Include event_id when adding manual entries
    await submitRSVP({ ...newRsvp, event_id: 'greek-wedding' });
    alert('RSVP added successfully!');
    setNewRsvp({
      guest_name: '',
      phone_number: '',
      email: '',
      number_of_guests: 1,
      attendance: 'yes',
      dietary_notes: 'None',
      message: 'Organizer Manual Entry',
    });
    loadAdminData();
    setActiveTab('rsvps');
  };

  // CSV Export
  const exportToCSV = () => {
    if (rsvps.length === 0) return;
    const headers = ['Guest Name', 'Phone Number', 'Email', 'Attendance', 'Guest Count', 'Dietary Notes', 'Message', 'Submitted Date'];
    const rows = rsvps.map((r) => [
      `"${r.guest_name}"`,
      `"${r.phone_number}"`,
      `"${r.email || ''}"`,
      `"${r.attendance === 'yes' ? 'Attending' : 'Declined'}"`,
      r.number_of_guests,
      `"${r.dietary_notes || ''}"`,
      `"${r.message?.replace(/"/g, '""') || ''}"`,
      `"${r.created_at || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Farah_Seif_Wedding_RSVPs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI calculations
  const totalAttending = rsvps.filter((r) => r.attendance === 'yes').reduce((sum, r) => sum + r.number_of_guests, 0);
  const totalDeclined = rsvps.filter((r) => r.attendance === 'no').length;
  const filteredRSVPs = rsvps.filter((r) => {
    const matchesSearch =
      r.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone_number.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || r.attendance === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#050B18]/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="w-full max-w-5xl glass-panel rounded-3xl border border-[#D4AF37]/40 overflow-hidden relative my-8">
          {/* Header Bar */}
          <div className="p-6 bg-[#0B152C] border-b border-[#D4AF37]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wider">
                  Organizer Dashboard
                </h3>
                <p className="text-xs font-sans text-gray-400">Farah & Seif — Santorini Wedding Portal</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#050B18] border border-[#D4AF37]/30 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Password Lock View */}
          {!isAuthenticated ? (
            <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#0B152C] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="font-cormorant text-3xl text-white font-medium">Organizer Verification</h4>
              <p className="font-sans text-xs text-gray-300">
                Enter your wedding organizer passkey to access guest RSVPs, stats, and photo management.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter Password (FarahSeif2027)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#050B18] border border-[#D4AF37]/40 text-white placeholder-gray-500 text-center text-sm focus:outline-none focus:border-[#D4AF37]"
                />

                {passError && (
                  <p className="text-xs text-red-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Incorrect password. Try: FarahSeif2027
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#D4AF37] text-[#050B18] font-cinzel text-xs font-bold tracking-widest uppercase hover:bg-[#E5C158] transition-colors cursor-pointer"
                >
                  Unlock Portal
                </button>
              </form>
            </div>
          ) : (
            /* Admin Dashboard Content */
            <div className="p-6 sm:p-8 space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#0B152C] border border-[#D4AF37]/30 text-center">
                  <div className="text-2xl font-bold font-cinzel text-[#D4AF37]">{totalAttending}</div>
                  <div className="text-xs font-sans text-gray-300 mt-1">Confirmed Guests</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B152C] border border-[#D4AF37]/30 text-center">
                  <div className="text-2xl font-bold font-cinzel text-white">{rsvps.length}</div>
                  <div className="text-xs font-sans text-gray-300 mt-1">Total RSVP Entries</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B152C] border border-[#D4AF37]/30 text-center">
                  <div className="text-2xl font-bold font-cinzel text-red-400">{totalDeclined}</div>
                  <div className="text-xs font-sans text-gray-300 mt-1">Declined</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B152C] border border-[#D4AF37]/30 text-center">
                  <div className="text-2xl font-bold font-cinzel text-[#E5C158]">{photos.length}</div>
                  <div className="text-xs font-sans text-gray-300 mt-1">Gallery Photos</div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className={`px-4 py-2 rounded-xl font-cinzel text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                      activeTab === 'rsvps'
                        ? 'bg-[#D4AF37] text-[#050B18]'
                        : 'bg-[#0B152C] text-gray-300 hover:text-white'
                    }`}
                  >
                    RSVP List ({rsvps.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`px-4 py-2 rounded-xl font-cinzel text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                      activeTab === 'photos'
                        ? 'bg-[#D4AF37] text-[#050B18]'
                        : 'bg-[#0B152C] text-gray-300 hover:text-white'
                    }`}
                  >
                    Photos ({photos.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('add-rsvp')}
                    className={`px-4 py-2 rounded-xl font-cinzel text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                      activeTab === 'add-rsvp'
                        ? 'bg-[#D4AF37] text-[#050B18]'
                        : 'bg-[#0B152C] text-gray-300 hover:text-white'
                    }`}
                  >
                    + Add Guest
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-lg bg-[#0B152C] border border-[#D4AF37]/30 text-gray-300 hover:text-white cursor-pointer"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>

                  {activeTab === 'rsvps' && (
                    <button
                      onClick={exportToCSV}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B152C] border border-[#D4AF37]/40 text-[#E5C158] font-cinzel text-xs uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#050B18] transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  )}
                </div>
              </div>

              {/* Tab 1: RSVPs Table */}
              {activeTab === 'rsvps' && (
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search guests by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#050B18] border border-[#D4AF37]/30 text-white text-xs placeholder-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-cinzel uppercase cursor-pointer ${
                          statusFilter === 'all' ? 'bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]' : 'text-gray-400'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setStatusFilter('yes')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-cinzel uppercase cursor-pointer ${
                          statusFilter === 'yes' ? 'bg-green-900/40 text-green-300 border border-green-500' : 'text-gray-400'
                        }`}
                      >
                        Attending
                      </button>
                      <button
                        onClick={() => setStatusFilter('no')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-cinzel uppercase cursor-pointer ${
                          statusFilter === 'no' ? 'bg-red-900/40 text-red-300 border border-red-500' : 'text-gray-400'
                        }`}
                      >
                        Declined
                      </button>
                    </div>
                  </div>

                  {/* RSVPs Table */}
                  <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/20 bg-[#050B18]">
                    <table className="w-full text-left text-xs font-sans text-gray-300">
                      <thead className="bg-[#0B152C] font-cinzel uppercase text-[#E5C158] border-b border-[#D4AF37]/20">
                        <tr>
                          <th className="p-3.5">Guest Name</th>
                          <th className="p-3.5">Phone</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Party Size</th>
                          <th className="p-3.5">Dietary Notes</th>
                          <th className="p-3.5">Message</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4AF37]/10">
                        {filteredRSVPs.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-gray-500">
                              No guest responses match your filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredRSVPs.map((r) => (
                            <tr key={r.id || r.phone_number} className="hover:bg-[#0B152C]/50 transition-colors">
                              <td className="p-3.5 font-medium text-white">{r.guest_name}</td>
                              <td className="p-3.5">{r.phone_number}</td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-cinzel font-semibold uppercase ${
                                    r.attendance === 'yes'
                                      ? 'bg-green-900/40 text-green-300 border border-green-500/40'
                                      : 'bg-red-900/40 text-red-300 border border-red-500/40'
                                  }`}
                                >
                                  {r.attendance === 'yes' ? 'Attending' : 'Declined'}
                                </span>
                              </td>
                              <td className="p-3.5 font-cinzel text-white">{r.number_of_guests} Guest(s)</td>
                              <td className="p-3.5 max-w-[150px] truncate">{r.dietary_notes || 'None'}</td>
                              <td className="p-3.5 max-w-[200px] truncate italic text-gray-400">{r.message || '-'}</td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteRSVP(r.id)}
                                  className="p-1.5 rounded bg-red-900/30 text-red-300 hover:bg-red-800 hover:text-white transition-colors cursor-pointer"
                                  title="Delete RSVP"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Photos Grid */}
              {activeTab === 'photos' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 font-sans">
                      No photos uploaded yet.
                    </div>
                  ) : (
                    photos.map((p) => (
                      <div
                        key={p.id}
                        className="relative rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#050B18] group"
                      >
                        <img src={p.url} alt="Guest uploaded" className="w-full h-36 object-cover" />
                        <div className="p-2 text-[10px] bg-[#0B152C] flex items-center justify-between text-gray-300">
                          <span className="truncate">{p.uploader_name || 'Guest'}</span>
                          <button
                            onClick={() => handleDeletePhoto(p.id)}
                            className="p-1 text-red-400 hover:text-red-200 cursor-pointer"
                            title="Delete photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Manual Add Guest Form */}
              {activeTab === 'add-rsvp' && (
                <form onSubmit={handleManualAdd} className="max-w-xl mx-auto space-y-4 bg-[#050B18] p-6 rounded-2xl border border-[#D4AF37]/30">
                  <h4 className="font-cinzel text-sm text-[#E5C158] uppercase font-bold mb-4">Add Guest RSVP Manually</h4>
                  <div>
                    <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">Guest Name</label>
                    <input
                      type="text"
                      required
                      value={newRsvp.guest_name}
                      onChange={(e) => setNewRsvp({ ...newRsvp, guest_name: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#0B152C] border border-[#D4AF37]/30 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={newRsvp.phone_number}
                      onChange={(e) => setNewRsvp({ ...newRsvp, phone_number: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#0B152C] border border-[#D4AF37]/30 text-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">Attendance</label>
                      <select
                        value={newRsvp.attendance}
                        onChange={(e) => setNewRsvp({ ...newRsvp, attendance: e.target.value as 'yes' | 'no' })}
                        className="w-full p-2.5 rounded-lg bg-[#0B152C] border border-[#D4AF37]/30 text-white text-xs"
                      >
                        <option value="yes">Attending</option>
                        <option value="no">Declined</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-cinzel text-gray-300 uppercase mb-1">Guest Count</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={newRsvp.number_of_guests}
                        onChange={(e) => setNewRsvp({ ...newRsvp, number_of_guests: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-lg bg-[#0B152C] border border-[#D4AF37]/30 text-white text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#D4AF37] text-[#050B18] font-cinzel text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Save Guest Entry
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
