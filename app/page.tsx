import { getGames, getVideosByCategory } from "@/lib/db"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HomeClient from "./home-client"

export default async function Home() {
  // Fetch real data for the "Trending" section
  // We'll grab some games and some kids' videos
  const [games, videos] = await Promise.all([
    getGames(),
    getVideosByCategory('abana-5-14') // Defaulting to one of the kids categories
  ])

  // Select top 4 for trending
  const trendingGames = games.slice(0, 4)
  const trendingVideos = videos.slice(0, 4)

  return (
    <>
      <Header />
      <HomeClient 
        trendingGames={trendingGames} 
        trendingVideos={trendingVideos} 
      />
      <Footer />
    </>
  )
}
