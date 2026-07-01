import { useState, useEffect } from 'react'

export interface UseNavDrawerReturn {
  isOpen: boolean
  isNavHidden: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Manages the mobile nav drawer state.
 * Also hides the nav bar when the footer is visible on small screens.
 */
export function useNavDrawer(): UseNavDrawerReturn {
  const [isOpen,      setIsOpen]      = useState(false)
  const [isNavHidden, setIsNavHidden] = useState(false)

  const open   = () => setIsOpen(true)
  const close  = () => setIsOpen(false)
  const toggle = () => setIsOpen((prev) => !prev)

  // Hide nav when footer enters viewport (mobile/tablet only)
  useEffect(() => {
    const footer = document.querySelector('.site-footer')
    if (!footer || !('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        const isMobile = window.matchMedia('(max-width: 950px)').matches
        if (!isMobile) return
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNavHidden(true)
            close()
          } else {
            setIsNavHidden(false)
          }
        })
      },
      { threshold: 0.05 }
    )

    io.observe(footer)
    return () => io.disconnect()
  }, [])

  return { isOpen, isNavHidden, open, close, toggle }
}
