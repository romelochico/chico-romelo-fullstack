import { useState, useEffect, useCallback } from 'react'

/**
 * Controls the streaming modal.
 * Returns { modal, openModal, closeModal }.
 * `modal` is null when closed, or { cover, title, spotify, apple, youtube }.
 */
export function useStreamingModal() {
  const [modal, setModal] = useState(null)

  const openModal = useCallback((data) => {
    setModal(data)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
    document.body.style.overflow = ''
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  return { modal, openModal, closeModal }
}
