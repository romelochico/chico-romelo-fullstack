import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styled, { createGlobalStyle } from 'styled-components'
import { createClient } from '../../lib/supabase/client'
import type { FormEvent, ChangeEvent } from 'react'

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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  color: rgba(245, 240, 232, 0.4);
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
  color: rgba(245, 240, 232, 0.5);
  font-family: 'Montserrat', sans-serif;
`

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #f5f0e8;
  font-size: 15px;
  font-family: 'Montserrat', sans-serif;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #c8a96e;
  }
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
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Msg = styled.p<{ $error?: boolean }>`
  font-size: 13px;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  color: ${({ $error }) => ($error ? '#f87171' : '#4ade80')};
`

const BackLink = styled.a`
  font-size: 12px;
  color: rgba(245, 240, 232, 0.4);
  font-family: 'Montserrat', sans-serif;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: rgba(245, 240, 232, 0.7);
  }
`

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMsg('')
    setLoading(true)

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/admin/reset-password`
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (authError) {
      setError('Erro ao enviar email. Verifique o endereço e tente novamente.')
    } else {
      setSent(true)
      setMsg(
        'Email enviado! Verifique sua caixa de entrada e clique no link para redefinir a senha.'
      )
    }

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Recuperar senha — Chico Romelo</title>
      </Head>
      <AdminReset />
      <Wrap>
        <Card>
          <Logo src="/assets/logo-mobile.png" alt="Chico Romelo" />
          <Title>Recuperar senha</Title>
          <Sub>Enviamos um link para você redefinir sua senha</Sub>

          {sent ? (
            <>
              <Msg>{msg}</Msg>
              <Link href="/admin/login" passHref legacyBehavior>
                <BackLink>← Voltar ao login</BackLink>
              </Link>
            </>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Label>
                Email
                <Input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="seu-email@exemplo.com"
                />
              </Label>
              {error && <Msg $error>{error}</Msg>}
              <Btn type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar link →'}
              </Btn>
              <Link href="/admin/login" passHref legacyBehavior>
                <BackLink style={{ textAlign: 'center' }}>← Voltar ao login</BackLink>
              </Link>
            </Form>
          )}
        </Card>
      </Wrap>
    </>
  )
}
