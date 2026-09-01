# 🐱 MeowBox Social App

> A modern, aesthetic, and high-performance cat-themed social media platform built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, **TanStack Query v5**, and **Appwrite**.

---

## ✨ Features & UI Highlights

- **✨ Ultra-Modern Glassmorphism Design:** Deep Nebula dark theme with vibrant Violet (`#8B5CF6`) and Pink (`#EC4899`) glowing accents, backdrop filters, and fluid responsiveness.
- **📸 Story Reel & Creator Highlights:** Horizontal story carousel with active gradient rings and full-screen story viewer.
- **❤️ Rich Post Interactions:**
  - Double-tap to like with heart burst effect and confetti animations (`canvas-confetti`).
  - Bookmark / save posts to your personal collection.
  - Interactive comments thread with instant real-time comment adding.
  - Share post with 1-click clipboard copy toast.
- **🧭 Explore & Category Discovery:** Search bar with debounce and category filter pills (*All*, *🔥 Trending*, *🐱 Cute Cats*, *🎨 Art & Floof*, *💤 Sleepy Loaf*, *📦 Box Royalty*).
- **👥 Creators & People Discovery (`/all-users`):** Creator cards with follower stats, bio previews, and instant Follow/Unfollow toggles.
- **🎨 Post Studio (`/create-post` & `/update-post/:id`):** Drag-and-drop media uploader with live preview, character counter, location pin, and quick tag suggestions.
- **👤 Complete Profile (`/profile/:id` & `/update-profile/:id`):**
  - Cover photo banner with glowing avatar ring.
  - Counters for Posts, Followers, and Following.
  - Tabbed switcher for **Posts**, **Liked**, and **Saved** collections.
  - Profile editor with custom avatar upload.
- **🚀 Zero-Friction Instant Demo Mode:**
  - Works out of the box with zero configuration!
  - 1-Click Demo Login button on Sign In & Sign Up screens.
  - Seamlessly switches to real Appwrite backend when credentials are provided in `.env`.

---

## 🛠 Tech Stack & Modern Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18.3, TypeScript 5.5, Vite 5.4 |
| **Styling & Theme** | Tailwind CSS 3.4, PostCSS, Glassmorphism, Tailwind Animate |
| **Icons & UI Primitives** | Lucide React, Radix UI (Dialog, Tabs, Avatar, Tooltip, Toast) |
| **Animations** | Framer Motion 11, Canvas Confetti |
| **State & Data Fetching**| TanStack Query v5 (React Query), React Context |
| **Form Handling** | React Hook Form, Zod Validation |
| **Backend & Storage** | Appwrite SDK v14 (with Smart Mock Fallback Store) |

---

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/TechmoNoway/meowbox-social-app.git
cd meowbox-social-app
npm install
```

### 2. Environment Variables (Optional)
Copy `.env.example` to `.env` if you wish to connect your own Appwrite instance:
```bash
cp .env.example .env
```
*(If no `.env` is provided, MeowBox runs in **Interactive Demo Mode** with full mock data and local storage persistence).*

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
