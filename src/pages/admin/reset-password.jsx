import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styled, { createGlobalStyle } from 'styled-components'
import { createClient } from '../../lib/supabase/client'

const AdminReset = createGlobalStyle`
  body { background: #0d0d0d; }
`

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d0d0d;
  padding: 24px;
`

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`

const Logo = styled.img`
  width: 72px;
  height: 72px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.8;
`

const Title = styled.h1`
  font-family: 'Special Elite', serif;
  font-size: 28px;
  color: #f5f0e8;
  text-align: center;
  margin: 0;
`

const Sub = styled.p`
  font-size: 13px;
  color: rgba(245,240,232,0.4);
  text-align: center;
  margin-top: -20px;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(245,240,232,0.5);
  font-family: 'Montserrat', sans-serif;
`

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #f5f0e8;
  font-size: 15px;
  font-family: 'Montserrat', sans-serif;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: #c8a96e; }
`

const Btn = styled.button`
  margin-top: 8px;
  padding: 14px;
  background: #f5f0e8;
  color: #0d0d0d;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const Msg = styled.p`
  font-size: 13px;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  color: ${({ $error }) => $error ? '#f87171' : '#4ade80'};
`

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase exchanges the token from the URL hash automatically on load
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.updateUser({ password })

    if (authError) {
      setError('Erro ao atualizar a senha. O link pode ter expirado.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  if (!ready) {
    return (
      <>
        <Head><title>Redefinir senha — Chico Romelo</title></Head>
        <AdminReset />
        <Wrap>
          <Card>
            <Logo src="/assets/logo-mobile.png" alt="Chico Romelo" />
            <Sub style={{ marginTop: 0 }}>Verificando o link...</Sub>
          </Card>
        </Wrap>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Redefinir senha — Chico Romelo</title>
      </Head>
      <AdminReset />
      <Wrap>
        <Card>
          <Logo src="/assets/logo-mobile.png" alt="Chico Romelo" />
          <Title>Nova senha</Title>
          <Sub>Escolha uma nova senha para sua conta</Sub>

          <Form onSubmit={handleSubmit}>
            <Label>
              Nova senha
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </Label>
            <Label>
              Confirmar senha
              <Input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </Label>
            {error && <Msg $error>{error}</Msg>}
            <Btn type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar nova senha →'}
            </Btn>
          </Form>
        </Card>
      </Wrap>
    </>
  )
}
