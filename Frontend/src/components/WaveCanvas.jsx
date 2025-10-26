import { useEffect, useRef } from 'react'

export default function WaveCanvas({ className }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const dpr = Math.max(1, window.devicePixelRatio || 1)

    function resize() {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.scale(dpr, dpr)
    }
    resize()
    const onResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      resize()
    }
    window.addEventListener('resize', onResize)

    const waves = [
      {
        amp: 22,
        freq: 0.012,
        speed: 0.015,
        color: getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim() || 'oklch(0.78 0.12 55)',
      },
      { amp: 14, freq: 0.018, speed: 0.022, color: 'oklch(0.9 0.02 90)' },
      { amp: 8, freq: 0.026, speed: 0.03, color: 'oklch(0.6 0.06 70)' },
    ]

    let t = 0
    function draw() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = 0.9

      waves.forEach((wConf, idx) => {
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = wConf.color
        const yCenter = h * (0.3 + idx * 0.25)
        for (let x = 0; x <= w; x += 2) {
          const y =
            yCenter +
            Math.sin(x * wConf.freq + t * (1 + idx * 0.1)) * wConf.amp +
            Math.sin(x * (wConf.freq * 0.6) + t * wConf.speed * 2) * (wConf.amp * 0.3)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      t += 0.03
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}