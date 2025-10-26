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
