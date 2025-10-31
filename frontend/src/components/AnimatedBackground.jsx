import React, { useEffect, useRef } from 'react'
import '../styles/animations.css'

const AnimatedBackground = ({ variant = 'particles' }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let running = true
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    let entities = []

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    if (variant === 'particles') {
      class P {
        constructor() {
          this.x = Math.random() * w
          this.y = Math.random() * h
          this.r = Math.random() * 2 + 0.6
          this.vx = (Math.random() - 0.5) * 0.8
          this.vy = (Math.random() - 0.5) * 0.8
          this.alpha = Math.random() * 0.6 + 0.1
        }
        update() {
          this.x += this.vx
          this.y += this.vy
          if (this.x < -50) this.x = w + 50
          if (this.x > w + 50) this.x = -50
          if (this.y < -50) this.y = h + 50
          if (this.y > h + 50) this.y = -50
        }
        draw() {
          ctx.fillStyle = `rgba(255,255,255,${this.alpha})`
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      entities = new Array(Math.floor((w * h) / 60000)).fill().map(() => new P())

      const loop = () => {
        if (!running) return
        ctx.clearRect(0, 0, w, h)
        // subtle gradient
        const g = ctx.createLinearGradient(0, 0, w, h)
        g.addColorStop(0, 'rgba(255,140,50,0.03)')
        g.addColorStop(1, 'rgba(80,50,255,0.02)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)

        // connect lines
        for (let i = 0; i < entities.length; i++) {
          const a = entities[i]
          a.update()
          a.draw()
          for (let j = i + 1; j < entities.length; j++) {
            const b = entities[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 120) {
              ctx.strokeStyle = `rgba(255,255,255,${(0.12 - dist / 120) * 0.8})`
              ctx.lineWidth = 0.6
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
        requestAnimationFrame(loop)
      }
      loop()
    } else if (variant === 'orbs') {
      class Orb {
        constructor() {
          this.x = Math.random() * w
          this.y = Math.random() * h
          this.r = Math.random() * 24 + 8
          this.speed = Math.random() * 0.6 + 0.2
          this.angle = Math.random() * Math.PI * 2
          this.color = `hsl(${Math.random() * 50 + 190}, 80%, 60%)`
        }
        update() {
          this.angle += 0.002 * this.speed
          this.y += Math.sin(this.angle) * this.speed
          this.x += Math.cos(this.angle * 0.7) * this.speed * 0.5
          if (this.x < -100) this.x = w + 100
          if (this.x > w + 100) this.x = -100
          if (this.y < -100) this.y = h + 100
          if (this.y > h + 100) this.y = -100
        }
        draw() {
          const g = ctx.createRadialGradient(this.x, this.y, this.r * 0.1, this.x, this.y, this.r)
          g.addColorStop(0, `${this.color.replace(')', ', 0.95)')}`)
          g.addColorStop(1, `${this.color.replace(')', ', 0.02)')}`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      entities = new Array(10).fill().map(() => new Orb())

      const loop2 = () => {
        if (!running) return
        ctx.clearRect(0, 0, w, h)
        // subtle dark overlay
        ctx.fillStyle = 'rgba(10,10,12,0.12)'
        ctx.fillRect(0, 0, w, h)
        entities.forEach(e => { e.update(); e.draw() })
        requestAnimationFrame(loop2)
      }
      loop2()
    }

    return () => {
      running = false
      window.removeEventListener('resize', resize)
    }
  }, [variant])

  return (
    <canvas ref={canvasRef} className={`animated-bg animated-bg--${variant}`} />
  )
}

export default AnimatedBackground
