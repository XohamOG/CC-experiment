import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

export default function InteractiveOrb({ className = "" }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className={`fixed top-8 right-8 z-50 ${className}`}>
      <motion.div
        className="relative w-16 h-16 cursor-pointer group"
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Main clickable orb */}
        <motion.div
          className="absolute inset-0 rounded-full shadow-lg backdrop-blur-sm border"
          style={{
            background: isDark 
              ? `radial-gradient(circle at 30% 30%, 
                  rgba(255, 255, 255, 0.9) 0%, 
                  rgba(240, 240, 240, 0.7) 40%, 
                  rgba(200, 200, 200, 0.5) 80%, 
                  transparent 100%
                )`
              : `radial-gradient(circle at 30% 30%, 
                  rgba(245, 222, 179, 0.9) 0%, 
                  rgba(222, 184, 135, 0.7) 40%, 
                  rgba(210, 180, 140, 0.5) 80%, 
                  transparent 100%
                )`,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(222, 184, 135, 0.3)',
            filter: 'blur(0.5px)'
          }}
          animate={{
            rotate: [0, 360],
            scale: isDark ? [1, 1.05, 1] : [1, 1.02, 1],
          }}
          transition={{
            rotate: {
              duration: isDark ? 15 : 25,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: isDark ? 3 : 8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />

        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(245, 222, 179, 0.4)'}`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: isDark ? 2 : 4,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />

        {/* Inner glow */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245, 222, 179, 0.6) 0%, transparent 70%)',
            filter: 'blur(4px)'
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: isDark ? 2 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Tooltip */}
        <motion.div
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
            isDark 
              ? 'bg-white/90 text-black border-white/30' 
              : 'bg-beige-50/90 text-beige-800 border-beige-200/30'
          }`}>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}