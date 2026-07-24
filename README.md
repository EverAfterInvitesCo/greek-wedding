# Farah & Seif — Premium Greek Vacation Digital Wedding Invitation Website

A luxury destination wedding digital invitation for **Farah and Seif** set in Santorini, Greece. Designed with an editorial high-fashion aesthetic featuring rich midnight navy, Aegean royal blue, warm metallic gold accents, glassmorphism, countdown timer, interactive itinerary schedule, live Supabase RSVP system, guest photo uploader with client-side image compression, masonry photo gallery, and a password-protected organizer portal.

---

## 📁 Public Media Files (`/public`)

Place your custom video and photo assets directly in the `public` folder:

```text
public/
  ├── intro.mp4        # Fullscreen intro video played on first load
  ├── greek.mp4        # Background looping video for the Hero section
  └── images/          # Additional photo assets if desired
```

### Reference Pathing:
- Intro Video: `/intro.mp4`
- Hero Background Video: `/greek.mp4`

*(Note: If these files are absent, the application gracefully renders high-end animated fallback visuals.)*

---

## 🛠️ Project Setup & Installation

### Prerequisites
- **Node.js**: v18.x or v20.x installed
- **npm**: v9.x or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
The optimized production build output will be generated in the `dist/` directory.

---

## ⚡ Supabase Setup & Configuration

This project is pre-configured to connect to the following Supabase backend:

- **Supabase URL**: `https://pvuszjcuvkycprbggweo.supabase.co`
- **Anon Public Key**: `sb_publishable_xPvR3HkIozZaxNLxPCIRfw_dvljpvdV`

### Database Schema SQL (Optional / Reference)

If setting up a fresh Supabase instance, run these queries in your Supabase SQL Editor:

```sql
-- 1. Create RSVPs table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  guest_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  number_of_guests INT DEFAULT 1,
  attendance TEXT CHECK (attendance IN ('yes', 'no')),
  dietary_notes TEXT,
  message TEXT
);

-- 2. Create Photos metadata table
CREATE TABLE IF NOT EXISTS public.photos (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  url TEXT NOT NULL,
  uploader_name TEXT,
  caption TEXT,
  is_approved BOOLEAN DEFAULT true
);

-- 3. Storage Bucket
-- Create a public bucket named 'wedding-photos' in Supabase Storage with public read access.
```

*(Note: The website features automatic LocalStorage fallback, so all RSVP submissions, guest photo uploads, and gallery operations work seamlessly even if the database table or bucket is offline.)*

---

## 🚀 GitHub Actions Deployment (GitHub Pages)

This repository includes an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`.

### Deployment Steps:
1. Push your code to the `main` branch on GitHub.
2. In your GitHub repository settings, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. In `vite.config.ts`, if deploying to a subfolder (e.g. `https://<username>.github.io/<repo-name>/`), update the `base` configuration:
   ```ts
   base: '/<YOUR_REPOSITORY_NAME>/'
   ```
5. The workflow will automatically trigger on every push to `main`, build the app, and deploy it to GitHub Pages.

---

## 🔒 Organizer Portal Access

To open the secret Organizer Admin Portal:
1. Click the **Shield / Lock icon** in the top navigation bar or bottom footer.
2. Enter the passkey: `FarahSeif2027` (or `admin`).
3. Features:
   - Live RSVP statistics (Attending, Declined, Total Guests).
   - Search & Filter RSVPs by guest name or status.
   - One-click **Export to CSV** (`wedding_rsvps.csv`).
   - Add guest RSVPs manually.
   - Delete / Moderate guest uploaded photos and RSVPs.

---

## 🏛️ Project Architecture

```text
├── .github/workflows/deploy.yml   # GitHub Pages deployment pipeline
├── public/                        # Static assets (intro.mp4, greek.mp4)
├── src/
│   ├── components/
│   │   ├── IntroVideo.tsx         # Fullscreen intro screen
│   │   ├── Navigation.tsx         # Navbar with Web Audio Greek music toggle
│   │   ├── HeroSection.tsx        # Hero with background video & gold typography
│   │   ├── Countdown.tsx          # Real-time countdown cards
│   │   ├── OurStory.tsx           # "How We Met" editorial layout
│   │   ├── VenueSection.tsx       # Venue, map, dress code & travel guides
│   │   ├── WeddingSchedule.tsx    # Animated timeline cards
│   │   ├── RSVPSection.tsx        # Supabase RSVP form with gold confetti
│   │   ├── PhotoUploadSection.tsx # Guest photo compression & uploader
│   │   ├── GallerySection.tsx     # Masonry album with fullscreen lightbox
│   │   ├── OrganizerPortal.tsx    # Password protected admin dashboard
│   │   └── Footer.tsx             # Footer with social links & Everafterinvites credit
│   ├── lib/
│   │   └── supabase.ts            # Supabase client, storage & local persistence
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces
│   ├── App.tsx                    # Main App orchestrator
│   ├── main.tsx                   # React root entry
│   └── index.css                  # Tailwind CSS, fonts, and gold styling
├── metadata.json                  # Application metadata
├── vite.config.ts                 # Vite config with GitHub Pages base setup
└── README.md                      # Project documentation
```

---

*Made with love by **Everafterinvites***
