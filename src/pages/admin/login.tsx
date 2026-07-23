import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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

const GoogleBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: #fff;
  color: #1f1f1f;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  svg {
    width: 18px;
    height: 18px;
  }
`

const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(245, 240, 232, 0.3);
  font-size: 11px;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
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

const ErrorMsg = styled.p`
  font-size: 13px;
  color: #f87171;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
`

const ForgotLink = styled.a`
  font-size: 12px;
  color: rgba(245, 240, 232, 0.35);
  font-family: 'Montserrat', sans-serif;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: rgba(245, 240, 232, 0.65);
  }
`

function getNextPath(next: unknown): string {
  return typeof next === 'string' && next.startsWith('/admin') ? next : '/admin/dashboard'
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (router.query.error === 'oauth') {
      setError('Não foi possível entrar com Google. Tente novamente.')
    }
  }, [router.query.error])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push(getNextPath(router.query.next))
  }

  async function handleGoogleSignIn() {
    setError('')
    setGoogleLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (authError) {
      setError('Não foi possível entrar com Google. Tente novamente.')
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin — Chico Romelo</title>
      </Head>
      <AdminReset />
      <Wrap>
        <Card>
          <Logo src="/assets/logo-mobile.png" alt="Chico Romelo" />
          <Title>Admin</Title>
          <Sub>Acesso restrito à equipe Chico Romelo</Sub>

          <GoogleBtn type="button" onClick={handleGoogleSignIn} disabled={googleLoading}>
            <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.98v2.33A9 9 0 0 0 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.05l2.99-2.33z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.95l2.99 2.33C4.68 5.16 6.66 3.58 9 3.58z"
              />
            </svg>
            {googleLoading ? 'Entrando...' : 'Continuar com Google'}
          </GoogleBtn>

          <Divider>ou</Divider>

          <Form onSubmit={handleSubmit}>
            <Label>
              Email
              <Input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Label>
            <Label>
              Senha
              <Input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </Label>
            {error && <ErrorMsg>{error}</ErrorMsg>}
            <Btn type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar →'}
            </Btn>
            <Link href="/admin/forgot-password" passHref legacyBehavior>
              <ForgotLink>Esqueceu a senha?</ForgotLink>
            </Link>
          </Form>
        </Card>
      </Wrap>
    </>
  )
}
