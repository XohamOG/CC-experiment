import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import WaveCanvas from '@/components/WaveCanvas'
import AnimatedButton from '@/components/AnimatedButton'
import LoadingSplash from '@/components/LoadingSplash'
import AnimatedTypeText from '@/components/AnimatedTypeText'
import EnhancedOrb from '@/components/EnhancedOrb'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Landing page: Vishwas Netra - Hate Speech Detection
export default function Home() {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // simulated landing load to show loader animation
    const t = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <LoadingSplash isLoading={loading} onComplete={() => setLoading(false)} />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      >
      {/* Enhanced background with orb */}
      <EnhancedOrb 
        hue={200} 
        hoverIntensity={0.4}
        rotateOnHover={true}
        className="opacity-30"
      />
      
      {/* subtle decorative waveform */}
      <div className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10">
        <WaveCanvas className="w-full h-full opacity-40" />
      </div>

      {/* replace cutout images with oversized animated geometric shapes */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div
          className="absolute -top-16 -left-12 w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-accent/30 bg-secondary/60 pop-in float-slow blur-[1px]"
          style={{ animationDelay: '100ms' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-10 w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-[2rem] border border-border bg-card/70 pop-in float-slow"
          style={{ animationDelay: '280ms' }}
          aria-hidden="true"
        />
        <div
          className="absolute top-16 right-16 w-40 h-16 md:w-56 md:h-20 rounded-full border-2 border-accent/25 bg-secondary/70 rotate-6 pop-in float-slow"
          style={{ animationDelay: '520ms' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-28 left-1/3 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border bg-transparent pop-in float-slow"
          style={{ animationDelay: '800ms' }}
          aria-hidden="true"
        />
      </div>

      <Card className="card-pop max-w-3xl w-full backdrop-blur-sm relative z-10">
        <CardContent className="p-8 md:p-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-secondary text-secondary-foreground text-xs px-3 py-1 float-slow">
                Cloud Computing
              </span>
              <span
                className="inline-block rounded-full bg-accent text-accent-foreground text-xs px-3 py-1 float-slow"
                style={{ animationDelay: '1.2s' }}
              >
                AI Detection
              </span>
            </div>

            <h1 className="funky-title text-balance text-4xl md:text-6xl">
              <AnimatedTypeText 
                text="Vishwas Netra" 
                speed={80}
                className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              />
            </h1>

            {/* concise description */}
            <p className="text-pretty text-base md:text-lg leading-relaxed text-foreground/80">
              AI-powered hate speech detection system. Enter text and get instant analysis with confidence scores and severity levels—clean, powerful, and intelligent.
            </p>

            <div className="pt-2">
              <Link to="/analyze" aria-label="Get started with analysis">
                <AnimatedButton className="gap-2" variant="primary">
                  Get Started →
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.main>
    </>
  )
}