import { getFestivals } from '@/lib/db'
import FestivalClient from './festival-client'

export const dynamic = 'force-dynamic'

export default async function FestivalPage() {
  const festivals = await getFestivals()
  return <FestivalClient initialEvents={festivals} />
}
