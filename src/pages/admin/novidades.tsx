import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Plus, Pencil, X, AlertTriangle, ImageOff, Upload } from 'lucide-react'
import AdminLayout from '../../components/Admin/AdminLayout'
import { createClient } from '../../lib/supabase/client'
import { formatDateLabel, getMediaUrl } from '../../lib/novidades'
import type { NewsRow } from '../../types'

// ─── Types ───────────────────────────────────────────────────────────────────

type RawNewsItem = NewsRow & {
  image?: { storage_path: string; bucket: string; id?: string; alt_text?: string } | null
  image_id?: string | null
  created_by?: string | null
  order?: number | null
  published?: boolean | null
}

interface NewsFormData {
  title: string
  strap: string
  date_label: string
  body: string
  image_id: string | null
  link_url: string
  link_label: string
  order: number | string
  published: boolean
}

type ModalState =
  | { type: 'add' }
  | { type: 'edit'; item: RawNewsItem }
  | { type: 'delete'; item: { id: string; title: string } }

// ─── List ──────────────────────────────────────────────────────────────────

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const Count = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: rgba(245,240,232,0.35);
`

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #c8a96e;
  color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  svg { width: 15px; height: 15px; }
`

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  gap: 12px;
`

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  transition: border-color 0.15s;
  &:hover { border-color: rgba(255,255,255,0.13); }
`

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 16px;
  position: relative;
`

const CardTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`

const Thumb = styled.div`
  width: 90px;
  align-self: stretch;
  flex-shrink: 0;
  background: rgba(255,255,255,0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  img { width: 100%; height: 100%; object-fit: cover; border-radius: 5px; }
  svg { width: 22px; height: 22px; color: rgba(245,240,232,0.15); }
`

const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const TagBadge = styled.span`
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c8a96e;
  margin-bottom: 4px;
`

const CardTitle = styled.h3`
  font-family: 'Special Elite', serif;
  font-size: 16px;
  color: #f5f0e8;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardMeta = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: rgba(245,240,232,0.3);
  margin: 0;
`

const Unpublished = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 1px 6px;
  border-radius: 3px;
  background: rgba(248,113,113,0.15);
  color: #f87171;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

const CardActions = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
`

const EditBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 5px;
  color: rgba(245,240,232,0.7);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(255,255,255,0.1); color: #f5f0e8; }
  svg { width: 12px; height: 12px; }
`

const DeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: transparent;
  border: none;
  border-radius: 5px;
  color: rgba(245,240,232,0.25);
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(248,113,113,0.1); color: #f87171; }
  svg { width: 13px; height: 13px; }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 32px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: rgba(245,240,232,0.25);
`

// ─── Modal ─────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0;
    align-items: stretch;
  }
`

const ModalBox = styled.div`
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  position: sticky;
  top: 0;
  background: #1a1a1a;
  z-index: 1;
`

const ModalTitle = styled.h2`
  font-family: 'Special Elite', serif;
  font-size: 18px;
  color: #f5f0e8;
  font-weight: 400;
`

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border: none;
  border-radius: 6px;
  color: rgba(245,240,232,0.5);
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(255,255,255,0.1); color: #f5f0e8; }
  svg { width: 16px; height: 16px; }
`

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: 0;
  background: #1a1a1a;
`

// ─── Form ──────────────────────────────────────────────────────────────────

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.45);
  display: flex;
  align-items: center;
  gap: 6px;
`

const Input = styled.input`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #f5f0e8;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: #c8a96e; }
  &::placeholder { color: rgba(245,240,232,0.2); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

const Textarea = styled.textarea`
  padding: 10px 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #f5f0e8;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.15s;
  &:focus { border-color: #c8a96e; }
  &::placeholder { color: rgba(245,240,232,0.2); }
`

const CharCount = styled.span<{ $over?: boolean }>`
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: ${p => p.$over ? '#f87171' : 'rgba(245,240,232,0.3)'};
`

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245,240,232,0.6);

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #c8a96e;
  }
`

const FormError = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #f87171;
`

// ─── Image upload ───────────────────────────────────────────────────────────

const ImageUploadArea = styled.div`
  position: relative;
  width: 100%;
  height: 140px;
  border: 2px dashed rgba(255,255,255,0.12);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s;
  background: rgba(255,255,255,0.02);

  &:hover { border-color: rgba(200,169,110,0.4); }
`

const ImagePreview = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const UploadOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.15s;
  ${ImageUploadArea}:hover & { opacity: 1; }
`

const UploadHint = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  svg { width: 24px; height: 24px; color: rgba(245,240,232,0.3); }
  span {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: rgba(245,240,232,0.4);
  }
`

const UploadingText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #c8a96e;
`

// ─── Buttons ───────────────────────────────────────────────────────────────

const BtnPrimary = styled.button`
  padding: 10px 20px;
  background: #c8a96e;
  color: #0d0d0d;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const BtnGhost = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: rgba(245,240,232,0.5);
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { color: #f5f0e8; border-color: rgba(255,255,255,0.2); }
`

const BtnDanger = styled(BtnPrimary)`
  background: #f87171;
  color: #fff;
`

// ─── Delete confirm ─────────────────────────────────────────────────────────

const ConfirmBox = styled(ModalBox)`
  max-width: 400px;
`

const ConfirmBody = styled.div`
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;

  svg { width: 36px; height: 36px; color: #f87171; }
`

const ConfirmTitle = styled.h3`
  font-family: 'Special Elite', serif;
  font-size: 18px;
  color: #f5f0e8;
`

const ConfirmText = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: rgba(245,240,232,0.45);
  line-height: 1.5;
`

// ─── Constants ─────────────────────────────────────────────────────────────

const MAX_CHARS = 240

const EMPTY_FORM: NewsFormData = {
  title: '',
  strap: '',
  date_label: '',
  body: '',
  image_id: null,
  link_url: '',
  link_label: 'Ler mais →',
  order: 0,
  published: true,
}

function defaultDateLabel(): string {
  const PT = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']
  const d = new Date()
  return `${PT[d.getMonth()]} · ${d.getFullYear()}`
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AdminNovidadesPage() {
  const [items, setItems] = useState<RawNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [form, setForm] = useState<NewsFormData>(EMPTY_FORM)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    load()
    createClient().auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await createClient()
      .from('news')
      .select('*, image:media!image_id(id, storage_path, bucket, alt_text)')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false })
    setItems((data ?? []) as unknown as RawNewsItem[])
    setLoading(false)
  }

  function openAdd() {
    setForm({ ...EMPTY_FORM, date_label: defaultDateLabel() })
    setPreviewUrl(null)
    setFormError('')
    setModal({ type: 'add' })
  }

  function openEdit(item: RawNewsItem) {
    setForm({
      title: item.title,
      strap: item.strap ?? '',
      date_label: item.date_label ?? formatDateLabel(item.created_at),
      body: item.body ?? '',
      image_id: item.image_id ?? null,
      link_url: item.link_url ?? '',
      link_label: item.link_label ?? 'Ler mais →',
      order: item.order ?? 0,
      published: item.published ?? true,
    })
    setPreviewUrl(item.image ? getMediaUrl(item.image) : null)
    setFormError('')
    setModal({ type: 'edit', item })
  }

  function openDelete(item: RawNewsItem) {
    setModal({ type: 'delete', item: { id: item.id, title: item.title } })
  }

  function closeModal() {
    setModal(null)
    setFormError('')
    setSaving(false)
    setUploading(false)
  }

  function setField(key: keyof NewsFormData, val: string | boolean | number | null) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setFormError('')

    const client = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `news/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadErr } = await client.storage.from('media').upload(path, file)
    if (uploadErr) {
      setFormError('Erro no upload: ' + uploadErr.message)
      setUploading(false)
      return
    }

    const { data: mediaRow, error: mediaErr } = await client
      .from('media')
      .insert({ filename: file.name, storage_path: path, bucket: 'media', alt_text: form.title || file.name })
      .select()
      .single()

    if (mediaErr) {
      setFormError('Erro ao salvar mídia: ' + mediaErr.message)
      setUploading(false)
      return
    }

    setField('image_id', (mediaRow as { id: string }).id)
    setPreviewUrl(getMediaUrl({ storage_path: path, bucket: 'media' }))
    setUploading(false)
  }

  async function handleSave() {
    if (!modal || modal.type === 'delete') return
    if (!form.title.trim() || !form.body.toString().trim()) {
      setFormError('Título e texto são obrigatórios.')
      return
    }
    if (form.body.toString().length > MAX_CHARS) {
      setFormError(`O texto não pode exceder ${MAX_CHARS} caracteres.`)
      return
    }
    setSaving(true)
    setFormError('')

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      strap: form.strap.toString().trim() || null,
      date_label: form.date_label.toString().trim() || defaultDateLabel(),
      body: form.body.toString().trim(),
      image_id: form.image_id || null,
      link_url: form.link_url.toString().trim() || null,
      link_label: form.link_url.toString().trim() ? (form.link_label.toString().trim() || 'Ler mais →') : null,
      order: Number(form.order) || 0,
      published: form.published,
    }

    const client = createClient()
    let error: { message: string } | null = null

    if (modal.type === 'add') {
      payload['created_by'] = user?.email ?? null
      ;({ error } = await client.from('news').insert(payload))
    } else {
      ;({ error } = await client.from('news').update(payload).eq('id', modal.item.id))
    }

    if (error) {
      setFormError(error.message)
      setSaving(false)
      return
    }

    closeModal()
    load()
  }

  async function handleDelete() {
    if (!modal || modal.type !== 'delete') return
    await createClient().from('news').delete().eq('id', modal.item.id)
    closeModal()
    load()
  }

  const isFormModal = modal?.type === 'add' || modal?.type === 'edit'
  const isDeleteModal = modal?.type === 'delete'

  return (
    <AdminLayout title="Novidades" subtitle="Gestão de notícias e atualizações">
      <TopBar>
        <Count>{items.length} novidade{items.length !== 1 ? 's' : ''}</Count>
        <AddBtn onClick={openAdd}><Plus /> Adicionar Novidade</AddBtn>
      </TopBar>

      {loading ? (
        <EmptyState>Carregando...</EmptyState>
      ) : items.length === 0 ? (
        <EmptyState>Nenhuma novidade ainda. Clique em &quot;Adicionar Novidade&quot; para começar.</EmptyState>
      ) : (
        <List>
          {items.map(item => {
            const imgUrl = item.image ? getMediaUrl(item.image) : null
            return (
              <Card key={item.id}>
                <Thumb>
                  {imgUrl ? <img src={imgUrl} alt={item.title} /> : <ImageOff />}
                </Thumb>
                <CardContent>
                  <DeleteBtn onClick={() => openDelete(item)} title="Excluir"><X /></DeleteBtn>
                  <CardActions>
                    <EditBtn onClick={() => openEdit(item)}><Pencil /> Editar</EditBtn>
                  </CardActions>
                  <CardTop>
                    {item.strap && <TagBadge>{item.strap}</TagBadge>}
                    <CardTitle>{item.title}</CardTitle>
                  </CardTop>
                  <CardBottom>
                    <CardMeta>
                      {item.date_label ?? formatDateLabel(item.created_at)}
                      {!item.published && <Unpublished>não publicado</Unpublished>}
                    </CardMeta>
                  </CardBottom>
                </CardContent>
              </Card>
            )
          })}
        </List>
      )}

      {/* ── Add / Edit modal ── */}
      {isFormModal && modal && (
        <Overlay onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <ModalBox>
            <ModalHeader>
              <ModalTitle>{modal.type === 'add' ? 'Nova Novidade' : 'Editar Novidade'}</ModalTitle>
              <CloseBtn onClick={closeModal}><X /></CloseBtn>
            </ModalHeader>

            <ModalBody>
              <FieldRow>
                <Field>
                  <Label>Título *</Label>
                  <Input
                    value={form.title}
                    onChange={e => setField('title', e.target.value)}
                    placeholder="Vencedores do Rock à Margem"
                  />
                </Field>
                <Field>
                  <Label>Tag</Label>
                  <Input
                    value={form.strap}
                    onChange={e => setField('strap', e.target.value)}
                    placeholder="★ Prémio"
                  />
                </Field>
              </FieldRow>

              <Field>
                <Label>
                  Texto *
                  <CharCount $over={(form.body as string).length > MAX_CHARS}>
                    {(form.body as string).length}/{MAX_CHARS}
                  </CharCount>
                </Label>
                <Textarea
                  value={form.body as string}
                  onChange={e => setField('body', e.target.value)}
                  placeholder="Breve descrição da novidade (máx. 40 palavras)..."
                  rows={4}
                />
              </Field>

              <Field>
                <Label>Imagem</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <ImageUploadArea onClick={() => !uploading && fileRef.current?.click()}>
                  {previewUrl && <ImagePreview src={previewUrl} alt="preview" />}
                  {uploading ? (
                    <UploadingText>Enviando imagem...</UploadingText>
                  ) : (
                    <UploadOverlay>
                      <Upload style={{ width: 20, height: 20, color: '#f5f0e8' }} />
                      <span style={{ fontFamily: 'Montserrat', fontSize: 12, color: '#f5f0e8' }}>
                        {previewUrl ? 'Trocar imagem' : 'Carregar imagem'}
                      </span>
                    </UploadOverlay>
                  )}
                  {!previewUrl && !uploading && (
                    <UploadHint>
                      <Upload />
                      <span>Clique para carregar</span>
                    </UploadHint>
                  )}
                </ImageUploadArea>
              </Field>

              <FieldRow>
                <Field>
                  <Label>Data</Label>
                  <Input
                    value={form.date_label as string}
                    onChange={e => setField('date_label', e.target.value)}
                    placeholder="JUN · 2026"
                  />
                </Field>
                <Field>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={form.order as number}
                    onChange={e => setField('order', e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </Field>
              </FieldRow>

              <FieldRow>
                <Field>
                  <Label>Link (opcional)</Label>
                  <Input
                    value={form.link_url}
                    onChange={e => setField('link_url', e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </Field>
                <Field>
                  <Label>Texto do link</Label>
                  <Input
                    value={form.link_label}
                    onChange={e => setField('link_label', e.target.value)}
                    placeholder="Ler mais →"
                    disabled={!form.link_url}
                  />
                </Field>
              </FieldRow>

              <ToggleRow>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e => setField('published', e.target.checked)}
                />
                Publicado (visível no site)
              </ToggleRow>

              {formError && <FormError>{formError}</FormError>}
            </ModalBody>

            <ModalFooter>
              <BtnGhost onClick={closeModal}>Cancelar</BtnGhost>
              <BtnPrimary onClick={handleSave} disabled={saving || uploading}>
                {saving ? 'Salvando...' : modal.type === 'add' ? 'Adicionar' : 'Salvar'}
              </BtnPrimary>
            </ModalFooter>
          </ModalBox>
        </Overlay>
      )}

      {/* ── Delete confirm ── */}
      {isDeleteModal && modal && modal.type === 'delete' && (
        <Overlay onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <ConfirmBox>
            <ConfirmBody>
              <AlertTriangle />
              <ConfirmTitle>Excluir novidade?</ConfirmTitle>
              <ConfirmText>
                Tem certeza que quer excluir <strong>&quot;{modal.item.title}&quot;</strong>?
                Esta ação não pode ser desfeita.
              </ConfirmText>
            </ConfirmBody>
            <ModalFooter>
              <BtnGhost onClick={closeModal}>Cancelar</BtnGhost>
              <BtnDanger onClick={handleDelete}>Excluir</BtnDanger>
            </ModalFooter>
          </ConfirmBox>
        </Overlay>
      )}
    </AdminLayout>
  )
}
