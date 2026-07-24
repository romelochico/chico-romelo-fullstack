import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

const MIN_AVALIACOES = 5

interface ShowRow {
  id: string
  nome: string
  data_show: string
  local?: string | null
  resumo_ia?: string | null
}

interface AvaliacaoRow {
  id: string
  avaliador: string
  papel?: string | null
  nota_final: number
  geral_comentarios?: string | null
  apres_comentarios?: string | null
  obs_bem?: string | null
  obs_melhorar?: string | null
  obs_livres?: string | null
  musicas?: unknown
}

const PROMPT = `Você é um analista direto e imparcial de avaliações internas de uma banda.

O ficheiro JSON anexo (resumo-*.json) contém todas as avaliações de um show específico, preenchidas pelos próprios membros da banda: comentários gerais, comentários sobre apresentação/comportamento, observações finais, e notas por música (o que foi bem, o que melhorar, notas sobre a própria performance e sobre os colegas).

Sua tarefa: ler o JSON e produzir um resumo direto e imparcial com duas seções:
1. "Reclamações recorrentes" — problemas citados por múltiplos avaliadores. Se um problema foi citado por apenas uma pessoa, trate-o como ponto isolado, não como consenso.
2. "Ações para o próximo show" — ações concretas e práticas.

Seja direto e objetivo. Não elogie genericamente. Não repita cada comentário individual — sintetize os padrões reais. Responda em português, em bullets curtos.

Depois de escrever o resumo, devolva SOMENTE um JSON (sem nenhum texto antes ou depois, sem markdown fences) no seguinte formato:

{"summary": "<o texto do resumo aqui, com \\n onde precisar de quebra de linha>"}`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).json({ error: 'ID inválido.' })

  if (req.method === 'GET') return handleDigest(req, res, id)
  if (req.method === 'POST') return handleUpload(req, res, id)
  return res.status(405).end()
}

async function handleDigest(_req: NextApiRequest, res: NextApiResponse, id: string) {
  const supabase = adminClient()
  const [showRes, avalsRes] = await Promise.all([
    supabase.from('shows').select('*').eq('id', id).single(),
    supabase.from('avaliacoes').select('*').eq('show_id', id),
  ])

  if (showRes.error || !showRes.data) {
    console.error('[api/admin/avaliacoes/summary] show lookup failed', {
      id,
      error: showRes.error,
    })
    return res.status(404).json({
      error: showRes.error
        ? `Erro ao buscar show: ${showRes.error.message}`
        : 'Show não encontrado.',
    })
  }
  if (avalsRes.error) {
    console.error('[api/admin/avaliacoes/summary] avaliacoes lookup failed', {
      id,
      error: avalsRes.error,
    })
    return res.status(500).json({ error: `Erro ao buscar avaliações: ${avalsRes.error.message}` })
  }

  const show = showRes.data
  const avals = avalsRes.data
  const showRow = show as ShowRow

  if (showRow.resumo_ia) {
    return res.status(400).json({ error: 'Este show já tem um resumo salvo.' })
  }

  const rows = (avals ?? []) as AvaliacaoRow[]
  if (rows.length < MIN_AVALIACOES) {
    return res.status(400).json({
      error: `É necessário pelo menos ${MIN_AVALIACOES} avaliações para gerar o resumo.`,
    })
  }

  const digest = {
    show: { nome: showRow.nome, data_show: showRow.data_show, local: showRow.local ?? null },
    avaliacoes: rows.map(r => ({
      avaliador: r.avaliador,
      papel: r.papel ?? null,
      nota_final: r.nota_final,
      geral_comentarios: r.geral_comentarios ?? null,
      apres_comentarios: r.apres_comentarios ?? null,
      obs_bem: r.obs_bem ?? null,
      obs_melhorar: r.obs_melhorar ?? null,
      obs_livres: r.obs_livres ?? null,
      musicas: r.musicas ?? null,
    })),
  }

  return res.status(200).json({ digest, prompt: PROMPT })
}

async function handleUpload(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { summary } = req.body as { summary?: unknown }
  if (typeof summary !== 'string' || !summary.trim()) {
    return res.status(400).json({ error: 'Resumo inválido — campo "summary" em falta.' })
  }

  const supabase = adminClient()
  const showRes = await supabase.from('shows').select('resumo_ia').eq('id', id).single()
  if (showRes.error) {
    console.error('[api/admin/avaliacoes/summary] show lookup failed', {
      id,
      error: showRes.error,
    })
    return res.status(500).json({ error: `Erro ao buscar show: ${showRes.error.message}` })
  }
  if ((showRes.data as { resumo_ia?: string | null } | null)?.resumo_ia) {
    return res.status(400).json({ error: 'Este show já tem um resumo salvo.' })
  }

  const updateRes = await supabase.from('shows').update({ resumo_ia: summary }).eq('id', id)
  if (updateRes.error) {
    console.error('[api/admin/avaliacoes/summary] update failed', { id, error: updateRes.error })
    return res.status(500).json({ error: `Erro ao salvar resumo: ${updateRes.error.message}` })
  }

  return res.status(200).json({ summary })
}
