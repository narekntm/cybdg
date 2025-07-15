export function showToast (message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container')
  const toast = document.createElement('div')
  toast.className = `toast ${type}`

  // Message handling
  toast.innerHTML = Array.isArray(message)
    ? message.map(m => `<div>${m}</div>`).join('')
    : message

  // Initial state for animation
  toast.style.animation = `fadeIn 0.3s ease-out`

  container.appendChild(toast)

  // Wait for display duration, then trigger fadeOut
  setTimeout(() => {
    toast.style.animation = `fadeOut 0.3s ease-in`
    toast.addEventListener('animationend', () => toast.remove())
  }, duration)
}

// Example usage:
// showToast("User created successfully", "success");
// showToast("Failed to save changes", "error");

