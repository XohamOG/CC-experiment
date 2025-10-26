# Vishwas Netra - Hate Speech Detection System

## Project Overview

This is a Cloud Computing project built with React + Vite for detecting hate speech in text using advanced AI models. The application features a modern, minimal design with intelligent detection capabilities and real-time analysis.

## 🎯 Project Purpose

**Vishwas Netra** is an AI-powered hate speech detection system that analyzes text input to identify potentially harmful or hateful content. Built as a Cloud Computing project, it demonstrates:
- Real-time text analysis
- Machine learning model integration
- Cloud-based infrastructure
- Modern web interface design

## 🎨 Theme Documentation

### Design Philosophy
- **Minimal & Clean**: Focus on content with subtle animations
- **Intelligent**: AI-themed elements and modern UI
- **Cloud-Centric**: Scalable architecture and cloud integration
- **Accessible**: High contrast ratios and semantic HTML

### Color Palette

#### Light Theme (Default)
```css
--background: oklch(0.985 0.02 90);          /* Soft white-beige */
--foreground: oklch(0.25 0.03 70);           /* Deep brown-gray text */
--card: oklch(0.98 0.02 90);                 /* Slightly beige card background */
--primary: oklch(0.3 0.04 70);               /* Dark cocoa for buttons */
--secondary: oklch(0.96 0.02 90);            /* Pale beige for secondary elements */
--accent: oklch(0.78 0.12 55);               /* Warm terracotta accent */
--muted: oklch(0.965 0.015 90);              /* Very light beige for muted content */
--border: oklch(0.93 0.015 90);              /* Subtle border color */
```

#### Dark Theme
```css
--background: oklch(0.145 0 0);              /* Dark background */
--foreground: oklch(0.985 0 0);              /* Light text */
--primary: oklch(0.985 0 0);                 /* Light primary */
--secondary: oklch(0.269 0 0);               /* Dark secondary */
--accent: oklch(0.269 0 0);                  /* Dark accent */
```

### Typography
- **Display Font**: Bricolage Grotesque (via Google Fonts) - Used for headings with `.funky-title` class
- **Body Font**: Geist Sans - Clean, modern sans-serif
- **Mono Font**: Geist Mono - For code elements

### Key CSS Classes

#### Animation Classes
```css
.funky-title          /* Display font with tight tracking */
.btn-wiggle:active    /* Button wiggle animation on click */
.card-pop             /* Card with hover lift effect */
.pressable:active     /* Generic press effect */
.sheen                /* Shimmer effect overlay */
.float-slow           /* 6s floating animation */
.pop-in               /* Pop-in entrance animation */
```

#### Keyframe Animations
- `wiggle`: Quick button interaction feedback
- `shimmer`: Subtle shine effect on buttons
- `floatY`: Gentle floating motion for decorative elements
- `popIn`: Smooth entrance animation

### Component Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── button.jsx   # Button with variants
│   │   └── card.jsx     # Card layout components
│   ├── AnimatedButton.jsx  # Animated button component
│   └── WaveCanvas.jsx      # Animated wave visualization
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── Analyze.jsx      # Text input and detection page
│   └── EnhancedResults.jsx  # Results visualization
├── lib/
│   └── utils.js         # Utility functions (cn, etc.)
└── hooks/               # Custom React hooks
```

## 🔧 API Integration

The frontend connects to a backend API running on `http://localhost:3000/api` with the following endpoints:

### POST `/api/detect`
Analyzes text for hate speech detection.

**Request Body:**
```json
{
  "text": "Text to analyze"
}
```

**Response:**
```json
{
  "success": true,
  "is_hate_speech": false,
  "confidence": 0.95,
  "severity": "none|low|medium|high",
  "text": "Original text",
  "model_info": {},
  "timestamp": "2025-10-26T..."
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation
```bash
cd frontend
npm install
# or
pnpm install
```

### Development
```bash
npm run dev
# or
pnpm dev
```

### Build for Production
```bash
npm run build
# or
pnpm build
```

## 🎵 Features

### Current Features
1. **Landing Page**: Hero section with animated geometric shapes and waveform background
2. **Audio Input**: File upload and microphone recording capabilities
3. **Results Visualization**: 
   - Animated performance metrics
   - Interactive bar charts (Recharts)
   - Confusion matrix heatmap
   - Placeholder data for demonstration

### Animated Elements
- **Floating Shapes**: Large geometric decorations with subtle motion
- **Wave Canvas**: Real-time animated waveform using HTML5 Canvas
- **Count-up Animations**: Metrics animate to their values on page load
- **Hover Effects**: Cards lift on hover, buttons have press feedback

## 🔧 Technical Stack

### Core Dependencies
- **React 18.3.1**: Modern React with hooks
- **React Router Dom**: Client-side routing
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling

### UI Components
- **Radix UI**: Accessible component primitives
- **Class Variance Authority**: Type-safe component variants
- **Lucide React**: Consistent icon library

### Data Visualization
- **Recharts**: Responsive chart library for React

### Styling & Animation
- **Tailwind CSS**: Utility classes with custom theme
- **tailwindcss-animate**: Additional animation utilities
- **clsx & tailwind-merge**: Conditional and merged class names

## 📁 File Structure Details

### Pages
- `Home.jsx`: Landing page with hero content and call-to-action
- `Analyze.jsx`: Audio input interface with waveform background
- `Results.jsx`: Data visualization dashboard with charts and metrics

### Components
- `WaveCanvas.jsx`: HTML5 Canvas component rendering animated waveforms
- `AudioControls.jsx`: Handles file upload and microphone recording
- `ui/button.jsx`: Flexible button component with multiple variants
- `ui/card.jsx`: Card layout system with header, content, and footer

### Styling
- `index.css`: Global styles, CSS variables, and utility classes
- Uses CSS custom properties for theming
- Oklch color space for better color management

## ⚡ Performance Considerations

1. **Canvas Optimization**: Wave animations use requestAnimationFrame for smooth 60fps
2. **Device Pixel Ratio**: Canvas rendering adapts to high-DPI displays
3. **Animation Cleanup**: All animations properly cleaned up on component unmount
4. **Lazy Loading**: Components can be easily code-split if needed

## 🎨 Customization Guide

### Adding New Colors
1. Define in CSS custom properties in `index.css`
2. Add to Tailwind config in `tailwind.config.js`
3. Use with `hsl(var(--your-color))` or Tailwind classes

### Creating New Animations
1. Define keyframe in `tailwind.config.js`
2. Add animation utility class
3. Apply with `animate-your-name`

### Extending Components
- UI components use `cn()` utility for className merging
- Variants managed with Class Variance Authority
- All components accept `className` prop for customization

## 🔮 Future Enhancements

### Planned Features
1. **Theme Switcher**: Toggle between light/dark modes
2. **Real ML Integration**: Connect to actual ML models
3. **Audio Visualization**: Spectrum analyzer and waveform display
4. **Export Features**: Download results as PDF/images
5. **Responsive Charts**: Better mobile chart interactions

### Technical Improvements
1. **TypeScript Migration**: Optional typed version
2. **State Management**: Context API or Zustand for complex state
3. **Testing Setup**: Jest + React Testing Library
4. **PWA Features**: Offline support and installability

## 📞 Integration Points

### ML Model Integration
The frontend is designed to easily connect with ML backends:

```javascript
// Example API integration
const analyzeAudio = async (audioBlob) => {
  const formData = new FormData()
  formData.append('audio', audioBlob)
  
  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}
```

### Backend API Endpoints
Expected endpoints for full functionality:
- `POST /api/analyze` - Audio analysis
- `GET /api/models` - Available models
- `POST /api/upload` - File upload
- `GET /api/results/:id` - Fetch results

## 🎯 Best Practices

### Component Development
1. Use functional components with hooks
2. Implement proper prop validation
3. Handle loading and error states
4. Make components accessible (ARIA labels, semantic HTML)

### Styling Guidelines
1. Use Tailwind utilities first
2. Create custom CSS only when needed
3. Follow mobile-first responsive design
4. Maintain consistent spacing scale

### Performance Tips
1. Use React.memo for expensive components
2. Implement virtual scrolling for large lists
3. Lazy load images and heavy components
4. Optimize Canvas animations

This documentation serves as a comprehensive guide for future development and maintenance of the ML Audio Dashboard project.