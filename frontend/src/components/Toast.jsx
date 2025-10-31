import React, { useEffect } from 'react'
import '../styles/toast.css'

const Toast = ({ message, type = 'info', onClose = () => {}, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <div className="toast-body">{message}</div>
      <button className="toast-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  )
}

export default Toast;
