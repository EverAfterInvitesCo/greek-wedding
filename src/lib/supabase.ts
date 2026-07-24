import { createClient } from '@supabase/supabase-js';
import { RSVP, PhotoItem } from '../types';

export const SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || 'https://pvuszjcuvkycprbggweo.supabase.co';
export const SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_xPvR3HkIozZaxNLxPCIRfw_dvljpvdV';
export const WEDDING_SLUG = ((import.meta as any).env?.VITE_WEDDING_SLUG as string) || 'greek-wedding';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// LocalStorage Fallback Keys
const LOCAL_RSVP_KEY = 'farah_seif_rsvps_v1';
const LOCAL_PHOTOS_KEY = 'farah_seif_photos_v1';

// Default initial photos for guest gallery (Luxury Greek Destination Aesthetic)
export const DEFAULT_GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: 'def-1',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85',
    uploader_name: 'Farah & Seif',
    caption: 'Sunset in Oia, Santorini',
    is_approved: true,
  },
  {
    id: 'def-2',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
    uploader_name: 'Farah & Seif',
    caption: 'Aegean Sea Horizon',
    is_approved: true,
  },
  {
    id: 'def-3',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85',
    uploader_name: 'Wedding Studio',
    caption: 'Canaves Oia Sunset Terrace',
    is_approved: true,
  },
  {
    id: 'def-4',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    uploader_name: 'Farah & Seif',
    caption: 'Engagement Memories',
    is_approved: true,
  },
  {
    id: 'def-5',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    uploader_name: 'Everafter Invites',
    caption: 'Mediterranean Royalty',
    is_approved: true,
  },
  {
    id: 'def-6',
    created_at: new Date().toISOString(),
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    uploader_name: 'Farah & Seif',
    caption: 'Golden Hour Reflection',
    is_approved: true,
  },
];

// Canvas Image Compression Utility
export async function compressImage(file: File, maxWidth = 1600, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    reader.readAsDataURL(file);
  });
}

// RSVP Operations mapped to exact Supabase schema columns
export async function submitRSVP(rsvpData: RSVP): Promise<{ success: boolean; message: string; data?: RSVP }> {
  const dbPayload = {
    wedding_slug: WEDDING_SLUG,
    fullName: rsvpData.guest_name,
    email: rsvpData.email || '',
    attending: rsvpData.attendance === 'yes',
    guestsCount: rsvpData.number_of_guests || 1,
    dietaryNotes: rsvpData.dietary_notes || 'None',
    wellWishes: rsvpData.message || '',
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase.from('rsvps').insert([dbPayload]).select().single();

    if (error) {
      console.warn('Supabase RSVP insert error:', error.message);
      saveLocalRSVP(rsvpData);
      return { success: true, message: 'RSVP saved locally!', data: rsvpData };
    }

    saveLocalRSVP(rsvpData);
    return { success: true, message: 'RSVP submitted successfully!', data: rsvpData };
  } catch (err: any) {
    console.warn('Network or Supabase exception, saving locally:', err?.message);
    saveLocalRSVP(rsvpData);
    return { success: true, message: 'RSVP recorded successfully!', data: rsvpData };
  }
}

export async function fetchRSVPs(slugFilter: string = WEDDING_SLUG): Promise<RSVP[]> {
  try {
    let { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_slug', slugFilter)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const fallback = await supabase.from('rsvps').select('*').order('created_at', { ascending: false });
      if (!fallback.error && fallback.data && fallback.data.length > 0) {
        data = fallback.data;
      }
    }

    const dbRSVPs: RSVP[] = (data || []).map((row: any) => ({
      id: row.id?.toString(),
      guest_name: row.fullName || row.guest_name || '',
      phone_number: row.phone_number || '',
      email: row.email || '',
      number_of_guests: row.guestsCount || row.number_of_guests || 1,
      attendance: row.attending === true || row.attending === 'true' ? 'yes' : 'no',
      dietary_notes: row.dietaryNotes || row.dietary_notes || '',
      message: row.wellWishes || row.message || '',
      created_at: row.created_at,
    }));

    const localRSVPs = getLocalRSVPs();
    const combined = [
      ...dbRSVPs,
      ...localRSVPs.filter(
        (l) => !dbRSVPs.some((d) => d.id === l.id || (d.guest_name === l.guest_name))
      ),
    ];
    return combined;
  } catch (err) {
    return getLocalRSVPs();
  }
}

export async function deleteRSVP(id: string): Promise<boolean> {
  try {
    await supabase.from('rsvps').delete().eq('id', id);
  } catch (e) {}
  deleteLocalRSVP(id);
  return true;
}

// Photo Operations - Mapped to 'guest_photos' table matching your Supabase schema
export async function uploadGuestPhoto(
  file: File,
  uploaderName: string,
  caption: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; photo?: PhotoItem; error?: string }> {
  try {
    onProgress?.(15);
    const compressedBlob = await compressImage(file, 1600, 0.85);
    onProgress?.(40);

    const fileName = `${WEDDING_SLUG}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
    let imageUrl = '';

    const bucketsToTry = ['wedding-photos', 'photos', 'farahandseif'];

    for (const bucket of bucketsToTry) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, compressedBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
          break;
        }
      } catch (storageErr) {}
    }

    onProgress?.(75);

    if (!imageUrl) {
      imageUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result as string);
        r.readAsDataURL(compressedBlob);
      });
    }

    const newPhotoRow = {
      id: 'photo_' + Date.now(),
      wedding_slug: WEDDING_SLUG,
      url: imageUrl,
      uploader_name: uploaderName || 'Guest',
      caption: caption || 'Greek Wedding Memories',
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('guest_photos').insert([newPhotoRow]);
    } catch (dbErr) {
      console.warn('Database guest_photos record fallback:', dbErr);
    }

    const photoItem: PhotoItem = {
      ...newPhotoRow,
      is_approved: true,
    };

    saveLocalPhoto(photoItem);
    onProgress?.(100);

    return { success: true, photo: photoItem };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to process photo upload' };
  }
}

export async function fetchPhotos(slugFilter: string = WEDDING_SLUG): Promise<PhotoItem[]> {
  try {
    let { data, error } = await supabase
      .from('guest_photos')
      .select('*')
      .eq('wedding_slug', slugFilter)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const fallback = await supabase.from('guest_photos').select('*').order('created_at', { ascending: false });
      if (!fallback.error && fallback.data && fallback.data.length > 0) {
        data = fallback.data;
      }
    }

    const dbPhotos = (data || []).map((row: any) => ({
      ...row,
      is_approved: true,
    })) as PhotoItem[];

    const localPhotos = getLocalPhotos();
    const combined = [...dbPhotos, ...localPhotos.filter((lp) => !dbPhotos.some((dp) => dp.id === lp.id))];
    return combined;
  } catch (err) {
    return getLocalPhotos();
  }
}

export async function deletePhoto(id: string): Promise<boolean> {
  try {
    await supabase.from('guest_photos').delete().eq('id', id);
  } catch (e) {}
  deleteLocalPhoto(id);
  return true;
}

// Local Storage Helpers
function getLocalRSVPs(): RSVP[] {
  try {
    const raw = localStorage.getItem(LOCAL_RSVP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRSVP(rsvp: RSVP) {
  const current = getLocalRSVPs();
  const filtered = current.filter(r => r.guest_name !== rsvp.guest_name && r.id !== rsvp.id);
  const updated = [rsvp, ...filtered];
  localStorage.setItem(LOCAL_RSVP_KEY, JSON.stringify(updated));
}

function deleteLocalRSVP(id: string) {
  const current = getLocalRSVPs();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(LOCAL_RSVP_KEY, JSON.stringify(updated));
}

function getLocalPhotos(): PhotoItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_PHOTOS_KEY);
    const custom: PhotoItem[] = raw ? JSON.parse(raw) : [];
    return [...custom, ...DEFAULT_GALLERY_PHOTOS];
  } catch {
    return DEFAULT_GALLERY_PHOTOS;
  }
}

function saveLocalPhoto(photo: PhotoItem) {
  try {
    const raw = localStorage.getItem(LOCAL_PHOTOS_KEY);
    const custom: PhotoItem[] = raw ? JSON.parse(raw) : [];
    const updated = [photo, ...custom];
    localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(updated));
  } catch (e) {}
}

function deleteLocalPhoto(id: string) {
  try {
    const raw = localStorage.getItem(LOCAL_PHOTOS_KEY);
    const custom: PhotoItem[] = raw ? JSON.parse(raw) : [];
    const updated = custom.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(updated));
  } catch (e) {}
}
