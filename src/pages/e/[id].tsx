// Short redirect used in SMS reminders — every character counts there
// (GSM-7 segments are 160 chars), so this trades a path for a query param:
// chicoromelo.com/e/<id> -> /admin/calendario?ev=<id>. Auth/tier checks
// still happen on the destination via middleware, same as visiting
// /admin/calendario directly — this route itself doesn't touch Supabase.
import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = typeof params?.id === 'string' ? params.id : ''
  const safeId = /^[a-zA-Z0-9-]+$/.test(id) ? id : ''

  return {
    redirect: {
      destination: safeId ? `/admin/calendario?ev=${safeId}` : '/admin/calendario',
      permanent: false,
    },
  }
}

export default function EventShortlink() {
  return null
}
