import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

export default function SimpleOrb({ className = "" }) {
  const { isDark } = useTheme()
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center ${className}`}>
      {/* Main orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: isDark 
            ? `radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, 0.8) 0%, 
                rgba(240, 240, 240, 0.6) 30%, 
                rgba(200, 200, 200, 0.4) 60%, 
                transparent 80%
              )`
            : `radial-gradient(circle at 30% 30%, 
                rgba(245, 222, 179, 0.8) 0%, 
                rgba(222, 184, 135, 0.6) 30%, 
                rgba(210, 180, 140, 0.4) 60%, 
                transparent 80%
              )`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(2px)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          scale: {
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full"
        style={{
          background: isDark
            ? `radial-gradient(circle at 40% 40%, 
                rgba(220, 220, 220, 0.6) 0%, 
                rgba(180, 180, 180, 0.4) 40%, 
                transparent 70%
              )`
            : `radial-gradient(circle at 40% 40%, 
                rgba(240, 230, 140, 0.6) 0%, 
                rgba(238, 203, 173, 0.4) 40%, 
                transparent 70%
              )`,
          filter: 'blur(3px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Tertiary orb */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full"
        style={{
          background: isDark
            ? `radial-gradient(circle at 50% 50%, 
                rgba(200, 200, 200, 0.5) 0%, 
                rgba(160, 160, 160, 0.3) 50%, 
                transparent 80%
              )`
            : `radial-gradient(circle at 50% 50%, 
                rgba(222, 184, 135, 0.5) 0%, 
                rgba(210, 180, 140, 0.3) 50%, 
                transparent 80%
              )`,
          filter: 'blur(1px)'
        }}
        animate={{
          scale: [1, 0.8, 1],
          rotate: [0, -180],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(240, 220, 185, 0.4)',
            top: `${20 + i * 10}%`,
            left: `${15 + i * 12}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center,
              transparent 20%,
              rgba(245, 222, 179, 0.1) 40%,
              rgba(210, 180, 140, 0.05) 70%,
              transparent 90%
            )
          `
        }}
      />
    </div>
  )
}