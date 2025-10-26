import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingSplash({ isLoading, onComplete }) {
  const [currentWord, setCurrentWord] = useState(0)
  const words = ['ML', 'MINI', 'PROJECT']
  
  useEffect(() => {
    if (!isLoading) return

    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 800)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3500)

    return () => {
      clearInterval(wordInterval)
      clearTimeout(completeTimer)
    }
  }, [isLoading, onComplete])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-secondary/50 to-accent/10"
        >
          {/* Enhanced animated background with spectrum orbs */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Primary spectrum orb */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -top-20 -left-20 w-52 h-52 rounded-full blur-2xl"
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, 
                    rgba(245, 222, 179, 0.6) 0%, 
                    rgba(222, 184, 135, 0.4) 40%, 
                    rgba(210, 180, 140, 0.2) 70%, 
                    transparent 90%
                  )
                `
              }}
            />
            
            {/* Secondary spectrum orb */}
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1],
                x: [0, 20, 0],
              }}
              transition={{ 
                rotate: { duration: 45, repeat: Infinity, ease: "linear" },
                scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 16, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl"
              style={{
                background: `
                  radial-gradient(ellipse at 40% 60%, 
                    rgba(240, 230, 140, 0.5) 0%, 
                    rgba(238, 203, 173, 0.3) 50%, 
                    rgba(222, 184, 135, 0.2) 80%, 
                    transparent 95%
                  )
                `
              }}
            />
            
            {/* Floating accent orb */}
            <motion.div
              animate={{ 
                y: [-30, 30, -30],
                x: [-15, 15, -15],
                rotate: [0, 180, 360],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{ 
                duration: 18, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-1/4 right-1/4 w-52 h-52 rounded-full blur-xl"
              style={{
                background: `
                  radial-gradient(circle at 50% 50%, 
                    rgba(210, 180, 140, 0.7) 0%, 
                    rgba(245, 222, 179, 0.4) 60%, 
                    transparent 85%
                  )
                `
              }}
            />

            {/* Subtle accent particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  top: `${10 + i * 8}%`,
                  left: `${5 + i * 10}%`,
                  background: 'rgba(245, 222, 179, 0.4)',
                  filter: 'blur(1px)'
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 10 + i * 1,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center space-y-8">
            {/* Animated title */}
            <div className="space-y-2">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-bold"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={{ y: 50, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -50, opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'gradient-shift 2s ease-in-out infinite',
                    }}
                  >
                    {words[currentWord]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="h-1 bg-gradient-to-r from-accent to-primary rounded-full mx-auto max-w-xs"
              />
            </div>

            {/* Loading dots */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 rounded-full bg-accent"
                />
              ))}
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="text-muted-foreground text-lg font-medium"
            >
              Preparing your audio analysis experience...
            </motion.p>
          </div>


        </motion.div>
      )}
    </AnimatePresence>
  )
}