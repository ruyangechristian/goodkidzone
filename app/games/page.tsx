import { getGames } from '@/lib/db'
import GamesClient from './games-client'

export const dynamic = 'force-dynamic'

export default async function GamesPage() {
  const games = await getGames()
  return <GamesClient initialGames={games} />
}
