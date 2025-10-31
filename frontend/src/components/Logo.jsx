import React from 'react'
import '../styles/logo.css'
import { Link } from 'react-router-dom'

const Logo = ({ position = 'top-left' }) => {
  return (
    <Link to="/" className={`app-logo app-logo--${position}`} aria-label="FoodHub Home">
      <span className="app-logo__text">food</span>
      <span className="app-logo__highlight">hub</span>
    </Link>
  )
}

export default Logo
