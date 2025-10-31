import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/landing.css'
import '../../styles/reels.css'
import Logo from '../../components/Logo'

const Landing = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Create particle
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(255,255,255,${Math.random() * 0.5})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.1;
        
        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Initialize particles
    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(13, 13, 13, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };

    // Setup
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    init();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className="landing-wrapper">
      <canvas ref={canvasRef} className="landing-canvas"></canvas>
      
      <div className="landing-content">
        <header className="landing-header">
          <nav>
            <div className="nav-links">
              <Link to="/about">About</Link>
              <Link to="/careers">Careers</Link>
            </div>
            <div className="nav-auth">
              <Link to="/user/login" className="login-btn">User Login</Link>
              <Link to="/food-partner/login" className="login-btn partner">Partner Login</Link>
            </div>
          </nav>
        </header>

        <main className="landing-main">
          <Logo position="center-top" />

          <div className="home-hero" aria-hidden>
            <h1 className="home-title">
              <span className="home-title__text">food</span>
              <span className="home-title__accent">hub</span>
            </h1>
          </div>

          <p className="tagline">Discover delicious food, connect with local partners</p>
          <div className="cta-buttons">
            <Link to="/user/login" className="cta-btn primary">Get Started</Link>
            <Link to="/food-partner/register" className="cta-btn secondary">Become a Partner</Link>
          </div>
        </main>

        <div className="floating-dishes">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`floating-dish dish-${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Landing
