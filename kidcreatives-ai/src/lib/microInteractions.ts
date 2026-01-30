import confetti from 'canvas-confetti'

function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function createRipple(
  event: React.MouseEvent<HTMLElement>,
  color: string = 'rgba(255, 255, 255, 0.6)'
): void {
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const ripple = document.createElement('span')
  
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.style.background = color
  ripple.className = 'ripple'
  
  button.appendChild(ripple)
  
  setTimeout(() => {
    // Check if ripple is still in DOM before removing
    if (ripple.parentNode) {
      ripple.remove()
    }
  }, 600)
}

export function triggerConfetti(options?: confetti.Options): void {
  if (shouldReduceMotion()) return
  
  const defaults: confetti.Options = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  }
  
  confetti({ ...defaults, ...options })
}

export function triggerPhaseCompletionConfetti(): () => void {
  if (shouldReduceMotion()) return () => {}
  
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)
  
  // Return cleanup function to clear interval
  return () => clearInterval(interval)
}

export function triggerTrophyConfetti(): void {
  if (shouldReduceMotion()) return
  
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  }

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })
  fire(0.2, {
    spread: 60,
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}
