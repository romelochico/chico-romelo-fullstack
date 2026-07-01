import { IconClose } from '../Icons/Icons'
import StreamBtn from '../StreamBtn/StreamBtn'
import { Overlay, Card, CloseBtn, CoverWrap, Title, ModalLabel, BtnsCol } from './StreamingModal.styles'

/**
 * @param {boolean} isOpen
 * @param {Function} onClose
 * @param {{ cover, title, spotify, apple, youtube }} modal
 */
export default function StreamingModal({ isOpen, onClose, modal }) {
  if (!modal && !isOpen) return null

  return (
    <Overlay
      className={isOpen ? 'is-open' : ''}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <Card>
        <CloseBtn aria-label="Fechar" onClick={onClose}>
          <IconClose size={18} />
        </CloseBtn>

        <CoverWrap>
          <img src={modal?.cover} alt={modal?.title} loading="lazy" decoding="async" />
        </CoverWrap>

        <Title>{modal?.title}</Title>
        <ModalLabel>Ouvir em</ModalLabel>

        <BtnsCol>
          {modal?.spotify && <StreamBtn platform="spotify" href={modal.spotify} />}
          {modal?.apple   && <StreamBtn platform="apple"   href={modal.apple} />}
          {modal?.youtube && <StreamBtn platform="youtube" href={modal.youtube} />}
        </BtnsCol>
      </Card>
    </Overlay>
  )
}
