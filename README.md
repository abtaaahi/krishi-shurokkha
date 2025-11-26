# Krishi Shurokkha

**Developed by:** ERROR 404! EDU HackFest Team  

A hackfest project aimed at reducing food loss in Bangladesh by empowering farmers with timely insights and tools. Mobile-first, offline-ready, and farmer-friendly.

---

## 🚀 Project Overview

**Krishi Shurokkha** focuses on post-harvest crop protection. It currently implements two core features:

1. **Storytelling Landing Page**  
   - Engaging UI to present the food loss problem and introduce the solution.  
   - Visual metaphor: Data → Warning → Action → Saved Food.  
   - Supports Bangla and English for accessibility.

2. **Basic Crop Health Scanner (AI Wrapper)**  
   - Farmers can upload crop photos.  
   - Pre-trained AI model detects crop status: *Fresh* or *Rotten*.  
   - Quick, lightweight, and mobile-friendly.

---

## 🌐 Tech Stack

- **Frontend & Backend:** Next.js (App Router)  
- **Styling:** Tailwind CSS, shadcn/ui  
- **State Management:** Zustand / Jotai  
- **Offline Storage:** Dexie.js / localForage  
- **Backend DB:** Supabase PostgreSQL  
- **API Integration:** OpenWeatherMap, HuggingFace Inference API  
- **Animations & Visuals:** Framer Motion, React Three Fiber (optional)  
- **Data Export:** PapaParse, FileSaver  

---

## 📦 Features

- Multi-language support (Bangla/English)  
- Mobile-first responsive design  
- Offline-first data saving with auto-sync  
- Farmer registration and crop batch management  
- CSV/JSON export for crop and achievement data  
- AI-powered crop health detection  
- Storytelling landing page with strong visual metaphor  

---

## ⚡ Getting Started

1. **Clone the repo**
```bash
git clone https://github.com/<your-username>/krishi-shurokkha.git
cd krishi-shurokkha
````

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables** in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
WEATHER_API_KEY=<your-weather-api-key>
```

4. **Run the development server**

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is open-source and free to use under the MIT License.

---

## 🤝 Team

**ERROR 404! EDU HackFest Team**

* Concept, design, and development for Krishi Shurokkha.

```