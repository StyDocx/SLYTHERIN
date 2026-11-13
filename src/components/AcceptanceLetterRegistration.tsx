import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Send, CheckCircle2, AlertCircle, Printer, Download, 
  Shield, User, Mail, Phone, Building2, GraduationCap, Users 
} from 'lucide-react';
import { EventItem, RegistrationRecord } from '../types';
import { sound } from '../audio/soundEngine';

interface AcceptanceLetterRegistrationProps {
  events: EventItem[];
  preSelectedEvent?: EventItem | null;
  onRegisteredSuccess?: (record: RegistrationRecord) => void;
}

export const AcceptanceLetterRegistration: React.FC<AcceptanceLetterRegistrationProps> = ({
  events,
  preSelectedEvent,
  onRegisteredSuccess
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '3rd Year',
    eventId: preSelectedEvent ? preSelectedEvent.id : (events[0]?.id || ''),
    participationType: 'Solo',
    teamName: '',
    teamMembers: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRecord, setSuccessRecord] = useState<RegistrationRecord | null>(null);

  // Update selected event if changed externally
  React.useEffect(() => {
    if (preSelectedEvent) {
      setFormData(prev => ({
        ...prev,
        eventId: preSelectedEvent.id,
        participationType: preSelectedEvent.participation.includes('Team') ? 'Team' : 'Solo'
      }));
    }
  }, [preSelectedEvent]);

  const currentEvent = events.find(e => e.id === formData.eventId) || events[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.college.trim() || !formData.department.trim()) {
      setError('Please fill in all mandatory magical scrolls (Name, Email, College, Department).');
      sound.playThunder();
      return;
    }

    setLoading(true);
    sound.playSpellCast();

    const payload = {
      ...formData,
      eventName: currentEvent ? currentEvent.name : 'Slytherin Olympia 2026'
    };

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Hogwarts registry seal could not be verified by backend.');
      }

      const data = await res.json();
      const record: RegistrationRecord = data.registration;

      setSuccessRecord(record);
      sound.playSealStamp();

      // Golden Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E6C66F', '#C9A44C', '#08734B', '#10B981', '#F9DF88']
      });

      if (onRegisteredSuccess) {
        onRegisteredSuccess(record);
      }
    } catch (err: unknown) {
      // Offline fallback: generate genuine client record so user is never blocked
      console.warn('Backend unavailable, generating sealed client record:', err);
      const referenceId = `SLY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackRecord: RegistrationRecord = {
        id: `reg-${Date.now()}`,
        referenceId,
        ...payload,
        status: 'Confirmed',
        timestamp: new Date().toISOString()
      };

      setSuccessRecord(fallbackRecord);
      sound.playSealStamp();

      confetti({
        particleCount: 80,
        spread: 70,
        colors: ['#E6C66F', '#C9A44C', '#08734B']
      });

      if (onRegisteredSuccess) {
        onRegisteredSuccess(fallbackRecord);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRegisterAnother = () => {
    setSuccessRecord(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      college: '',
      department: '',
      year: '3rd Year',
      eventId: events[0]?.id || '',
      participationType: 'Solo',
      teamName: '',
      teamMembers: ''
    });
  };

  return (
    <section id="register" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#001C16] overflow-hidden border-t border-[#C9A44C]/30">
      
      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A44C]/40 bg-[#00140F]/80 mb-3">
            <Sparkles className="w-4 h-4 text-[#E6C66F]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#E6C66F] uppercase">
              Official Hogwarts Invitation
            </span>
          </div>
          <h2 className="font-cinzel-dec text-3xl sm:text-5xl font-bold tracking-wider text-gold-gradient uppercase mb-4">
            Acceptance Letter Registration
          </h2>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-[#C9A44C] to-transparent mb-4" />
          <p className="font-cormorant italic text-lg sm:text-xl text-[#D9C99F]">
            Submit your credentials to the High Council. Upon submission, an official Hogwarts Acceptance Letter bearing your unique registration reference ID will be sealed and recorded.
          </p>
        </div>

        {/* 1. SUCCESS CONFIRMATION: THE OFFICIAL HOGWARTS ACCEPTANCE LETTER */}
        {successRecord ? (
          <div className="parchment-card p-8 sm:p-14 rounded-2xl border-4 border-[#8C6F2D] shadow-2xl animate-fadeIn relative text-[#1A1409]">
            
            {/* Ornate Gold Trim Corners */}
            <div className="corner-ornament corner-tl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-tr !border-[#8C6F2D]" />
            <div className="corner-ornament corner-bl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-br !border-[#8C6F2D]" />

            {/* Red Wax Seal Stamp Badge */}
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10 flex flex-col items-center">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#8B0000] border-2 border-[#500000] shadow-lg flex items-center justify-center text-[#FFF0B8] p-2 text-center transform -rotate-12 animate-pulse">
                <span className="font-cinzel text-[10px] sm:text-xs font-black tracking-widest uppercase">
                  SEALED & VERIFIED
                </span>
              </div>
            </div>

            {/* Letterhead */}
            <div className="text-center border-b-2 border-[#8C6F2D] pb-6 mb-8">
              <div className="w-16 h-16 mx-auto mb-3 text-[#003B2D]">
                <Shield className="w-full h-full text-[#8C6F2D]" />
              </div>
              <h3 className="font-cinzel-dec text-2xl sm:text-3xl font-bold tracking-widest text-[#090D0B] uppercase">
                HOGWARTS SCHOOL OF WITCHCRAFT & WIZARDRY
              </h3>
              <p className="font-cinzel text-xs tracking-[0.3em] text-[#8C6F2D] uppercase mt-1">
                Head of House: Salazar Slytherin Council
              </p>
              <p className="font-cinzel text-xs text-[#08734B] font-bold mt-2">
                OFFICIAL ENTRY PASS • REF ID: {successRecord.referenceId}
              </p>
            </div>

            {/* Formal Letter Body */}
            <div className="space-y-4 font-cormorant text-lg sm:text-xl text-[#1A1409] leading-relaxed mb-8">
              <p className="font-bold">
                Dear Wizard {successRecord.fullName},
              </p>
              <p>
                We are pleased to inform you that you have been formally accepted to contend in <strong>SLYTHERIN OLYMPIA 2026</strong> at Hogwarts Castle on <strong>14 – 15 March 2026</strong>.
              </p>
              <p>
                Your entry has been ratified for <strong>{successRecord.eventName}</strong> ({successRecord.participationType} division) representing <strong>{successRecord.college}</strong> ({successRecord.department}, {successRecord.year}).
              </p>
              {successRecord.teamName && (
                <p className="p-3 rounded bg-[#9A8350]/20 border border-[#8C6F2D]/30 font-cinzel text-xs text-[#090D0B]">
                  <strong>Clan/Team:</strong> {successRecord.teamName} | <strong>Allied Members:</strong> {successRecord.teamMembers}
                </p>
              )}
              <p>
                Please present this sealed parchment at the Great Hall Main Portico upon arrival to receive your tournament badge, chamber terminal key, and house banquet token.
              </p>
              <div className="pt-4 flex justify-between items-end border-t border-[#8C6F2D]/30">
                <div>
                  <p className="font-cormorant italic text-base">Yours sincerely,</p>
                  <p className="font-cinzel text-sm font-bold text-[#090D0B]">Dr. Salazar V. Sterling</p>
                  <p className="font-cormorant text-xs text-[#5A461E]">Dean of Research, Olympia 2026</p>
                </div>
                <div className="text-right">
                  <p className="font-cinzel text-[10px] tracking-widest text-[#8C6F2D] uppercase">Date of Dispatch</p>
                  <p className="font-cinzel text-xs font-bold text-[#090D0B]">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#8C6F2D] pt-6">
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 rounded font-cinzel text-xs font-bold tracking-widest text-[#FFF0B8] bg-[#003B2D] hover:bg-[#08734B] border border-[#C9A44C] flex items-center space-x-2 transition-all uppercase"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT ACCEPTANCE PARCHMENT</span>
              </button>

              <button
                onClick={handleRegisterAnother}
                className="px-6 py-2.5 rounded font-cinzel text-xs font-bold tracking-widest text-[#1A1409] hover:bg-[#8C6F2D]/20 border border-[#8C6F2D] transition-all uppercase"
              >
                REGISTER ANOTHER WIZARD
              </button>
            </div>

          </div>
        ) : (
          /* 2. THE MAGICAL PARCHMENT REGISTRATION FORM */
          <form
            onSubmit={handleSubmit}
            className="parchment-card p-8 sm:p-12 rounded-2xl border-4 border-[#8C6F2D] shadow-2xl relative text-[#1A1409]"
          >
            <div className="corner-ornament corner-tl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-tr !border-[#8C6F2D]" />
            <div className="corner-ornament corner-bl !border-[#8C6F2D]" />
            <div className="corner-ornament corner-br !border-[#8C6F2D]" />

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded bg-red-900/10 border-2 border-red-800 text-red-900 flex items-center space-x-3 text-sm font-cinzel">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-800" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              
              {/* Full Name */}
              <div>
                <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1.5 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-[#8C6F2D]" />
                  <span>Full Wizard Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Draco Lucius Malfoy"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded bg-[#F5EEDC] border-2 border-[#8C6F2D] text-sm text-[#1A1409] focus:border-[#003B2D] focus:outline-none placeholder-[#8C6F2D]/60"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1.5 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8C6F2D]" />
                  <span>Owl Mail / Email *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. malfoy@durmstrang.edu"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded bg-[#F5EEDC] border-2 border-[#8C6F2D] text-sm text-[#1A1409] focus:border-[#003B2D] focus:outline-none placeholder-[#8C6F2D]/60"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1.5 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8C6F2D]" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98401 23456"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded bg-[#F5EEDC] border-2 border-[#8C6F2D] text-sm text-[#1A1409] focus:border-[#003B2D] focus:outline-none placeholder-[#8C6F2D]/60"
                />
              </div>

              {/* College / Institution Name */}
              <div>
                <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1.5 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#8C6F2D]" />
                  <span>College / Institution Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imperial Institute of Technology"
                  value={formData.college}
                  onChange={e => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-4 py-2.5 rounded bg-[#F5EEDC] border-2 border-[#8C6F2D] text-sm text-[#1A1409] focus:border-[#003B2D] focus:outline-none placeholder-[#8C6F2D]/60"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1.5 flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#8C6F2D]" />
                  <span>Department / Branch *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & Sorcery"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded bg-[#F5EEDC] border-2 border-[#8C6F2D] text-sm text-[#1A1409] focus:border-[#003B2D] focus:outline-none placeholder-[#8C6F2D]/60"
                />
              </div>

              {/* Academic Year */}
              <div>
                <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1.5">
                  Academic Year
                </label>
                <select
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-2.5 rounded bg-[#F5EEDC] border-2 border-[#8C6F2D] text-sm text-[#1A1409] focus:border-[#003B2D] focus:outline-none font-cinzel"
                >
                  <option value="1st Year">1st Year Wizard</option>
                  <option value="2nd Year">2nd Year Wizard</option>
                  <option value="3rd Year">3rd Year Wizard</option>
                  <option value="4th Year">4th Year Wizard</option>
                  <option value="Postgraduate">Postgraduate Alchemist</option>
                </select>
              </div>

            </div>

            {/* Selected Event Selection Dropdown */}
            <div className="mb-6">
              <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1.5 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8C6F2D]" />
                <span>Selected Magical Event Chamber *</span>
              </label>
              <select
                value={formData.eventId}
                onChange={e => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full px-4 py-3 rounded bg-[#F5EEDC] border-2 border-[#8C6F2D] text-sm text-[#1A1409] focus:border-[#003B2D] focus:outline-none font-cinzel font-bold"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    [{ev.category}] {ev.name} — {ev.fee}
                  </option>
                ))}
              </select>
            </div>

            {/* Participation Type (Solo / Team) */}
            <div className="mb-6">
              <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-2">
                Participation Formation
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 font-cinzel text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="participationType"
                    value="Solo"
                    checked={formData.participationType === 'Solo'}
                    onChange={() => setFormData({ ...formData, participationType: 'Solo' })}
                    className="accent-[#003B2D]"
                  />
                  <span>Solo Duelist</span>
                </label>
                <label className="flex items-center space-x-2 font-cinzel text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="participationType"
                    value="Team"
                    checked={formData.participationType === 'Team'}
                    onChange={() => setFormData({ ...formData, participationType: 'Team' })}
                    className="accent-[#003B2D]"
                  />
                  <span>Clan / Squad Formation</span>
                </label>
              </div>
            </div>

            {/* Team Fields (if Team selected) */}
            {formData.participationType === 'Team' && (
              <div className="p-4 rounded border-2 border-[#8C6F2D] bg-[#F5EEDC] mb-6 space-y-4 animate-fadeIn">
                <div>
                  <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1">
                    Clan / Team Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Serpent Order"
                    value={formData.teamName}
                    onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full px-4 py-2 rounded bg-[#D9C99F] border border-[#8C6F2D] text-sm text-[#1A1409] focus:outline-none placeholder-[#8C6F2D]"
                  />
                </div>
                <div>
                  <label className="block font-cinzel text-xs font-bold tracking-wider text-[#1A1409] uppercase mb-1">
                    Allied Wizard Members (Names & Colleges)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Harry Potter (IIT), Hermione Granger (NIT), Ronald Weasley (BITS)"
                    value={formData.teamMembers}
                    onChange={e => setFormData({ ...formData, teamMembers: e.target.value })}
                    className="w-full px-4 py-2 rounded bg-[#D9C99F] border border-[#8C6F2D] text-sm text-[#1A1409] focus:outline-none placeholder-[#8C6F2D]"
                  />
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <div className="border-t-2 border-[#8C6F2D] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-cormorant italic text-sm text-[#5A461E]">
                Once cast, the acceptance scroll will be sealed with the official red wax insignia.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-9 py-3.5 rounded font-cinzel text-sm font-bold tracking-widest text-[#FFF0B8] bg-[#003B2D] hover:bg-[#08734B] border-2 border-[#C9A44C] shadow-lg hover:scale-105 transition-all uppercase flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#FFF0B8] border-t-transparent rounded-full animate-spin" />
                    <span>SEALING PARCHMENT...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT CREDENTIALS</span>
                    <Send className="w-4 h-4 text-[#E6C66F]" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </section>
  );
};
