export interface RSVP {
  id?: string;
  created_at?: string;
  wedding_slug?: string;
  guest_name: string;
  phone_number: string;
  email?: string;
  number_of_guests: number;
  attendance: 'yes' | 'no';
  dietary_notes?: string;
  message?: string;
}

export interface PhotoItem {
  id: string;
  created_at: string;
  wedding_slug?: string;
  url: string;
  uploader_name?: string;
  caption?: string;
  is_approved?: boolean;
}

export interface ScheduleEvent {
  time: string;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  iconName: string;
}

export interface StoryMilestone {
  year: string;
  title: string;
  location: string;
  description: string;
  imageUrl?: string;
}
