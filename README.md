# 📱 MeowBox Social App (Instagram-Style)

> An aesthetic, ultra-modern, and high-performance social media platform built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, **TanStack Query v5**, and **Supabase** (PostgreSQL, Auth & Storage).

---

## ✨ Features & UI Highlights

- **✨ Sleek Instagram Dark Design:** OLED pitch black & zinc surfaces, Instagram story gradient rings, and fluid responsive layouts.
- **📸 Interactive Story Viewer:** Segmented auto-progressing timers, pause on hold, tap navigation, and quick story replies with heart reactions.
- **❤️ Post Feed & Interactions:**
  - Double-tap to like with heart burst animation (`canvas-confetti`).
  - Bookmark / save posts to your personal collection.
  - Interactive comments thread with instant real-time commenting.
  - Share post with 1-click clipboard copy and direct send drawer.
- **🎨 Photo Filter Studio & Aspect Ratio Selector:**
  - In-browser CSS photo filters (*Normal*, *Clarendon*, *Gingham*, *Moon*, *Lark*, *Juno*, *Valencia*).
  - Crop aspect ratios: *1:1 Square*, *4:5 Portrait*, *16:9 Wide*.
- **🧭 Explore & Category Discovery:** Search bar with debounce and category filter pills (*📸 Photography*, *🏛️ Architecture*, *✈️ Travel*, *🛹 Streetstyle*, *☕ Places*).
- **👥 Discover People (`/all-users`):** Creator cards with follower stats, bio previews, and instant Follow/Unfollow toggles.
- **👤 Profile & Story Highlights (`/profile/:id`):**
  - Circular story highlight bubbles (*Tokyo*, *35mm Film*, *Architecture*, *Lifestyle*, *Travel*).
  - Stats counters (Posts, Followers, Following).
  - Tab switcher for **POSTS**, **REELS**, **SAVED**, and **TAGGED**.
- **🚀 Zero-Friction Instant Demo Mode:**
  - Works out of the box with zero configuration!
  - 1-Click Demo Login button on Sign In & Sign Up screens.
  - Seamlessly switches to real Supabase backend when credentials are provided in `.env`.

---

## 🛠 Tech Stack & Modern Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18.3, TypeScript 5.5, Vite 5.4 |
| **Styling & Theme** | Tailwind CSS 3.4, PostCSS, Instagram Dark Mode, Tailwind Animate |
| **Icons & UI Primitives** | Lucide React, Radix UI (Dialog, Tabs, Avatar, Tooltip, Toast) |
| **Animations** | Framer Motion 11, Canvas Confetti |
| **State & Data Fetching**| TanStack Query v5 (React Query), React Context |
| **Form Handling** | React Hook Form, Zod Validation |
| **Backend & Storage** | **Supabase** (Auth, PostgreSQL Database, and Storage Buckets for 1GB Free Media) |

---

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/TechmoNoway/meowbox-social-app.git
cd meowbox-social-app
npm install
```

### 2. Connect Supabase (Optional)
If you want to connect your own free Supabase backend:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase, open [`src/lib/supabase/schema.sql`](src/lib/supabase/schema.sql), paste the content and click **Run**.
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

*(If no `.env` is provided, MeowBox runs automatically in **Interactive Demo Mode** with full mock data and local storage persistence).*

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
