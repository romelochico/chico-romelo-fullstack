import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Construction } from 'lucide-react'
import AdminLayout from '../../../components/Admin/AdminLayout'

const PAGE_LABELS: Record<string, string> = {
  inicio: 'Início',
  sobre: 'Sobre',
  lancamentos: 'Lançamentos',
  novidades: 'Novidades',
  agenda: 'Agenda',
  imprensa: 'Imprensa',
  contatos: 'Contatos',
}

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 32px;
  text-align: center;

  svg { width: 40px; height: 40px; color: rgba(245,240,232,0.2); }
`

const PlaceholderText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: rgba(245,240,232,0.3);
`

export default function PageEditPage() {
  const router = useRouter()
  const { page } = router.query
  const pageStr = Array.isArray(page) ? page[0] : page
  const label = (pageStr && PAGE_LABELS[pageStr]) ?? pageStr

  return (
    <AdminLayout
      title={`Editar — ${label ?? '...'}`}
      subtitle="Edição de conteúdo da página pública"
    >
      <Placeholder>
        <Construction />
        <PlaceholderText>Em construção</PlaceholderText>
      </Placeholder>
    </AdminLayout>
  )
}
