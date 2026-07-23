import { useEffect, RefObject } from 'react'

/**
 * Triggers CSS class "in" on elements matching `selector`
 * when they enter the viewport (IntersectionObserver).
 */
export function useScrollReveal(selector = '[data-reveal]'): void {
  useEffect(() => {
    const elements = document.querySelectorAll<Element>(selector)

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    )

    elements.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [selector])
}

/**
 * Variant that also observes a collage element (adds "in" class
 * which triggers the polaroid entry animations).
 */
export function useCollageReveal(collageRef: RefObject<Element | null>): void {
  useEffect(() => {
    const collage = collageRef?.current
    if (!collage || !('IntersectionObserver' in window)) {
      collage?.classList.add('in')
      return
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.1 }
    )

    io.observe(collage)
    return () => io.disconnect()
  }, [collageRef])
}
