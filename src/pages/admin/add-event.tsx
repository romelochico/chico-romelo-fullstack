import styled from 'styled-components'
import { Construction } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 32px;
  text-align: center;

  svg {
    width: 40px;
    height: 40px;
    color: rgba(245, 240, 232, 0.2);
  }
`

const PlaceholderText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: rgba(245, 240, 232, 0.3);
`

export default function AddEventPage() {
  return (
    <AdminLayout title="Adicionar Evento" subtitle="Novo show ou concerto">
      <Placeholder>
        <Construction />
        <PlaceholderText>Em construção</PlaceholderText>
      </Placeholder>
    </AdminLayout>
  )
}
