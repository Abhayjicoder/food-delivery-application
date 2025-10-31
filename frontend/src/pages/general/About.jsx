import React from 'react'
import '../../styles/about.css'
import Logo from '../../components/Logo'

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <Logo position="top-left" />
        <h1>About FoodHub</h1>
        <p className="about-tagline">Connecting people with local flavors</p>
      </header>

      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          FoodHub was founded with a simple idea: make it effortless to discover and enjoy
          great food from local partners. We combine delightful product design with a
          creator‑style reels experience so you can see dishes in action before you order.
        </p>
      </section>

      <section className="about-section grid">
        <div className="about-card">
          <h3>Mission</h3>
          <p>Empower local food partners with modern tools to reach nearby customers.</p>
        </div>
        <div className="about-card">
          <h3>Values</h3>
          <ul>
            <li>Customer delight</li>
            <li>Craft over shortcuts</li>
            <li>Bias for action</li>
          </ul>
        </div>
        <div className="about-card">
          <h3>Impact</h3>
          <p>Helping small kitchens grow sustainable, local-first businesses.</p>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <img src="/vite.svg" alt="Abhay Singh Rajput" />
            <h4>Abhay Singh Rajput</h4>
            <p>CEO & Co‑founder</p>
          </div>
          <div className="team-card">
            <img src="/vite.svg" alt="Abhay Singh Rajput" />
            <h4>Abhay Singh Rajput</h4>
            <p>CTO & Co‑founder</p>
          </div>
          <div className="team-card">
            <img src="/vite.svg" alt="Abhay Singh Rajput" />
            <h4>Abhay Singh Rajput</h4>
            <p>Design Lead</p>
          </div>
          <div className="team-card">
            <img src="/vite.svg" alt="Abhay Singh Rajput" />
            <h4>Abhay Singh Rajput</h4>
            <p>Ops & Partnerships</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About


