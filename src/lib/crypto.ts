import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

const ALGO = 'aes-256-gcm'

let cachedKey: Buffer | null = null

function getKey(): Buffer {
  if (cachedKey) return cachedKey
  const secret = process.env.CREDENTIALS_ENCRYPTION_KEY
  if (!secret) throw new Error('CREDENTIALS_ENCRYPTION_KEY não configurada.')
  cachedKey = scryptSync(secret, 'chico-romelo-credentials', 32)
  return cachedKey
}

/** Encrypts a string for storage. Format: base64(iv).base64(authTag).base64(ciphertext) */
export function encrypt(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGO, getKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return [iv, authTag, ciphertext].map(b => b.toString('base64')).join('.')
}

/**
 * Decrypts a value produced by encrypt(). Rows saved before encryption was
 * added are still plain text (no '.' separators) — those are returned
 * as-is rather than treated as an error, so old data keeps working until
 * it's next edited and re-saved (which encrypts it).
 */
export function decrypt(payload: string): string {
  const parts = payload.split('.')
  if (parts.length !== 3) return payload

  const [ivB64, tagB64, dataB64] = parts
  try {
    const iv = Buffer.from(ivB64, 'base64')
    const authTag = Buffer.from(tagB64, 'base64')
    const data = Buffer.from(dataB64, 'base64')
    const decipher = createDecipheriv(ALGO, getKey(), iv)
    decipher.setAuthTag(authTag)
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
  } catch {
    return payload
  }
}
