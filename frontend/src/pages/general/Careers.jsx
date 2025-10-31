import React from 'react'
import '../../styles/careers.css'
import Logo from '../../components/Logo'

const Careers = () => {
  return (
    <div className="careers-page">
      <header className="careers-hero">
        <Logo position="top-left" />
        <h1>Careers at FoodHub</h1>
        <p>Join a small team building big experiences for local food.</p>
      </header>

      <section className="careers-section">
        <h2>Open Roles</h2>
        <div className="roles-grid">
          <article className="role-card">
            <h3>Frontend Engineer</h3>
            <p>React, modern UX, motion-first interfaces.</p>
            <div className="meta">
              <span>Remote</span>
              <span>Full‑time</span>
            </div>
            <button className="apply-btn">Apply to Aarya</button>
          </article>
          <article className="role-card">
            <h3>Backend Engineer</h3>
            <p>Node.js, APIs, scalable data models.</p>
            <div className="meta">
              <span>Remote</span>
              <span>Full‑time</span>
            </div>
            <button className="apply-btn">Apply to Kabir</button>
          </article>
          <article className="role-card">
            <h3>Product Designer</h3>
            <p>End‑to‑end product craft with strong systems thinking.</p>
            <div className="meta">
              <span>Hybrid</span>
              <span>Contract</span>
            </div>
            <button className="apply-btn">Apply to Meera</button>
          </article>
        </div>
      </section>

      <section className="careers-section">
        <h2>How We Hire</h2>
        <ol className="process-list">
          <li>Intro chat with Vivaan</li>
          <li>Portfolio/Code deep‑dive</li>
          <li>Mini async exercise</li>
          <li>Team conversation</li>
          <li>Offer</li>
        </ol>
      </section>
    </div>
  )
}

export default Careers


