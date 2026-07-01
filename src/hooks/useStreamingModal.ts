import { useState, useEffect, useCallback } from 'react'
import type { StreamingModalData } from '../types'

export interface UseStreamingModalReturn {
  modal: StreamingModalData | null
  openModal: (data: StreamingModalData) => void
  closeModal: () => void
}

/**
 * Controls the streaming modal.
 * Returns { modal, openModal, closeModal }.
 * `modal` is null when closed, or { cover, title, spotify, apple, youtube }.
 */
export function useStreamingModal(): UseStreamingModalReturn {
  const [modal, setModal] = useState<StreamingModalData | null>(null)

  const openModal = useCallback((data: StreamingModalData) => {
    setModal(data)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
    document.body.style.overflow = ''
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  return { modal, openModal, closeModal }
}
