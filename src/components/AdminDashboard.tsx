import React, { useState, useEffect } from 'react';
import { 
  KeyRound, Plus, Trash2, Edit3, Download, RefreshCw, 
  CheckCircle, Users, Coins, Sparkles, X, Shield, Calendar, MapPin, Eye 
} from 'lucide-react';
import { EventItem, RegistrationRecord, EventCategory } from '../types';
import { sound } from '../audio/soundEngine';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onRefreshEvents: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  events,
  onRefreshEvents
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'events' | 'registrations'>('analytics');
  
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [searchReg, setSearchReg] = useState('');

  // Event modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventForm, setEventForm] = useState({
    name: '',
    category: 'Technical' as EventCategory,
    tagline: '',
    description: '',
    date: 'Day 1 — 14 March 2026',
    time: '10:00 AM',
    venue: 'The Great Hall',
    fee: '150 Galleons',
    participation: 'Solo',
    rules: '',
    prizes: '10,000 Galleons + Trophy',
    maxParticipants: 50,
    chamberName: 'Chamber Vault'
  });

  const fetchRegistrations = async () => {
    setRegLoading(true);
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (e) {
      console.warn('Could not fetch registrations from backend:', e);
    } finally {
      setRegLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'slytherin2026' || passcode === 'admin') {
      sound.playSpellCast();
      setIsAuthenticated(true);
    } else {
      sound.playThunder();
      alert('The serpent wards reject your passcode. Hint: slytherin2026');
    }
  };

  const handleCreateOrUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSpellCast();

    const payload = {
      ...eventForm,
      rules: eventForm.rules.split('\n').filter(r => r.trim().length > 0)
    };

    try {
      if (editingEvent) {
        // PUT update
        await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // POST create
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      onRefreshEvents();
      setShowEventModal(false);
      setEditingEvent(null);
    } catch (e) {
      alert('Failed to update event in backend database.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you certain you wish to banish this chamber from the tournament scrolls?')) return;
    sound.playThunder();
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      onRefreshEvents();
    } catch (e) {
      alert('Failed to banish event.');
    }
  };

  const handleUpdateRegStatus = async (id: string, currentStatus: string) => {
    sound.playGoldClick();
    const newStatus = currentStatus === 'Confirmed' ? 'Pending Verification' : 'Confirmed';
    try {
      await fetch(`/api/registrations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchRegistrations();
    } catch (e) {
      alert('Status update failed.');
    }
  };

  const handleExportCSV = () => {
    sound.playWandSparkle();
    window.open('/api/export-csv', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#001C16] border-2 border-[#C9A44C] shadow-2xl p-6 sm:p-10 text-[#D9C99F]">
        
        {/* Ornate Gold Trim Corners */}
        <div className="corner-ornament corner-tl" />
        <div className="corner-ornament corner-tr" />
        <div className="corner-ornament corner-bl" />
        <div className="corner-ornament corner-br" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-[#C9A44C] hover:border-[#FFF0B8] text-[#E6C66F] hover:bg-[#08734B]/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. AUTHENTICATION GATE (If not logged in) */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#C9A44C] bg-[#00140F] flex items-center justify-center shadow-gold-glow">
              <KeyRound className="w-8 h-8 text-[#E6C66F]" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-gold-gradient uppercase mb-2">
              High Council Chamber
            </h3>
            <p className="font-cormorant italic text-sm text-[#C6C9C8] mb-6">
              Restricted to the Grand Inquisitor and faculty administrators of Olympia 2026.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter High Passcode (slytherin2026)"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded bg-[#00140F] border-2 border-[#C9A44C] text-sm text-center text-[#FFF0B8] focus:border-[#E6C66F] focus:outline-none placeholder-[#8C6F2D]"
              />
              <button
                type="submit"
                className="w-full py-3 rounded font-cinzel text-xs font-bold tracking-widest text-[#090D0B] bg-gradient-to-r from-[#C9A44C] via-[#F9DF88] to-[#C9A44C] border border-[#FFF0B8] shadow-gold-glow uppercase hover:scale-105 transition-all"
              >
                UNSEAL ADMINISTRATION VAULT
              </button>
            </form>
          </div>
        ) : (
          /* 2. ADMIN DASHBOARD WORKSPACE */
          <div>
            
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#C9A44C]/40 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-7 h-7 text-[#E6C66F]" />
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-gold-gradient uppercase">
                    Slytherin Olympia Administration Chamber
                  </h3>
                  <span className="font-cormorant italic text-xs text-[#A7F3D0]">
                    Live Backend Connected • Node/Express Database
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center space-x-2 mt-4 sm:mt-0 font-cinzel text-xs">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3.5 py-1.5 rounded transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-[#003B2D] border border-[#E6C66F] text-[#FFF0B8] font-bold'
                      : 'border border-[#C9A44C]/30 text-[#D9C99F] hover:border-[#C9A44C]'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('registrations')}
                  className={`px-3.5 py-1.5 rounded transition-all ${
                    activeTab === 'registrations'
                      ? 'bg-[#003B2D] border border-[#E6C66F] text-[#FFF0B8] font-bold'
                      : 'border border-[#C9A44C]/30 text-[#D9C99F] hover:border-[#C9A44C]'
                  }`}
                >
                  Registrations ({registrations.length})
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-3.5 py-1.5 rounded transition-all ${
                    activeTab === 'events'
                      ? 'bg-[#003B2D] border border-[#E6C66F] text-[#FFF0B8] font-bold'
                      : 'border border-[#C9A44C]/30 text-[#D9C99F] hover:border-[#C9A44C]'
                  }`}
                >
                  Manage Events ({events.length})
                </button>
              </div>
            </div>

            {/* TAB 1: ANALYTICS OVERVIEW */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl border border-[#C9A44C]/40 bg-[#00140F]/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-cinzel text-xs text-[#A7F3D0] uppercase">Total Registered Wizards</span>
                      <Users className="w-5 h-5 text-[#E6C66F]" />
                    </div>
                    <span className="font-cinzel text-3xl font-bold text-gold-gradient">
                      {registrations.length}
                    </span>
                    <p className="font-cormorant text-xs text-[#C6C9C8] mt-1">Confirmed across collegiate delegations</p>
                  </div>

                  <div className="p-5 rounded-xl border border-[#C9A44C]/40 bg-[#00140F]/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-cinzel text-xs text-[#A7F3D0] uppercase">Treasury Inflow (Galleons)</span>
                      <Coins className="w-5 h-5 text-[#F9DF88]" />
                    </div>
                    <span className="font-cinzel text-3xl font-bold text-gold-gradient">
                      {registrations.length * 200} G
                    </span>
                    <p className="font-cormorant text-xs text-[#C6C9C8] mt-1">Estimated tournament dues collected</p>
                  </div>

                  <div className="p-5 rounded-xl border border-[#C9A44C]/40 bg-[#00140F]/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-cinzel text-xs text-[#A7F3D0] uppercase">Active Chamber Trials</span>
                      <Sparkles className="w-5 h-5 text-[#34D399]" />
                    </div>
                    <span className="font-cinzel text-3xl font-bold text-gold-gradient">
                      {events.length}
                    </span>
                    <p className="font-cormorant text-xs text-[#C6C9C8] mt-1">Across 5 competitive divisions</p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="p-6 rounded-xl border border-[#08734B]/60 bg-[#003B2D]/30 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-cinzel text-base font-bold text-[#FFF0B8]">
                      Export Official Tournament Registry
                    </h4>
                    <p className="font-cormorant text-sm text-[#C6C9C8]">
                      Download participant roll sheets, colleges, reference IDs, and contact info in Excel/CSV format.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="px-6 py-2.5 rounded font-cinzel text-xs font-bold tracking-widest text-[#090D0B] bg-gradient-to-r from-[#C9A44C] to-[#F9DF88] border border-[#FFF0B8] flex items-center space-x-2 shadow-gold-glow uppercase hover:scale-105 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD PARTICIPANTS CSV</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTRATIONS MANAGEMENT */}
            {activeTab === 'registrations' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Search participant name, college or Ref ID..."
                    value={searchReg}
                    onChange={e => setSearchReg(e.target.value)}
                    className="w-full sm:w-80 px-4 py-2 rounded bg-[#00140F] border border-[#C9A44C]/40 text-xs text-[#D9C99F] focus:outline-none"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={fetchRegistrations}
                      className="px-3.5 py-2 rounded border border-[#C9A44C]/40 text-xs font-cinzel text-[#E6C66F] hover:border-[#FFF0B8] flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 rounded font-cinzel text-xs font-bold text-[#090D0B] bg-[#C9A44C] hover:bg-[#F9DF88] flex items-center space-x-1.5 uppercase"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Registrations Table */}
                <div className="overflow-x-auto rounded-lg border border-[#C9A44C]/40">
                  <table className="w-full text-left font-cinzel text-xs">
                    <thead className="bg-[#00140F] text-[#E6C66F] border-b border-[#C9A44C]/40 uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">Wizard Name</th>
                        <th className="p-3">College & Dept</th>
                        <th className="p-3">Event Chamber</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C9A44C]/20 bg-[#001C16]/60">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-[#8C6F2D]">
                            No wizard registrations recorded yet.
                          </td>
                        </tr>
                      ) : (
                        registrations
                          .filter(r =>
                            r.fullName.toLowerCase().includes(searchReg.toLowerCase()) ||
                            r.college.toLowerCase().includes(searchReg.toLowerCase()) ||
                            r.referenceId.toLowerCase().includes(searchReg.toLowerCase())
                          )
                          .map(reg => (
                            <tr key={reg.id} className="hover:bg-[#003B2D]/30 transition-colors">
                              <td className="p-3 font-bold text-[#F9DF88]">{reg.referenceId}</td>
                              <td className="p-3">
                                <p className="font-bold text-[#FFF0B8]">{reg.fullName}</p>
                                <p className="text-[10px] text-[#A7F3D0]">{reg.email}</p>
                              </td>
                              <td className="p-3">
                                <p className="text-[#D9C99F]">{reg.college}</p>
                                <p className="text-[10px] text-[#8C6F2D]">{reg.department} ({reg.year})</p>
                              </td>
                              <td className="p-3 text-[#A7F3D0]">{reg.eventName}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  reg.status === 'Confirmed'
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                                    : 'bg-amber-950/80 text-amber-300 border border-amber-700'
                                }`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleUpdateRegStatus(reg.id, reg.status)}
                                  className="px-2.5 py-1 rounded border border-[#C9A44C]/40 text-[#E6C66F] hover:border-[#FFF0B8] text-[10px]"
                                >
                                  Flip Status
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

            {/* TAB 3: MANAGE EVENTS (CRUD) */}
            {activeTab === 'events' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <h4 className="font-cinzel text-sm font-bold text-[#E6C66F] uppercase">
                    Tournament Trial Vaults
                  </h4>
                  <button
                    onClick={() => {
                      setEditingEvent(null);
                      setEventForm({
                        name: '',
                        category: 'Technical',
                        tagline: '',
                        description: '',
                        date: 'Day 1 — 14 March 2026',
                        time: '10:00 AM',
                        venue: 'The Great Hall',
                        fee: '150 Galleons',
                        participation: 'Solo',
                        rules: 'Rule 1: Bring valid ID\nRule 2: Respect the Inquisitor',
                        prizes: '10,000 Galleons + Trophy',
                        maxParticipants: 50,
                        chamberName: 'Chamber Vault'
                      });
                      setShowEventModal(true);
                    }}
                    className="px-4 py-2 rounded font-cinzel text-xs font-bold text-[#090D0B] bg-[#C9A44C] hover:bg-[#F9DF88] flex items-center space-x-1.5 uppercase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD NEW CHAMBER</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(ev => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-lg border border-[#C9A44C]/30 bg-[#00140F]/80 flex items-start justify-between"
                    >
                      <div>
                        <span className="font-cinzel text-[10px] text-[#A7F3D0] uppercase">
                          {ev.category} • {ev.fee}
                        </span>
                        <h4 className="font-cinzel text-base font-bold text-gold-gradient mt-0.5">
                          {ev.name}
                        </h4>
                        <p className="font-cormorant text-xs text-[#C6C9C8] line-clamp-2 mt-1">
                          {ev.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingEvent(ev);
                            setEventForm({
                              name: ev.name,
                              category: ev.category,
                              tagline: ev.tagline,
                              description: ev.description,
                              date: ev.date,
                              time: ev.time,
                              venue: ev.venue,
                              fee: ev.fee,
                              participation: ev.participation,
                              rules: ev.rules.join('\n'),
                              prizes: ev.prizes,
                              maxParticipants: ev.maxParticipants || 50,
                              chamberName: ev.chamberName
                            });
                            setShowEventModal(true);
                          }}
                          className="p-1.5 rounded border border-[#C9A44C]/40 text-[#E6C66F] hover:border-[#FFF0B8]"
                          title="Edit Chamber"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1.5 rounded border border-red-900/60 text-red-400 hover:border-red-500"
                          title="Delete Chamber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODAL: CREATE / EDIT EVENT FORM */}
        {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl parchment-card p-8 rounded-xl border-4 border-[#8C6F2D] text-[#1A1409]">
              <div className="flex justify-between items-center border-b-2 border-[#8C6F2D] pb-3 mb-4">
                <h3 className="font-cinzel text-xl font-bold uppercase">
                  {editingEvent ? 'Edit Chamber Record' : 'Inscribe New Chamber'}
                </h3>
                <button onClick={() => setShowEventModal(false)} className="p-1">
                  <X className="w-5 h-5 text-[#8C6F2D]" />
                </button>
              </div>

              <form onSubmit={handleCreateOrUpdateEvent} className="space-y-4 font-cinzel text-xs">
                <div>
                  <label className="block font-bold mb-1">Chamber Name *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.name}
                    onChange={e => setEventForm({ ...eventForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#F5EEDC] border border-[#8C6F2D] text-sm text-[#1A1409]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Category</label>
                    <select
                      value={eventForm.category}
                      onChange={e => setEventForm({ ...eventForm, category: e.target.value as EventCategory })}
                      className="w-full px-3 py-2 rounded bg-[#F5EEDC] border border-[#8C6F2D] text-sm text-[#1A1409]"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Non-Technical">Non-Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Special">Special</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Fee (Galleons)</label>
                    <input
                      type="text"
                      value={eventForm.fee}
                      onChange={e => setEventForm({ ...eventForm, fee: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#F5EEDC] border border-[#8C6F2D] text-sm text-[#1A1409]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={eventForm.tagline}
                    onChange={e => setEventForm({ ...eventForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#F5EEDC] border border-[#8C6F2D] text-sm text-[#1A1409]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#F5EEDC] border border-[#8C6F2D] text-sm text-[#1A1409]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Venue</label>
                    <input
                      type="text"
                      value={eventForm.venue}
                      onChange={e => setEventForm({ ...eventForm, venue: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#F5EEDC] border border-[#8C6F2D] text-sm text-[#1A1409]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Bounties / Prizes</label>
                    <input
                      type="text"
                      value={eventForm.prizes}
                      onChange={e => setEventForm({ ...eventForm, prizes: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#F5EEDC] border border-[#8C6F2D] text-sm text-[#1A1409]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Rules (One per line)</label>
                  <textarea
                    rows={3}
                    value={eventForm.rules}
                    onChange={e => setEventForm({ ...eventForm, rules: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#F5EEDC] border border-[#8C6F2D] text-sm text-[#1A1409]"
                  />
                </div>

                <div className="pt-3 border-t-2 border-[#8C6F2D] flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 rounded border border-[#8C6F2D] text-[#1A1409]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded font-bold text-[#FFF0B8] bg-[#003B2D] border border-[#C9A44C]"
                  >
                    Save Chamber
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
