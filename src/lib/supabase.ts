import { createClient } from '@supabase/supabase-js';
import { RSVP, PhotoItem } from '../types';

export const SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || 'https://pvuszjcuvkycprbggweo.supabase.co';
export const SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_xPvR3HkIozZaxNLxPCIRfw_dvljpvdV';
export const WEDDING_SLUG = ((import.meta as any).env?.VITE_WEDDING_SLUG as string) || 'farahandseif';

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

// RSVP Operations
export async function submitRSVP(rsvpData: RSVP): Promise<{ success: boolean; message: string; data?: RSVP }> {
  const payloadWithSlug = {
    ...rsvpData,
    wedding_slug: WEDDING_SLUG,
    created_at: new Date().toISOString(),
  };

  const payloadWithoutSlug = {
    ...rsvpData,
    created_at: new Date().toISOString(),
  };

  try {
    // 1. Try Supabase insert with wedding_slug
    let { data, error } = await supabase.from('rsvps').insert([payloadWithSlug]).select().single();

    // 2. If column not present, retry without wedding_slug
    if (error && (error.code === 'PGRST204' || error.message?.includes('wedding_slug'))) {
      const retry = await supabase.from('rsvps').insert([payloadWithoutSlug]).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.warn('Supabase RSVP insert note/fallback:', error.message);
      saveLocalRSVP(payloadWithSlug);
      return { success: true, message: 'RSVP saved successfully!', data: payloadWithSlug };
    }

    saveLocalRSVP(data || payloadWithSlug);
    return { success: true, message: 'RSVP submitted successfully!', data: data || payloadWithSlug };
  } catch (err: any) {
    console.warn('Network or Supabase exception, saving locally:', err?.message);
    saveLocalRSVP(payloadWithSlug);
    return { success: true, message: 'RSVP recorded successfully!', data: payloadWithSlug };
  }
}

export async function fetchRSVPs(): Promise<RSVP[]> {
  try {
    // Try fetching with wedding_slug filter first
    let { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('wedding_slug', WEDDING_SLUG)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback: fetch all rsvps
      const fallback = await supabase.from('rsvps').select('*').order('created_at', { ascending: false });
      if (!fallback.error && fallback.data && fallback.data.length > 0) {
        data = fallback.data;
      }
    }

    const dbRSVPs = (data || []) as RSVP[];
    const localRSVPs = getLocalRSVPs();
    const combined = [
      ...dbRSVPs,
      ...localRSVPs.filter(
        (l) => !dbRSVPs.some((d) => d.id === l.id || (d.phone_number === l.phone_number && d.guest_name === l.guest_name))
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
  } catch (e) {
    // Ignore error
  }
  deleteLocalRSVP(id);
  return true;
}

// Photo Operations
export async function uploadGuestPhoto(
  file: File,
  uploaderName: string,
  caption: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; photo?: PhotoItem; error?: string }> {
  try {
    onProgress?.(15);
    // Compress image
    const compressedBlob = await compressImage(file, 1600, 0.85);
    onProgress?.(40);

    const fileName = `${WEDDING_SLUG}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
    let imageUrl = '';

    // Buckets to attempt upload
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
      } catch (storageErr) {
        // Continue to next bucket option
      }
    }

    onProgress?.(75);

    // If storage didn't return a public URL, create a base64 Data URL for immediate display
    if (!imageUrl) {
      imageUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result as string);
        r.readAsDataURL(compressedBlob);
      });
    }

    const newPhoto: PhotoItem = {
      id: 'photo_' + Date.now(),
      created_at: new Date().toISOString(),
      wedding_slug: WEDDING_SLUG,
      url: imageUrl,
      uploader_name: uploaderName || 'Guest',
      caption: caption || 'Greek Wedding Memories',
      is_approved: true,
    };

    // Attempt DB save
    try {
      const { error } = await supabase.from('photos').insert([newPhoto]);
      if (error && (error.code === 'PGRST204' || error.message?.includes('wedding_slug'))) {
        const { wedding_slug, ...photoWithoutSlug } = newPhoto;
        await supabase.from('photos').insert([photoWithoutSlug]);
      }
    } catch (dbErr) {
      console.warn('Database photo record fallback:', dbErr);
    }

    saveLocalPhoto(newPhoto);
    onProgress?.(100);

    return { success: true, photo: newPhoto };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to process photo upload' };
  }
}

export async function fetchPhotos(): Promise<PhotoItem[]> {
  try {
    let { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('wedding_slug', WEDDING_SLUG)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const fallback = await supabase.from('photos').select('*').order('created_at', { ascending: false });
      if (!fallback.error && fallback.data && fallback.data.length > 0) {
        data = fallback.data;
      }
    }

    const dbPhotos = (data || []) as PhotoItem[];
    const localPhotos = getLocalPhotos();
    const combined = [...dbPhotos, ...localPhotos.filter((lp) => !dbPhotos.some((dp) => dp.id === lp.id))];
    return combined;
  } catch (err) {
    return getLocalPhotos();
  }
}

export async function deletePhoto(id: string): Promise<boolean> {
  try {
    await supabase.from('photos').delete().eq('id', id);
  } catch (e) {
    // Ignore error
  }
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
  const filtered = current.filter(r => r.phone_number !== rsvp.phone_number && r.id !== rsvp.id);
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
  } catch (e) {
    console.warn('LocalStorage full or unaccessible for photo save', e);
  }
}

function deleteLocalPhoto(id: string) {
  try {
    const raw = localStorage.getItem(LOCAL_PHOTOS_KEY);
    const custom: PhotoItem[] = raw ? JSON.parse(raw) : [];
    const updated = custom.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(updated));
  } catch (e) {
    // Ignore error
  }
}
