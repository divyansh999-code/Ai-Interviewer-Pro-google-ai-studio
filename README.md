<div align="center">

# 🎯 AI Interviewer Pro

**AI-Powered Technical Interview Preparation Platform**

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

[Live Demo](#) • [Report Bug](https://github.com/divyansh999-code/ai-interviewer-pro/issues) • [Request Feature](https://github.com/divyansh999-code/ai-interviewer-pro/issues)

*Built by [Divyansh Khandal](https://github.com/divyansh999-code) • Dec 2025 - Jan 2026*

</div>

---

## 🚀 Overview

AI Interviewer Pro transforms interview preparation by analyzing your resume and generating **adaptive, personalized technical questions** powered by Google's Gemini 2.5 Flash AI. Whether you're a student preparing for campus placements or a fresher targeting tech companies, this platform provides real-time voice interviews, instant feedback, and targeted learning paths to improve your weak areas.

### 💡 Why I Built This

As a AI & Data Science student, I experienced firsthand the challenges of technical interview preparation—generic question banks, no adaptive difficulty, and zero personalized feedback. After competing in Smart India Hackathon finals, I realized AI could solve this problem. AI Interviewer Pro is the tool I wish I had when starting my interview prep journey.

### ✨ Key Features

- 🧠 **Smart Resume Analysis** - Detects experience level, primary skills, and knowledge gaps automatically
- 🎙️ **Live Voice Interviews** - Practice with real-time AI conversation (Gemini 2.5 Flash)
- 📊 **Adaptive Difficulty System** - Questions dynamically adjust based on your performance
- 💡 **Instant Detailed Feedback** - Get hiring recommendations and multi-dimensional scoring
- 📚 **Personalized Study Roadmaps** - Curated learning paths with videos, articles, and practice problems
- 🎨 **Cyberpunk UI/UX** - Modern interface with smooth animations and micro-interactions
- 🔐 **User Authentication** - Save your interview history and track progress over time

---

## 🎬 Demo
https://github.com/divyansh999-code/Ai-Interviewer-Pro/blob/00f7280da80373f7520e6d864536621b9c3814ff/Screenshot%202026-01-02%20222223.png

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.3** - Latest React with concurrent features
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Custom CSS Animations** - Hand-crafted effects (glitch, magnetic, spotlight)

### AI & Backend
- **Google Gemini 2.5 Flash** - Advanced language model for question generation and evaluation
- **Supabase 2.39.0** - PostgreSQL database & authentication
- **WebRTC** - Real-time audio streaming for voice interviews

### Animations & Graphics
- **Three.js 0.160.0** - 3D graphics and effects
- **GSAP 3.12.5** - Professional-grade animations
- **Lucide React** - Beautiful icon system

---

## 📦 Features Deep Dive

### 🔍 Resume Intelligence
Upload your resume (PDF/DOCX/TXT) and watch the AI:
- Extract your primary tech stack
- Identify experience level (0-1yr, 1-2yr, 2yr+)
- Detect knowledge gaps and weak areas
- Recommend focus topics based on your profile

### 🎯 Interview Modes

#### 📝 Text-Based Practice
- 15-20 tailored questions per session
- Categorized by topic (DSA, System Design, OOP, etc.)
- Time limits matching real interview conditions
- Progressive hint system (minimal penalty)
- Follow-up questions based on your answers

#### 🎙️ Live Voice Interview
- Natural conversation flow with AI interviewer
- Real-time speech-to-text transcription
- Instant verbal feedback and encouragement
- Simulates actual interview pressure
- Perfect for communication skill practice

### 📈 Intelligent Evaluation

Get scored across **6 dimensions:**
1. **Correctness** - Accuracy of your solution
2. **Approach Quality** - Problem-solving methodology
3. **Code Quality** - Best practices and optimization
4. **Communication** - Clarity of explanation
5. **Completeness** - Edge cases and thoroughness
6. **Overall Score** - Weighted final grade

**Hiring Recommendation System:**
- ✅ **YES** - Ready for interviews (80%+ score)
- ⚠️ **MAYBE** - Need targeted practice (60-80%)
- ❌ **NO** - Significant gaps to address (<60%)

### 📚 Adaptive Learning System

After each session, receive:
- **Weakness Analysis** - Prioritized list of areas to improve
- **Curated Resources** - Videos, articles, practice problems
- **Study Roadmap** - Week-by-week learning plan
- **Next Question Prediction** - AI-optimized difficulty curve

### 🎨 UI/UX Highlights
- **Magnetic Effects** - Interactive footer links with smooth physics
- **Glitch Animations** - Cyberpunk-themed text effects
- **Spotlight Cards** - Mouse-following gradient overlays
- **Custom Cursor** - Enhanced pointer interactions
- **Konami Code Easter Egg** - Try it! (⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA)
- **Responsive Design** - Fully mobile-optimized

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Google Gemini API Key** ([Get free key](https://ai.google.dev/))
- **Supabase Account** *(Optional - for user auth)* ([Sign up](https://supabase.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/divyansh999-code/ai-interviewer-pro.git
   cd ai-interviewer-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Required - Get from https://ai.google.dev/
   VITE_GEMINI_API_KEY=your_gemini_api_key_here

   # Optional - For user authentication (https://supabase.com/)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
ai-interviewer-pro/
├── src/
│   ├── App.tsx              # Main application component with interview logic
│   ├── index.tsx            # Application entry point
│   ├── index.css            # Global styles & custom animations
│   ├── types.ts             # TypeScript interfaces (well-structured!)
│   ├── components/
│   │   ├── Footer.tsx       # Interactive footer with magnetic effects
│   │   └── ui/              # Reusable UI components
│   └── utils/               # Helper functions & API services
├── public/                  # Static assets (images, fonts)
├── .env.local              # Environment variables (create this!)
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md              # You are here!
```

---

## 🔧 Configuration

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key" in the top right
4. Create a new API key
5. Copy and paste into `.env.local`

### Supabase Setup (Optional - For User Auth)

If you want to enable user accounts and interview history:

1. Create a new project at [supabase.com](https://supabase.com/)
2. Copy your project URL and anon key
3. Add to `.env.local`
4. Run this SQL in Supabase SQL Editor:

```sql
-- Create interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  resume_data JSONB,
  candidate_analysis JSONB,
  questions JSONB,
  results JSONB,
  session_type TEXT, -- 'text' or 'voice'
  overall_score NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Users can only see their own interviews
CREATE POLICY "Users can view own interviews"
  ON interviews FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# Settings → Environment Variables → Add
# - VITE_GEMINI_API_KEY
# - VITE_SUPABASE_URL (if using)
# - VITE_SUPABASE_ANON_KEY (if using)
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Drag and drop the 'dist' folder to Netlify

# Add environment variables in Netlify dashboard:
# Site settings → Environment variables → Add variable
```

### Important: Environment Variables

⚠️ **Don't forget to add these in your hosting platform:**
- `VITE_GEMINI_API_KEY` (Required)
- `VITE_SUPABASE_URL` (Optional)
- `VITE_SUPABASE_ANON_KEY` (Optional)

---

## 🎯 Usage Guide

### Step 1: Upload Your Resume
- Click **"Upload Resume"** or drag-and-drop
- Supported formats: PDF, TXT, DOCX
- AI analyzes in ~2-3 seconds

### Step 2: Choose Interview Mode
- **Quick Practice** - 5-10 questions for targeted drill
- **Full Mock Interview** - 15-20 questions simulating real interviews
- **Live Voice Interview** - Real-time conversation practice

### Step 3: Answer Questions
- Read carefully and think aloud
- Use hints sparingly (affects your score)
- Explain your reasoning clearly
- Time limits match industry standards

### Step 4: Review Detailed Feedback
- View scores across 6 categories
- Read AI-generated strengths & weaknesses
- Get hiring recommendation (YES/MAYBE/NO)
- Download personalized study roadmap

### Step 5: Track Progress
- Save interview history (if authenticated)
- Compare scores over time
- Focus on consistently weak areas

---

## 🧪 Technical Highlights

### Gemini Prompt Engineering

The quality of AI responses depends on prompt design. Here's how I structured them:

**Resume Analysis Prompt:**
```typescript
const analysisPrompt = `Analyze this resume and extract ONLY JSON:
{
  "experience_level": "0-1 years" | "1-2 years" | "2+ years",
  "primary_skills": ["skill1", "skill2", ...], // max 5
  "weak_areas_detected": ["area1", "area2", ...] // max 3
}

Resume text:
${resumeText}

Rules:
- Be conservative with experience estimation
- Focus on technical skills only
- Weak areas = mentioned but not demonstrated
- No markdown, just raw JSON`;
```

**Adaptive Question Generation:**
```typescript
const adaptivePrompt = `Previous answer score: ${score}/10
Detected weakness: ${weakArea}

Generate a ${difficulty} level question targeting this gap.

Required JSON format:
{
  "question": "Clear problem statement",
  "difficulty": "Easy" | "Medium" | "Hard",
  "topic": "Main category",
  "subtopic": "Specific area",
  "time_limit_minutes": 15-45,
  "expected_approach": "High-level solution strategy",
  "key_concepts": ["concept1", "concept2"],
  "hints": ["hint1", "hint2", "hint3"],
  "follow_up": "Optional deeper question"
}`;
```

### Performance Metrics

- ⚡ **Resume Analysis**: < 3 seconds (with Gemini 2.5 Flash)
- 🎯 **Question Generation**: < 2 seconds per question
- 🎙️ **Voice Response Latency**: < 1 second (WebRTC)
- 📦 **Production Bundle**: ~450KB gzipped
- 🚀 **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ideas for Enhancement
- [ ] Add more programming languages (currently focused on Python/JS)
- [ ] Integrate LeetCode/HackerRank problem links
- [ ] Add company-specific interview modes (Google, Amazon, etc.)
- [ ] Multi-language support (Hindi, Spanish)
- [ ] Video interview with face/gesture analysis
- [ ] Collaborative practice mode (peer-to-peer)
- [ ] Mobile app using React Native

### Development Process

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Make changes and test thoroughly
4. Commit with clear messages
   ```bash
   git commit -m 'Add: Amazing new feature with XYZ capability'
   ```
5. Push to your branch
   ```bash
   git push origin feature/AmazingFeature
   ```
6. Open a Pull Request with:
   - Clear description of changes
   - Screenshots/GIFs if UI-related
   - Test results

### Code Guidelines
- Use TypeScript strict mode
- Follow existing code style (Prettier config)
- Add comments for complex logic only
- Test with different resume formats
- Ensure mobile responsiveness

---

## 🐛 Known Issues & Limitations

### Current Limitations
- **Voice Interview:** May not work on iOS Safari due to WebRTC restrictions
- **Resume Parsing:** Accuracy varies with PDF formatting (text-based PDFs work best)
- **API Rate Limits:** Free Gemini tier has request quotas
- **Browser Support:** Best experience on Chrome/Edge; Firefox supported, Safari partial

### Planned Fixes
- [ ] Add PDF OCR for image-based resumes
- [ ] Implement request queuing for API limits
- [ ] Safari WebRTC polyfill for voice mode
- [ ] Offline mode with cached questions

---

## 🗺️ Roadmap

### Phase 1: Core Enhancements (Feb - Mar 2026)
- [ ] Multi-language support (Hindi + 2 others)
- [ ] Code editor integration (Monaco Editor)
- [ ] Interview recording & playback
- [ ] Enhanced analytics dashboard

### Phase 2: Advanced Features (Apr - Jun 2026)
- [ ] Video interview with camera
- [ ] Behavioral question module
- [ ] System design diagramming
- [ ] Peer practice matching algorithm

### Phase 3: Scale & Monetization (Jul - Sep 2026)
- [ ] Company-specific interview modes
- [ ] Premium tier with unlimited sessions
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

---

## 📚 Lessons Learned

Building this project taught me:
- **Prompt Engineering is an Art** - 70% of AI quality comes from prompt design
- **TypeScript Saves Hours** - Strong typing prevented countless runtime bugs
- **Animation Performance** - CSS transforms > JavaScript animations
- **Voice APIs are Tricky** - Browser compatibility requires extensive testing
- **User Feedback is Gold** - Tested with 15+ peers; pivoted features 3 times

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What This Means:
✅ Commercial use allowed  
✅ Modification allowed  
✅ Distribution allowed  
✅ Private use allowed  
⚠️ Liability and warranty disclaimed

---

## 👨‍💻 About Me

**Divyansh Khandal**  
Second Year AI & Data Science Student @ MBM Jodhpur | SIH Finalist

I'm passionate about building AI-powered tools that solve real-world problems. Currently exploring full-stack development, machine learning, and prompt engineering. Always open to collaboration on innovative projects!

### Connect With Me

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-divyansh999--code-181717?style=for-the-badge&logo=github)](https://github.com/divyansh999-code)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Divyansh_Khandal-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/divyansh-khandal-5b8b8b32b)
[![Email](https://img.shields.io/badge/Email-divyanshkhandal2005-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:divyanshkhandal2005@gmail.com)

</div>

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For the incredible AI model and free tier
- **Supabase** - For seamless backend infrastructure
- **Lucide Icons** - Beautiful open-source icon library
- **Three.js & GSAP** - Animation frameworks that brought the UI to life
- **My Peers** - 15+ beta testers who provided invaluable feedback
- **SIH Organizers** - Experience that inspired this project

---

## 💬 Support & Feedback

### Found a Bug?
[Open an issue](https://github.com/divyansh999-code/ai-interviewer-pro/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if UI-related
- Browser & OS details

### Feature Request?
[Start a discussion](https://github.com/divyansh999-code/ai-interviewer-pro/discussions) to:
- Propose new features
- Vote on existing ideas
- Share use cases

### Need Help?
- 📧 Email: [divyanshkhandal2005@gmail.com](mailto:divyanshkhandal2005@gmail.com)
- 💬 GitHub Discussions: [Ask anything](https://github.com/divyansh999-code/ai-interviewer-pro/discussions)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/divyansh999-code/ai-interviewer-pro?style=social)
![GitHub forks](https://img.shields.io/github/forks/divyansh999-code/ai-interviewer-pro?style=social)
![GitHub issues](https://img.shields.io/github/issues/divyansh999-code/ai-interviewer-pro)
![GitHub pull requests](https://img.shields.io/github/issues-pr/divyansh999-code/ai-interviewer-pro)

---

<div align="center">

**Built with ❤️ and ☕ in Jaipur, India**

⭐ **Star this repo if it helped you ace your interviews!** ⭐

*Last Updated: January 2026*

</div>

