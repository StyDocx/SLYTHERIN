export type EventCategory = 'Technical' | 'Non-Technical' | 'Cultural' | 'Gaming' | 'Special';

export interface Coordinator {
  name: string;
  title: string;
  phone?: string;
  owlEmail?: string;
}

export interface EventItem {
  id: string;
  name: string;
  category: EventCategory;
  tagline: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  fee: string;
  participation: string;
  rules: string[];
  prizes: string;
  maxParticipants?: number;
  coordinators: Coordinator[];
  chamberName: string;
  iconName: string;
  badge: string;
  featured?: boolean;
}

export interface RegistrationRecord {
  id: string;
  referenceId: string;
  eventId: string;
  eventName: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  participationType: string;
  teamName?: string;
  teamMembers?: string;
  status: 'Confirmed' | 'Pending Verification' | 'Archived';
  timestamp: string;
}

export interface WizardProfile {
  id: string;
  name: string;
  role: string;
  house: string;
  title: string;
  department: string;
  specialty: string;
  quote: string;
  portraitSymbol: string;
}

export interface ScheduleItem {
  id: string;
  day: 1 | 2;
  time: string;
  event: string;
  category: EventCategory;
  venue: string;
  status: 'Upcoming' | 'Live Now' | 'Completed';
  description?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  type: 'urgent' | 'info' | 'scroll';
}
