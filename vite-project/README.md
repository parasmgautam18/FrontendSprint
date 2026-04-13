# 🍳 Recipe AI Intelligence Engine

A Data-to-Intelligence Pipeline web application that combines TheMealDB API with Groq LLM for AI-powered recipe analysis and insights.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Groq API key to .env
# VITE_GROQ_API_KEY=your_key_here

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🎯 Features

- **Real-time Recipe Data**: Fetches from TheMealDB with images, ingredients, and instructions
- **AI Analysis Modes**: 4 different Groq LLM analysis perspectives
  - 🥗 **Nutrition Expert**: Health benefits and dietary analysis
  - 👨‍🍳 **Cuisine Expert**: Cultural origin and cooking techniques
  - 💪 **Health & Wellness**: Health improvements and target demographics
  - ⭐ **Food Critic**: Witty reviews and flavor insights
- **Search & Random**: Find recipes by name or get random ones
- **Beautiful UI**: Responsive design with Tailwind CSS + animated gradients
- **Loading States**: Skeleton screens for smooth UX
- **Error Handling**: User-friendly error messages
- **Ingredient Display**: Organized ingredient grid with measurements

## 📊 How It Works

```
User Input → Fetch TheMealDB → Format Recipe Data → Send to Groq → Display AI Analysis
```

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite
- **HTTP Client**: Axios
- **AI/LLM**: Groq SDK (mixtral-8x7b-32768)
- **API**: TheMealDB (free, no authentication required)
- **Animations**: Custom CSS keyframes for blob effects

## 🔑 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from [console.groq.com](https://console.groq.com)

## 📁 Project Structure

```
src/
├── App.jsx                 # Main application component
├── App.css                 # Custom animations
├── index.css               # Global Tailwind styles
├── main.jsx                # React entry point
├── hooks/
│   ├── useMealData.js      # TheMealDB API integration
│   └── useRecipeAnalysis.js # Groq LLM integration
└── components/
    └── UIComponents.jsx    # Reusable React components
```

## 🎨 Components

### **SearchBar**
Search recipes by name with debouncing

### **MealCard**
Displays full recipe with:
- High-quality image with glow effect
- Category and cuisine badges
- Ingredients grid with measurements
- Complete cooking instructions
- Recipe tags

### **AnalysisCard**
Shows AI-generated analysis with loading state

### **AnalysisTypeSelector**
Toggle between 4 different AI analysis perspectives

### **LoadingSkeleton**
Animated placeholder while fetching data

## 🚀 Performance

- **Build Size**: ~250KB gzipped
- **Speed**: LPU-powered Groq API = <1s response times
- **UI**: Smooth animations with 60fps transitions

## 📝 Example Usage

1. Click **"Random Recipe"** to fetch a meal
2. View full recipe details with image and ingredients
3. Select an analysis type to get AI insights
4. Search for a specific recipe by name
5. Switch between different AI perspectives instantly

## ✨ Features Highlights

- ✅ No backend required (frontend + Groq API only)
- ✅ Keyless API integration (TheMealDB)
- ✅ Beautiful glassmorphic UI with backdrop blur
- ✅ Animated background with color gradients
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Error handling with user feedback
- ✅ Extreme API response speed via Groq LPU

## 🔗 APIs Used

- **TheMealDB**: https://www.themealdb.com/api/json/v1/1/
- **Groq LLM**: https://api.groq.com/openai/v1/chat/completions

## 📄 License

Built for the Data-to-Intelligence Hackathon Challenge 2026

## 📁 Project Structure

```
src/
├── components/
│   ├── UIComponents.jsx    # Reusable UI components
│   └── SearchBar.jsx       # Search functionality
├── hooks/
│   ├── usePokeData.js      # PokeAPI integration
│   └── useGroqAnalysis.js  # Groq LLM integration
├── App.jsx                 # Main component
└── index.css               # Tailwind styles
```

## 🔑 Key Implementation Details

### usePokeData Hook
- Fetches Pokémon by ID or name from PokeAPI
- Includes species descriptions in English
- Handles errors gracefully

### useGroqAnalysis Hook
- Integrates with Groq's OpenAI-compatible API
- 4 analysis modes with different system prompts
- Fast LPU-powered responses

### Components
- **LoadingSkeleton**: Animated loading state
- **PokemonCard**: Displays stats, abilities, and description
- **AnalysisCard**: Shows Groq AI analysis results
- **AnalysisTypeSelector**: Mode selection buttons
- **SearchBar**: Pokémon search input

## ⚠️ Environment Setup

**Important**: Never commit `.env` to version control!

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key: https://console.groq.com

## 🚀 Deployment

The app is production-ready and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

```bash
npm run build  # Creates dist/ folder
# Deploy the dist/ folder to your host
```

## 📚 API References

- **PokeAPI**: https://pokeapi.co/docs/v2.html
- **Groq API**: https://console.groq.com/docs/text-chat

## 🎓 What This Demonstrates

✅ Custom React hooks for data fetching  
✅ AI/LLM integration in frontend  
✅ Environment variables in Vite  
✅ Responsive design with Tailwind CSS  
✅ Loading/error states and UX patterns  
✅ API error handling  
✅ Reusable component architecture  

---

**Built for the Data-to-Intelligence Hackathon Challenge**
